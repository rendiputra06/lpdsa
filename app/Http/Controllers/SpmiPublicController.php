<?php

namespace App\Http\Controllers;

use App\Models\SpmiCategory;
use App\Models\SpmiDocument;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SpmiPublicController extends Controller
{
    /**
     * Halaman Induk Kebijakan SPMI (Mode: All Kriteria dengan Horizontal Filter Tabs)
     */
    public function kebijakanIndex(Request $request)
    {
        $categories = SpmiCategory::where('cycle_stage', 'penetapan')
            ->where('sub_stage', 'kebijakan')
            ->where('is_active', true)
            ->withCount(['documents' => fn ($q) => $q->where('is_public', true)])
            ->orderBy('order')
            ->orderBy('name')
            ->get();

        $criteriaSlug = $request->query('criteria');
        $sort = $request->query('sort', 'newest');
        $search = $request->query('search', $request->query('q', ''));

        // Jika criteria spesifik dipilih atau default ke kategori pertama yang memiliki dokumen / urutan pertama
        $selectedCategory = null;
        if (!empty($criteriaSlug)) {
            $selectedCategory = $categories->firstWhere('slug', $criteriaSlug);
        }

        // Jika kriteria tidak dispesifikasikan, kita bisa pilih kategori pertama secara default agar langsung ada konten yang tampil
        if (!$selectedCategory && $categories->isNotEmpty()) {
            $selectedCategory = $categories->first();
        }

        $docsQuery = SpmiDocument::where('is_public', true)->with('category');

        if ($selectedCategory) {
            $docsQuery->where('spmi_category_id', $selectedCategory->id);
        }

        if (!empty($search)) {
            $docsQuery->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('document_number', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($sort === 'oldest') {
            $docsQuery->orderBy('year', 'asc')->orderBy('id', 'asc');
        } else {
            $docsQuery->orderBy('year', 'desc')->orderBy('id', 'desc');
        }

        $documents = $docsQuery->get();

        return Inertia::render('spmi/kebijakan', [
            'mode' => 'all', // Menampilkan horizontal filter tabs
            'categories' => $categories,
            'selectedCategory' => $selectedCategory,
            'documents' => $documents,
            'currentSort' => $sort,
            'currentSearch' => $search,
        ]);
    }

    /**
     * Halaman Khusus Sub-Menu Kategori SPMI (Mode: Single Kriteria tanpa Horizontal Tabs)
     * Contoh rute: /spmi/penetapan/kebijakan/{category:slug}
     */
    public function kebijakanCategory(Request $request, SpmiCategory $category)
    {
        if (!$category->is_active && !auth()->check()) {
            abort(404, 'Kategori kriteria SPMI ini sedang tidak aktif.');
        }

        $sort = $request->query('sort', 'newest');
        $search = $request->query('search', $request->query('q', ''));

        $docsQuery = SpmiDocument::where('spmi_category_id', $category->id)
            ->where('is_public', true)
            ->with('category');

        if (!empty($search)) {
            $docsQuery->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('document_number', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($sort === 'oldest') {
            $docsQuery->orderBy('year', 'asc')->orderBy('id', 'asc');
        } else {
            $docsQuery->orderBy('year', 'desc')->orderBy('id', 'desc');
        }

        $documents = $docsQuery->get();

        return Inertia::render('spmi/kebijakan', [
            'mode' => 'single', // TANPA horizontal tabs, fokus khusus kriteria ini
            'selectedCategory' => $category,
            'documents' => $documents,
            'currentSort' => $sort,
            'currentSearch' => $search,
        ]);
    }

    /**
     * Membuka dokumen SPMI via tautan resmi kampus:
     * 1. Melacak jumlah pembaca/unduhan (audit trail)
     * 2. Memeriksa ketersediaan file atau link eksternal
     * 3. Mengarahkan pengunjung secara mulus ke Google Drive / Berkas PDF
     */
    public function openDocument(string $documentParam)
    {
        $document = SpmiDocument::where('slug', $documentParam)
            ->orWhere('id', $documentParam)
            ->firstOrFail();

        if (!$document->is_public && !auth()->check()) {
            abort(403, 'Dokumen ini bersifat internal kampus.');
        }

        // Tracking: naikkan download_count
        $document->increment('download_count');

        $destination = $document->effective_url;
        if (empty($destination)) {
            abort(404, 'Berkas dokumen belum tersedia atau tautan tidak valid.');
        }

        return redirect()->away($destination);
    }
}
