<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/menus/index', [
            'menus' => Menu::with('children')->whereNull('parent_id')->orderBy('order')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'type' => 'required|in:internal,external',
            'url' => 'required|string',
            'order' => 'required|integer',
            'parent_id' => 'nullable|exists:menus,id',
        ]);

        Menu::create($validated);

        return redirect()->back()->with('success', 'Menu berhasil ditambahkan.');
    }

    public function update(Request $request, Menu $menu)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'type' => 'required|in:internal,external',
            'url' => 'required|string',
            'order' => 'required|integer',
            'parent_id' => 'nullable|exists:menus,id',
        ]);

        $menu->update($validated);

        return redirect()->back()->with('success', 'Menu berhasil diperbarui.');
    }

    public function destroy(Menu $menu)
    {
        $menu->delete();
        return redirect()->back()->with('success', 'Menu berhasil dihapus.');
    }
}
