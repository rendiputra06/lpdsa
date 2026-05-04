<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'link' => 'nullable|string|max:500',
            'order' => 'required|integer',
            'is_active' => 'required|boolean',
        ]);

        $validated['image_path'] = $request->file('image')->store('banners', 'public');
        unset($validated['image']);

        Banner::create($validated);

        return redirect()->back()->with('success', 'Banner berhasil ditambahkan.');
    }

    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'text' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'link' => 'nullable|string|max:500',
            'order' => 'required|integer',
            'is_active' => 'required|boolean',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($banner->image_path && Storage::disk('public')->exists($banner->image_path)) {
                Storage::disk('public')->delete($banner->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('banners', 'public');
        }

        unset($validated['image']);

        $banner->update($validated);

        return redirect()->back()->with('success', 'Banner berhasil diperbarui.');
    }

    public function destroy(Banner $banner)
    {
        // Delete image file if exists
        if ($banner->image_path && Storage::disk('public')->exists($banner->image_path)) {
            Storage::disk('public')->delete($banner->image_path);
        }

        $banner->delete();
        return redirect()->back()->with('success', 'Banner berhasil dihapus.');
    }
}
