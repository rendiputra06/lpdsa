<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\StaticPage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function index()
    {
        $menus = Menu::tree()
            ->whereNull('parent_id')
            ->orderBy('order')
            ->get();

        $staticPages = StaticPage::select('id', 'title', 'slug')
            ->orderBy('title')
            ->get();

        $allMenusFlat = Menu::select('id', 'label', 'parent_id', 'order', 'type', 'url')
            ->orderBy('order')
            ->get();

        $stats = [
            'total' => Menu::count(),
            'root_count' => Menu::whereNull('parent_id')->count(),
            'sub_count' => Menu::whereNotNull('parent_id')->count(),
            'external_count' => Menu::where('type', 'external')->count(),
            'label_count' => Menu::where('type', 'label')->count(),
        ];

        return Inertia::render('admin/menus/index', [
            'menus' => $menus,
            'allMenusFlat' => $allMenusFlat,
            'staticPages' => $staticPages,
            'stats' => $stats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'type' => 'required|in:internal,external,label',
            'url' => 'nullable|string|max:500',
            'order' => 'nullable|integer',
            'parent_id' => 'nullable|exists:menus,id',
        ], [
            'label.required' => 'Label menu wajib diisi.',
            'type.required' => 'Tipe menu wajib dipilih.',
        ]);

        $isRootDropdown = empty($validated['parent_id']) && empty($validated['url']);
        if ($validated['type'] !== 'label' && !$isRootDropdown && empty($validated['url'])) {
            return redirect()->back()->withErrors(['url' => 'URL / Path tujuan wajib diisi untuk menu tautan (kecuali menu induk dropdown).']);
        }

        // Validate max depth (level 4)
        if (!empty($validated['parent_id'])) {
            $parent = Menu::find($validated['parent_id']);
            if ($parent && $parent->depth >= 4) {
                return redirect()->back()->withErrors(['parent_id' => 'Struktur menu maksimal 4 tingkat. Induk yang dipilih sudah berada pada level 4.']);
            }
        }

        // Auto assign next order if not set
        if (!isset($validated['order']) || $validated['order'] <= 0) {
            $maxOrder = Menu::where('parent_id', $validated['parent_id'] ?? null)->max('order');
            $validated['order'] = ($maxOrder ?? 0) + 1;
        }

        if ($validated['type'] === 'internal' && !empty($validated['url']) && $validated['url'] !== '#') {
            $url = trim($validated['url']);
            if (!str_starts_with($url, 'http://') && !str_starts_with($url, 'https://') && !str_starts_with($url, 'mailto:') && !str_starts_with($url, 'tel:')) {
                $validated['url'] = '/' . ltrim($url, '/');
            }
        }

        Menu::create($validated);

        return redirect()->back()->with('success', 'Menu baru berhasil ditambahkan.');
    }

    public function update(Request $request, Menu $menu)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'type' => 'required|in:internal,external,label',
            'url' => 'nullable|string|max:500',
            'order' => 'required|integer',
            'parent_id' => 'nullable|exists:menus,id',
        ], [
            'label.required' => 'Label menu wajib diisi.',
            'type.required' => 'Tipe menu wajib dipilih.',
        ]);

        $hasChildren = $menu->children()->exists();
        $isRootDropdown = empty($validated['parent_id']) && empty($validated['url']);
        if ($validated['type'] !== 'label' && !$hasChildren && !$isRootDropdown && empty($validated['url'])) {
            return redirect()->back()->withErrors(['url' => 'URL / Path tujuan wajib diisi untuk menu tautan.']);
        }

        // Prevent cyclic loop and check max depth
        if (!empty($validated['parent_id'])) {
            if ($validated['parent_id'] == $menu->id) {
                return redirect()->back()->withErrors(['parent_id' => 'Menu tidak dapat menjadikan dirinya sendiri sebagai induk.']);
            }

            $descendantIds = $this->getDescendantIds($menu);
            if (in_array($validated['parent_id'], $descendantIds)) {
                return redirect()->back()->withErrors(['parent_id' => 'Menu tidak dapat memilih sub-menu bawahannya sebagai induk (cyclic loop).']);
            }

            $parent = Menu::find($validated['parent_id']);
            if ($parent) {
                $maxOffset = $this->getMaxDescendantDepthOffset($menu);
                if ($parent->depth + $maxOffset > 4) {
                    return redirect()->back()->withErrors(['parent_id' => 'Struktur menu maksimal 4 tingkat. Perpindahan ini akan menyebabkan sub-menu melebihi level 4.']);
                }
            }
        }

        if ($validated['type'] === 'internal' && !empty($validated['url']) && $validated['url'] !== '#') {
            $url = trim($validated['url']);
            if (!str_starts_with($url, 'http://') && !str_starts_with($url, 'https://') && !str_starts_with($url, 'mailto:') && !str_starts_with($url, 'tel:')) {
                $validated['url'] = '/' . ltrim($url, '/');
            }
        }

        $menu->update($validated);

        return redirect()->back()->with('success', 'Menu berhasil diperbarui.');
    }

    public function destroy(Menu $menu)
    {
        $deletedCount = $this->deleteRecursively($menu);

        $msg = $deletedCount > 1
            ? "Menu '{$menu->label}' beserta " . ($deletedCount - 1) . " sub-menu di bawahnya berhasil dihapus."
            : "Menu '{$menu->label}' berhasil dihapus.";

        return redirect()->back()->with('success', $msg);
    }

    public function move(Request $request, Menu $menu)
    {
        $direction = $request->input('direction');
        if (!in_array($direction, ['up', 'down'])) {
            return redirect()->back()->with('error', 'Arah pergeseran tidak valid.');
        }

        $siblings = Menu::where('parent_id', $menu->parent_id)
            ->orderBy('order')
            ->orderBy('id')
            ->get();

        $currentIndex = $siblings->search(fn ($item) => $item->id === $menu->id);
        if ($currentIndex === false) {
            return redirect()->back();
        }

        $targetIndex = $direction === 'up' ? $currentIndex - 1 : $currentIndex + 1;

        if ($targetIndex < 0 || $targetIndex >= $siblings->count()) {
            return redirect()->back(); // Already at the top or bottom
        }

        $targetMenu = $siblings->get($targetIndex);

        $currentOrder = $menu->order;
        $targetOrder = $targetMenu->order;

        // If duplicate orders exist, reset to spaced sequence
        if ($currentOrder === $targetOrder) {
            foreach ($siblings as $idx => $sib) {
                $sib->update(['order' => ($idx + 1) * 10]);
            }
            $menu->refresh();
            $targetMenu->refresh();
            $currentOrder = $menu->order;
            $targetOrder = $targetMenu->order;
        }

        $menu->update(['order' => $targetOrder]);
        $targetMenu->update(['order' => $currentOrder]);

        return redirect()->back()->with('success', "Urutan menu '{$menu->label}' berhasil digeser.");
    }

    private function getDescendantIds(Menu $menu): array
    {
        $ids = [];
        $children = Menu::where('parent_id', $menu->id)->get();
        foreach ($children as $child) {
            $ids[] = $child->id;
            $ids = array_merge($ids, $this->getDescendantIds($child));
        }

        return $ids;
    }

    private function deleteRecursively(Menu $menu): int
    {
        $count = 1;
        $children = Menu::where('parent_id', $menu->id)->get();
        foreach ($children as $child) {
            $count += $this->deleteRecursively($child);
        }
        $menu->delete();

        return $count;
    }

    private function getMaxDescendantDepthOffset(Menu $menu): int
    {
        $children = Menu::where('parent_id', $menu->id)->get();
        if ($children->isEmpty()) {
            return 1;
        }

        $maxChildOffset = 0;
        foreach ($children as $child) {
            $maxChildOffset = max($maxChildOffset, $this->getMaxDescendantDepthOffset($child));
        }

        return 1 + $maxChildOffset;
    }
}
