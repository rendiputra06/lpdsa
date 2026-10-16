<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicUnit;
use App\Models\Accreditation;
use App\Models\ActivityLog;
use App\Models\Announcement;
use App\Models\Category;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $accreditationTotal = Accreditation::count();
        $accreditationActive = Accreditation::where('status', 'active')->count();
        $accreditationExpiring = Accreditation::where('status', 'active')
            ->whereNotNull('valid_until')
            ->where('valid_until', '>', now())
            ->where('valid_until', '<=', now()->addMonths(6))
            ->count();

        $academicUnitsTotal = AcademicUnit::count();
        $studyProgramsCount = AcademicUnit::studyPrograms()->count();
        $facultiesCount = AcademicUnit::faculties()->count();
        $lastSyncedAt = AcademicUnit::max('synced_at');

        $univAccreditation = Accreditation::university()->latest('valid_until')->first();

        return Inertia::render('dashboard', [
            'stats' => [
                'totalAnnouncements' => Announcement::count(),
                'publishedAnnouncements' => Announcement::published()->count(),
                'pendingAnnouncements' => Announcement::where('status', 'draft')->count(),
                'totalCategories' => Category::count(),
                'totalUsers' => User::count(),
                'totalAccreditations' => $accreditationTotal,
                'activeAccreditations' => $accreditationActive,
                'expiringAccreditations' => $accreditationExpiring,
                'totalAcademicUnits' => $academicUnitsTotal,
                'studyProgramsCount' => $studyProgramsCount,
                'facultiesCount' => $facultiesCount,
                'lastSyncedAt' => $lastSyncedAt,
            ],
            'univAccreditation' => $univAccreditation,
            'recentAnnouncements' => Announcement::with(['category', 'images'])->latest()->take(5)->get(),
            'recentAccreditations' => Accreditation::with('academicUnit')->latest('updated_at')->take(4)->get(),
            'recentLogs' => ActivityLog::with('user')->latest()->take(6)->get(),
        ]);
    }
}
