<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BannerController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/banners/index', [
            'banners' => Banner::latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'text' => 'nullable|string',
            'image' => 'required|image|max:2048',
            'order' => 'required|integer',
            'is_active' => 'required|boolean',
        ]);

        $validated['image'] = $request->file('image')->store('banners', 'public');

        Banner::create($validated);

        return redirect()->back()->with('success', 'Banner berhasil ditambahkan.');
    }

    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'text' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'order' => 'required|integer',
            'is_active' => 'required|boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('banners', 'public');
        }

        $banner->update($validated);

        return redirect()->back()->with('success', 'Banner berhasil diperbarui.');
    }

    public function destroy(Banner $banner)
    {
        $banner->delete();
        return redirect()->back()->with('success', 'Banner berhasil dihapus.');
    }
}
