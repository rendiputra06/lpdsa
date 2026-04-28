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
            'content' => 'required|string',
            'meta_description' => 'nullable|string|max:255',
        ]);

        $staticPage->update($validated);

        return redirect()->route('admin.static-pages.index')->with('success', 'Halaman berhasil diperbarui.');
    }
}
