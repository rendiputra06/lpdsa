<?php

namespace Tests\Feature;

use App\Models\Menu;
use App\Models\SpmiCategory;
use App\Models\SpmiDocument;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SpmiDocumentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\SpmiCategorySeeder::class);
    }

    public function test_public_can_view_kebijakan_index_with_all_mode(): void
    {
        $response = $this->get('/spmi/penetapan/kebijakan');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('spmi/kebijakan')
            ->where('mode', 'all')
            ->has('categories')
            ->has('documents')
        );
    }

    public function test_public_can_view_single_category_from_sub_menu_route(): void
    {
        $category = SpmiCategory::where('slug', 'visi-misi-tujuan-dan-strategi')->first();

        $response = $this->get("/spmi/penetapan/kebijakan/{$category->slug}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('spmi/kebijakan')
            ->where('mode', 'single')
            ->where('selectedCategory.id', $category->id)
            ->has('documents')
        );
    }

    public function test_admin_can_view_spmi_management_page(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)->get('/admin/spmi/documents');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/spmi/documents/index')
            ->has('documents.data')
            ->has('categories')
            ->has('stats')
        );
    }

    public function test_admin_can_publish_category_to_public_menu(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $category = SpmiCategory::first();

        $response = $this->actingAs($admin)
            ->post("/admin/spmi/categories/{$category->id}/publish-menu");

        $response->assertRedirect();

        // Verifikasi menu bertingkat terbentuk
        $this->assertDatabaseHas('menus', [
            'label' => 'SPMI',
            'parent_id' => null,
        ]);

        $this->assertDatabaseHas('menus', [
            'label' => 'Penetapan',
        ]);

        $this->assertDatabaseHas('menus', [
            'label' => 'Kebijakan',
            'url' => '/spmi/penetapan/kebijakan',
        ]);

        $this->assertDatabaseHas('menus', [
            'label' => $category->name,
            'url' => $category->public_url,
        ]);
    }

    public function test_admin_can_create_and_delete_spmi_document(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $category = SpmiCategory::first();

        $createResponse = $this->actingAs($admin)->post('/admin/spmi/documents', [
            'spmi_category_id' => $category->id,
            'document_number' => 'TEST/001/2026',
            'title' => 'Dokumen Kebijakan Uji Coba',
            'year' => 2026,
            'external_url' => 'https://drive.google.com/test',
            'is_public' => true,
        ]);

        $createResponse->assertRedirect();
        $this->assertDatabaseHas('spmi_documents', [
            'document_number' => 'TEST/001/2026',
            'title' => 'Dokumen Kebijakan Uji Coba',
        ]);

        $doc = SpmiDocument::where('document_number', 'TEST/001/2026')->first();

        $deleteResponse = $this->actingAs($admin)->delete("/admin/spmi/documents/{$doc->id}");
        $deleteResponse->assertRedirect();

        $this->assertDatabaseMissing('spmi_documents', [
            'id' => $doc->id,
        ]);
    }

    public function test_internal_share_link_redirects_and_increments_tracking_count(): void
    {
        $doc = SpmiDocument::first();
        $initialCount = $doc->download_count;

        $response = $this->get("/spmi/dokumen/share/{$doc->slug}");

        $response->assertRedirect($doc->effective_url);

        $doc->refresh();
        $this->assertEquals($initialCount + 1, $doc->download_count);
    }

    public function test_updating_category_synchronizes_navbar_menu(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = SpmiCategory::create([
            'name' => 'Kategori Awal',
            'slug' => 'kategori-awal',
            'order' => 1,
            'is_active' => true,
        ]);

        // Publish to menu
        $this->actingAs($admin)->post("/admin/spmi/categories/{$category->id}/publish-menu");
        $this->assertDatabaseHas('menus', [
            'label' => 'Kategori Awal',
            'url' => '/spmi/penetapan/kebijakan/kategori-awal',
        ]);

        // Update name and slug
        $updateResponse = $this->actingAs($admin)->put("/admin/spmi/categories/{$category->id}", [
            'name' => 'Kategori Baru Diperbarui',
            'slug' => 'kategori-baru-diperbarui',
            'order' => 1,
            'is_active' => true,
        ]);
        $updateResponse->assertRedirect();

        // Check if menu entry is automatically synchronized
        $this->assertDatabaseHas('menus', [
            'label' => 'Kategori Baru Diperbarui',
            'url' => '/spmi/penetapan/kebijakan/kategori-baru-diperbarui',
        ]);
        $this->assertDatabaseMissing('menus', [
            'url' => '/spmi/penetapan/kebijakan/kategori-awal',
        ]);
    }

    public function test_deleting_category_removes_navbar_menu(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = SpmiCategory::create([
            'name' => 'Kategori Dihapus',
            'slug' => 'kategori-dihapus',
            'order' => 99,
            'is_active' => true,
        ]);

        // Publish to menu
        $this->actingAs($admin)->post("/admin/spmi/categories/{$category->id}/publish-menu");
        $this->assertDatabaseHas('menus', [
            'url' => $category->public_url,
        ]);

        // Delete category
        $deleteResponse = $this->actingAs($admin)->delete("/admin/spmi/categories/{$category->id}");
        $deleteResponse->assertRedirect();

        // Check that menu is also cleaned up
        $this->assertDatabaseMissing('menus', [
            'url' => $category->public_url,
        ]);
    }

    public function test_inactive_category_cannot_be_accessed_by_guests(): void
    {
        $category = SpmiCategory::create([
            'name' => 'Kategori Nonaktif',
            'slug' => 'kategori-nonaktif',
            'order' => 10,
            'is_active' => false,
        ]);

        $response = $this->get("/spmi/penetapan/kebijakan/{$category->slug}");
        $response->assertStatus(404);
    }
}

