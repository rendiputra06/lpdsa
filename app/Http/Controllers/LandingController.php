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
        $banners = Banner::active()->get();

        $featuredAnnouncement = Announcement::with(['category', 'images'])
            ->published()
            ->where('is_featured', true)
            ->latest('published_at')
            ->first();

        if (!$featuredAnnouncement) {
            $featuredAnnouncement = Announcement::with(['category', 'images'])
                ->published()
                ->latest('published_at')
                ->first();
        }

        $latestAnnouncements = Announcement::with(['category', 'images'])
            ->withCount('images')
            ->published()
            ->where('type', '!=', 'event')
            ->latest('published_at')
            ->take(4)
            ->get();

        $upcomingEvents = Announcement::with(['category', 'eventDetail', 'images'])
            ->withCount('images')
            ->published()
            ->where('type', 'event')
            ->latest('published_at')
            ->take(3)
            ->get();

        $documentsPage = \App\Models\StaticPage::where('type', 'documents')->first();
        $latestDocuments = $documentsPage && !empty($documentsPage->data)
            ? array_slice($documentsPage->data, 0, 4)
            : [];

        $heroSettings = [
            'hero_badge_text' => \App\Models\Setting::getValue('hero_badge_text', 'Lembaga Penjaminan Mutu & Pengembangan Pendidikan'),
            'hero_welcome_title' => \App\Models\Setting::getValue('hero_welcome_title', 'Selamat Datang di Pusat Informasi & Pengumuman LPDSA'),
            'hero_welcome_subtitle' => \App\Models\Setting::getValue('hero_welcome_subtitle', 'Media resmi publikasi pengumuman akademik, penjaminan mutu, layanan digital, dan agenda Universitas Abdurrab.'),
        ];

        $stats = [
            'announcements_count' => Announcement::published()->count(),
            'categories_count' => Category::count(),
            'events_count' => Announcement::published()->where('type', 'event')->count(),
            'documents_count' => $documentsPage && is_array($documentsPage->data) ? count($documentsPage->data) : 0,
            'accreditations_count' => \App\Models\Accreditation::where('status', 'active')->count(),
        ];

        return Inertia::render('welcome', [
            'banners' => $banners,
            'heroSettings' => $heroSettings,
            'featuredAnnouncement' => $featuredAnnouncement,
            'latestAnnouncements' => $latestAnnouncements,
            'upcomingEvents' => $upcomingEvents,
            'latestDocuments' => $latestDocuments,
            'stats' => $stats,
        ]);
    }

    public function accreditations(Request $request)
    {
        $query = \App\Models\Accreditation::with('academicUnit');

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('unit_type', $request->type);
        }

        if ($request->filled('level') && $request->level !== 'all') {
            $query->where('level', $request->level);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('unit_name', 'like', "%{$search}%")
                    ->orWhere('faculty_name', 'like', "%{$search}%")
                    ->orWhere('sk_number', 'like', "%{$search}%")
                    ->orWhere('grade', 'like', "%{$search}%")
                    ->orWhere('accreditation_body', 'like', "%{$search}%");
            });
        }

        $status = $request->get('status', 'active');
        $now = now()->startOfDay();
        $sixMonths = now()->addMonths(6)->endOfDay();

        if ($status !== 'all') {
            switch ($status) {
                case 'active':
                    $query->where('status', 'active')
                        ->where(function ($q) use ($now) {
                            $q->whereNull('valid_until')->orWhere('valid_until', '>=', $now);
                        });
                    break;

                case 'expiring_soon':
                    $query->where('status', 'active')
                        ->whereNotNull('valid_until')
                        ->where('valid_until', '>', $now)
                        ->where('valid_until', '<=', $sixMonths);
                    break;

                case 'expired':
                    $query->where(function ($q) use ($now) {
                        $q->where('status', 'expired')
                            ->orWhere(function ($sub) use ($now) {
                                $sub->whereNotNull('valid_until')->where('valid_until', '<', $now);
                            });
                    });
                    break;

                case 'in_process':
                    $query->where('status', 'in_process');
                    break;

                default:
                    $query->where('status', $status);
                    break;
            }
        }

        $sort = $request->get('sort', 'unit_type');
        if ($sort === 'grade') {
            $query->orderBy('grade', 'asc');
        } elseif ($sort === 'valid_until') {
            $query->orderBy('valid_until', 'desc');
        } elseif ($sort === 'name') {
            $query->orderBy('unit_name', 'asc');
        } else {
            $query->orderByRaw("CASE unit_type WHEN 'university' THEN 1 WHEN 'faculty' THEN 2 WHEN 'study_program' THEN 3 ELSE 4 END")
                ->orderBy('unit_name', 'asc');
        }

        $accreditations = $query->with(['academicUnit.accreditations' => function ($q) {
            $q->orderBy('valid_until', 'desc');
        }])->paginate(15)->withQueryString();

        $stats = [
            'total' => \App\Models\Accreditation::count(),
            'active' => \App\Models\Accreditation::where('status', 'active')
                ->where(function ($q) use ($now) {
                    $q->whereNull('valid_until')->orWhere('valid_until', '>=', $now);
                })
                ->count(),
            'university' => \App\Models\Accreditation::where('unit_type', 'university')->where('status', 'active')->first(),
            'faculties_count' => \App\Models\Accreditation::where('unit_type', 'faculty')->where('status', 'active')->count(),
            'study_programs_count' => \App\Models\Accreditation::where('unit_type', 'study_program')->where('status', 'active')->count(),
        ];

        return Inertia::render('accreditations/index', [
            'accreditations' => $accreditations,
            'stats' => $stats,
            'filters' => [
                'type' => $request->get('type', 'all'),
                'level' => $request->get('level', 'all'),
                'search' => $request->get('search', ''),
                'status' => $status,
                'sort' => $sort,
            ],
        ]);
    }

    public function universityAccreditation()
    {
        $now = now()->startOfDay();

        // 1. Active or latest university accreditation
        $university = \App\Models\Accreditation::where('unit_type', 'university')
            ->where('status', 'active')
            ->latest('valid_until')
            ->first() ?? \App\Models\Accreditation::where('unit_type', 'university')->latest()->first();

        // 2. Full chronological history of university accreditations
        $history = \App\Models\Accreditation::where('unit_type', 'university')
            ->orderBy('valid_until', 'desc')
            ->get();

        // 3. Ecosystem stats (study programs & faculties)
        $studyPrograms = \App\Models\Accreditation::where('unit_type', 'study_program')->where('status', 'active')->get();
        $facultiesCount = \App\Models\Accreditation::where('unit_type', 'faculty')->where('status', 'active')->count();

        $unggulCount = $studyPrograms->filter(function ($item) {
            $g = strtolower($item->grade);
            return str_contains($g, 'unggul') || $g === 'a';
        })->count();

        $baikSekaliCount = $studyPrograms->filter(function ($item) {
            $g = strtolower($item->grade);
            return str_contains($g, 'baik sekali') || $g === 'b';
        })->count();

        $baikCount = $studyPrograms->filter(function ($item) {
            $g = strtolower($item->grade);
            return $g === 'baik' || $g === 'c';
        })->count();

        $stats = [
            'faculties_count' => $facultiesCount > 0 ? $facultiesCount : 4,
            'study_programs_count' => $studyPrograms->count() > 0 ? $studyPrograms->count() : 15,
            'unggul_count' => $unggulCount,
            'baik_sekali_count' => $baikSekaliCount,
            'baik_count' => $baikCount,
        ];

        return Inertia::render('accreditations/university', [
            'university' => $university,
            'history' => $history,
            'stats' => $stats,
        ]);
    }

    public function announcements(Request $request)
    {
        $query = Announcement::with(['category', 'images'])->withCount('images')->published();

        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                    ->orWhere('content', 'like', '%' . $search . '%')
                    ->orWhere('excerpt', 'like', '%' . $search . '%');
            });
        }

        $sort = $request->get('sort', 'latest');
        if ($sort === 'oldest') {
            $query->oldest('published_at');
        } else {
            $query->latest('published_at');
        }

        return Inertia::render('announcements/index', [
            'announcements' => $query->paginate(12)->withQueryString(),
            'categories' => Category::all(),
            'filters' => [
                'category' => $request->get('category', ''),
                'search' => $request->get('search', ''),
                'sort' => $sort,
            ],
        ]);
    }

    public function showAnnouncement($slug)
    {
        $announcement = Announcement::with(['category', 'author', 'attachments', 'eventDetail', 'images'])
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        $latestAnnouncements = Announcement::with('category')
            ->published()
            ->where('id', '!=', $announcement->id)
            ->latest('published_at')
            ->take(5)
            ->get();

        $relatedAnnouncements = Announcement::with('category')
            ->published()
            ->where('id', '!=', $announcement->id)
            ->where('category_id', $announcement->category_id)
            ->latest('published_at')
            ->take(3)
            ->get();

        $categories = Category::withCount(['announcements' => function ($q) {
            $q->published();
        }])->get();

        return Inertia::render('announcements/show', [
            'announcement' => $announcement,
            'latestAnnouncements' => $latestAnnouncements,
            'relatedAnnouncements' => $relatedAnnouncements,
            'categories' => $categories,
        ]);
    }

    public function showStaticPage($slug)
    {
        $page = \App\Models\StaticPage::where('slug', $slug)->firstOrFail();

        $otherPages = \App\Models\StaticPage::select('slug', 'title', 'type')
            ->where('id', '!=', $page->id)
            ->get();

        return Inertia::render('static-page', [
            'page' => $page,
            'otherPages' => $otherPages,
        ]);
    }
}
