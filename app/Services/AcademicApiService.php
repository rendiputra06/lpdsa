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
     * Sync academic units from external API or fallback dataset
     */
    public function syncUnits(): array
    {
        $apiUrl = Setting::where('key', 'academic_api_url')->value('value');
        $apiToken = Setting::where('key', 'academic_api_token')->value('value');

        $isLiveApi = false;
        $syncedCount = 0;

        if (!empty($apiUrl)) {
            try {
                $response = Http::withToken($apiToken ?: '')
                    ->timeout(10)
                    ->acceptJson()
                    ->get($apiUrl . '/study-programs');

                if ($response->successful()) {
                    $json = $response->json();
                    $data = $json['data'] ?? $json;

                    if (is_array($data) && count($data) > 0) {
                        $isLiveApi = true;
                        $syncedCount = $this->importFromApiResponse($data);
                    }
                }
            } catch (\Exception $e) {
                Log::warning('Academic API connection failed, falling back to local dataset: ' . $e->getMessage());
            }
        }

        // If live API was not used or returned no items, use default Univrab structure
        if (!$isLiveApi) {
            $syncedCount = $this->importFromDefaultDataset();
        }

        return [
            'success' => true,
            'is_live_api' => $isLiveApi,
            'synced_count' => $syncedCount,
            'message' => $isLiveApi
                ? "Berhasil menyinkronkan {$syncedCount} unit akademik dari API eksternal."
                : "Berhasil menyinkronkan {$syncedCount} unit akademik Universitas Abdurrab (dataset standar).",
        ];
    }

    /**
     * Import structured API data from study-programs endpoint
     */
    protected function importFromApiResponse(array $items): int
    {
        $now = now();
        $count = 0;

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
        $count++;

        $faculties = [];

        foreach ($items as $item) {
            $facultyData = $item['fakultas'] ?? null;
            $facultyId = null;
            $facultyName = null;

            if ($facultyData && is_array($facultyData)) {
                $facCode = $facultyData['kode_fakultas'] ?? ($facultyData['code'] ?? null);
                $facName = $facultyData['nama_fakultas'] ?? ($facultyData['name'] ?? 'Fakultas');

                if (!isset($faculties[$facCode])) {
                    $faculty = AcademicUnit::updateOrCreate(
                        ['type' => 'faculty', 'code' => $facCode],
                        [
                            'name' => $facName,
                            'parent_id' => $univ->id,
                            'is_active' => true,
                            'synced_at' => $now,
                        ]
                    );
                    $faculties[$facCode] = $faculty;
                    $count++;
                }

                $facultyId = $faculties[$facCode]->id;
                $facultyName = $facName;
            }

            $prodiCode = $item['kode_prodi'] ?? ($item['code'] ?? null);
            $prodiName = $item['nama_prodi'] ?? ($item['name'] ?? null);
            $level = $item['jenjang'] ?? ($item['level'] ?? 'S1');

            if ($prodiName) {
                AcademicUnit::updateOrCreate(
                    ['type' => 'study_program', 'code' => $prodiCode],
                    [
                        'name' => $prodiName,
                        'level' => strtoupper(trim($level)),
                        'faculty_name' => $facultyName,
                        'parent_id' => $facultyId,
                        'is_active' => true,
                        'synced_at' => $now,
                    ]
                );
                $count++;
            }
        }

        return $count;
    }

    /**
     * Import default Univrab dataset
     */
    protected function importFromDefaultDataset(): int
    {
        $dataset = $this->getDefaultUnivrabUnits();
        $now = now();
        $count = 0;

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
        $count++;

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
            $count++;

            foreach ($fac['programs'] as $prog) {
                AcademicUnit::updateOrCreate(
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
                $count++;
            }
        }

        return $count;
    }
}
