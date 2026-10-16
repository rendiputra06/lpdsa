<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicUnit;
use App\Models\Setting;
use App\Services\AcademicApiService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicUnitController extends Controller
{
    public function index(Request $request)
    {
        $query = AcademicUnit::query()
            ->with(['parent', 'latestAccreditation']);

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->filled('level') && $request->level !== 'all') {
            $query->where('level', $request->level);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        if ($request->filled('faculty_id') && $request->faculty_id !== 'all') {
            $query->where('parent_id', $request->faculty_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('faculty_name', 'like', "%{$search}%")
                    ->orWhere('level', 'like', "%{$search}%");
            });
        }

        $units = $query
            ->orderByRaw("CASE 
                WHEN type = 'university' THEN 1 
                WHEN type = 'faculty' THEN 2 
                WHEN type = 'study_program' THEN 3 
                ELSE 4 END")
            ->orderBy('name')
            ->paginate(25)
            ->withQueryString();

        // Get faculties for filter & parent dropdown
        $faculties = AcademicUnit::faculties()
            ->active()
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        // Hierarchical tree data (University -> Faculties -> Study Programs)
        $hierarchy = AcademicUnit::where('type', 'university')
            ->with([
                'latestAccreditation',
                'children' => function ($q) {
                    $q->orderBy('name')->with([
                        'latestAccreditation',
                        'children' => function ($sq) {
                            $sq->orderBy('level')->orderBy('name')->with('latestAccreditation');
                        },
                    ]);
                },
            ])
            ->first();

        // Summary stats
        $stats = [
            'total' => AcademicUnit::count(),
            'university_count' => AcademicUnit::universities()->count(),
            'faculty_count' => AcademicUnit::faculties()->count(),
            'study_program_count' => AcademicUnit::studyPrograms()->count(),
            'active_count' => AcademicUnit::where('is_active', true)->count(),
            'inactive_count' => AcademicUnit::where('is_active', false)->count(),
            'last_synced_at' => AcademicUnit::max('synced_at'),
        ];

        // API Connection status info from settings
        $apiInfo = [
            'api_url' => Setting::where('key', 'academic_api_url')->value('value'),
            'has_token' => !empty(Setting::where('key', 'academic_api_token')->value('value')),
        ];

        return Inertia::render('admin/academic-units/index', [
            'units' => $units,
            'hierarchy' => $hierarchy,
            'faculties' => $faculties,
            'stats' => $stats,
            'apiInfo' => $apiInfo,
            'filters' => [
                'type' => $request->get('type', 'all'),
                'level' => $request->get('level', 'all'),
                'status' => $request->get('status', 'all'),
                'faculty_id' => $request->get('faculty_id', 'all'),
                'search' => $request->get('search', ''),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:university,faculty,study_program',
            'code' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'level' => 'nullable|string|max:20',
            'parent_id' => 'nullable|exists:academic_units,id',
            'is_active' => 'boolean',
        ]);

        $facultyName = null;
        if (!empty($validated['parent_id'])) {
            $parent = AcademicUnit::find($validated['parent_id']);
            if ($parent && $parent->type === 'faculty') {
                $facultyName = $parent->name;
            }
        }

        $validated['faculty_name'] = $facultyName;
        $validated['is_active'] = $request->boolean('is_active', true);

        AcademicUnit::create($validated);

        return redirect()->back()->with('success', 'Unit akademik berhasil ditambahkan.');
    }

    public function update(Request $request, AcademicUnit $academicUnit)
    {
        $validated = $request->validate([
            'type' => 'required|in:university,faculty,study_program',
            'code' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'level' => 'nullable|string|max:20',
            'parent_id' => 'nullable|exists:academic_units,id',
            'is_active' => 'boolean',
        ]);

        $facultyName = null;
        if (!empty($validated['parent_id'])) {
            $parent = AcademicUnit::find($validated['parent_id']);
            if ($parent && $parent->type === 'faculty') {
                $facultyName = $parent->name;
            }
        }

        $validated['faculty_name'] = $facultyName;
        $validated['is_active'] = $request->boolean('is_active', true);

        $academicUnit->update($validated);

        return redirect()->back()->with('success', 'Unit akademik berhasil diperbarui.');
    }

    public function toggleStatus(AcademicUnit $academicUnit)
    {
        $academicUnit->update([
            'is_active' => !$academicUnit->is_active,
        ]);

        $statusStr = $academicUnit->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return redirect()->back()->with('success', "Unit akademik \"{$academicUnit->name}\" berhasil {$statusStr}.");
    }

    public function destroy(AcademicUnit $academicUnit)
    {
        if ($academicUnit->accreditations()->count() > 0) {
            return redirect()->back()->with('error', 'Unit tidak dapat dihapus karena memiliki riwayat data akreditasi.');
        }

        if ($academicUnit->children()->count() > 0) {
            return redirect()->back()->with('error', 'Unit tidak dapat dihapus karena memiliki unit bawahan (Program Studi/Fakultas).');
        }

        $name = $academicUnit->name;
        $academicUnit->delete();

        return redirect()->back()->with('success', "Unit akademik \"{$name}\" berhasil dihapus.");
    }

    public function syncFromApi(AcademicApiService $service)
    {
        $result = $service->syncUnits();

        return redirect()->back()->with('success', $result['message']);
    }
}
