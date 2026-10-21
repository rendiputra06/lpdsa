<?php

namespace App\Services;

use App\Models\AcademicUnit;
use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AcademicApiService
{
    /**
     * Get the default Univrab academic structure as robust fallback
     * when external API is not configured or offline.
     */
    public function getDefaultUnivrabUnits(): array
    {
        return [
            'university' => [
                'code' => '101026',
                'name' => 'Universitas Abdurrab',
            ],
            'faculties' => [
                [
                    'code' => 'FFIK',
                    'name' => 'Fakultas Farmasi dan Ilmu Kesehatan',
                    'programs' => [
                        ['code' => '48201', 'name' => 'Farmasi', 'level' => 'S1'],
                        ['code' => '48401', 'name' => 'Kebidanan', 'level' => 'D3'],
                        ['code' => '14401', 'name' => 'Keperawatan', 'level' => 'D3'],
                        ['code' => '14201', 'name' => 'Ilmu Keperawatan', 'level' => 'S1'],
                        ['code' => '14901', 'name' => 'Profesi Ners', 'level' => 'Profesi'],
                        ['code' => '51401', 'name' => 'Teknologi Laboratorium Medis', 'level' => 'D4'],
                        ['code' => '51402', 'name' => 'Fisioterapi', 'level' => 'D3'],
                    ],
                ],
                [
                    'code' => 'FK',
                    'name' => 'Fakultas Kedokteran',
                    'programs' => [
                        ['code' => '11201', 'name' => 'Pendidikan Dokter', 'level' => 'S1'],
                        ['code' => '11101', 'name' => 'Profesi Dokter', 'level' => 'Profesi'],
                    ],
                ],
                [
                    'code' => 'FT',
                    'name' => 'Fakultas Teknik',
                    'programs' => [
                        ['code' => '55201', 'name' => 'Teknik Informatika', 'level' => 'S1'],
                        ['code' => '22201', 'name' => 'Teknik Sipil', 'level' => 'S1'],
                    ],
                ],
                [
                    'code' => 'FPSI',
                    'name' => 'Fakultas Psikologi dan Ilmu Sosial Politik',
                    'programs' => [
                        ['code' => '73201', 'name' => 'Psikologi', 'level' => 'S1'],
                        ['code' => '70201', 'name' => 'Ilmu Komunikasi', 'level' => 'S1'],
                        ['code' => '63201', 'name' => 'Ilmu Pemerintahan', 'level' => 'S1'],
                        ['code' => '71201', 'name' => 'Hubungan Internasional', 'level' => 'S1'],
                    ],
                ],
            ],
        ];
    }

    /**
     * Sync academic units from external API or fallback dataset.
     * Guarantees that the data source is the single source of truth:
     * - New units in API are added
     * - Existing units are updated
     * - Units no longer present in API are pruned/deleted
     */
    public function syncUnits(): array
    {
        $apiUrl = Setting::where('key', 'academic_api_url')->value('value');
        $apiToken = Setting::where('key', 'academic_api_token')->value('value');

        $isLiveApi = false;
        $syncResult = [
            'synced_count' => 0,
            'deactivated_count' => 0,
            'deleted_count' => 0,
        ];

        if (!empty($apiUrl)) {
            $endpoint = trim($apiUrl);
            // Normalisasi endpoint hanya jika URL adalah root domain tanpa path
            $parsed = parse_url($endpoint);
            if (empty($parsed['path']) || $parsed['path'] === '/') {
                $endpoint = rtrim($endpoint, '/') . '/api/v1/academic-units';
            }

            try {
                $response = Http::withToken($apiToken ?: '')
                    ->timeout(12)
                    ->acceptJson()
                    ->get($endpoint);

                if ($response->successful()) {
                    $json = $response->json();
                    $data = $json['data'] ?? $json;

                    if (is_array($data) && count($data) > 0) {
                        $isLiveApi = true;
                        $syncResult = $this->importFromApiResponse($data);
                    } else {
                        return [
                            'success' => false,
                            'is_live_api' => true,
                            'synced_count' => 0,
                            'deactivated_count' => 0,
                            'deleted_count' => 0,
                            'message' => 'API eksternal berhasil dihubungi, namun format payload data kosong atau tidak valid.',
                        ];
                    }
                } else {
                    $status = $response->status();
                    return [
                        'success' => false,
                        'is_live_api' => false,
                        'synced_count' => 0,
                        'deactivated_count' => 0,
                        'deleted_count' => 0,
                        'message' => "Gagal menghubungi API eksternal (HTTP {$status}). Sinkronisasi dibatalkan untuk melindungi integritas data.",
                    ];
                }
            } catch (\Exception $e) {
                Log::error('Academic API connection failed: ' . $e->getMessage());
                return [
                    'success' => false,
                    'is_live_api' => false,
                    'synced_count' => 0,
                    'deactivated_count' => 0,
                    'deleted_count' => 0,
                    'message' => 'Koneksi ke API sistem akademik gagal: ' . $e->getMessage() . '. Sinkronisasi dibatalkan.',
                ];
            }
        } else {
            // Jika URL API belum dikonfigurasi, gunakan dataset standar Univrab
            $syncResult = $this->importFromDefaultDataset();
        }

        $syncedCount = $syncResult['synced_count'];
        $deactivatedCount = $syncResult['deactivated_count'];
        $deletedCount = $syncResult['deleted_count'];

        $sourceLabel = $isLiveApi ? 'API eksternal' : 'dataset standar Univrab';
        $message = "Sinkronisasi berhasil ({$sourceLabel}): {$syncedCount} unit akademik aktif diperbarui.";
        if ($deactivatedCount > 0) {
            $message .= " {$deactivatedCount} unit dinonaktifkan demi menjaga seluruh arsip akreditasi.";
        }
        if ($deletedCount > 0) {
            $message .= " {$deletedCount} unit usang tanpa riwayat akreditasi telah dibersihkan.";
        }

        return [
            'success' => true,
            'is_live_api' => $isLiveApi,
            'synced_count' => $syncedCount,
            'deactivated_count' => $deactivatedCount,
            'deleted_count' => $deletedCount,
            'message' => $message,
        ];
    }

    /**
     * Import structured API data with full two-way reconciliation.
     * Supports both flat structure (code, name, level, faculty_name) and nested (fakultas: {kode, nama}).
     */
    protected function importFromApiResponse(array $items): array
    {
        $now = now();
        $processedIds = [];

        // Ensure University record exists
        $univ = AcademicUnit::updateOrCreate(
            ['type' => 'university'],
            [
                'code' => '101026',
                'name' => 'Universitas Abdurrab',
                'is_active' => true,
                'synced_at' => $now,
            ]
        );
        $processedIds[] = $univ->id;

        $faculties = [];

        foreach ($items as $item) {
            $type = $item['type'] ?? 'study_program';

            // If item is university itself
            if ($type === 'university') {
                $univ->update([
                    'code' => $item['code'] ?? $univ->code,
                    'name' => $item['name'] ?? $univ->name,
                    'synced_at' => $now,
                ]);
                continue;
            }

            // If item is a standalone faculty definition
            if ($type === 'faculty') {
                $facCode = $item['code'] ?? ($item['kode_fakultas'] ?? null);
                $facName = $item['name'] ?? ($item['nama_fakultas'] ?? 'Fakultas');

                if ($facCode || $facName) {
                    $faculty = null;
                    if (!empty($facCode)) {
                        $faculty = AcademicUnit::where('type', 'faculty')->where('code', $facCode)->first();
                    }
                    if (!$faculty && !empty($facName)) {
                        $faculty = AcademicUnit::where('type', 'faculty')->where('name', $facName)->first();
                    }

                    if ($faculty) {
                        $faculty->update([
                            'name' => $facName,
                            'code' => $facCode ?: $faculty->code,
                            'parent_id' => $univ->id,
                            'is_active' => $item['is_active'] ?? true,
                            'synced_at' => $now,
                        ]);
                    } else {
                        $faculty = AcademicUnit::create([
                            'type' => 'faculty',
                            'code' => $facCode,
                            'name' => $facName,
                            'parent_id' => $univ->id,
                            'is_active' => $item['is_active'] ?? true,
                            'synced_at' => $now,
                        ]);
                    }

                    $key = $facCode ?: $facName;
                    $faculties[$key] = $faculty;
                    $processedIds[] = $faculty->id;
                }
                continue;
            }

            // Study program handling
            $facultyData = $item['fakultas'] ?? null;
            $facCode = $item['faculty_code'] ?? ($facultyData['kode_fakultas'] ?? ($facultyData['code'] ?? null));
            $facName = $item['faculty_name'] ?? ($facultyData['nama_fakultas'] ?? ($facultyData['name'] ?? null));

            $facultyId = null;
            if ($facCode || $facName) {
                $key = $facCode ?: $facName;
                if (!isset($faculties[$key])) {
                    $faculty = null;
                    if (!empty($facCode)) {
                        $faculty = AcademicUnit::where('type', 'faculty')->where('code', $facCode)->first();
                    }
                    if (!$faculty && !empty($facName)) {
                        $faculty = AcademicUnit::where('type', 'faculty')->where('name', $facName)->first();
                    }

                    if ($faculty) {
                        $faculty->update([
                            'name' => $facName ?: $faculty->name,
                            'code' => $facCode ?: $faculty->code,
                            'parent_id' => $univ->id,
                            'is_active' => true,
                            'synced_at' => $now,
                        ]);
                    } else {
                        $faculty = AcademicUnit::create([
                            'type' => 'faculty',
                            'code' => $facCode,
                            'name' => $facName ?: ('Fakultas ' . $facCode),
                            'parent_id' => $univ->id,
                            'is_active' => true,
                            'synced_at' => $now,
                        ]);
                    }
                    $faculties[$key] = $faculty;
                }
                $facultyId = $faculties[$key]->id;
                $processedIds[] = $facultyId;
            }

            $prodiCode = $item['kode_prodi'] ?? ($item['code'] ?? null);
            $prodiName = $item['nama_prodi'] ?? ($item['name'] ?? null);
            $level = $item['jenjang'] ?? ($item['level'] ?? 'S1');
            $isActive = $item['is_active'] ?? true;

            if ($prodiName) {
                $prodi = null;
                if (!empty($prodiCode)) {
                    $prodi = AcademicUnit::where('type', 'study_program')->where('code', $prodiCode)->first();
                }
                if (!$prodi && !empty($prodiName)) {
                    $prodi = AcademicUnit::where('type', 'study_program')
                        ->where('name', $prodiName)
                        ->when($facultyId, fn ($q) => $q->where('parent_id', $facultyId))
                        ->first();
                }

                if ($prodi) {
                    $prodi->update([
                        'code' => $prodiCode ?: $prodi->code,
                        'name' => $prodiName,
                        'level' => strtoupper(trim($level)),
                        'faculty_name' => $facName ?: $prodi->faculty_name,
                        'parent_id' => $facultyId ?: $prodi->parent_id,
                        'is_active' => (bool) $isActive,
                        'synced_at' => $now,
                    ]);
                } else {
                    $prodi = AcademicUnit::create([
                        'type' => 'study_program',
                        'code' => $prodiCode,
                        'name' => $prodiName,
                        'level' => strtoupper(trim($level)),
                        'faculty_name' => $facName,
                        'parent_id' => $facultyId,
                        'is_active' => (bool) $isActive,
                        'synced_at' => $now,
                    ]);
                }
                $processedIds[] = $prodi->id;
            }
        }

        $processedIds = array_values(array_unique($processedIds));
        $pruneResult = $this->pruneObsoleteUnits($processedIds);

        return [
            'synced_count' => count($processedIds),
            'deactivated_count' => $pruneResult['deactivated'],
            'deleted_count' => $pruneResult['deleted'],
        ];
    }

    /**
     * Import default Univrab dataset with full two-way reconciliation.
     */
    protected function importFromDefaultDataset(): array
    {
        $dataset = $this->getDefaultUnivrabUnits();
        $now = now();
        $processedIds = [];

        // University
        $univ = AcademicUnit::updateOrCreate(
            ['type' => 'university'],
            [
                'code' => $dataset['university']['code'],
                'name' => $dataset['university']['name'],
                'is_active' => true,
                'synced_at' => $now,
            ]
        );
        $processedIds[] = $univ->id;

        // Faculties & Study Programs
        foreach ($dataset['faculties'] as $fac) {
            $faculty = AcademicUnit::updateOrCreate(
                ['type' => 'faculty', 'code' => $fac['code']],
                [
                    'name' => $fac['name'],
                    'parent_id' => $univ->id,
                    'is_active' => true,
                    'synced_at' => $now,
                ]
            );
            $processedIds[] = $faculty->id;

            foreach ($fac['programs'] as $prog) {
                $program = AcademicUnit::updateOrCreate(
                    ['type' => 'study_program', 'code' => $prog['code']],
                    [
                        'name' => $prog['name'],
                        'level' => $prog['level'],
                        'faculty_name' => $fac['name'],
                        'parent_id' => $faculty->id,
                        'is_active' => true,
                        'synced_at' => $now,
                    ]
                );
                $processedIds[] = $program->id;
            }
        }

        $processedIds = array_values(array_unique($processedIds));
        $pruneResult = $this->pruneObsoleteUnits($processedIds);

        return [
            'synced_count' => count($processedIds),
            'deactivated_count' => $pruneResult['deactivated'],
            'deleted_count' => $pruneResult['deleted'],
        ];
    }

    /**
     * Safely reconcile units that are not in the synced payload:
     * - Units having active/past accreditation records are SOFT-DEACTIVATED (is_active = false)
     *   so that certificate files and history remain intact.
     * - Only units with NO accreditation records are permanently deleted.
     */
    protected function pruneObsoleteUnits(array $syncedIds): array
    {
        $obsoleteQuery = AcademicUnit::whereNotIn('id', $syncedIds);

        $totalObsolete = (clone $obsoleteQuery)->count();
        if ($totalObsolete === 0) {
            return [
                'deactivated' => 0,
                'deleted' => 0,
            ];
        }

        // 1. Deaktivasi unit yang punya riwayat akreditasi
        $unitsWithAccreditation = (clone $obsoleteQuery)->whereHas('accreditations')->get();
        $deactivatedCount = 0;
        foreach ($unitsWithAccreditation as $unit) {
            if ($unit->is_active) {
                $unit->update(['is_active' => false]);
                $deactivatedCount++;
            }
        }

        // 2. Hapus permanen hanya unit tanpa riwayat akreditasi
        $deletedStudyPrograms = (clone $obsoleteQuery)
            ->whereDoesntHave('accreditations')
            ->where('type', 'study_program')
            ->delete();

        $deletedFaculties = (clone $obsoleteQuery)
            ->whereDoesntHave('accreditations')
            ->where('type', 'faculty')
            ->whereDoesntHave('children')
            ->delete();

        $deletedRemaining = (clone $obsoleteQuery)
            ->whereDoesntHave('accreditations')
            ->whereDoesntHave('children')
            ->delete();

        $deletedCount = $deletedStudyPrograms + $deletedFaculties + $deletedRemaining;

        return [
            'deactivated' => $deactivatedCount,
            'deleted' => $deletedCount,
        ];
    }
}
