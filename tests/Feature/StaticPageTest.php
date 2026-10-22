<?php

namespace Tests\Feature;

use App\Models\StaticPage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class StaticPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_documents_static_page_with_file(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => 'admin']);

        $file = UploadedFile::fake()->create('pedoman-2026.pdf', 500, 'application/pdf');

        $response = $this->actingAs($admin)->post('/admin/static-pages', [
            'title' => 'Pusat Regulasi & SOP',
            'slug' => 'pusat-regulasi-dan-sop',
            'type' => 'documents',
            'content' => '',
            'data' => [
                [
                    'title' => 'Pedoman Akademik 2026',
                    'description' => 'Buku pedoman resmi akademik',
                    'file' => $file,
                    'is_external_link' => false,
                    'url' => '',
                ],
                [
                    'title' => 'Panduan Kurikulum OBE di Cloud',
                    'description' => 'Akses via Google Drive',
                    'file' => null,
                    'is_external_link' => true,
                    'url' => 'https://drive.google.com/sample',
                ],
            ],
        ]);

        $response->assertRedirect('/admin/static-pages');
        $this->assertDatabaseHas('static_pages', [
            'slug' => 'pusat-regulasi-dan-sop',
            'type' => 'documents',
        ]);

        $page = StaticPage::where('slug', 'pusat-regulasi-dan-sop')->first();
        $this->assertCount(2, $page->data);
        $this->assertNotEmpty($page->data[0]['file']);
        Storage::disk('public')->assertExists($page->data[0]['file']);
    }

    public function test_updating_documents_cleans_up_orphaned_files(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => 'admin']);

        $file1 = UploadedFile::fake()->create('doc1.pdf', 500, 'application/pdf');
        $file2 = UploadedFile::fake()->create('doc2.pdf', 500, 'application/pdf');

        // 1. Create page with 2 documents
        $this->actingAs($admin)->post('/admin/static-pages', [
            'title' => 'Koleksi Dokumen',
            'slug' => 'koleksi-dokumen',
            'type' => 'documents',
            'data' => [
                [
                    'title' => 'Dokumen 1',
                    'file' => $file1,
                    'is_external_link' => false,
                ],
                [
                    'title' => 'Dokumen 2',
                    'file' => $file2,
                    'is_external_link' => false,
                ],
            ],
        ]);

        $page = StaticPage::where('slug', 'koleksi-dokumen')->first();
        $storedFile1 = $page->data[0]['file'];
        $storedFile2 = $page->data[1]['file'];

        Storage::disk('public')->assertExists($storedFile1);
        Storage::disk('public')->assertExists($storedFile2);

        // 2. Update page: remove Dokumen 1, switch Dokumen 2 to external link
        $updateResponse = $this->actingAs($admin)->put("/admin/static-pages/{$page->id}", [
            'title' => 'Koleksi Dokumen',
            'slug' => 'koleksi-dokumen',
            'type' => 'documents',
            'data' => [
                [
                    'title' => 'Dokumen 2 (Sekarang via Cloud)',
                    'file' => null,
                    'is_external_link' => true,
                    'url' => 'https://drive.google.com/doc2',
                ],
            ],
        ]);

        $updateResponse->assertRedirect('/admin/static-pages');

        // Verifikasi bahwa kedua berkas lama otomatis terhapus dari storage
        Storage::disk('public')->assertMissing($storedFile1);
        Storage::disk('public')->assertMissing($storedFile2);

        $page->refresh();
        $this->assertCount(1, $page->data);
        $this->assertNull($page->data[0]['file']);
        $this->assertEquals('https://drive.google.com/doc2', $page->data[0]['url']);
    }

    public function test_destroying_page_cleans_up_all_stored_files(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => 'admin']);

        $file = UploadedFile::fake()->create('doc-hapus.pdf', 500, 'application/pdf');

        $this->actingAs($admin)->post('/admin/static-pages', [
            'title' => 'Halaman Dihapus',
            'slug' => 'halaman-dihapus',
            'type' => 'documents',
            'data' => [
                [
                    'title' => 'Dokumen Segera Dihapus',
                    'file' => $file,
                    'is_external_link' => false,
                ],
            ],
        ]);

        $page = StaticPage::where('slug', 'halaman-dihapus')->first();
        $storedFile = $page->data[0]['file'];
        Storage::disk('public')->assertExists($storedFile);

        // Delete page
        $this->actingAs($admin)->delete("/admin/static-pages/{$page->id}");

        $this->assertDatabaseMissing('static_pages', ['id' => $page->id]);
        Storage::disk('public')->assertMissing($storedFile);
    }

    public function test_document_item_requires_title(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post('/admin/static-pages', [
            'title' => 'Halaman Tanpa Judul Item',
            'slug' => 'halaman-tanpa-judul-item',
            'type' => 'documents',
            'data' => [
                [
                    'title' => '', // Kosong
                    'is_external_link' => true,
                    'url' => 'https://example.com',
                ],
            ],
        ]);

        $response->assertSessionHasErrors('data.0.title');
    }

    public function test_public_user_can_view_documents_static_page(): void
    {
        $page = StaticPage::create([
            'title' => 'Regulasi Universitas',
            'slug' => 'regulasi-universitas',
            'type' => 'documents',
            'content' => '',
            'data' => [
                [
                    'title' => 'Statuta Universitas',
                    'description' => 'Statuta resmi',
                    'is_external_link' => true,
                    'url' => 'https://drive.google.com/statuta',
                ],
            ],
        ]);

        $response = $this->get('/regulasi-universitas');
        $response->assertStatus(200);
        $response->assertInertia(fn ($assert) => $assert
            ->component('static-page')
            ->has('page')
            ->where('page.slug', 'regulasi-universitas')
        );
    }
}
