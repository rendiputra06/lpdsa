<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAnnouncementRequest;
use App\Http\Requests\Admin\UpdateAnnouncementRequest;
use App\Models\Announcement;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'category_id', 'status', 'type', 'date_from', 'date_to']);

        $announcements = Announcement::with(['category', 'author', 'coverImage'])
            ->withCount(['images', 'attachments'])
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

        $validated['author_id'] = $request->user()->id;
        $validated['slug'] = Str::slug($validated['title']) . '-' . now()->format('His');

        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        // Create announcement record
        $announcement = Announcement::create($validated);

        // Handle Event detail
        if ($validated['type'] === 'event' && !empty($request->validated('event_detail'))) {
            $announcement->eventDetail()->create($request->validated('event_detail'));
        }

        // Handle Multi-Images Gallery
        $coverPath = null;
        if ($request->hasFile('images')) {
            $coverIndex = $request->input('cover_image_index');
            $captions = $request->input('image_captions', []);

            foreach ($request->file('images') as $idx => $imageFile) {
                $path = $imageFile->store('announcements/gallery', 'public');
                $isCover = ($coverIndex !== null && (int)$coverIndex === (int)$idx) || ($coverIndex === null && $idx === 0 && !$request->hasFile('thumbnail'));

                if ($isCover) {
                    $coverPath = $path;
                }

                $announcement->images()->create([
                    'image_path' => $path,
                    'caption' => $captions[$idx] ?? null,
                    'is_cover' => $isCover,
                    'sort_order' => $idx,
                ]);
            }
        }

        // Handle Single Thumbnail Upload (Fallback or dedicated upload)
        if ($request->hasFile('thumbnail')) {
            $thumbPath = $request->file('thumbnail')->store('announcements', 'public');
            $coverPath = $thumbPath;

            $announcement->images()->update(['is_cover' => false]);
            $announcement->images()->create([
                'image_path' => $thumbPath,
                'caption' => null,
                'is_cover' => true,
                'sort_order' => 0,
            ]);
        }

        // Sync cover path to announcement thumbnail column
        if ($coverPath) {
            $announcement->update(['thumbnail' => $coverPath]);
        }

        // Handle Attachments
        if (!empty($validated['attachments'])) {
            foreach ($validated['attachments'] as $idx => $attachmentData) {
                $filePath = $attachmentData['path'] ?? '';
                if ($attachmentData['type'] === 'file' && $request->hasFile("attachments.{$idx}.file")) {
                    $filePath = $request->file("attachments.{$idx}.file")->store('announcement_attachments', 'public');
                }

                $announcement->attachments()->create([
                    'title' => $attachmentData['title'],
                    'type' => $attachmentData['type'],
                    'path' => $filePath,
                ]);
            }
        }

        return redirect()->route('admin.announcements.index')->with('success', 'Pengumuman berhasil dibuat.');
    }

    public function show(Announcement $announcement)
    {
        return Inertia::render('admin/announcements/show', [
            'announcement' => $announcement->load(['eventDetail', 'category', 'author', 'attachments', 'images']),
        ]);
    }

    public function edit(Announcement $announcement)
    {
        return Inertia::render('admin/announcements/edit', [
            'announcement' => $announcement->load(['eventDetail', 'category', 'attachments', 'images']),
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    public function update(UpdateAnnouncementRequest $request, Announcement $announcement)
    {
        $validated = $request->validated();

        if ($validated['status'] === 'published' && empty($validated['published_at']) && !$announcement->published_at) {
            $validated['published_at'] = now();
        }

        $announcement->update($validated);

        // Handle Event detail
        if ($validated['type'] === 'event') {
            if ($request->validated('event_detail')) {
                $announcement->eventDetail()->updateOrCreate(
                    ['announcement_id' => $announcement->id],
                    $request->validated('event_detail')
                );
            }
        } else {
            $announcement->eventDetail()->delete();
        }

        // Handle Deleted Images (Automatic storage cleanup handled by AnnouncementImage booted model)
        if (!empty($validated['deleted_image_ids'])) {
            $imagesToDelete = $announcement->images()->whereIn('id', $validated['deleted_image_ids'])->get();
            foreach ($imagesToDelete as $img) {
                $img->delete();
            }
        }

        // Update Captions for Existing Images
        if (!empty($validated['existing_captions'])) {
            foreach ($validated['existing_captions'] as $imgId => $captionText) {
                $announcement->images()->where('id', $imgId)->update(['caption' => $captionText]);
            }
        }

        // Set Cover from Existing Images
        if ($request->filled('cover_image_id')) {
            $chosenCoverId = (int)$request->input('cover_image_id');
            $chosenImage = $announcement->images()->find($chosenCoverId);
            if ($chosenImage) {
                $announcement->images()->update(['is_cover' => false]);
                $chosenImage->update(['is_cover' => true]);
                $announcement->update(['thumbnail' => $chosenImage->image_path]);
            }
        }

        // Handle New Images Upload
        if ($request->hasFile('images')) {
            $highestOrder = $announcement->images()->max('sort_order') ?? 0;
            $newCoverIndex = $request->input('cover_image_index');
            $captions = $request->input('image_captions', []);

            foreach ($request->file('images') as $idx => $imageFile) {
                $path = $imageFile->store('announcements/gallery', 'public');
                $isCover = ($newCoverIndex !== null && (int)$newCoverIndex === (int)$idx);

                $newImg = $announcement->images()->create([
                    'image_path' => $path,
                    'caption' => $captions[$idx] ?? null,
                    'is_cover' => $isCover,
                    'sort_order' => $highestOrder + $idx + 1,
                ]);

                if ($isCover) {
                    $announcement->images()->where('id', '!=', $newImg->id)->update(['is_cover' => false]);
                    $announcement->update(['thumbnail' => $path]);
                }
            }
        }

        // Handle Single Thumbnail File Upload
        if ($request->hasFile('thumbnail')) {
            $oldThumb = $announcement->thumbnail;
            $newThumb = $request->file('thumbnail')->store('announcements', 'public');

            // Clean up old thumbnail file if it's not present in gallery
            if ($oldThumb && !$announcement->images()->where('image_path', $oldThumb)->exists()) {
                Storage::disk('public')->delete($oldThumb);
            }

            $announcement->images()->update(['is_cover' => false]);
            $announcement->images()->create([
                'image_path' => $newThumb,
                'caption' => null,
                'is_cover' => true,
                'sort_order' => 0,
            ]);

            $announcement->update(['thumbnail' => $newThumb]);
        }

        // If thumbnail is still empty but gallery has images, make first image cover
        if (empty($announcement->thumbnail) && $announcement->images()->count() > 0) {
            $firstImg = $announcement->images()->first();
            $firstImg->update(['is_cover' => true]);
            $announcement->update(['thumbnail' => $firstImg->image_path]);
        }

        // Handle Deleted Attachments (Automatic storage cleanup handled by AnnouncementAttachment booted model)
        if (!empty($validated['attachments_deleted'])) {
            $attachmentsToDelete = $announcement->attachments()->whereIn('id', $validated['attachments_deleted'])->get();
            foreach ($attachmentsToDelete as $att) {
                $att->delete();
            }
        }

        // Handle Upsert Attachments
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
