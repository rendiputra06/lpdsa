<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        
        return Inertia::render('admin/settings/index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'app_name' => 'required|string|max:255',
            'app_description' => 'nullable|string',
            'app_logo' => 'nullable|image|max:2048',
            'app_favicon' => 'nullable|image|max:1024',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string',
            'contact_address' => 'nullable|string',
            'footer_text' => 'nullable|string',
        ]);

        foreach ($data as $key => $value) {
            if ($request->hasFile($key)) {
                // Handle file upload
                $oldSetting = Setting::where('key', $key)->first();
                if ($oldSetting && $oldSetting->value) {
                    Storage::disk('public')->delete($oldSetting->value);
                }
                
                $path = $request->file($key)->store('settings', 'public');
                Setting::updateOrCreate(['key' => $key], ['value' => $path]);
            } else {
                Setting::updateOrCreate(['key' => $key], ['value' => $value]);
            }
        }

        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui.');
    }
}
