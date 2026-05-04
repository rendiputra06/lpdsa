<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StaticPage;
use Illuminate\Http\Request;
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
        $staticPage->delete();
        return redirect()->route('admin.static-pages.index')->with('success', 'Halaman berhasil dihapus.');
    }

    private function processDataFiles(Request $request, array $data, array $oldData = [])
    {
        if ($request->hasFile('data')) {
            $files = $request->file('data');
            foreach ($files as $index => $fileItem) {
                if (isset($fileItem['photo']) && $fileItem['photo'] instanceof \Illuminate\Http\UploadedFile) {
                    $data[$index]['photo'] = $fileItem['photo']->store('static_pages', 'public');
                }
                if (isset($fileItem['file']) && $fileItem['file'] instanceof \Illuminate\Http\UploadedFile) {
                    $data[$index]['file'] = $fileItem['file']->store('static_pages', 'public');
                }
            }
        }

        // Preserve old file paths if they weren't updated
        foreach ($data as $index => &$item) {
            if (isset($item['photo']) && $item['photo'] === null && isset($oldData[$index]['photo'])) {
                $item['photo'] = $oldData[$index]['photo'];
            }
            if (isset($item['file']) && $item['file'] === null && isset($oldData[$index]['file'])) {
                $item['file'] = $oldData[$index]['file'];
            }
        }

        return $data;
    }
}
