<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Announcement;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalAnnouncements' => Announcement::count(),
                'totalCategories' => Category::count(),
                'totalUsers' => User::count(),
                'pendingAnnouncements' => Announcement::where('status', 'draft')->count(),
            ],
            'recentAnnouncements' => Announcement::with('category')->latest()->take(5)->get(),
            'recentLogs' => ActivityLog::with('user')->latest()->take(5)->get(),
        ]);
    }
}
