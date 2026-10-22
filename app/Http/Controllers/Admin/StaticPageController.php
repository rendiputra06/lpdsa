<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StaticPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StaticPageController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/static-pages/index', [
            'pages' => StaticPage::latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/static-pages/create');
    }

    public function store(Request $request)
    {
        $rules = [
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:static_pages,slug',
            'type' => 'required|string|in:default,org_structure,documents',
            'content' => 'nullable|string',
            'meta_description' => 'nullable|string|max:255',
            'data' => 'nullable|array',
        ];

        if ($request->input('type') === 'documents' && is_array($request->input('data'))) {
            $rules['data.*.title'] = 'required|string|max:255';
            $rules['data.*.description'] = 'nullable|string|max:1000';
            $rules['data.*.is_external_link'] = 'nullable';
            $rules['data.*.url'] = 'nullable|url|max:1000';
            $rules['data.*.file'] = 'nullable';
        }

        $validated = $request->validate($rules, [
            'title.required' => 'Judul halaman wajib diisi.',
            'slug.unique' => 'Slug halaman sudah digunakan.',
            'data.*.title.required' => 'Judul pada setiap baris dokumen wajib diisi.',
            'data.*.url.url' => 'Format URL tautan eksternal tidak valid.',
        ]);

        $rawItems = $request->input('data', []);
        $validated['data'] = is_array($rawItems) ? $this->processDataFiles($request, $rawItems, []) : null;

        StaticPage::create($validated);

        return redirect()->route('admin.static-pages.index')->with('success', 'Halaman berhasil dibuat.');
    }

    public function edit(StaticPage $staticPage)
    {
        return Inertia::render('admin/static-pages/edit', [
            'page' => $staticPage,
        ]);
    }

    public function update(Request $request, StaticPage $staticPage)
    {
        $rules = [
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:static_pages,slug,' . $staticPage->id,
            'type' => 'required|string|in:default,org_structure,documents',
            'content' => 'nullable|string',
            'meta_description' => 'nullable|string|max:255',
            'data' => 'nullable|array',
        ];

        if ($request->input('type') === 'documents' && is_array($request->input('data'))) {
            $rules['data.*.title'] = 'required|string|max:255';
            $rules['data.*.description'] = 'nullable|string|max:1000';
            $rules['data.*.is_external_link'] = 'nullable';
            $rules['data.*.url'] = 'nullable|url|max:1000';
            $rules['data.*.file'] = 'nullable';
        }

        $validated = $request->validate($rules, [
            'title.required' => 'Judul halaman wajib diisi.',
            'slug.unique' => 'Slug halaman sudah digunakan.',
            'data.*.title.required' => 'Judul pada setiap baris dokumen wajib diisi.',
            'data.*.url.url' => 'Format URL tautan eksternal tidak valid.',
        ]);

        $rawItems = $request->input('data', []);
        $validated['data'] = is_array($rawItems) ? $this->processDataFiles($request, $rawItems, $staticPage->data ?? []) : null;

        $staticPage->update($validated);

        return redirect()->route('admin.static-pages.index')->with('success', 'Halaman berhasil diperbarui.');
    }

    public function destroy(StaticPage $staticPage)
    {
        // Cleanup stored files from disk
        if (is_array($staticPage->data)) {
            foreach ($staticPage->data as $item) {
                if (!empty($item['photo']) && is_string($item['photo']) && Storage::disk('public')->exists($item['photo'])) {
                    Storage::disk('public')->delete($item['photo']);
                }
                if (!empty($item['file']) && is_string($item['file']) && Storage::disk('public')->exists($item['file'])) {
                    Storage::disk('public')->delete($item['file']);
                }
            }
        }

        $staticPage->delete();
        return redirect()->route('admin.static-pages.index')->with('success', 'Halaman berhasil dihapus.');
    }

    private function processDataFiles(Request $request, array $data, array $oldData = []): array
    {
        // Kumpulkan semua file lama yang pernah tersimpan di disk
        $allOldFiles = [];
        foreach ($oldData as $oldItem) {
            if (!empty($oldItem['photo']) && is_string($oldItem['photo'])) {
                $allOldFiles[] = $oldItem['photo'];
            }
            if (!empty($oldItem['file']) && is_string($oldItem['file'])) {
                $allOldFiles[] = $oldItem['file'];
            }
        }

        foreach ($data as $index => &$item) {
            // 1. Process photo for org_structure
            if ($request->hasFile("data.{$index}.photo")) {
                $request->validate([
                    "data.{$index}.photo" => 'file|mimes:jpeg,png,jpg,webp|max:2048',
                ], [
                    "data.{$index}.photo.max" => 'Ukuran foto pada baris ke-' . ($index + 1) . ' maksimal 2 MB.',
                ]);

                $item['photo'] = $request->file("data.{$index}.photo")->store('static_pages', 'public');
            } else {
                if (empty($item['photo']) || $item['photo'] === 'null' || $item['photo'] === '') {
                    $item['photo'] = null;
                }
            }

            // 2. Process file for documents
            $isExternal = filter_var($item['is_external_link'] ?? false, FILTER_VALIDATE_BOOLEAN);

            if ($isExternal) {
                // Jika bertipe tautan eksternal, bersihkan field file
                $item['file'] = null;
                $item['is_external_link'] = true;
            } else {
                // Jika bertipe berkas fisik, bersihkan field url
                $item['url'] = null;
                $item['is_external_link'] = false;

                if ($request->hasFile("data.{$index}.file")) {
                    $request->validate([
                        "data.{$index}.file" => 'file|mimes:pdf,doc,docx,xls,xlsx,zip,rar|max:10240',
                    ], [
                        "data.{$index}.file.max" => 'Ukuran berkas pada baris ke-' . ($index + 1) . ' maksimal 10 MB.',
                        "data.{$index}.file.mimes" => 'Format berkas pada baris ke-' . ($index + 1) . ' harus berupa PDF, DOC, DOCX, XLS, XLSX, ZIP, atau RAR.',
                    ]);

                    $item['file'] = $request->file("data.{$index}.file")->store('static_pages', 'public');
                } else {
                    if (empty($item['file']) || $item['file'] === 'null' || $item['file'] === '') {
                        $item['file'] = null;
                    }
                }
            }
        }
        unset($item);

        // Kumpulkan file yang aktif dipakai pada data yang baru
        $newFiles = [];
        foreach ($data as $newItem) {
            if (!empty($newItem['photo']) && is_string($newItem['photo'])) {
                $newFiles[] = $newItem['photo'];
            }
            if (!empty($newItem['file']) && is_string($newItem['file'])) {
                $newFiles[] = $newItem['file'];
            }
        }

        // Hapus file lama yang tidak lagi digunakan di susunan data baru (diff cleanup)
        $filesToDelete = array_diff($allOldFiles, $newFiles);
        foreach ($filesToDelete as $fileToDelete) {
            if (Storage::disk('public')->exists($fileToDelete)) {
                Storage::disk('public')->delete($fileToDelete);
            }
        }

        return $data;
    }
}
