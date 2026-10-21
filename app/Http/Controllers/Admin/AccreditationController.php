<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAccreditationRequest;
use App\Http\Requests\Admin\UpdateAccreditationRequest;
use App\Models\AcademicUnit;
use App\Models\Accreditation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AccreditationController extends Controller
{
    public function index(Request $request)
    {
        $query = Accreditation::query()->with(['academicUnit.accreditations']);

        if ($request->filled('unit_type') && $request->unit_type !== 'all') {
            $query->where('unit_type', $request->unit_type);
        }

        if ($request->filled('level') && $request->level !== 'all') {
            $query->where('level', $request->level);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $now = now()->startOfDay();
            $sixMonths = now()->addMonths(6)->endOfDay();

            switch ($request->status) {
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
                    $query->where('status', $request->status);
                    break;
            }
        }

        if ($request->filled('body') && $request->body !== 'all') {
            $query->where('accreditation_body', $request->body);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('unit_name', 'like', "%{$search}%")
                    ->orWhere('sk_number', 'like', "%{$search}%")
                    ->orWhere('faculty_name', 'like', "%{$search}%")
                    ->orWhere('accreditation_body', 'like', "%{$search}%")
                    ->orWhere('grade', 'like', "%{$search}%");
            });
        }

        $sort = $request->get('sort', 'valid_until_desc');
        switch ($sort) {
            case 'valid_until_asc':
                $query->orderBy('valid_until', 'asc');
                break;
            case 'name_asc':
                $query->orderBy('unit_name', 'asc');
                break;
            case 'latest':
                $query->latest();
                break;
            case 'valid_until_desc':
            default:
                $query->orderBy('valid_until', 'desc');
                break;
        }

        $accreditations = $query->paginate(12)->withQueryString();

        // Calculate summary statistics
        $now = now()->startOfDay();
        $sixMonths = now()->addMonths(6)->endOfDay();

        $stats = [
            'total' => Accreditation::count(),
            'university_count' => Accreditation::university()->count(),
            'faculty_count' => Accreditation::faculty()->count(),
            'study_program_count' => Accreditation::studyProgram()->count(),
            'active_count' => Accreditation::where('status', 'active')
                ->where(function ($q) use ($now) {
                    $q->whereNull('valid_until')->orWhere('valid_until', '>=', $now);
                })
                ->count(),
            'expiring_soon_count' => Accreditation::where('status', 'active')
                ->whereNotNull('valid_until')
                ->where('valid_until', '>', $now)
                ->where('valid_until', '<=', $sixMonths)
                ->count(),
            'expired_count' => Accreditation::where('status', 'expired')
                ->orWhere(function ($q) use ($now) {
                    $q->whereNotNull('valid_until')->where('valid_until', '<', $now);
                })
                ->count(),
        ];

        // Academic units for form selector
        $academicUnits = AcademicUnit::active()
            ->orderBy('type')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/accreditations/index', [
            'accreditations' => $accreditations,
            'stats' => $stats,
            'academicUnits' => $academicUnits,
            'filters' => [
                'unit_type' => $request->get('unit_type', 'all'),
                'level' => $request->get('level', 'all'),
                'status' => $request->get('status', 'all'),
                'body' => $request->get('body', 'all'),
                'search' => $request->get('search', ''),
                'sort' => $sort,
            ],
        ]);
    }

    public function create(Request $request)
    {
        $academicUnits = AcademicUnit::active()
            ->with(['accreditations' => function ($q) {
                $q->orderBy('valid_until', 'desc');
            }])
            ->orderBy('type')
            ->orderBy('name')
            ->get();

        $selectedUnit = null;
        $history = [];
        if ($request->filled('academic_unit_id')) {
            $selectedUnit = AcademicUnit::with(['accreditations' => function ($q) {
                $q->orderBy('valid_until', 'desc');
            }])->find($request->academic_unit_id);

            if ($selectedUnit) {
                $history = $selectedUnit->accreditations;
            }
        }

        return Inertia::render('admin/accreditations/create', [
            'academicUnits' => $academicUnits,
            'selectedUnit' => $selectedUnit,
            'history' => $history,
        ]);
    }

    public function edit(Accreditation $accreditation)
    {
        $accreditation->load('academicUnit');

        $academicUnits = AcademicUnit::active()
            ->orderBy('type')
            ->orderBy('name')
            ->get();

        // Load timeline history for this unit
        $historyQuery = Accreditation::query();
        if ($accreditation->academic_unit_id) {
            $historyQuery->where('academic_unit_id', $accreditation->academic_unit_id);
        } else {
            $historyQuery->where('unit_name', $accreditation->unit_name)
                ->where('unit_type', $accreditation->unit_type);
        }
        $history = $historyQuery->orderBy('valid_until', 'desc')->get();

        return Inertia::render('admin/accreditations/edit', [
            'accreditation' => $accreditation,
            'academicUnits' => $academicUnits,
            'history' => $history,
        ]);
    }

    public function store(StoreAccreditationRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('certificate_file')) {
            $data['certificate_file'] = $request->file('certificate_file')->store('accreditations', 'public');
        }

        Accreditation::create($data);

        return redirect()->route('admin.accreditations.index')->with('success', 'Data akreditasi berhasil ditambahkan.');
    }

    public function update(UpdateAccreditationRequest $request, Accreditation $accreditation)
    {
        $data = $request->validated();

        // Handle certificate deletion
        if ($request->boolean('delete_certificate')) {
            if ($accreditation->certificate_file && Storage::disk('public')->exists($accreditation->certificate_file)) {
                Storage::disk('public')->delete($accreditation->certificate_file);
            }
            $data['certificate_file'] = null;
        }

        // Handle new certificate file upload
        if ($request->hasFile('certificate_file')) {
            if ($accreditation->certificate_file && Storage::disk('public')->exists($accreditation->certificate_file)) {
                Storage::disk('public')->delete($accreditation->certificate_file);
            }
            $data['certificate_file'] = $request->file('certificate_file')->store('accreditations', 'public');
        }

        unset($data['delete_certificate']);

        $accreditation->update($data);

        return redirect()->route('admin.accreditations.index')->with('success', 'Data akreditasi berhasil diperbarui.');
    }

    public function destroy(Accreditation $accreditation)
    {
        $accreditation->delete();

        return redirect()->back()->with('success', 'Data akreditasi berhasil dihapus.');
    }
}
