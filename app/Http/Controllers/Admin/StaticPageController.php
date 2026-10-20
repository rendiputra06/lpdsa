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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:static_pages,slug',
            'type' => 'required|string|in:default,org_structure,documents',
            'content' => 'nullable|string',
            'meta_description' => 'nullable|string|max:255',
            'data' => 'nullable|array',
        ]);

        $validated['data'] = $this->processDataFiles($request, $validated['data'] ?? []);

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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:static_pages,slug,' . $staticPage->id,
            'type' => 'required|string|in:default,org_structure,documents',
            'content' => 'nullable|string',
            'meta_description' => 'nullable|string|max:255',
            'data' => 'nullable|array',
        ]);

        $validated['data'] = $this->processDataFiles($request, $validated['data'] ?? [], $staticPage->data ?? []);

        $staticPage->update($validated);

        return redirect()->route('admin.static-pages.index')->with('success', 'Halaman berhasil diperbarui.');
    }

    public function destroy(StaticPage $staticPage)
    {
        // Cleanup stored files from disk
        if (is_array($staticPage->data)) {
            foreach ($staticPage->data as $item) {
                if (!empty($item['photo']) && Storage::disk('public')->exists($item['photo'])) {
                    Storage::disk('public')->delete($item['photo']);
                }
                if (!empty($item['file']) && Storage::disk('public')->exists($item['file'])) {
                    Storage::disk('public')->delete($item['file']);
                }
            }
        }

        $staticPage->delete();
        return redirect()->route('admin.static-pages.index')->with('success', 'Halaman berhasil dihapus.');
    }

    private function processDataFiles(Request $request, array $data, array $oldData = [])
    {
        foreach ($data as $index => &$item) {
            // Process photo for org_structure
            if ($request->hasFile("data.{$index}.photo")) {
                $request->validate([
                    "data.{$index}.photo" => 'file|mimes:jpeg,png,jpg,webp|max:2048',
                ]);

                // Delete old photo if it exists
                $oldPhoto = $oldData[$index]['photo'] ?? null;
                if ($oldPhoto && is_string($oldPhoto) && Storage::disk('public')->exists($oldPhoto)) {
                    Storage::disk('public')->delete($oldPhoto);
                }

                $item['photo'] = $request->file("data.{$index}.photo")->store('static_pages', 'public');
            } else {
                // Keep the existing photo if it's already a string path (unchanged)
                // If it is explicitly deleted or empty, set to null and clean up disk
                if (!isset($item['photo']) || $item['photo'] === 'null' || $item['photo'] === '' || $item['photo'] === null) {
                    $oldPhoto = $oldData[$index]['photo'] ?? null;
                    if ($oldPhoto && is_string($oldPhoto) && Storage::disk('public')->exists($oldPhoto)) {
                        Storage::disk('public')->delete($oldPhoto);
                    }
                    $item['photo'] = null;
                }
            }

            // Process file for documents
            if ($request->hasFile("data.{$index}.file")) {
                $request->validate([
                    "data.{$index}.file" => 'file|mimes:pdf,doc,docx,xls,xlsx,zip,rar|max:10240',
                ]);

                // Delete old document file if it exists
                $oldFile = $oldData[$index]['file'] ?? null;
                if ($oldFile && is_string($oldFile) && Storage::disk('public')->exists($oldFile)) {
                    Storage::disk('public')->delete($oldFile);
                }

                $item['file'] = $request->file("data.{$index}.file")->store('static_pages', 'public');
            } else {
                // Keep the existing file if it's already a string path (unchanged)
                // If it is explicitly deleted or empty, set to null and clean up disk
                if (!isset($item['file']) || $item['file'] === 'null' || $item['file'] === '' || $item['file'] === null) {
                    $oldFile = $oldData[$index]['file'] ?? null;
                    if ($oldFile && is_string($oldFile) && Storage::disk('public')->exists($oldFile)) {
                        Storage::disk('public')->delete($oldFile);
                    }
                    $item['file'] = null;
                }
            }
        }

        return $data;
    }
}
