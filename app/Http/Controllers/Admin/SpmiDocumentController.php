<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\SpmiCategory;
use App\Models\SpmiDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SpmiDocumentController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'category_id', 'year']);

        $query = SpmiDocument::with('category')->latest('year')->latest('id');

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('document_number', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['category_id'])) {
            $query->where('spmi_category_id', $filters['category_id']);
        }

        if (!empty($filters['year'])) {
            $query->where('year', $filters['year']);
        }

        $documents = $query->paginate(15)->withQueryString();

        // Optimasi: Ambil seluruh URL menu yang ada sekaligus untuk mencegah query N+1
        $publishedMenuMap = Menu::whereNotNull('url')->pluck('id', 'url');

        // Get categories with document counts and public menu verification
        $categories = SpmiCategory::withCount('documents')
            ->orderBy('order')
            ->orderBy('name')
            ->get()
            ->map(function ($cat) use ($publishedMenuMap) {
                $menuId = $publishedMenuMap->get($cat->public_url);
                $cat->is_menu_published = !is_null($menuId);
                $cat->menu_id = $menuId;
                return $cat;
            });

        // Available years for filter dropdown
        $availableYears = SpmiDocument::select('year')
            ->distinct()
            ->orderByDesc('year')
            ->pluck('year')
            ->values();

        $stats = [
            'total_documents' => SpmiDocument::count(),
            'total_categories' => $categories->count(),
            'published_categories' => $categories->where('is_menu_published', true)->count(),
            'pending_categories' => $categories->where('is_menu_published', false)->count(),
        ];

        return Inertia::render('admin/spmi/documents/index', [
            'documents' => $documents,
            'categories' => $categories,
            'filters' => $filters,
            'availableYears' => $availableYears,
            'stats' => $stats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'spmi_category_id' => 'required|exists:spmi_categories,id',
            'document_number' => 'nullable|string|max:255',
            'title' => 'required|string|max:500',
            'year' => 'required|integer|min:1990|max:2099',
            'file' => 'nullable|file|mimes:pdf|max:20480',
            'external_url' => 'nullable|url|max:1000',
            'description' => 'nullable|string|max:2000',
            'is_public' => 'boolean',
        ], [
            'spmi_category_id.required' => 'Kategori kriteria SPMI wajib dipilih.',
            'title.required' => 'Judul dokumen wajib diisi.',
            'year.required' => 'Tahun penetapan wajib diisi.',
            'file.mimes' => 'File dokumen harus berformat PDF.',
            'file.max' => 'Ukuran file PDF maksimal 20 MB.',
            'external_url.url' => 'Format tautan eksternal tidak valid.',
        ]);

        if (empty($validated['external_url']) && !$request->hasFile('file')) {
            return redirect()->back()->withErrors([
                'file' => 'Wajib mengunggah file PDF atau menyertakan tautan dokumen eksternal (Google Drive).',
            ]);
        }

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('spmi-documents', 'public');
        }

        SpmiDocument::create([
            'spmi_category_id' => $validated['spmi_category_id'],
            'document_number' => $validated['document_number'] ?? null,
            'title' => $validated['title'],
            'year' => $validated['year'],
            'file_path' => $filePath,
            'external_url' => $validated['external_url'] ?? null,
            'description' => $validated['description'] ?? null,
            'is_public' => $request->boolean('is_public', true),
        ]);

        return redirect()->back()->with('success', 'Dokumen SPMI berhasil ditambahkan.');
    }

    public function update(Request $request, SpmiDocument $document)
    {
        $validated = $request->validate([
            'spmi_category_id' => 'required|exists:spmi_categories,id',
            'document_number' => 'nullable|string|max:255',
            'title' => 'required|string|max:500',
            'year' => 'required|integer|min:1990|max:2099',
            'file' => 'nullable|file|mimes:pdf|max:20480',
            'external_url' => 'nullable|url|max:1000',
            'description' => 'nullable|string|max:2000',
            'is_public' => 'boolean',
        ], [
            'spmi_category_id.required' => 'Kategori kriteria SPMI wajib dipilih.',
            'title.required' => 'Judul dokumen wajib diisi.',
            'year.required' => 'Tahun penetapan wajib diisi.',
            'file.mimes' => 'File dokumen harus berformat PDF.',
            'file.max' => 'Ukuran file PDF maksimal 20 MB.',
            'external_url.url' => 'Format tautan eksternal tidak valid.',
        ]);

        if (empty($validated['external_url']) && empty($document->file_path) && !$request->hasFile('file')) {
            return redirect()->back()->withErrors([
                'file' => 'Wajib mengunggah file PDF atau menyertakan tautan dokumen eksternal (Google Drive).',
            ]);
        }

        $filePath = $document->file_path;
        $externalUrl = $validated['external_url'] ?? null;

        if ($request->hasFile('file')) {
            // Hapus file fisik lama jika ada
            if ($filePath && Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);
            }
            $filePath = $request->file('file')->store('spmi-documents', 'public');
            // Jika mengunggah file baru, bersihkan external_url agar tidak saling menimpa
            $externalUrl = null;
        } elseif (!empty($externalUrl)) {
            // Jika beralih menggunakan tautan eksternal (Google Drive), hapus file PDF lama di storage
            if ($filePath && Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);
            }
            $filePath = null;
        }

        $document->update([
            'spmi_category_id' => $validated['spmi_category_id'],
            'document_number' => $validated['document_number'] ?? null,
            'title' => $validated['title'],
            'year' => $validated['year'],
            'file_path' => $filePath,
            'external_url' => $externalUrl,
            'description' => $validated['description'] ?? null,
            'is_public' => $request->boolean('is_public', true),
        ]);

        return redirect()->back()->with('success', 'Dokumen SPMI berhasil diperbarui.');
    }

    public function destroy(SpmiDocument $document)
    {
        if ($document->file_path && Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();

        return redirect()->back()->with('success', 'Dokumen SPMI berhasil dihapus.');
    }

    // --- Kategori SPMI CRUD Methods ---

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:spmi_categories,slug',
            'description' => 'nullable|string|max:1000',
            'order' => 'nullable|integer',
            'is_active' => 'boolean',
        ], [
            'name.required' => 'Nama kategori kriteria SPMI wajib diisi.',
            'slug.unique' => 'Slug kategori sudah digunakan.',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if (!isset($validated['order']) || $validated['order'] <= 0) {
            $maxOrder = SpmiCategory::max('order');
            $validated['order'] = ($maxOrder ?? 0) + 1;
        }

        $validated['cycle_stage'] = 'penetapan';
        $validated['sub_stage'] = 'kebijakan';
        $validated['is_active'] = $request->boolean('is_active', true);

        SpmiCategory::create($validated);

        return redirect()->back()->with('success', 'Kategori kriteria SPMI baru berhasil ditambahkan.');
    }

    public function updateCategory(Request $request, SpmiCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:spmi_categories,slug,' . $category->id,
            'description' => 'nullable|string|max:1000',
            'order' => 'required|integer',
            'is_active' => 'boolean',
        ], [
            'name.required' => 'Nama kategori kriteria SPMI wajib diisi.',
            'slug.unique' => 'Slug kategori sudah digunakan.',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $validated['is_active'] = $request->boolean('is_active', true);

        $oldPublicUrl = $category->public_url;

        $category->update($validated);

        // Jika URL publik kategori berubah, otomatis sinkronkan item menu di navbar jika sudah terdaftar
        if ($oldPublicUrl !== $category->public_url) {
            Menu::where('url', $oldPublicUrl)->update([
                'url' => $category->public_url,
                'label' => $category->name,
            ]);
        }

        return redirect()->back()->with('success', 'Kategori kriteria SPMI berhasil diperbarui.');
    }

    public function destroyCategory(SpmiCategory $category)
    {
        $docsCount = $category->documents()->count();
        if ($docsCount > 0) {
            return redirect()->back()->withErrors([
                'category_delete' => "Kategori '{$category->name}' tidak dapat dihapus karena masih memuat {$docsCount} dokumen terkait. Hapus atau pindahkan dokumen terlebih dahulu.",
            ]);
        }

        // Hapus item menu yang terkait di navbar publik jika ada
        Menu::where('url', $category->public_url)->delete();

        $category->delete();

        return redirect()->back()->with('success', "Kategori '{$category->name}' berhasil dihapus.");
    }

    /**
     * 1-Click Action: Otomatis daftarkan kategori ke struktur menu navigasi publik:
     * SPMI > Penetapan > Kebijakan > {Kategori}
     */
    public function publishCategoryToMenu(SpmiCategory $category)
    {
        $publicUrl = $category->public_url;

        // Cek apakah sudah ada di menu
        $existing = Menu::where('url', $publicUrl)->first();
        if ($existing) {
            return redirect()->back()->with('info', "Kategori '{$category->name}' sudah terdaftar di menu navigasi publik.");
        }

        // 1. Pastikan Menu Root 'SPMI' ada
        $rootSpmi = Menu::whereNull('parent_id')
            ->where(function ($q) {
                $q->where('label', 'SPMI')
                  ->orWhere('label', 'LIKE', '%SPMI%');
            })
            ->first();

        if (!$rootSpmi) {
            $maxOrder = Menu::whereNull('parent_id')->max('order') ?? 0;
            $rootSpmi = Menu::create([
                'label' => 'SPMI',
                'type' => 'label',
                'url' => '#',
                'order' => $maxOrder + 1,
                'parent_id' => null,
            ]);
        }

        // 2. Pastikan Sub-Menu Level 2 'Penetapan' ada di bawah SPMI
        $penetapanMenu = Menu::where('parent_id', $rootSpmi->id)
            ->where('label', 'Penetapan')
            ->first();

        if (!$penetapanMenu) {
            $maxOrder = Menu::where('parent_id', $rootSpmi->id)->max('order') ?? 0;
            $penetapanMenu = Menu::create([
                'label' => 'Penetapan',
                'type' => 'label',
                'url' => '#',
                'order' => $maxOrder + 1,
                'parent_id' => $rootSpmi->id,
            ]);
        }

        // 3. Pastikan Sub-Menu Level 3 'Kebijakan' ada di bawah Penetapan
        $kebijakanMenu = Menu::where('parent_id', $penetapanMenu->id)
            ->where('label', 'Kebijakan')
            ->first();

        if (!$kebijakanMenu) {
            $maxOrder = Menu::where('parent_id', $penetapanMenu->id)->max('order') ?? 0;
            $kebijakanMenu = Menu::create([
                'label' => 'Kebijakan',
                'type' => 'internal',
                'url' => '/spmi/penetapan/kebijakan',
                'order' => $maxOrder + 1,
                'parent_id' => $penetapanMenu->id,
            ]);
        }

        // 3b. Pastikan item 'Semua Kebijakan' (Opsi A) tersedia di urutan teratas sub menu Kebijakan
        $allKebijakanMenu = Menu::where('parent_id', $kebijakanMenu->id)
            ->where('url', '/spmi/penetapan/kebijakan')
            ->first();

        if (!$allKebijakanMenu) {
            Menu::create([
                'label' => 'Semua Kebijakan',
                'type' => 'internal',
                'url' => '/spmi/penetapan/kebijakan',
                'order' => 0,
                'parent_id' => $kebijakanMenu->id,
            ]);
        }

        // 4. Daftarkan Kategori ini sebagai Sub-Menu Level 4 di bawah Kebijakan
        $maxChildOrder = Menu::where('parent_id', $kebijakanMenu->id)->max('order') ?? 0;
        Menu::create([
            'label' => $category->name,
            'type' => 'internal',
            'url' => $publicUrl,
            'order' => $maxChildOrder + 1,
            'parent_id' => $kebijakanMenu->id,
        ]);

        return redirect()->back()->with('success', "Kategori '{$category->name}' berhasil didaftarkan ke Menu Navigasi Publik: SPMI > Penetapan > Kebijakan > {$category->name}!");
    }
}
