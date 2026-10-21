<?php

namespace Tests\Feature;

use App\Models\AcademicUnit;
use App\Models\Accreditation;
use App\Models\Setting;
use App\Models\User;
use App\Services\AcademicApiService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AcademicUnitSyncTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected AcademicApiService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->service = app(AcademicApiService::class);
    }

    public function test_sync_units_with_default_data_creates_units(): void
    {
        $result = $this->service->syncUnits();

        $this->assertTrue($result['success']);
        $this->assertDatabaseHas('academic_units', [
            'type' => 'university',
            'name' => 'Universitas Abdurrab',
        ]);
        $this->assertDatabaseHas('academic_units', [
            'type' => 'faculty',
            'name' => 'Fakultas Kedokteran',
        ]);
        $this->assertDatabaseHas('academic_units', [
            'type' => 'study_program',
            'code' => '11201',
            'name' => 'Pendidikan Dokter',
        ]);
    }

    public function test_sync_preserves_obsolete_units_with_accreditations_by_deactivating(): void
    {
        // First sync to establish base units
        $this->service->syncUnits();

        // Create an obsolete study program
        $faculty = AcademicUnit::where('type', 'faculty')->first();
        $obsoleteUnit = AcademicUnit::create([
            'type' => 'study_program',
            'code' => 'OBSOLETE-01',
            'name' => 'Program Studi Lawas',
            'level' => 'S1',
            'faculty_name' => $faculty->name,
            'parent_id' => $faculty->id,
            'is_active' => true,
        ]);

        // Attach an accreditation record to obsoleteUnit
        Accreditation::create([
            'academic_unit_id' => $obsoleteUnit->id,
            'unit_type' => 'study_program',
            'unit_name' => $obsoleteUnit->name,
            'level' => 'S1',
            'faculty_name' => $faculty->name,
            'accreditation_body' => 'LAM-PTKes',
            'grade' => 'B',
            'sk_number' => 'SK-TEST-001',
            'status' => 'active',
        ]);

        // Also create an unreferenced obsolete unit without accreditations
        $unreferencedUnit = AcademicUnit::create([
            'type' => 'study_program',
            'code' => 'OBSOLETE-02',
            'name' => 'Program Studi Hapus',
            'level' => 'S1',
            'faculty_name' => $faculty->name,
            'parent_id' => $faculty->id,
            'is_active' => true,
        ]);

        // Run sync again
        $result = $this->service->syncUnits();

        $this->assertTrue($result['success']);

        // Assert $obsoleteUnit still exists in DB, but is deactivated
        $this->assertDatabaseHas('academic_units', [
            'id' => $obsoleteUnit->id,
            'is_active' => false,
        ]);

        // Assert accreditation still points to $obsoleteUnit (not nullified or orphaned)
        $this->assertDatabaseHas('accreditations', [
            'academic_unit_id' => $obsoleteUnit->id,
        ]);

        // Assert $unreferencedUnit without accreditations was pruned
        $this->assertDatabaseMissing('academic_units', [
            'id' => $unreferencedUnit->id,
        ]);
    }

    public function test_sync_fails_cleanly_when_remote_api_is_unreachable(): void
    {
        Setting::updateOrCreate(
            ['key' => 'academic_api_url'],
            ['value' => 'https://invalid-non-existent-domain-xyz.local/api/prodi']
        );

        Http::fake([
            'https://invalid-non-existent-domain-xyz.local/*' => Http::response(null, 500),
        ]);

        $result = $this->service->syncUnits();

        $this->assertFalse($result['success']);
        $this->assertStringContainsString('Gagal menghubungi', $result['message']);
    }

    public function test_admin_can_toggle_academic_unit_status(): void
    {
        $unit = AcademicUnit::create([
            'type' => 'faculty',
            'name' => 'Fakultas Teknik',
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.academic-units.toggle-status', $unit));

        $response->assertRedirect();
        $this->assertDatabaseHas('academic_units', [
            'id' => $unit->id,
            'is_active' => false,
        ]);
    }

    public function test_admin_can_update_academic_unit(): void
    {
        $unit = AcademicUnit::create([
            'type' => 'study_program',
            'code' => 'INF-01',
            'name' => 'Informatika',
            'level' => 'S1',
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->admin)
            ->put(route('admin.academic-units.update', $unit), [
                'type' => 'study_program',
                'code' => 'TIF-S1',
                'name' => 'Teknik Informatika',
                'level' => 'S1',
                'faculty_name' => 'Fakultas Teknik',
                'is_active' => true,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('academic_units', [
            'id' => $unit->id,
            'code' => 'TIF-S1',
            'name' => 'Teknik Informatika',
            'faculty_name' => 'Fakultas Teknik',
        ]);
    }
}
