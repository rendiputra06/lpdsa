import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    ArrowDown,
    ArrowRight,
    ArrowUp,
    Bookmark,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    CornerDownRight,
    Edit,
    ExternalLink,
    Eye,
    FolderPlus,
    FolderTree,
    Layers,
    LayoutList,
    Link2,
    ListTree,
    Menu as MenuIcon,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface MenuItem {
    id: number;
    label: string;
    type: 'internal' | 'external' | 'label';
    url: string | null;
    order: number;
    parent_id: number | null;
    children?: MenuItem[];
}

interface StaticPageItem {
    id: number;
    title: string;
    slug: string;
}

interface Stats {
    total: number;
    root_count: number;
    sub_count: number;
    external_count: number;
    label_count: number;
}

interface Props {
    menus: MenuItem[];
    allMenusFlat?: MenuItem[];
    staticPages?: StaticPageItem[];
    stats?: Stats;
}

// Common preset routes for Univrab LPDSA
const SYSTEM_PRESET_ROUTES = [
    { label: 'Beranda Utama', url: '/' },
    { label: 'Pusat Pengumuman', url: '/announcements' },
    { label: 'Data Akreditasi', url: '/akreditasi' },
    { label: 'Akreditasi Universitas', url: '/akreditasi/universitas' },
    { label: 'Kontak Kami', url: '/contact' },
    { label: 'Pusat Dokumen', url: '/dokumen' },
];

export default function MenuIndex({
    menus = [],
    allMenusFlat = [],
    staticPages = [],
    stats,
}: Props) {
    const [viewMode, setViewMode] = useState<'table' | 'preview'>('table');
    const [searchQuery, setSearchQuery] = useState('');
    const [activePreviewDropdown, setActivePreviewDropdown] = useState<number | null>(null);

    // Dialog state for create/edit
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);

    // Dialog state for delete confirmation
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [menuToDelete, setMenuToDelete] = useState<MenuItem | null>(null);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        label: '',
        type: 'internal' as 'internal' | 'external' | 'label',
        url: '',
        order: 0,
        parent_id: null as number | null,
    });

    // Helper: Find all descendant IDs of a menu to prevent cyclic loops
    const getDescendantIds = (parentId: number): number[] => {
        let result: number[] = [];
        const directChildren = allMenusFlat.filter((m) => m.parent_id === parentId);
        for (const child of directChildren) {
            result.push(child.id);
            result = result.concat(getDescendantIds(child.id));
        }
        return result;
    };

    // Calculate count of children recursively for delete warning
    const countTotalDescendants = (menu: MenuItem | null): number => {
        if (!menu) return 0;
        return getDescendantIds(menu.id).length;
    };

    // Flatten tree with depth levels for search and table rendering
    interface FlatTreeItem extends MenuItem {
        depth: number;
        parentLabel?: string;
        isFirstInGroup: boolean;
        isLastInGroup: boolean;
    }

    const flattenedList = useMemo(() => {
        const result: FlatTreeItem[] = [];

        const walk = (items: MenuItem[], depth: number, parentLabel?: string) => {
            items.forEach((item, index) => {
                const isFirst = index === 0;
                const isLast = index === items.length - 1;

                result.push({
                    ...item,
                    depth,
                    parentLabel,
                    isFirstInGroup: isFirst,
                    isLastInGroup: isLast,
                });

                const itemChildren = item.children || (item as any).children_recursive || [];
                if (itemChildren && itemChildren.length > 0) {
                    walk(itemChildren, depth + 1, item.label);
                }
            });
        };

        walk(menus, 1);
        return result;
    }, [menus]);

    // Filtered tree
    const filteredList = useMemo(() => {
        if (!searchQuery.trim()) return flattenedList;
        const q = searchQuery.toLowerCase();
        return flattenedList.filter(
            (item) =>
                item.label.toLowerCase().includes(q) ||
                (item.url && item.url.toLowerCase().includes(q)) ||
                item.type.toLowerCase().includes(q) ||
                (item.parentLabel && item.parentLabel.toLowerCase().includes(q))
        );
    }, [flattenedList, searchQuery]);

    // Handle Open Create Dialog
    const handleOpenCreateDialog = (defaultParentId: number | null = null) => {
        setEditingMenu(null);
        clearErrors();
        reset();
        if (defaultParentId !== null) {
            setData((prev) => ({
                ...prev,
                parent_id: defaultParentId,
                order: 0,
            }));
        }
        setIsDialogOpen(true);
    };

    // Handle Open Edit Dialog
    const handleOpenEditDialog = (menu: MenuItem) => {
        setEditingMenu(menu);
        clearErrors();
        setData({
            label: menu.label,
            type: menu.type,
            url: menu.url || '',
            order: menu.order,
            parent_id: menu.parent_id,
        });
        setIsDialogOpen(true);
    };

    // Handle Move Reorder
    const handleMove = (menuId: number, direction: 'up' | 'down') => {
        router.post(
            `/admin/menus/${menuId}/move`,
            { direction },
            { preserveScroll: true }
        );
    };

    // Form Submit
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingMenu) {
            put(`/admin/menus/${editingMenu.id}`, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setEditingMenu(null);
                    reset();
                },
            });
        } else {
            post('/admin/menus', {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    // Delete Handling
    const handleOpenDeleteDialog = (menu: MenuItem) => {
        setMenuToDelete(menu);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!menuToDelete) return;
        destroy(`/admin/menus/${menuToDelete.id}`, {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setMenuToDelete(null);
            },
        });
    };

    // Invalid parent candidates for cyclic protection
    const invalidParentIds = useMemo(() => {
        if (!editingMenu) return [];
        return [editingMenu.id, ...getDescendantIds(editingMenu.id)];
    }, [editingMenu, allMenusFlat]);

    return (
        <>
            <Head title="Manajemen Menu Navigasi - LPDSA Universitas Abdurrab" />

            <div className="space-y-6 pb-12">
                {/* Header Halaman Menu Navigasi */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-brand-50 dark:bg-brand-950/70 text-[#8B142C] dark:text-gold-400 flex items-center justify-center shrink-0 border border-brand-100 dark:border-brand-900/50">
                            <MenuIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Menu & Navigasi Publik
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-0.5">
                                Kelola struktur navbar publik, menu bertingkat (dropdown), dan tautan portal Universitas Abdurrab.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Button
                            variant="outline"
                            asChild
                            className="rounded-xl border-slate-200 dark:border-neutral-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-neutral-800"
                        >
                            <a
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink className="h-4 w-4 mr-1.5 text-[#8B142C] dark:text-gold-400" />
                                <span>Buka Navbar Publik</span>
                            </a>
                        </Button>
                        <Button
                            onClick={() => handleOpenCreateDialog(null)}
                            className="rounded-xl bg-[#8B142C] hover:bg-[#721024] text-white font-bold text-xs shadow-xs"
                        >
                            <Plus className="h-4 w-4 mr-1.5" />
                            <span>Tambah Menu Baru</span>
                        </Button>
                    </div>
                </div>

                {/* 2. Stat Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Menu */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-xs hover:border-brand-300 dark:hover:border-gold-400/50 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <div className="h-10 w-10 rounded-xl bg-brand-50 dark:bg-brand-950/70 text-[#8B142C] dark:text-gold-400 flex items-center justify-center">
                                <MenuIcon className="h-5 w-5" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">
                                Total Item
                            </span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                            {stats?.total ?? flattenedList.length}
                        </div>
                        <div className="text-xs font-semibold text-slate-600 dark:text-neutral-400 mt-1">
                            Semua Tautan Navigasi
                        </div>
                    </div>

                    {/* Menu Utama (Root) */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                <Layers className="h-5 w-5" />
                            </div>
                            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                Level 1
                            </span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                            {stats?.root_count ?? menus.length}
                        </div>
                        <div className="text-xs font-semibold text-slate-600 dark:text-neutral-400 mt-1">
                            Menu Baris Utama (Navbar)
                        </div>
                    </div>

                    {/* Sub-Menu & Grup */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                <FolderTree className="h-5 w-5" />
                            </div>
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                Sub-Menu
                            </span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                            {stats?.sub_count ?? (flattenedList.length - menus.length)}
                        </div>
                        <div className="text-xs font-semibold text-slate-600 dark:text-neutral-400 mt-1">
                            Dropdown & Mega-Menu
                        </div>
                    </div>

                    {/* Tautan Eksternal */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-xs hover:border-purple-300 dark:hover:border-purple-500/50 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                <ExternalLink className="h-5 w-5" />
                            </div>
                            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                                Luar
                            </span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                            {stats?.external_count ?? flattenedList.filter((m) => m.type === 'external').length}
                        </div>
                        <div className="text-xs font-semibold text-slate-600 dark:text-neutral-400 mt-1">
                            Tautan Tab Baru
                        </div>
                    </div>
                </div>

                {/* 3. Toolbar: Search & View Mode Switcher */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    {/* View Switcher Pills */}
                    <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-neutral-800 self-start sm:self-auto">
                        <button
                            type="button"
                            onClick={() => setViewMode('table')}
                            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                viewMode === 'table'
                                    ? 'bg-white dark:bg-neutral-900 text-[#8B142C] dark:text-gold-400 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-neutral-200'
                            }`}
                        >
                            <ListTree className="h-3.5 w-3.5" />
                            <span>Tabel Hirarki</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('preview')}
                            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                viewMode === 'preview'
                                    ? 'bg-white dark:bg-neutral-900 text-[#8B142C] dark:text-gold-400 shadow-xs'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-neutral-200'
                            }`}
                        >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Pratinjau Navigasi</span>
                        </button>
                    </div>

                    {/* Search Input */}
                    {viewMode === 'table' && (
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            <Input
                                type="text"
                                placeholder="Cari label menu, url, atau tipe..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-9 rounded-xl border-slate-200 dark:border-neutral-800 text-xs h-10 focus-visible:ring-brand-700 dark:focus-visible:ring-gold-400"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* 4. Tab Content: Table vs Live Preview */}
                {viewMode === 'table' ? (
                    <div className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900 shadow-xs">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/75 dark:bg-neutral-800/50">
                                    <TableRow className="border-b border-slate-200/80 dark:border-neutral-800">
                                        <TableHead className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400 w-16 text-center">
                                            Urutan
                                        </TableHead>
                                        <TableHead className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400">
                                            Struktur & Label Menu
                                        </TableHead>
                                        <TableHead className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400 text-center">
                                            Tingkat
                                        </TableHead>
                                        <TableHead className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400 text-center">
                                            Tipe
                                        </TableHead>
                                        <TableHead className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400">
                                            Tujuan (URL / Path)
                                        </TableHead>
                                        <TableHead className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400 text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredList.length > 0 ? (
                                        filteredList.map((item) => {
                                            const isRoot = item.depth === 1;
                                            const isSub = item.depth === 2;
                                            const isSubChild = item.depth >= 3;

                                            return (
                                                <TableRow
                                                    key={item.id}
                                                    className={`border-b border-slate-100 dark:border-neutral-800/60 transition-colors ${
                                                        isRoot
                                                            ? 'bg-white dark:bg-neutral-900 font-semibold hover:bg-brand-50/20 dark:hover:bg-neutral-800/40'
                                                            : isSub
                                                              ? 'bg-slate-50/50 dark:bg-neutral-900/50 hover:bg-slate-50 dark:hover:bg-neutral-800/40'
                                                              : 'bg-slate-50/80 dark:bg-neutral-900/30 hover:bg-slate-100/70 dark:hover:bg-neutral-800/50'
                                                    }`}
                                                >
                                                    {/* Move Reorder Buttons */}
                                                    <TableCell className="py-3 px-3 text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button
                                                                type="button"
                                                                disabled={item.isFirstInGroup}
                                                                onClick={() => handleMove(item.id, 'up')}
                                                                title="Geser ke Atas"
                                                                className={`p-1 rounded-md text-slate-400 transition-colors ${
                                                                    item.isFirstInGroup
                                                                        ? 'opacity-20 cursor-not-allowed'
                                                                        : 'hover:text-brand-700 hover:bg-brand-50 dark:hover:bg-brand-950/80 cursor-pointer'
                                                                }`}
                                                            >
                                                                <ChevronUp className="h-3.5 w-3.5" />
                                                            </button>
                                                            <span className="font-mono text-xs font-bold text-slate-500 w-4 text-center">
                                                                {item.order}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                disabled={item.isLastInGroup}
                                                                onClick={() => handleMove(item.id, 'down')}
                                                                title="Geser ke Bawah"
                                                                className={`p-1 rounded-md text-slate-400 transition-colors ${
                                                                    item.isLastInGroup
                                                                        ? 'opacity-20 cursor-not-allowed'
                                                                        : 'hover:text-brand-700 hover:bg-brand-50 dark:hover:bg-brand-950/80 cursor-pointer'
                                                                }`}
                                                            >
                                                                <ChevronDown className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    </TableCell>

                                                    {/* Label & Visual Indentation */}
                                                    <TableCell className="py-3 px-4">
                                                        <div
                                                            className="flex items-center gap-2"
                                                            style={{
                                                                paddingLeft: `${(item.depth - 1) * 24}px`,
                                                            }}
                                                        >
                                                            {/* Indent Guide Icon */}
                                                            {isRoot && (
                                                                <div className="h-8 w-8 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-[#8B142C] dark:text-gold-400 flex items-center justify-center shrink-0">
                                                                    <MenuIcon className="h-4 w-4" />
                                                                </div>
                                                            )}
                                                            {isSub && (
                                                                <CornerDownRight className="h-4 w-4 text-slate-400 dark:text-neutral-500 shrink-0" />
                                                            )}
                                                            {isSubChild && (
                                                                <span className="text-slate-300 dark:text-neutral-600 font-mono pl-1 select-none">
                                                                    └──
                                                                </span>
                                                            )}

                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <span
                                                                        className={`text-sm ${
                                                                            isRoot
                                                                                ? 'font-black text-slate-900 dark:text-white'
                                                                                : isSub
                                                                                  ? 'font-bold text-slate-800 dark:text-neutral-200'
                                                                                  : 'font-medium text-slate-600 dark:text-neutral-400'
                                                                        }`}
                                                                    >
                                                                        {item.label}
                                                                    </span>

                                                                    {/* Has children indicator */}
                                                                    {item.children && item.children.length > 0 && (
                                                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-500 font-semibold">
                                                                            {item.children.length} sub
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {item.parentLabel && (
                                                                    <div className="text-[10px] text-slate-400 dark:text-neutral-500">
                                                                        Di bawah: <span className="font-semibold">{item.parentLabel}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    {/* Hierarchy Depth Badge */}
                                                    <TableCell className="py-3 px-4 text-center">
                                                        {item.depth === 1 ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-[#8B142C] dark:bg-brand-950/80 dark:text-gold-300 border border-brand-200/60 dark:border-brand-800/80">
                                                                Level 1 (Utama)
                                                            </span>
                                                        ) : item.depth === 2 ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                                                Level 2
                                                            </span>
                                                        ) : item.depth === 3 ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                                                Level 3
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                                                Level 4
                                                            </span>
                                                        )}
                                                    </TableCell>

                                                    {/* Type Badge */}
                                                    <TableCell className="py-3 px-4 text-center">
                                                        {item.type === 'internal' && (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                                                <Link2 className="h-3 w-3" />
                                                                Internal
                                                            </span>
                                                        )}
                                                        {item.type === 'external' && (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                                                <ExternalLink className="h-3 w-3" />
                                                                Eksternal
                                                            </span>
                                                        )}
                                                        {item.type === 'label' && (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                                                <Bookmark className="h-3 w-3" />
                                                                Grup Label
                                                            </span>
                                                        )}
                                                    </TableCell>

                                                    {/* URL / Path */}
                                                    <TableCell className="py-3 px-4 text-xs font-mono">
                                                        {item.type === 'label' ? (
                                                            <span className="text-slate-400 dark:text-neutral-500 italic">
                                                                — (Header Pengelompok)
                                                            </span>
                                                        ) : item.url ? (
                                                            <a
                                                                href={item.url}
                                                                target={item.type === 'external' ? '_blank' : undefined}
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-slate-700 dark:text-neutral-300 hover:text-brand-700 dark:hover:text-gold-400 transition-colors group"
                                                            >
                                                                <span className="max-w-xs truncate">{item.url}</span>
                                                                {item.type === 'external' && (
                                                                    <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                                                )}
                                                            </a>
                                                        ) : (
                                                            <span className="text-rose-500 font-bold">
                                                                URL Belum Diatur
                                                            </span>
                                                        )}
                                                    </TableCell>

                                                    {/* Actions */}
                                                    <TableCell className="py-3 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            {/* Add sub-menu button (for items with depth < 4) */}
                                                            {item.depth < 4 && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleOpenCreateDialog(item.id)}
                                                                    className="h-8 w-8 rounded-lg text-slate-600 dark:text-neutral-300 hover:text-[#8B142C] dark:hover:text-gold-400 hover:bg-brand-50 dark:hover:bg-brand-950/50"
                                                                    title={`Tambah Sub-Menu di Bawah Ini (Level ${item.depth + 1})`}
                                                                >
                                                                    <FolderPlus className="h-4 w-4" />
                                                                </Button>
                                                            )}

                                                            {/* Edit */}
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleOpenEditDialog(item)}
                                                                className="h-8 w-8 rounded-lg text-slate-600 dark:text-neutral-300 hover:text-brand-700 dark:hover:text-gold-400 hover:bg-slate-100 dark:hover:bg-neutral-800"
                                                                title="Edit Menu"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>

                                                            {/* Delete */}
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleOpenDeleteDialog(item)}
                                                                className="h-8 w-8 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                                                                title="Hapus Menu"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-12">
                                                <div className="text-center max-w-sm mx-auto">
                                                    <div className="h-14 w-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-[#8B142C] dark:text-gold-400 flex items-center justify-center mx-auto mb-3">
                                                        <FolderTree className="h-6 w-6" />
                                                    </div>
                                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                        Tidak Ada Menu Ditemukan
                                                    </h3>
                                                    <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed">
                                                        {searchQuery
                                                            ? 'Tidak ada menu yang sesuai dengan kata kunci pencarian Anda.'
                                                            : 'Belum ada menu navigasi yang dibuat.'}
                                                    </p>
                                                    <div className="mt-4">
                                                        {searchQuery ? (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setSearchQuery('')}
                                                                className="rounded-xl text-xs font-semibold"
                                                            >
                                                                Reset Pencarian
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleOpenCreateDialog(null)}
                                                                className="rounded-xl bg-[#8B142C] hover:bg-[#721024] text-white font-bold text-xs"
                                                            >
                                                                <Plus className="h-3.5 w-3.5 mr-1" />
                                                                Tambah Menu Baru
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Table Footer */}
                        <div className="p-4 border-t border-slate-100 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-neutral-400">
                            <div>
                                Menampilkan <span className="font-bold text-slate-900 dark:text-white">{filteredList.length}</span> item menu
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px]">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                                <span>Gunakan tombol panah di kolom urutan untuk menggeser posisi menu secara instan.</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* 5. Live Navbar Simulation Preview */
                    <div className="rounded-3xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-sm space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-neutral-800 pb-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-brand-700 dark:text-gold-400" />
                                    <span>Simulasi Navigasi Publik</span>
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                                    Pratinjau interaktif bagaimana susunan menu di atas akan tampil pada header landing page.
                                </p>
                            </div>
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-50 text-[#8B142C] dark:bg-brand-950 dark:text-gold-400 border border-brand-200 dark:border-brand-800">
                                Desktop Interactive View
                            </span>
                        </div>

                        {/* Miniature Navbar Container */}
                        <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 p-4 min-h-[300px]">
                            {/* Navbar Bar */}
                            <div className="h-16 px-6 rounded-xl bg-white dark:bg-neutral-900 shadow-sm border border-slate-200/80 dark:border-neutral-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-[#8B142C] flex items-center justify-center text-white font-black text-xs">
                                        UA
                                    </div>
                                    <span className="font-black text-sm text-[#8B142C] dark:text-gold-400 tracking-tight">
                                        LPDSA Univrab
                                    </span>
                                </div>

                                {/* Menu Items Bar */}
                                <div className="flex items-center gap-1 relative">
                                    {menus.map((menu) => {
                                        const hasChildren = menu.children && menu.children.length > 0;
                                        const isOpen = activePreviewDropdown === menu.id;

                                        return (
                                            <div
                                                key={menu.id}
                                                className="relative"
                                                onMouseEnter={() => hasChildren && setActivePreviewDropdown(menu.id)}
                                                onMouseLeave={() => hasChildren && setActivePreviewDropdown(null)}
                                            >
                                                <button
                                                    type="button"
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                                                        isOpen
                                                            ? 'bg-brand-50 text-[#8B142C] dark:bg-brand-950 dark:text-gold-400'
                                                            : 'text-slate-700 dark:text-neutral-300 hover:text-[#8B142C] dark:hover:text-gold-400 hover:bg-slate-100 dark:hover:bg-neutral-800'
                                                    }`}
                                                >
                                                    <span>{menu.label}</span>
                                                    {hasChildren && (
                                                        <ChevronDown className="h-3 w-3 opacity-60" />
                                                    )}
                                                </button>

                                                {/* Dropdown Menu Popup */}
                                                {hasChildren && isOpen && (
                                                    <div className="absolute top-full left-0 mt-1 min-w-[240px] rounded-2xl bg-white dark:bg-neutral-900 shadow-xl border border-slate-200/80 dark:border-neutral-800 p-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                                                        <div className="space-y-1">
                                                            {menu.children?.map((child) => (
                                                                <div
                                                                    key={child.id}
                                                                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-neutral-200 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:text-[#8B142C] dark:hover:text-gold-400 flex items-center justify-between transition-colors"
                                                                >
                                                                    <span className="flex items-center gap-2">
                                                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-neutral-600" />
                                                                        <span>{child.label}</span>
                                                                    </span>
                                                                    {child.type === 'external' ? (
                                                                        <ExternalLink className="h-3 w-3 opacity-50" />
                                                                    ) : (
                                                                        <ChevronRight className="h-3 w-3 opacity-40" />
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#8B142C] text-white">
                                        Login
                                    </span>
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-400 dark:text-neutral-500 text-center mt-6">
                                Arahkan kursor pada menu (seperti <span className="font-semibold text-slate-700 dark:text-neutral-300">Profil</span> atau <span className="font-semibold text-slate-700 dark:text-neutral-300">Layanan</span>) untuk menguji tampilan dropdown di atas.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* 6. Create / Edit Dialog */}
            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        setEditingMenu(null);
                        clearErrors();
                        reset();
                    }
                }}
            >
                <DialogContent className="sm:max-w-[500px] rounded-3xl p-6 border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl">
                    <DialogHeader className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-[#8B142C] dark:text-gold-400 flex items-center justify-center shrink-0">
                                {editingMenu ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-black text-slate-900 dark:text-white">
                                    {editingMenu ? 'Perbarui Menu Navigasi' : 'Tambah Menu Navigasi'}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500 dark:text-neutral-400">
                                    {editingMenu
                                        ? 'Sesuaikan label, tautan tujuan, dan penempatan hirarki menu.'
                                        : 'Buat item menu baru untuk navbar atau sub-menu landing page.'}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
                        {/* Label Input */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="menu-label"
                                className="text-xs font-bold text-slate-700 dark:text-neutral-300"
                            >
                                Label Menu <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="menu-label"
                                value={data.label}
                                onChange={(e) => setData('label', e.target.value)}
                                placeholder="Contoh: Visi & Misi"
                                className="rounded-xl border-slate-200 dark:border-neutral-800 text-xs h-10 focus-visible:ring-brand-700 dark:focus-visible:ring-gold-400"
                                autoFocus
                            />
                            {errors.label && (
                                <p className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    <span>{errors.label}</span>
                                </p>
                            )}
                        </div>

                        {/* Type & Order Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                                    Tipe Menu
                                </Label>
                                <Select
                                    value={data.type}
                                    onValueChange={(val: any) => setData('type', val)}
                                >
                                    <SelectTrigger className="rounded-xl border-slate-200 dark:border-neutral-800 text-xs h-10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="internal">Internal (Dalam Web)</SelectItem>
                                        <SelectItem value="external">Eksternal (Tab Baru)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="menu-order" className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                                    Nomor Urutan
                                </Label>
                                <Input
                                    id="menu-order"
                                    type="number"
                                    value={data.order}
                                    onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                    className="rounded-xl border-slate-200 dark:border-neutral-800 text-xs h-10"
                                />
                            </div>
                        </div>

                        {/* Parent Dropdown */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                                Induk Menu (Hirarki Dropdown)
                            </Label>
                            <Select
                                value={data.parent_id?.toString() || 'none'}
                                onValueChange={(val: string) =>
                                    setData('parent_id', val === 'none' ? null : parseInt(val))
                                }
                            >
                                <SelectTrigger className="rounded-xl border-slate-200 dark:border-neutral-800 text-xs h-10">
                                    <SelectValue placeholder="Sebagai Menu Utama (Root)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none" className="font-bold">
                                        Tidak Ada (Sebagai Menu Utama / Level 1)
                                    </SelectItem>
                                    {flattenedList
                                        .filter((m) => {
                                            if (m.depth >= 4) return false;
                                            if (editingMenu) {
                                                if (m.id === editingMenu.id) return false;
                                                const descendantIds = getDescendantIds(editingMenu.id);
                                                if (descendantIds.includes(m.id)) return false;
                                            }
                                            return true;
                                        })
                                        .map((m) => {
                                            const prefix = m.depth === 1 ? '● ' : m.depth === 2 ? '　└─ ' : '　　└─ ';
                                            return (
                                                <SelectItem key={m.id} value={m.id.toString()} className="font-medium text-xs">
                                                    <span className="font-mono text-slate-400">{prefix}</span>
                                                    <span className={m.depth === 1 ? 'font-bold text-brand-700 dark:text-gold-400' : 'text-slate-700 dark:text-neutral-200'}>
                                                        {m.label} (Level {m.depth})
                                                    </span>
                                                </SelectItem>
                                            );
                                        })}
                                </SelectContent>
                            </Select>
                            {errors.parent_id && (
                                <p className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    <span>{errors.parent_id}</span>
                                </p>
                            )}
                        </div>

                        {/* URL / Path (if not label) */}
                        {data.type !== 'label' && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="menu-url"
                                        className="text-xs font-bold text-slate-700 dark:text-neutral-300"
                                    >
                                        Tautan Tujuan (URL / Path) <span className="text-rose-500">*</span>
                                    </Label>
                                </div>

                                <Input
                                    id="menu-url"
                                    value={data.url}
                                    onChange={(e) => setData('url', e.target.value)}
                                    onBlur={(e) => {
                                        const val = e.target.value.trim();
                                        if (data.type === 'internal' && val && val !== '#' && !val.startsWith('/') && !val.startsWith('http')) {
                                            setData('url', `/${val}`);
                                        }
                                    }}
                                    placeholder={
                                        data.type === 'internal'
                                            ? '/akreditasi/universitas atau /announcements'
                                            : 'https://univrab.ac.id'
                                    }
                                    className="rounded-xl border-slate-200 dark:border-neutral-800 text-xs h-10 font-mono focus-visible:ring-brand-700 dark:focus-visible:ring-gold-400"
                                />

                                {/* Internal Preset Route Helper Chips */}
                                {data.type === 'internal' && (
                                    <div className="pt-1">
                                        <p className="text-[10px] font-semibold text-slate-400 dark:text-neutral-500 mb-1.5">
                                            Pilihan Cepat Rute Internal:
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {SYSTEM_PRESET_ROUTES.map((route) => (
                                                <button
                                                    key={route.url}
                                                    type="button"
                                                    onClick={() => setData('url', route.url)}
                                                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 hover:bg-brand-50 dark:bg-neutral-800 dark:hover:bg-brand-950/70 text-slate-600 hover:text-brand-700 dark:text-neutral-300 transition-colors"
                                                >
                                                    {route.label}
                                                </button>
                                            ))}
                                            {staticPages.map((page) => (
                                                <button
                                                    key={page.slug}
                                                    type="button"
                                                    onClick={() => setData('url', `/${page.slug}`)}
                                                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 transition-colors"
                                                >
                                                    📄 {page.title}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {errors.url && (
                                    <p className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                        <span>{errors.url}</span>
                                    </p>
                                )}
                            </div>
                        )}

                        <DialogFooter className="pt-3 gap-2 sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={processing}
                                className="rounded-xl text-xs font-semibold h-10 px-4"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || !data.label.trim()}
                                className="rounded-xl bg-[#8B142C] hover:bg-[#721024] text-white font-bold text-xs h-10 px-5 shadow-md cursor-pointer"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Menyimpan...</span>
                                    </span>
                                ) : editingMenu ? (
                                    'Simpan Perubahan'
                                ) : (
                                    'Buat Menu'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 7. Delete Confirmation Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={(open) => {
                    setIsDeleteDialogOpen(open);
                    if (!open) setMenuToDelete(null);
                }}
            >
                <DialogContent className="sm:max-w-[440px] rounded-3xl p-6 border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl">
                    <DialogHeader className="items-center text-center">
                        <div className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-3">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                            Hapus Menu Navigasi?
                        </DialogTitle>
                        <div className="text-xs text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed">
                            Apakah Anda yakin ingin menghapus menu{' '}
                            <span className="font-bold text-slate-900 dark:text-white">
                                "{menuToDelete?.label}"
                            </span>
                            ?
                        </div>
                    </DialogHeader>

                    {menuToDelete && countTotalDescendants(menuToDelete) > 0 && (
                        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5 my-2">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                            <div>
                                <p className="font-bold">Peringatan Penghapusan Bertingkat</p>
                                <p className="mt-0.5 text-[11px] leading-relaxed">
                                    Menu ini memiliki{' '}
                                    <span className="font-bold">
                                        {countTotalDescendants(menuToDelete)} sub-menu
                                    </span>{' '}
                                    di bawahnya. Seluruh sub-menu tersebut akan ikut terhapus secara otomatis agar tidak menjadi menu yatim (*orphan*) di navbar.
                                </p>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="mt-4 flex gap-2 sm:justify-center">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={processing}
                            className="rounded-xl text-xs font-semibold px-4 h-10"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmDelete}
                            disabled={processing}
                            className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 h-10 shadow-sm cursor-pointer"
                        >
                            {processing ? 'Menghapus...' : 'Ya, Hapus Sekarang'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

MenuIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Navigasi', href: '/admin/menus' },
    ],
};
