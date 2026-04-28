<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $query = Announcement::with('category', 'author');

        if ($request->search) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        return Inertia::render('admin/announcements/index', [
            'announcements' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/announcements/create', [
            'categories' => Category::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
            'type' => 'required|in:regular,event',
            'thumbnail' => 'nullable|image|max:2048',
            'published_at' => 'nullable|date',
        ]);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('announcements', 'public');
        }

        $validated['author_id'] = $request->user()->id;
        $validated['slug'] = Str::slug($validated['title']) . '-' . rand(1000, 9999);
        
        if ($validated['status'] === 'published' && !$validated['published_at']) {
            $validated['published_at'] = now();
        }

        $announcement = Announcement::create($validated);

        if ($validated['type'] === 'event' && $request->event_detail) {
            $announcement->eventDetail()->create($request->event_detail);
        }

        return redirect()->route('admin.announcements.index')->with('success', 'Pengumuman berhasil dibuat.');
    }

    public function edit(Announcement $announcement)
    {
        return Inertia::render('admin/announcements/edit', [
            'announcement' => $announcement->load('eventDetail'),
            'categories' => Category::all(),
        ]);
    }

    public function update(Request $request, Announcement $announcement)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
            'type' => 'required|in:regular,event',
            'thumbnail' => 'nullable|image|max:2048',
            'published_at' => 'nullable|date',
        ]);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('announcements', 'public');
        }

        if ($validated['status'] === 'published' && !$validated['published_at'] && !$announcement->published_at) {
            $validated['published_at'] = now();
        }

        $announcement->update($validated);

        if ($validated['type'] === 'event' && $request->event_detail) {
            $announcement->eventDetail()->updateOrCreate([], $request->event_detail);
        } else {
            $announcement->eventDetail()->delete();
        }

        return redirect()->route('admin.announcements.index')->with('success', 'Pengumuman berhasil diperbarui.');
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();
        return redirect()->route('admin.announcements.index')->with('success', 'Pengumuman berhasil dihapus.');
    }
}
