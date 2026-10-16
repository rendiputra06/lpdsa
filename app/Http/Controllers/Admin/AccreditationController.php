<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAccreditationRequest;
use App\Http\Requests\Admin\UpdateAccreditationRequest;
use App\Models\AcademicUnit;
use App\Models\Accreditation;
use App\Services\AcademicApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AccreditationController extends Controller
{
    public function index(Request $request)
    {
        $query = Accreditation::query()->with('academicUnit');

        if ($request->filled('unit_type') && $request->unit_type !== 'all') {
            $query->where('unit_type', $request->unit_type);
        }

        if ($request->filled('level') && $request->level !== 'all') {
            $query->where('level', $request->level);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
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
        $stats = [
            'total' => Accreditation::count(),
            'university_count' => Accreditation::university()->count(),
            'faculty_count' => Accreditation::faculty()->count(),
            'study_program_count' => Accreditation::studyProgram()->count(),
            'active_count' => Accreditation::where('status', 'active')->count(),
            'expiring_soon_count' => Accreditation::where('status', 'active')
                ->whereNotNull('valid_until')
                ->where('valid_until', '>', now())
                ->where('valid_until', '<=', now()->addMonths(6))
                ->count(),
            'expired_count' => Accreditation::where('status', 'expired')
                ->orWhere(function ($q) {
                    $q->whereNotNull('valid_until')->where('valid_until', '<', now());
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

    public function store(StoreAccreditationRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('certificate_file')) {
            $data['certificate_file'] = $request->file('certificate_file')->store('accreditations', 'public');
        }

        Accreditation::create($data);

        return redirect()->back()->with('success', 'Data akreditasi berhasil ditambahkan.');
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

        return redirect()->back()->with('success', 'Data akreditasi berhasil diperbarui.');
    }

    public function destroy(Accreditation $accreditation)
    {
        $accreditation->delete();

        return redirect()->back()->with('success', 'Data akreditasi berhasil dihapus.');
    }

    public function syncFromApi(AcademicApiService $service)
    {
        $result = $service->syncUnits();

        return redirect()->back()->with('success', $result['message']);
    }
}
