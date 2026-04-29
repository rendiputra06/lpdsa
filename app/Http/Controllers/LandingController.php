<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Banner;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingController extends Controller
{
    public function index()
    {
        return Inertia::render('welcome', [
            'banners' => Banner::active()->get(),
            'latestAnnouncements' => Announcement::with('category')
                ->published()
                ->latest('published_at')
                ->take(6)
                ->get(),
        ]);
    }

    public function announcements(Request $request)
    {
        $query = Announcement::with('category')->published();

        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('content', 'like', '%' . $request->search . '%');
            });
        }

        return Inertia::render('announcements/index', [
            'announcements' => $query->latest('published_at')->paginate(12)->withQueryString(),
            'categories' => Category::all(),
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    public function showAnnouncement($slug)
    {
        $announcement = Announcement::with(['category', 'author', 'attachments', 'eventDetail'])
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('announcements/show', [
            'announcement' => $announcement,
        ]);
    }

    public function about()
    {
        return Inertia::render('static-page', [
            'page' => \App\Models\StaticPage::where('slug', 'about')->firstOrFail(),
        ]);
    }

    public function contact()
    {
        return Inertia::render('static-page', [
            'page' => \App\Models\StaticPage::where('slug', 'contact')->firstOrFail(),
        ]);
    }
}
