<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAnnouncementRequest;
use App\Http\Requests\Admin\UpdateAnnouncementRequest;
use App\Models\Announcement;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'category_id', 'status', 'type', 'date_from', 'date_to']);

        $announcements = Announcement::with('category', 'author')
            ->filter($filters)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/announcements/index', [
            'announcements' => $announcements,
            'filters' => $filters,
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/announcements/create', [
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    public function store(StoreAnnouncementRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('announcements', 'public');
        }

        $validated['author_id'] = $request->user()->id;
        $validated['slug'] = Str::slug($validated['title']) . '-' . now()->format('His');

        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $announcement = Announcement::create($validated);

        if ($validated['type'] === 'event' && !empty($request->validated('event_detail'))) {
            $announcement->eventDetail()->create($request->validated('event_detail'));
        }

        if (!empty($validated['attachments'])) {
            foreach ($validated['attachments'] as $idx => $attachmentData) {
                if ($attachmentData['type'] === 'file' && $request->hasFile("attachments.{$idx}.file")) {
                    $attachmentData['path'] = $request->file("attachments.{$idx}.file")->store('announcement_attachments', 'public');
                }

                $announcement->attachments()->create([
                    'title' => $attachmentData['title'],
                    'type' => $attachmentData['type'],
                    'path' => $attachmentData['path'] ?? '',
                ]);
            }
        }

        return redirect()->route('admin.announcements.index')->with('success', 'Pengumuman berhasil dibuat.');
    }

    public function show(Announcement $announcement)
    {
        return Inertia::render('admin/announcements/show', [
            'announcement' => $announcement->load('eventDetail', 'category', 'author'),
        ]);
    }

    public function edit(Announcement $announcement)
    {
        return Inertia::render('admin/announcements/edit', [
            'announcement' => $announcement->load('eventDetail', 'category', 'attachments'),
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    public function update(UpdateAnnouncementRequest $request, Announcement $announcement)
    {
        $validated = $request->validated();

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('announcements', 'public');
        }

        if ($validated['status'] === 'published' && empty($validated['published_at']) && !$announcement->published_at) {
            $validated['published_at'] = now();
        }

        $announcement->update($validated);

        if ($validated['type'] === 'event') {
            if ($request->validated('event_detail')) {
                $announcement->eventDetail()->updateOrCreate([], $request->validated('event_detail'));
            }
        } else {
            $announcement->eventDetail()->delete();
        }

        if (!empty($validated['attachments_deleted'])) {
            $announcement->attachments()->whereIn('id', $validated['attachments_deleted'])->delete();
        }

        if (!empty($validated['attachments'])) {
            foreach ($validated['attachments'] as $idx => $attachmentData) {
                $path = $attachmentData['path'] ?? '';
                
                if ($attachmentData['type'] === 'file' && $request->hasFile("attachments.{$idx}.file")) {
                    $path = $request->file("attachments.{$idx}.file")->store('announcement_attachments', 'public');
                }

                if (!empty($attachmentData['id'])) {
                    $announcement->attachments()->where('id', $attachmentData['id'])->update([
                        'title' => $attachmentData['title'],
                        'type' => $attachmentData['type'],
                        'path' => $path,
                    ]);
                } else {
                    $announcement->attachments()->create([
                        'title' => $attachmentData['title'],
                        'type' => $attachmentData['type'],
                        'path' => $path,
                    ]);
                }
            }
        }

        return redirect()->route('admin.announcements.index')->with('success', 'Pengumuman berhasil diperbarui.');
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();

        return redirect()->route('admin.announcements.index')->with('success', 'Pengumuman berhasil dihapus.');
    }
}
