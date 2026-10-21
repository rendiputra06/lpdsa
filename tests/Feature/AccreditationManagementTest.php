<?php

namespace Tests\Feature;

use App\Models\AcademicUnit;
use App\Models\Accreditation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AccreditationManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    public function test_guests_are_redirected_from_admin_accreditations(): void
    {
        $response = $this->get(route('admin.accreditations.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_admin_can_access_accreditations_index(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.accreditations.index'));
        $response->assertOk();
    }

    public function test_status_filters_correctly_evaluate_valid_until_dates(): void
    {
        // 1. Long-term active (valid for 3 years)
        $activeUnit = Accreditation::create([
            'unit_type' => 'study_program',
            'unit_name' => 'S1 Farmasi',
            'level' => 'S1',
            'accreditation_body' => 'LAM-PTKes',
            'grade' => 'Unggul',
            'sk_number' => 'SK-ACTIVE-01',
            'valid_until' => now()->addYears(3),
            'status' => 'active',
        ]);

        // 2. Expiring soon (valid for 3 months)
        $expiringUnit = Accreditation::create([
            'unit_type' => 'study_program',
            'unit_name' => 'S1 Keperawatan',
            'level' => 'S1',
            'accreditation_body' => 'LAM-PTKes',
            'grade' => 'Baik Sekali',
            'sk_number' => 'SK-EXPIRING-01',
            'valid_until' => now()->addMonths(3),
            'status' => 'active',
        ]);

        // 3. Expired by date (valid_until passed 2 months ago, but status was still 'active' in DB)
        $expiredByDateUnit = Accreditation::create([
            'unit_type' => 'study_program',
            'unit_name' => 'D3 Kebidanan',
            'level' => 'D3',
            'accreditation_body' => 'LAM-PTKes',
            'grade' => 'B',
            'sk_number' => 'SK-EXPIRED-01',
            'valid_until' => now()->subMonths(2),
            'status' => 'active',
        ]);

        // Test filter status = expired
        $responseExpired = $this->actingAs($this->admin)->get(route('admin.accreditations.index', ['status' => 'expired']));
        $responseExpired->assertOk();
        $expiredData = $responseExpired->viewData('page')['props']['accreditations']['data'];
        $expiredIds = collect($expiredData)->pluck('id')->all();
        $this->assertContains($expiredByDateUnit->id, $expiredIds);
        $this->assertNotContains($activeUnit->id, $expiredIds);
        $this->assertNotContains($expiringUnit->id, $expiredIds);

        // Test filter status = expiring_soon
        $responseSoon = $this->actingAs($this->admin)->get(route('admin.accreditations.index', ['status' => 'expiring_soon']));
        $responseSoon->assertOk();
        $soonData = $responseSoon->viewData('page')['props']['accreditations']['data'];
        $soonIds = collect($soonData)->pluck('id')->all();
        $this->assertContains($expiringUnit->id, $soonIds);
        $this->assertNotContains($activeUnit->id, $soonIds);
        $this->assertNotContains($expiredByDateUnit->id, $soonIds);

        // Test filter status = active
        $responseActive = $this->actingAs($this->admin)->get(route('admin.accreditations.index', ['status' => 'active']));
        $responseActive->assertOk();
        $activeData = $responseActive->viewData('page')['props']['accreditations']['data'];
        $activeIds = collect($activeData)->pluck('id')->all();
        $this->assertContains($activeUnit->id, $activeIds);
        $this->assertContains($expiringUnit->id, $activeIds);
        $this->assertNotContains($expiredByDateUnit->id, $activeIds);
    }

    public function test_admin_can_create_accreditation_with_certificate_file(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->create('sertifikat_dokter.pdf', 1024, 'application/pdf');

        $response = $this->actingAs($this->admin)->post(route('admin.accreditations.store'), [
            'unit_type' => 'study_program',
            'unit_name' => 'Pendidikan Dokter',
            'level' => 'S1',
            'faculty_name' => 'Fakultas Kedokteran',
            'accreditation_body' => 'LAM-PTKes',
            'grade' => 'Unggul',
            'sk_number' => 'SK-TEST-DOKTER',
            'sk_date' => '2024-01-10',
            'valid_until' => '2029-01-10',
            'status' => 'active',
            'certificate_file' => $file,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('accreditations', [
            'unit_name' => 'Pendidikan Dokter',
            'grade' => 'Unggul',
            'sk_number' => 'SK-TEST-DOKTER',
        ]);

        $accreditation = Accreditation::where('sk_number', 'SK-TEST-DOKTER')->first();
        $this->assertNotNull($accreditation->certificate_file);
        Storage::disk('public')->assertExists($accreditation->certificate_file);
    }

    public function test_admin_can_update_accreditation_and_delete_certificate(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->create('sertifikat_lama.pdf', 500, 'application/pdf');
        $filePath = $file->store('accreditations', 'public');

        $accreditation = Accreditation::create([
            'unit_type' => 'study_program',
            'unit_name' => 'Teknik Informatika',
            'level' => 'S1',
            'accreditation_body' => 'LAM-INFOKOM',
            'grade' => 'Baik Sekali',
            'sk_number' => 'SK-TIF-01',
            'valid_until' => now()->addYears(2),
            'status' => 'active',
            'certificate_file' => $filePath,
        ]);

        Storage::disk('public')->assertExists($filePath);

        // Update with delete_certificate = true
        $response = $this->actingAs($this->admin)->put(route('admin.accreditations.update', $accreditation), [
            'unit_type' => 'study_program',
            'unit_name' => 'Teknik Informatika',
            'level' => 'S1',
            'accreditation_body' => 'LAM-INFOKOM',
            'grade' => 'Unggul',
            'sk_number' => 'SK-TIF-01',
            'status' => 'active',
            'delete_certificate' => true,
        ]);

        $response->assertRedirect();

        $accreditation->refresh();
        $this->assertEquals('Unggul', $accreditation->grade);
        $this->assertNull($accreditation->certificate_file);
        Storage::disk('public')->assertMissing($filePath);
    }

    public function test_destroy_purges_certificate_file_from_storage(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->create('sertifikat_hapus.pdf', 300, 'application/pdf');
        $filePath = $file->store('accreditations', 'public');

        $accreditation = Accreditation::create([
            'unit_type' => 'faculty',
            'unit_name' => 'Fakultas Farmasi',
            'accreditation_body' => 'BAN-PT',
            'grade' => 'A',
            'sk_number' => 'SK-FF-01',
            'status' => 'active',
            'certificate_file' => $filePath,
        ]);

        Storage::disk('public')->assertExists($filePath);

        $response = $this->actingAs($this->admin)->delete(route('admin.accreditations.destroy', $accreditation));
        $response->assertRedirect();

        $this->assertDatabaseMissing('accreditations', ['id' => $accreditation->id]);
        Storage::disk('public')->assertMissing($filePath);
    }

    public function test_public_accreditations_page_loads_and_filters(): void
    {
        Accreditation::create([
            'unit_type' => 'university',
            'unit_name' => 'Universitas Abdurrab',
            'accreditation_body' => 'BAN-PT',
            'grade' => 'Baik Sekali',
            'sk_number' => 'SK-UNIV-01',
            'valid_until' => now()->addYears(3),
            'status' => 'active',
        ]);

        $response = $this->get(route('accreditations.index'));
        $response->assertOk();

        $responseSoon = $this->get(route('accreditations.index', ['status' => 'expiring_soon']));
        $responseSoon->assertOk();
    }

    public function test_admin_can_access_accreditations_create_page(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.accreditations.create'));
        $response->assertOk();
    }

    public function test_admin_can_access_accreditations_create_page_with_preselected_unit_and_history(): void
    {
        $unit = AcademicUnit::create([
            'external_id' => 'prodi-test-01',
            'type' => 'study_program',
            'name' => 'Kedokteran Gigi',
            'level' => 'S1',
            'faculty_name' => 'Fakultas Kedokteran Gigi',
            'is_active' => true,
        ]);

        $pastAccreditation = Accreditation::create([
            'academic_unit_id' => $unit->id,
            'unit_type' => 'study_program',
            'unit_name' => 'Kedokteran Gigi',
            'level' => 'S1',
            'faculty_name' => 'Fakultas Kedokteran Gigi',
            'accreditation_body' => 'LAM-PTKes',
            'grade' => 'Baik',
            'sk_number' => 'SK-KG-PAST',
            'valid_until' => now()->subYear(),
            'status' => 'expired',
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.accreditations.create', ['academic_unit_id' => $unit->id]));
        $response->assertOk();

        $pageProps = $response->viewData('page')['props'];
        $this->assertEquals($unit->id, $pageProps['selectedUnit']['id']);
        $this->assertNotEmpty($pageProps['history']);
        $this->assertEquals($pastAccreditation->id, $pageProps['history'][0]['id']);
    }

    public function test_admin_can_access_accreditations_edit_page_with_history(): void
    {
        $unit = AcademicUnit::create([
            'external_id' => 'prodi-test-02',
            'type' => 'study_program',
            'name' => 'Teknik Elektro',
            'level' => 'S1',
            'faculty_name' => 'Fakultas Teknik',
            'is_active' => true,
        ]);

        $currentAccreditation = Accreditation::create([
            'academic_unit_id' => $unit->id,
            'unit_type' => 'study_program',
            'unit_name' => 'Teknik Elektro',
            'level' => 'S1',
            'faculty_name' => 'Fakultas Teknik',
            'accreditation_body' => 'LAM TEKNIK',
            'grade' => 'Baik Sekali',
            'sk_number' => 'SK-TE-CURRENT',
            'valid_until' => now()->addYears(3),
            'status' => 'active',
        ]);

        $pastAccreditation = Accreditation::create([
            'academic_unit_id' => $unit->id,
            'unit_type' => 'study_program',
            'unit_name' => 'Teknik Elektro',
            'level' => 'S1',
            'faculty_name' => 'Fakultas Teknik',
            'accreditation_body' => 'BAN-PT',
            'grade' => 'B',
            'sk_number' => 'SK-TE-OLD',
            'valid_until' => now()->subYears(2),
            'status' => 'expired',
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.accreditations.edit', $currentAccreditation));
        $response->assertOk();

        $pageProps = $response->viewData('page')['props'];
        $this->assertEquals($currentAccreditation->id, $pageProps['accreditation']['id']);
        $this->assertCount(2, $pageProps['history']);
    }

    public function test_store_and_update_redirect_to_accreditations_index(): void
    {
        $storeResponse = $this->actingAs($this->admin)->post(route('admin.accreditations.store'), [
            'unit_type' => 'study_program',
            'unit_name' => 'Fisioterapi',
            'level' => 'D3',
            'accreditation_body' => 'LAM-PTKes',
            'grade' => 'Baik Sekali',
            'sk_number' => 'SK-FISIO-01',
            'status' => 'active',
        ]);

        $storeResponse->assertRedirect(route('admin.accreditations.index'));

        $accreditation = Accreditation::where('sk_number', 'SK-FISIO-01')->firstOrFail();

        $updateResponse = $this->actingAs($this->admin)->put(route('admin.accreditations.update', $accreditation), [
            'unit_type' => 'study_program',
            'unit_name' => 'Fisioterapi',
            'level' => 'D3',
            'accreditation_body' => 'LAM-PTKes',
            'grade' => 'Unggul',
            'sk_number' => 'SK-FISIO-01',
            'status' => 'active',
        ]);

        $updateResponse->assertRedirect(route('admin.accreditations.index'));
    }

    public function test_public_university_accreditation_page_renders_successfully(): void
    {
        Accreditation::create([
            'unit_type' => 'university',
            'unit_name' => 'Universitas Abdurrab',
            'accreditation_body' => 'BAN-PT',
            'grade' => 'Baik Sekali',
            'sk_number' => '412/SK/BAN-PT/Ak/PT/VII/2023',
            'sk_date' => '2023-07-15',
            'valid_until' => now()->addYears(3),
            'status' => 'active',
        ]);

        $response = $this->get(route('accreditations.university'));
        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->component('accreditations/university')
                ->has('university')
                ->has('history')
                ->has('stats')
        );
    }
}
