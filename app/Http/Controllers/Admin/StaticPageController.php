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
        foreach ($data as $index => &$item) {
            // Process photo for org_structure
            if ($request->hasFile("data.{$index}.photo")) {
                $item['photo'] = $request->file("data.{$index}.photo")->store('static_pages', 'public');
            } else {
                // Keep the existing photo if it's already a string path (unchanged)
                // If it is explicitly deleted or empty, set to null
                if (!isset($item['photo']) || $item['photo'] === 'null' || $item['photo'] === '') {
                    $item['photo'] = null;
                }
            }

            // Process file for documents
            if ($request->hasFile("data.{$index}.file")) {
                $item['file'] = $request->file("data.{$index}.file")->store('static_pages', 'public');
            } else {
                // Keep the existing file if it's already a string path (unchanged)
                // If it is explicitly deleted or empty, set to null
                if (!isset($item['file']) || $item['file'] === 'null' || $item['file'] === '') {
                    $item['file'] = null;
                }
            }
        }

        return $data;
    }
}
