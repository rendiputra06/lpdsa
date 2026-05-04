<?php

use App\Http\Controllers\LandingController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

// Public Routes
Route::get('/', [LandingController::class, 'index'])->name('home');
Route::get('/announcements', [LandingController::class, 'announcements'])->name('announcements.index');
Route::get('/announcements/{slug}', [LandingController::class, 'showAnnouncement'])->name('announcements.show');

// Authenticated Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    
    // Admin Routes
    Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::resource('announcements', \App\Http\Controllers\Admin\AnnouncementController::class);
        Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class)->except(['create', 'edit', 'show']);
        Route::resource('menus', \App\Http\Controllers\Admin\MenuController::class)->except(['create', 'edit', 'show']);
        Route::resource('users', \App\Http\Controllers\Admin\UserController::class)->except(['create', 'edit', 'show']);
        Route::resource('static-pages', \App\Http\Controllers\Admin\StaticPageController::class);
        Route::resource('banners', \App\Http\Controllers\Admin\BannerController::class)->except(['create', 'edit', 'show']);
        Route::get('settings', [\App\Http\Controllers\Admin\SettingController::class, 'index'])->name('settings.index');
        Route::post('settings', [\App\Http\Controllers\Admin\SettingController::class, 'update'])->name('settings.update');
        Route::get('activity-logs', [\App\Http\Controllers\Admin\ActivityLogController::class, 'index'])->name('activity-logs.index');
    });
});

// Catch-all Static Page Route (Must be at the bottom)
Route::get('/{slug}', [LandingController::class, 'showStaticPage'])->name('static-page');

require __DIR__.'/settings.php';
