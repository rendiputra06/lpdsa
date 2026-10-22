import { Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Award,
    Building2,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    Download,
    FileCheck,
    FileText,
    GraduationCap,
    History,
    Info,
    Plus,
    RefreshCw,
    Save,
    Search,
    ShieldCheck,
    Sparkles,
    Trash,
    Upload,
    X,
} from 'lucide-react';
import { toast } from 'sonner';
import React, { useRef, useState } from 'react';
import AccreditationTimeline from '@/components/accreditation-timeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { AcademicUnit, Accreditation } from '@/types/accreditation';

interface AccreditationFormProps {
    academicUnits: AcademicUnit[];
    initialData?: Partial<Accreditation>;
    preselectedUnitId?: number | string | null;
    history?: Accreditation[];
    submitUrl: string;
    method: 'post' | 'put';
    submitLabel?: string;
    pageTitle?: string;
    pageSubtitle?: string;
    onUnitChange?: (unit: AcademicUnit | null) => void;
}

const COMMON_BODIES = [
    'BAN-PT',
    'LAM-PTKes',
    'LAM INFOKOM',
    'LAMDIK',
    'LAMEMBA',
    'LAM TEKNIK',
    'LAMSAMA',
];

const MODERN_GRADES = [
    { label: 'Unggul', variant: 'emerald', icon: '★' },
    { label: 'Baik Sekali', variant: 'blue', icon: '★' },
    { label: 'Baik', variant: 'amber', icon: '★' },
];

const LEGACY_GRADES = [
    { label: 'A', variant: 'emerald', icon: '★' },
    { label: 'B', variant: 'blue', icon: '★' },
    { label: 'C', variant: 'amber', icon: '★' },
    { label: 'Terakreditasi Sementara', variant: 'slate', icon: '⏳' },
];

export default function AccreditationForm({
    academicUnits,
    initialData = {},
    preselectedUnitId,
    history = [],
    submitUrl,
    method,
    submitLabel = 'Simpan Data Akreditasi',
    pageTitle,
    pageSubtitle,
    onUnitChange,
}: AccreditationFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial selected unit
    const initialUnitId = preselectedUnitId
        ? preselectedUnitId.toString()
        : initialData.academic_unit_id
          ? initialData.academic_unit_id.toString()
          : (initialData.unit_name ? 'custom' : '');

    const [sourceMode, setSourceMode] = useState<'master' | 'manual'>(
        initialUnitId === 'custom' || (!initialUnitId && !initialData.academic_unit_id && initialData.unit_name)
            ? 'manual'
            : 'master'
    );

    const [selectedUnitId, setSelectedUnitId] = useState<string>(initialUnitId || '');
    const [unitFilterType, setUnitFilterType] = useState<'all' | 'university' | 'faculty' | 'study_program'>('all');
    const [unitSearchQuery, setUnitSearchQuery] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);

    const { data, setData, post, processing, errors } = useForm<{
        _method: string;
        academic_unit_id: string;
        unit_type: 'university' | 'faculty' | 'study_program';
        unit_name: string;
        level: string;
        faculty_name: string;
        accreditation_body: string;
        grade: string;
        sk_number: string;
        sk_date: string;
        valid_until: string;
        status: 'active' | 'expired' | 'in_process';
        certificate_file: File | null;
        delete_certificate: boolean;
        notes: string;
    }>({
        _method: method === 'put' ? 'PUT' : 'POST',
        academic_unit_id: initialData.academic_unit_id
            ? initialData.academic_unit_id.toString()
            : preselectedUnitId
              ? preselectedUnitId.toString()
              : '',
        unit_type: initialData.unit_type || 'study_program',
        unit_name: initialData.unit_name || '',
        level: initialData.level || 'S1',
        faculty_name: initialData.faculty_name || '',
        accreditation_body: initialData.accreditation_body || 'BAN-PT',
        grade: initialData.grade || 'Baik Sekali',
        sk_number: initialData.sk_number || '',
        sk_date: initialData.sk_date || '',
        valid_until: initialData.valid_until || '',
        status: initialData.status || 'active',
        certificate_file: null,
        delete_certificate: false,
        notes: initialData.notes || '',
    });

    // Currently selected unit object
    const currentUnitObj = academicUnits.find(
        (u) => u.id.toString() === (data.academic_unit_id || selectedUnitId)
    );

    // Active history for the unit
    const unitHistory = currentUnitObj?.accreditations && currentUnitObj.accreditations.length > 0
        ? currentUnitObj.accreditations
        : history;

    // Filtered academic units for picker
    const filteredUnits = academicUnits.filter((u) => {
        if (unitFilterType !== 'all' && u.type !== unitFilterType) return false;
        if (!unitSearchQuery) return true;
        const q = unitSearchQuery.toLowerCase();
        return (
            u.name.toLowerCase().includes(q) ||
            (u.faculty_name && u.faculty_name.toLowerCase().includes(q)) ||
            (u.level && u.level.toLowerCase().includes(q))
        );
    });

    const handleSelectMasterUnit = (unit: AcademicUnit) => {
        setSelectedUnitId(unit.id.toString());
        setData((prev) => ({
            ...prev,
            academic_unit_id: unit.id.toString(),
            unit_type: unit.type,
            unit_name: unit.name,
            level: unit.level || '',
            faculty_name: unit.faculty_name || '',
        }));
        onUnitChange?.(unit);
    };

    const handleClearSelectedMasterUnit = () => {
        setSelectedUnitId('');
        setData((prev) => ({
            ...prev,
            academic_unit_id: '',
            unit_name: '',
            level: 'S1',
            faculty_name: '',
        }));
        onUnitChange?.(null);
    };

    const handleSetFiveYears = () => {
        if (!data.sk_date) return;
        const d = new Date(data.sk_date);
        d.setFullYear(d.getFullYear() + 5);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const fiveYearsLater = `${yyyy}-${mm}-${dd}`;

        const isExpired = new Date(fiveYearsLater) < new Date();
        setData((prev) => ({
            ...prev,
            valid_until: fiveYearsLater,
            status: prev.status === 'in_process' ? 'in_process' : isExpired ? 'expired' : 'active',
        }));
    };

    const handleValidUntilChange = (val: string) => {
        setData((prev) => {
            let nextStatus = prev.status;
            if (val && prev.status !== 'in_process') {
                const pickedDate = new Date(val);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                nextStatus = pickedDate < today ? 'expired' : 'active';
            }
            return {
                ...prev,
                valid_until: val,
                status: nextStatus,
            };
        });
    };

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0] || null;
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`Ukuran file "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas 10 MB.`);
                return;
            }
            setData((prev) => ({
                ...prev,
                certificate_file: file,
                delete_certificate: false,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(submitUrl, {
            forceFormData: true,
        });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    // Form Completion Checklist
    const isStep1Done = Boolean(data.unit_name);
    const isStep2Done = Boolean(data.accreditation_body && data.grade && data.sk_number);
    const isStep3Done = Boolean(data.valid_until && data.status);
    const allStepsDone = isStep1Done && isStep2Done && isStep3Done;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Top Action Header (Bab 4 PANDUAN_DESAIN.md) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-xs">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-brand-50 text-[#8B142C] dark:bg-brand-950/70 dark:text-gold-400 border border-brand-100 dark:border-brand-900/50 flex items-center justify-center shrink-0 shadow-xs">
                        <Award className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {pageTitle || (method === 'post' ? 'Tambah Akreditasi Baru' : 'Edit Data Akreditasi')}
                            </h1>
                            <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                    data.status === 'expired'
                                        ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40'
                                        : data.status === 'in_process'
                                          ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/40'
                                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40'
                                }`}
                            >
                                {data.status === 'expired'
                                    ? 'Kedaluwarsa'
                                    : data.status === 'in_process'
                                      ? 'Re-Akreditasi'
                                      : 'Aktif'}
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-0.5">
                            {pageSubtitle || 'Lengkapi rincian sertifikasi, nomor surat keputusan, dan masa berlaku'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                    <Button
                        type="button"
                        variant="outline"
                        asChild
                        className="rounded-xl border-slate-300 dark:border-neutral-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-neutral-800 gap-1.5"
                    >
                        <Link href="/admin/accreditations">
                            <ArrowLeft className="h-4 w-4" />
                            <span>Batal / Kembali</span>
                        </Link>
                    </Button>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl bg-[#8B142C] hover:bg-[#721024] text-white text-xs font-bold gap-2 shadow-sm transition-all"
                    >
                        <Save className="h-4 w-4" />
                        <span>{processing ? 'Menyimpan...' : submitLabel}</span>
                    </Button>
                </div>
            </div>

            {/* Main Dual-Pane Layout (lg:grid-cols-12: Left 7 cols, Right 5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT COLUMN: Modular Form Section Cards (7 cols on lg+) */}
                <div className="lg:col-span-7 space-y-5">
                    {/* SECTION 1: Unit Akademik & Entitas */}
                    <Card className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs overflow-hidden">
                        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-neutral-950/40">
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-lg bg-brand-50 text-[#8B142C] dark:bg-brand-950/70 dark:text-gold-400 flex items-center justify-center shrink-0">
                                    <Building2 className="h-4 w-4" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                        1. Unit Akademik & Entitas
                                    </h2>
                                    <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                                        Pilih entitas terdaftar dari pangkalan data atau isi manual
                                    </p>
                                </div>
                            </div>

                            {/* Mode Segment Switcher */}
                            <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-200/60 dark:bg-neutral-800 text-[11px] font-semibold">
                                <button
                                    type="button"
                                    onClick={() => setSourceMode('master')}
                                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                                        sourceMode === 'master'
                                            ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-xs font-bold'
                                            : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    Dari Master API
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSourceMode('manual')}
                                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                                        sourceMode === 'manual'
                                            ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-xs font-bold'
                                            : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    Input Manual
                                </button>
                            </div>
                        </div>

                        <CardContent className="p-5 space-y-4">
                            {sourceMode === 'master' ? (
                                <div className="space-y-3">
                                    {/* Jika unit sudah dipilih dari Master */}
                                    {currentUnitObj ? (
                                        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                                                        <Check className="h-3 w-3" /> Terhubung Master API
                                                    </span>
                                                    <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                                                        {currentUnitObj.type}
                                                    </Badge>
                                                    {currentUnitObj.level && (
                                                        <Badge variant="outline" className="text-[10px] border-amber-400 text-amber-700 dark:text-amber-400">
                                                            {currentUnitObj.level}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                    {currentUnitObj.name}
                                                </h3>
                                                {currentUnitObj.faculty_name && (
                                                    <p className="text-xs text-slate-600 dark:text-neutral-400">
                                                        {currentUnitObj.faculty_name}
                                                    </p>
                                                )}
                                            </div>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleClearSelectedMasterUnit}
                                                className="text-xs h-8 border-slate-300 dark:border-neutral-700 text-slate-700 dark:text-neutral-300 self-start sm:self-auto"
                                            >
                                                Ganti Entitas
                                            </Button>
                                        </div>
                                    ) : (
                                        /* Picker Dropdown jika belum dipilih */
                                        <div className="space-y-3">
                                            {/* Type Pills */}
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                {[
                                                    { key: 'all', label: 'Semua' },
                                                    { key: 'university', label: '🏛️ Universitas' },
                                                    { key: 'faculty', label: '🏢 Fakultas' },
                                                    { key: 'study_program', label: '🎓 Program Studi' },
                                                ].map((tab) => (
                                                    <button
                                                        key={tab.key}
                                                        type="button"
                                                        onClick={() => setUnitFilterType(tab.key as any)}
                                                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                                                            unitFilterType === tab.key
                                                                ? 'bg-[#8B142C] text-white border-[#8B142C] shadow-xs'
                                                                : 'bg-slate-50 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 border-slate-200 dark:border-neutral-700 hover:bg-slate-100'
                                                        }`}
                                                    >
                                                        {tab.label}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Search input for units */}
                                            <div className="relative">
                                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                <Input
                                                    value={unitSearchQuery}
                                                    onChange={(e) => setUnitSearchQuery(e.target.value)}
                                                    placeholder="Cari nama prodi, jenjang, atau fakultas..."
                                                    className="pl-9 h-9 text-xs rounded-xl border-slate-200 dark:border-neutral-800"
                                                />
                                            </div>

                                            {/* Scrollable list of units */}
                                            <div className="max-h-52 overflow-y-auto rounded-xl border border-slate-200 dark:border-neutral-800 divide-y divide-slate-100 dark:divide-neutral-800/80 bg-slate-50/40 dark:bg-neutral-950/30">
                                                {filteredUnits.length === 0 ? (
                                                    <div className="p-4 text-center text-xs text-slate-400">
                                                        Tidak ada unit yang cocok dengan pencarian
                                                    </div>
                                                ) : (
                                                    filteredUnits.map((u) => (
                                                        <button
                                                            key={u.id}
                                                            type="button"
                                                            onClick={() => handleSelectMasterUnit(u)}
                                                            className="w-full text-left p-3 hover:bg-white dark:hover:bg-neutral-800 transition-colors flex items-center justify-between gap-2 group cursor-pointer"
                                                        >
                                                            <div>
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                                        {u.type === 'university' ? '🏛️ UNIV' : u.type === 'faculty' ? '🏢 FAK' : '🎓 PRODI'}
                                                                    </span>
                                                                    {u.level && (
                                                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                                                                            {u.level}
                                                                        </span>
                                                                    )}
                                                                    <span className="text-xs font-bold text-slate-800 dark:text-neutral-200 group-hover:text-[#8B142C] dark:group-hover:text-gold-400 transition-colors">
                                                                        {u.name}
                                                                    </span>
                                                                </div>
                                                                {u.faculty_name && (
                                                                    <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
                                                                        {u.faculty_name}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <span className="text-[11px] font-semibold text-[#8B142C] dark:text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                Pilih &rarr;
                                                            </span>
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* INPUT MANUAL */
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold">Tingkat Entitas</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { key: 'university', label: 'Universitas', icon: Building2 },
                                                { key: 'faculty', label: 'Fakultas', icon: Building2 },
                                                { key: 'study_program', label: 'Program Studi', icon: GraduationCap },
                                            ].map((type) => {
                                                const IconComp = type.icon;
                                                const isSel = data.unit_type === type.key;
                                                return (
                                                    <button
                                                        key={type.key}
                                                        type="button"
                                                        onClick={() => setData('unit_type', type.key as any)}
                                                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                                                            isSel
                                                                ? 'bg-brand-50/60 dark:bg-brand-950/30 border-[#8B142C] text-[#8B142C] dark:text-gold-400 font-bold shadow-xs'
                                                                : 'bg-white dark:bg-neutral-850 border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        <IconComp className="h-4 w-4" />
                                                        <span className="text-xs">{type.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="unit_name" className="text-xs font-semibold">
                                            Nama Entitas Lengkap <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="unit_name"
                                            value={data.unit_name}
                                            onChange={(e) => setData('unit_name', e.target.value)}
                                            placeholder="Contoh: S1 Pendidikan Dokter"
                                            className="h-10 text-xs rounded-xl"
                                        />
                                        {errors.unit_name && (
                                            <p className="text-red-500 text-[11px]">{errors.unit_name}</p>
                                        )}
                                    </div>

                                    {data.unit_type === 'study_program' && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="level" className="text-xs font-semibold">
                                                    Jenjang Pendidikan <span className="text-red-500">*</span>
                                                </Label>
                                                <Select
                                                    value={data.level || 'S1'}
                                                    onValueChange={(val) => setData('level', val)}
                                                >
                                                    <SelectTrigger id="level" className="h-10 text-xs rounded-xl">
                                                        <SelectValue placeholder="Pilih jenjang" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        <SelectItem value="D3">Diploma 3 (D3)</SelectItem>
                                                        <SelectItem value="D4">Diploma 4 / Sarjana Terapan (D4)</SelectItem>
                                                        <SelectItem value="S1">Sarjana (S1)</SelectItem>
                                                        <SelectItem value="S2">Magister (S2)</SelectItem>
                                                        <SelectItem value="S3">Doktor (S3)</SelectItem>
                                                        <SelectItem value="Profesi">Profesi</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="faculty_name" className="text-xs font-semibold">
                                                    Fakultas Induk (Opsional)
                                                </Label>
                                                <Input
                                                    id="faculty_name"
                                                    value={data.faculty_name}
                                                    onChange={(e) => setData('faculty_name', e.target.value)}
                                                    placeholder="Contoh: Fakultas Kedokteran"
                                                    className="h-10 text-xs rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* SECTION 2: Lembaga & Penetapan SK */}
                    <Card className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs overflow-hidden">
                        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-neutral-800 flex items-center gap-2.5 bg-slate-50/50 dark:bg-neutral-950/40">
                            <div className="h-8 w-8 rounded-lg bg-brand-50 text-[#8B142C] dark:bg-brand-950/70 dark:text-gold-400 flex items-center justify-center shrink-0">
                                <Award className="h-4 w-4" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                    2. Lembaga & Penetapan SK
                                </h2>
                                <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                                    Lembaga akreditasi penguji, peringkat resmi, dan nomor surat keputusan
                                </p>
                            </div>
                        </div>

                        <CardContent className="p-5 space-y-4">
                            {/* Lembaga Akreditasi */}
                            <div className="space-y-2">
                                <Label htmlFor="accreditation_body" className="text-xs font-semibold">
                                    Lembaga Akreditasi <span className="text-red-500">*</span>
                                </Label>
                                {/* Quick Pill Buttons */}
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    {COMMON_BODIES.map((body) => (
                                        <button
                                            key={body}
                                            type="button"
                                            onClick={() => setData('accreditation_body', body)}
                                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                                                data.accreditation_body === body
                                                    ? 'bg-[#8B142C] text-white border-[#8B142C] shadow-xs'
                                                    : 'bg-slate-50 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 border-slate-200 dark:border-neutral-700 hover:bg-slate-100'
                                            }`}
                                        >
                                            {body}
                                        </button>
                                    ))}
                                </div>
                                <Input
                                    id="accreditation_body"
                                    value={data.accreditation_body}
                                    onChange={(e) => setData('accreditation_body', e.target.value)}
                                    placeholder="Ketik nama lembaga atau pilih tombol di atas"
                                    className="h-10 text-xs rounded-xl"
                                />
                                {errors.accreditation_body && (
                                    <p className="text-red-500 text-[11px]">{errors.accreditation_body}</p>
                                )}
                            </div>

                            {/* Peringkat Akreditasi */}
                            <div className="space-y-2.5">
                                <Label htmlFor="grade" className="text-xs font-semibold">
                                    Peringkat Akreditasi <span className="text-red-500">*</span>
                                </Label>

                                {/* 9 Kriteria Standar (Modern) */}
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 block mb-1.5">
                                        Instrumen 9 Kriteria (Standar Saat Ini)
                                    </span>
                                    <div className="grid grid-cols-3 gap-2">
                                        {MODERN_GRADES.map((g) => {
                                            const isSelected = data.grade.toLowerCase() === g.label.toLowerCase();
                                            return (
                                                <button
                                                    key={g.label}
                                                    type="button"
                                                    onClick={() => setData('grade', g.label)}
                                                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold ${
                                                        isSelected
                                                            ? g.variant === 'emerald'
                                                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                                                : g.variant === 'blue'
                                                                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                                  : 'bg-amber-500 text-white border-amber-500 shadow-xs'
                                                            : 'bg-slate-50 dark:bg-neutral-800/80 text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-neutral-700 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    <span>{g.icon}</span>
                                                    <span>{g.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 7 Standar & Lainnya (Legacy) */}
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 block mb-1.5">
                                        Instrumen 7 Standar (Lama) / Lainnya
                                    </span>
                                    <div className="grid grid-cols-4 gap-2">
                                        {LEGACY_GRADES.map((g) => {
                                            const isSelected = data.grade.toLowerCase() === g.label.toLowerCase();
                                            return (
                                                <button
                                                    key={g.label}
                                                    type="button"
                                                    onClick={() => setData('grade', g.label)}
                                                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer text-xs font-semibold ${
                                                        isSelected
                                                            ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-neutral-900 shadow-xs font-bold'
                                                            : 'bg-slate-50 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-neutral-700 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    {g.label === 'Terakreditasi Sementara' ? 'Sementara' : g.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <Input
                                    id="grade"
                                    value={data.grade}
                                    onChange={(e) => setData('grade', e.target.value)}
                                    placeholder="Ketik peringkat jika tidak tercantum di atas"
                                    className="h-9 text-xs rounded-xl"
                                />
                                {errors.grade && <p className="text-red-500 text-[11px]">{errors.grade}</p>}
                            </div>

                            {/* Nomor SK & Tanggal SK */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                <div className="space-y-1.5">
                                    <Label htmlFor="sk_number" className="text-xs font-semibold">
                                        Nomor SK Akreditasi <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="sk_number"
                                        value={data.sk_number}
                                        onChange={(e) => setData('sk_number', e.target.value)}
                                        placeholder="0123/SK/BAN-PT/..."
                                        className="h-10 text-xs font-mono rounded-xl"
                                    />
                                    <p className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
                                        Format baku: 1234/SK/BAN-PT/Akred/S/X/2024
                                    </p>
                                    {errors.sk_number && (
                                        <p className="text-red-500 text-[11px]">{errors.sk_number}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="sk_date" className="text-xs font-semibold">
                                        Tanggal Penerbitan SK
                                    </Label>
                                    <Input
                                        id="sk_date"
                                        type="date"
                                        value={data.sk_date}
                                        onChange={(e) => setData('sk_date', e.target.value)}
                                        className="h-10 text-xs rounded-xl"
                                    />
                                    {errors.sk_date && <p className="text-red-500 text-[11px]">{errors.sk_date}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SECTION 3: Masa Berlaku & Status */}
                    <Card className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs overflow-hidden">
                        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-neutral-800 flex items-center gap-2.5 bg-slate-50/50 dark:bg-neutral-950/40">
                            <div className="h-8 w-8 rounded-lg bg-brand-50 text-[#8B142C] dark:bg-brand-950/70 dark:text-gold-400 flex items-center justify-center shrink-0">
                                <Calendar className="h-4 w-4" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                    3. Masa Berlaku & Status
                                </h2>
                                <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                                    Tenggat kedaluwarsa sertifikat dan status pengakuan hukum
                                </p>
                            </div>
                        </div>

                        <CardContent className="p-5 space-y-4">
                            {/* Berlaku Hingga + Magic Button */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="valid_until" className="text-xs font-semibold">
                                        Berlaku Hingga Tanggal
                                    </Label>
                                    {data.sk_date && (
                                        <button
                                            type="button"
                                            onClick={handleSetFiveYears}
                                            className="text-[11px] font-bold text-[#8B142C] dark:text-gold-400 hover:underline inline-flex items-center gap-1 cursor-pointer bg-brand-50/80 dark:bg-brand-950/50 px-2 py-0.5 rounded-md border border-brand-200 dark:border-brand-900"
                                            title="Otomatis tetapkan masa berlaku 5 tahun dari tanggal SK"
                                        >
                                            <Sparkles className="h-3 w-3" />
                                            <span>+5 Tahun Siklus Standar</span>
                                        </button>
                                    )}
                                </div>
                                <Input
                                    id="valid_until"
                                    type="date"
                                    value={data.valid_until}
                                    onChange={(e) => handleValidUntilChange(e.target.value)}
                                    className="h-10 text-xs rounded-xl"
                                />
                                {errors.valid_until && (
                                    <p className="text-red-500 text-[11px]">{errors.valid_until}</p>
                                )}
                            </div>

                            {/* Status Akreditasi: 3 Interactive Cards */}
                            <div className="space-y-1.5 pt-1">
                                <Label className="text-xs font-semibold">
                                    Status Akreditasi <span className="text-red-500">*</span>
                                </Label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    {/* Aktif */}
                                    <button
                                        type="button"
                                        onClick={() => setData('status', 'active')}
                                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                            data.status === 'active'
                                                ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500 ring-1 ring-emerald-500 shadow-xs'
                                                : 'bg-white dark:bg-neutral-800/80 border-slate-200 dark:border-neutral-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                                🟢 Aktif
                                            </span>
                                            {data.status === 'active' && (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1">
                                            Sertifikat berlaku dan diakui secara legal
                                        </p>
                                    </button>

                                    {/* Proses Re-Akreditasi */}
                                    <button
                                        type="button"
                                        onClick={() => setData('status', 'in_process')}
                                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                            data.status === 'in_process'
                                                ? 'bg-purple-50/80 dark:bg-purple-950/30 border-purple-500 ring-1 ring-purple-500 shadow-xs'
                                                : 'bg-white dark:bg-neutral-800/80 border-slate-200 dark:border-neutral-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-purple-700 dark:text-purple-400">
                                                🟡 Re-Akreditasi
                                            </span>
                                            {data.status === 'in_process' && (
                                                <CheckCircle2 className="h-4 w-4 text-purple-600" />
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1">
                                            Pengajuan borang / asesmen lapangan
                                        </p>
                                    </button>

                                    {/* Kedaluwarsa */}
                                    <button
                                        type="button"
                                        onClick={() => setData('status', 'expired')}
                                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                            data.status === 'expired'
                                                ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-500 ring-1 ring-rose-500 shadow-xs'
                                                : 'bg-white dark:bg-neutral-800/80 border-slate-200 dark:border-neutral-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-rose-700 dark:text-rose-400">
                                                🔴 Kedaluwarsa
                                            </span>
                                            {data.status === 'expired' && (
                                                <CheckCircle2 className="h-4 w-4 text-rose-600" />
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1">
                                            Masa berlaku habis / data historis
                                        </p>
                                    </button>
                                </div>
                                {errors.status && <p className="text-red-500 text-[11px]">{errors.status}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* SECTION 4: Berkas Sertifikat & Catatan */}
                    <Card className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs overflow-hidden">
                        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-neutral-800 flex items-center gap-2.5 bg-slate-50/50 dark:bg-neutral-950/40">
                            <div className="h-8 w-8 rounded-lg bg-brand-50 text-[#8B142C] dark:bg-brand-950/70 dark:text-gold-400 flex items-center justify-center shrink-0">
                                <FileCheck className="h-4 w-4" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                    4. Berkas Sertifikat & Catatan
                                </h2>
                                <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                                    Salinan digital sertifikat resmi dan informasi pelengkap
                                </p>
                            </div>
                        </div>

                        <CardContent className="p-5 space-y-4">
                            {/* Dropzone Upload */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold">Berkas Sertifikat Resmi</Label>
                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragOver(true);
                                    }}
                                    onDragLeave={() => setIsDragOver(false)}
                                    onDrop={handleFileDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                                        isDragOver
                                            ? 'border-[#8B142C] bg-brand-50/50 dark:bg-brand-950/40'
                                            : 'border-slate-300 dark:border-neutral-700 bg-slate-50/60 dark:bg-neutral-950/30 hover:border-slate-400 dark:hover:border-neutral-600'
                                    }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,image/png,image/jpeg,image/webp"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            if (file && file.size > 10 * 1024 * 1024) {
                                                toast.error(`Ukuran file "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas 10 MB.`);
                                                e.target.value = '';
                                                return;
                                            }
                                            setData((prev) => ({
                                                ...prev,
                                                certificate_file: file,
                                                delete_certificate: false,
                                            }));
                                        }}
                                        className="hidden"
                                    />
                                    <div className="h-12 w-12 rounded-xl bg-white dark:bg-neutral-800 shadow-xs border border-slate-200 dark:border-neutral-700 flex items-center justify-center text-[#8B142C] dark:text-gold-400 mb-2">
                                        <Upload className="h-6 w-6" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-800 dark:text-neutral-200">
                                        {data.certificate_file
                                            ? data.certificate_file.name
                                            : 'Klik untuk telusuri berkas atau seret ke sini'}
                                    </p>
                                    <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-0.5">
                                        {data.certificate_file
                                            ? `Ukuran: ${formatFileSize(data.certificate_file.size)}`
                                            : 'Format PDF, JPG, PNG, atau WebP (Maksimal 5MB)'}
                                    </p>
                                </div>

                                {data.certificate_file && (
                                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                                        <div className="flex items-center gap-2 truncate">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                            <span className="font-semibold truncate">
                                                Siap diunggah: {data.certificate_file.name}
                                            </span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setData('certificate_file', null);
                                            }}
                                            className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                        >
                                            Hapus
                                        </Button>
                                    </div>
                                )}

                                {/* Existing File */}
                                {initialData.certificate_file && !data.certificate_file && (
                                    <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/50 flex items-center justify-between gap-3 text-xs">
                                        <div className="flex items-center gap-2 truncate">
                                            <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                                            <span className="text-slate-500 dark:text-neutral-400">Berkas saat ini:</span>
                                            <a
                                                href={`/storage/${initialData.certificate_file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`underline font-mono truncate max-w-xs ${
                                                    data.delete_certificate
                                                        ? 'line-through text-red-500'
                                                        : 'text-blue-600 dark:text-blue-400 font-semibold'
                                                }`}
                                            >
                                                {initialData.certificate_file.split('/').pop()}
                                            </a>
                                        </div>

                                        {data.delete_certificate ? (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setData('delete_certificate', false)}
                                                className="h-7 text-xs px-2"
                                            >
                                                Batal Hapus
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setData('delete_certificate', true)}
                                                className="h-7 text-xs px-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 gap-1"
                                            >
                                                <Trash className="h-3 w-3" />
                                                <span>Hapus Berkas</span>
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {data.delete_certificate && (
                                    <p className="text-[11px] text-red-500 font-medium">
                                        ⚠️ Berkas sertifikat di server akan dihapus permanen saat form disimpan.
                                    </p>
                                )}
                                {errors.certificate_file && (
                                    <p className="text-red-500 text-[11px]">{errors.certificate_file}</p>
                                )}
                            </div>

                            {/* Catatan Tambahan */}
                            <div className="space-y-1.5">
                                <Label htmlFor="notes" className="text-xs font-semibold">
                                    Catatan / Keterangan Tambahan
                                </Label>
                                <textarea
                                    id="notes"
                                    rows={3}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Keterangan perpanjangan, nomor borang, atau informasi akreditasi khusus..."
                                    className="w-full rounded-xl border border-input bg-background p-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                                {errors.notes && <p className="text-red-500 text-[11px]">{errors.notes}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bottom Action Footer */}
                    <div className="flex items-center justify-between gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                            className="rounded-xl border-slate-300 dark:border-neutral-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-neutral-800"
                        >
                            <Link href="/admin/accreditations">
                                Kembali ke Daftar
                            </Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-[#8B142C] hover:bg-[#721024] text-white text-xs font-bold gap-2 shadow-sm"
                        >
                            <Save className="h-4 w-4" />
                            <span>{processing ? 'Menyimpan...' : submitLabel}</span>
                        </Button>
                    </div>
                </div>

                {/* RIGHT COLUMN: Sticky Live Certificate Preview & Riwayat (5 cols on lg+) */}
                <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
                    {/* LIVE CERTIFICATE PREVIEW CARD (Visual Simulator) */}
                    <div className="rounded-3xl border border-slate-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-md overflow-hidden">
                        {/* Certificate Gold/Maroon Header */}
                        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#5c0f1f] via-[#8B142C] to-[#38050f] text-white relative overflow-hidden">
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-9 w-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-gold-300 font-black text-sm shadow-xs">
                                        <Award className="h-5 w-5 text-gold-400" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-bold tracking-widest text-gold-300">
                                            Universitas Abdurrab
                                        </div>
                                        <div className="text-xs font-bold text-white/95">
                                            Sertifikat Akreditasi Resmi
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 uppercase tracking-wider">
                                    {data.unit_type === 'university'
                                        ? 'Institusi'
                                        : data.unit_type === 'faculty'
                                          ? 'Fakultas'
                                          : 'Program Studi'}
                                </span>
                            </div>
                        </div>

                        {/* Certificate Body Preview */}
                        <div className="p-5 text-center space-y-4">
                            {/* Peringkat Akreditasi Badge */}
                            <div className="inline-flex flex-col items-center">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-neutral-500 mb-1">
                                    Peringkat Terakreditasi
                                </span>
                                <div
                                    className={`px-5 py-2 rounded-2xl text-base font-black tracking-wide shadow-xs border ${
                                        (data.grade || '').toLowerCase().includes('unggul') ||
                                        (data.grade || '').toLowerCase() === 'a'
                                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                                            : (data.grade || '').toLowerCase().includes('baik sekali') ||
                                                (data.grade || '').toLowerCase() === 'b'
                                              ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30'
                                              : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
                                    }`}
                                >
                                    ★ {data.grade || 'Belum Ditentukan'}
                                </div>
                            </div>

                            {/* Nama Entitas */}
                            <div>
                                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                                    {data.unit_name || 'Nama Entitas Belum Diisi'}
                                </h3>
                                {data.unit_type === 'study_program' && (
                                    <div className="flex items-center justify-center gap-1.5 mt-1.5 flex-wrap">
                                        {data.level && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40">
                                                {data.level}
                                            </span>
                                        )}
                                        {data.faculty_name && (
                                            <span className="text-xs text-slate-500 dark:text-neutral-400 font-medium">
                                                {data.faculty_name}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Legal Specifications Box */}
                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200/80 dark:border-neutral-800 text-left text-xs space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 dark:text-neutral-400">Lembaga:</span>
                                    <span className="font-bold text-slate-800 dark:text-neutral-200">
                                        {data.accreditation_body || '-'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 dark:text-neutral-400">Nomor SK:</span>
                                    <span className="font-mono font-semibold text-slate-800 dark:text-neutral-200 truncate max-w-[190px]">
                                        {data.sk_number || 'Belum diisi'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 dark:text-neutral-400">Masa Berlaku:</span>
                                    <span className="font-semibold text-slate-800 dark:text-neutral-200">
                                        {data.valid_until
                                            ? new Date(data.valid_until).toLocaleDateString('id-ID', {
                                                  day: 'numeric',
                                                  month: 'short',
                                                  year: 'numeric',
                                              })
                                            : 'Belum ditentukan'}
                                    </span>
                                </div>
                            </div>

                            {/* Status Banner */}
                            <div
                                className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 ${
                                    data.status === 'expired'
                                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40'
                                        : data.status === 'in_process'
                                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-900/40'
                                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
                                }`}
                            >
                                <ShieldCheck className="h-4 w-4" />
                                <span>
                                    {data.status === 'expired'
                                        ? 'Status: Kedaluwarsa'
                                        : data.status === 'in_process'
                                          ? 'Status: Proses Re-Akreditasi'
                                          : 'Status: Aktif & Sah Diakui'}
                                </span>
                            </div>

                            <p className="text-[10px] text-slate-400 dark:text-neutral-500 italic">
                                ✨ Pratinjau langsung tampilan sertifikat pada portal publik & laporan LPDSA
                            </p>
                        </div>
                    </div>

                    {/* RIWAYAT TIMELINE UNIT TERKAIT */}
                    <Card className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
                        <CardContent className="p-5">
                            <AccreditationTimeline
                                items={unitHistory}
                                currentId={initialData.id}
                                showAddButton={false}
                                unitName={data.unit_name || currentUnitObj?.name}
                                academicUnitId={data.academic_unit_id ? parseInt(data.academic_unit_id, 10) : undefined}
                                isAdmin={true}
                            />
                        </CardContent>
                    </Card>

                    {/* FORM COMPLETION READINESS SUMMARY */}
                    <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-950/30 space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                                Kelengkapan Data Formulir
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                allStepsDone
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}>
                                {allStepsDone ? '✓ Siap Disimpan' : 'Belum Lengkap'}
                            </span>
                        </div>
                        <div className="space-y-1.5 text-xs">
                            <div className="flex items-center gap-2">
                                {isStep1Done ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                ) : (
                                    <div className="h-3.5 w-3.5 rounded-full border border-slate-300 dark:border-neutral-600" />
                                )}
                                <span className={isStep1Done ? 'text-slate-800 dark:text-neutral-200 font-medium' : 'text-slate-400'}>
                                    Identitas Unit Akademik
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {isStep2Done ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                ) : (
                                    <div className="h-3.5 w-3.5 rounded-full border border-slate-300 dark:border-neutral-600" />
                                )}
                                <span className={isStep2Done ? 'text-slate-800 dark:text-neutral-200 font-medium' : 'text-slate-400'}>
                                    Lembaga, Peringkat, & SK
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {isStep3Done ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                ) : (
                                    <div className="h-3.5 w-3.5 rounded-full border border-slate-300 dark:border-neutral-600" />
                                )}
                                <span className={isStep3Done ? 'text-slate-800 dark:text-neutral-200 font-medium' : 'text-slate-400'}>
                                    Masa Berlaku & Status
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
