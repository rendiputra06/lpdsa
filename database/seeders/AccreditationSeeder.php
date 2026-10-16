<?php

namespace Database\Seeders;

use App\Models\AcademicUnit;
use App\Models\Accreditation;
use App\Services\AcademicApiService;
use Illuminate\Database\Seeder;

class AccreditationSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Sync academic units first
        $service = new AcademicApiService();
        $service->syncUnits();

        // 2. Clear existing accreditations before seeding realistic baseline
        Accreditation::truncate();

        // University accreditation
        $univ = AcademicUnit::universities()->first();
        Accreditation::create([
            'academic_unit_id' => $univ?->id,
            'unit_type' => 'university',
            'unit_name' => 'Universitas Abdurrab',
            'level' => null,
            'faculty_name' => null,
            'accreditation_body' => 'BAN-PT',
            'grade' => 'Baik Sekali',
            'sk_number' => '412/SK/BAN-PT/Ak/PT/VII/2023',
            'sk_date' => '2023-07-15',
            'valid_until' => '2028-07-15',
            'status' => 'active',
            'notes' => 'Akreditasi Institusi Perguruan Tinggi',
        ]);

        // Program Study Accreditations
        $studyPrograms = AcademicUnit::studyPrograms()->get();

        $sampleData = [
            'Pendidikan Dokter' => [
                'body' => 'LAM-PTKes',
                'grade' => 'Unggul',
                'sk' => '0245/LAM-PTKes/Akr/Sar/V/2024',
                'sk_date' => '2024-05-20',
                'valid_until' => '2029-05-20',
            ],
            'Profesi Dokter' => [
                'body' => 'LAM-PTKes',
                'grade' => 'Unggul',
                'sk' => '0246/LAM-PTKes/Akr/Pro/V/2024',
                'sk_date' => '2024-05-20',
                'valid_until' => '2029-05-20',
            ],
            'Farmasi' => [
                'body' => 'LAM-PTKes',
                'grade' => 'Unggul',
                'sk' => '0312/LAM-PTKes/Akr/Sar/VII/2023',
                'sk_date' => '2023-07-10',
                'valid_until' => '2028-07-10',
            ],
            'Teknik Informatika' => [
                'body' => 'LAM-INFOKOM',
                'grade' => 'Baik Sekali',
                'sk' => '058/SK/LAM-INFOKOM/Ak/S/IV/2024',
                'sk_date' => '2024-04-18',
                'valid_until' => '2029-04-18',
            ],
            'Teknik Sipil' => [
                'body' => 'BAN-PT',
                'grade' => 'Baik',
                'sk' => '1204/SK/BAN-PT/Ak-PPJ/S/II/2022',
                'sk_date' => '2022-02-14',
                'valid_until' => '2027-02-14',
            ],
            'Ilmu Keperawatan' => [
                'body' => 'LAM-PTKes',
                'grade' => 'Baik Sekali',
                'sk' => '0415/LAM-PTKes/Akr/Sar/VIII/2023',
                'sk_date' => '2023-08-25',
                'valid_until' => '2028-08-25',
            ],
            'Profesi Ners' => [
                'body' => 'LAM-PTKes',
                'grade' => 'Baik Sekali',
                'sk' => '0416/LAM-PTKes/Akr/Pro/VIII/2023',
                'sk_date' => '2023-08-25',
                'valid_until' => '2028-08-25',
            ],
            'Kebidanan' => [
                'body' => 'LAM-PTKes',
                'grade' => 'B',
                'sk' => '0189/LAM-PTKes/Akr/Dip/IV/2021',
                'sk_date' => '2021-04-12',
                'valid_until' => '2026-04-12',
            ],
            'Keperawatan' => [
                'body' => 'LAM-PTKes',
                'grade' => 'Baik',
                'sk' => '0298/LAM-PTKes/Akr/Dip/VI/2022',
                'sk_date' => '2022-06-19',
                'valid_until' => '2027-06-19',
            ],
            'Psikologi' => [
                'body' => 'BAN-PT',
                'grade' => 'Baik Sekali',
                'sk' => '2341/SK/BAN-PT/Ak/S/IV/2023',
                'sk_date' => '2023-04-05',
                'valid_until' => '2028-04-05',
            ],
            'Ilmu Komunikasi' => [
                'body' => 'BAN-PT',
                'grade' => 'Baik',
                'sk' => '1955/SK/BAN-PT/Ak/S/III/2023',
                'sk_date' => '2023-03-22',
                'valid_until' => '2028-03-22',
            ],
            'Ilmu Pemerintahan' => [
                'body' => 'BAN-PT',
                'grade' => 'B',
                'sk' => '0876/SK/BAN-PT/Ak/S/II/2022',
                'sk_date' => '2022-02-18',
                'valid_until' => '2027-02-18',
            ],
            'Hubungan Internasional' => [
                'body' => 'BAN-PT',
                'grade' => 'Baik',
                'sk' => '3120/SK/BAN-PT/Ak/S/V/2023',
                'sk_date' => '2023-05-15',
                'valid_until' => '2028-05-15',
            ],
            'Teknologi Laboratorium Medis' => [
                'body' => 'LAM-PTKes',
                'grade' => 'Baik Sekali',
                'sk' => '0555/LAM-PTKes/Akr/Dip/X/2023',
                'sk_date' => '2023-10-08',
                'valid_until' => '2028-10-08',
            ],
            'Fisioterapi' => [
                'body' => 'LAM-PTKes',
                'grade' => 'Baik',
                'sk' => '0432/LAM-PTKes/Akr/Dip/VIII/2022',
                'sk_date' => '2022-08-14',
                'valid_until' => '2027-08-14',
            ],
        ];

        foreach ($studyPrograms as $prog) {
            $data = $sampleData[$prog->name] ?? [
                'body' => 'BAN-PT',
                'grade' => 'Baik',
                'sk' => '001/SK/BAN-PT/Ak/' . rand(2021, 2024),
                'sk_date' => '2022-01-01',
                'valid_until' => '2027-01-01',
            ];

            Accreditation::create([
                'academic_unit_id' => $prog->id,
                'unit_type' => 'study_program',
                'unit_name' => $prog->name,
                'level' => $prog->level,
                'faculty_name' => $prog->faculty_name,
                'accreditation_body' => $data['body'],
                'grade' => $data['grade'],
                'sk_number' => $data['sk'],
                'sk_date' => $data['sk_date'],
                'valid_until' => $data['valid_until'],
                'status' => 'active',
                'notes' => 'Status akreditasi program studi resmi Univrab',
            ]);
        }
    }
}
