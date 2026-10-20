import {
    Trash2,
    Plus,
    Upload,
    X,
    Shield,
    ClipboardList,
    Mail,
    ChevronUp,
    ChevronDown,
    Users,
} from 'lucide-react';
import { useRef } from 'react';
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
import { Textarea } from '@/components/ui/textarea';

export default function OrgStructureForm({
    data,
    onChange,
}: {
    data: any[];
    onChange: (data: any[]) => void;
}) {
    const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    const generateId = () => `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const handleAdd = () => {
        const existingData = (data || []).map((item, idx) => ({
            ...item,
            id: item.id || `mem_${idx + 1}`,
        }));

        onChange([
            ...existingData,
            {
                id: generateId(),
                name: '',
                position: '',
                level: '4',
                parentId: null,
                photo: null,
                email: '',
                authorities: '',
                responsibilities: '',
            },
        ]);
    };

    const handleRemove = (index: number) => {
        const itemToRemove = data[index];
        const removedId = itemToRemove?.id;
        const newData = [...data];
        newData.splice(index, 1);

        // Reset parentId jika pejabat yang menaungi staf dihapus
        if (removedId) {
            newData.forEach((item) => {
                if (item.parentId === removedId) {
                    item.parentId = null;
                }
            });
        }
        onChange(newData);
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= data.length) return;

        const newData = [...data];
        const temp = newData[index];
        newData[index] = newData[targetIndex];
        newData[targetIndex] = temp;
        onChange(newData);
    };

    const handleChange = (index: number, field: string, value: any) => {
        const newData = (data || []).map((item, idx) => ({
            ...item,
            id: item.id || `mem_${idx + 1}`,
        }));
        newData[index][field] = value;

        // Jika level diubah bukan level 4, bersihkan parentId
        if (field === 'level' && value !== '4') {
            newData[index].parentId = null;
        }

        onChange(newData);
    };

    const handlePhotoChange = (index: number, file: File | null) => {
        handleChange(index, 'photo', file);
    };

    const handleRemovePhoto = (index: number) => {
        handlePhotoChange(index, null);
        // Clear file input
        const fileInput = fileInputRefs.current[`photo-${index}`];

        if (fileInput) {
            fileInput.value = '';
        }
    };

    const getPhotoDisplay = (item: any) => {
        if (item.photo instanceof File) {
            return URL.createObjectURL(item.photo);
        }

        if (typeof item.photo === 'string' && item.photo) {
            return `/storage/${item.photo}`;
        }

        return null;
    };

    // Daftar calon atasan langsung (Level 3 - Kepala Bidang, atau Level 2)
    const candidateSupervisors = (data || []).filter(
        (m) => (m.level === '3' || m.level === '2') && m.name,
    );

    return (
        <div className="space-y-6">
            {(data || []).map((item, index) => (
                <div
                    key={item.id || index}
                    className="flex gap-3 sm:gap-4 p-5 border rounded-2xl bg-slate-50 dark:bg-neutral-900/60 items-start shadow-xs relative"
                >
                    {/* Reorder Buttons (Move Up / Down) */}
                    <div className="flex flex-col items-center gap-1 pt-1 text-slate-400 shrink-0">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-500 hover:text-brand-700 hover:bg-brand-50 dark:hover:bg-neutral-800 disabled:opacity-30"
                            onClick={() => handleMove(index, 'up')}
                            disabled={index === 0}
                            title="Geser ke Atas"
                        >
                            <ChevronUp className="h-4 w-4" />
                        </Button>
                        <span className="text-[10px] font-bold text-slate-400 select-none">
                            #{index + 1}
                        </span>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-500 hover:text-brand-700 hover:bg-brand-50 dark:hover:bg-neutral-800 disabled:opacity-30"
                            onClick={() => handleMove(index, 'down')}
                            disabled={index === (data || []).length - 1}
                            title="Geser ke Bawah"
                        >
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex-1 space-y-4">
                        {/* Baris 1: Identitas Pokok */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Nama Lengkap & Gelar</Label>
                                <Input
                                    value={item.name || ''}
                                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                                    placeholder="Dr. H. Nama Lengkap, M.Kom"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Jabatan Struktural</Label>
                                <Input
                                    value={item.position || ''}
                                    onChange={(e) => handleChange(index, 'position', e.target.value)}
                                    placeholder="Ketua LPDSA / Koordinator SPMI"
                                />
                            </div>
                        </div>

                        {/* Baris 2: Hirarki Level & Kontak Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Tingkat Hirarki (Level Bagan)</Label>
                                <Select
                                    value={String(item.level || '1')}
                                    onValueChange={(val) => handleChange(index, 'level', val)}
                                >
                                    <SelectTrigger className="h-9 text-xs">
                                        <SelectValue placeholder="Pilih Tingkat Hirarki" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Level 1 - Pimpinan Lembaga (Ketua)</SelectItem>
                                        <SelectItem value="2">Level 2 - Sekretaris Lembaga</SelectItem>
                                        <SelectItem value="3">Level 3 - Kepala Bidang & Koordinator</SelectItem>
                                        <SelectItem value="4">Level 4 - Staf Teknis & Pelaksana</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold flex items-center gap-1.5">
                                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>Email Resmi / Kontak (Opsional)</span>
                                </Label>
                                <Input
                                    type="email"
                                    value={item.email || ''}
                                    onChange={(e) => handleChange(index, 'email', e.target.value)}
                                    placeholder="nama.pejabat@univrab.ac.id"
                                />
                            </div>
                        </div>

                        {/* Baris Khusus: Pemilihan Atasan Langsung / Kepala Bidang untuk Level 4 (Staf) */}
                        {String(item.level) === '4' && (
                            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                    <Label className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                                        <Users className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                        <span>Atasan Langsung / Kepala Bidang yang Menaungi</span>
                                    </Label>
                                    <span className="text-[10px] text-amber-700/90 dark:text-amber-400/90 italic">
                                        Staf akan bercabang tepat di bawah kartu pejabat ini
                                    </span>
                                </div>
                                <Select
                                    value={item.parentId || 'none'}
                                    onValueChange={(val) =>
                                        handleChange(index, 'parentId', val === 'none' ? null : val)
                                    }
                                >
                                    <SelectTrigger className="h-9 text-xs bg-white dark:bg-neutral-900 border-amber-300 dark:border-amber-800">
                                        <SelectValue placeholder="Pilih Kepala Bidang Atasan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            (Tanpa Atasan Spesifik / Langsung di bawah Lembaga)
                                        </SelectItem>
                                        {candidateSupervisors.map((supervisor, sIdx) => {
                                            const supId = supervisor.id || `mem_${sIdx + 1}`;
                                            return (
                                                <SelectItem key={supId} value={supId}>
                                                    {supervisor.name} — {supervisor.position}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Baris 3: Foto Profil */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Foto Profil Anggota</Label>
                            <Card className="border-dashed border-2 hover:border-brand-700/50 dark:hover:border-gold-400/50 transition-colors">
                                <CardContent className="p-4">
                                    {/* Photo Preview Area */}
                                    <div className="relative group">
                                        {getPhotoDisplay(item) ? (
                                            <div className="relative inline-block mx-auto">
                                                <img
                                                    src={getPhotoDisplay(item) || ''}
                                                    alt={`Preview ${item.name || 'Photo'}`}
                                                    className="h-28 w-28 mx-auto rounded-full object-cover border-4 border-brand-100 dark:border-neutral-800 shadow-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemovePhoto(index)}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                                                    title="Hapus foto"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                className="h-24 w-24 mx-auto rounded-full border-2 border-dashed border-slate-300 dark:border-neutral-700 flex flex-col items-center justify-center bg-white dark:bg-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-750 transition-colors cursor-pointer"
                                                onClick={() => fileInputRefs.current[`photo-${index}`]?.click()}
                                            >
                                                <Upload className="h-6 w-6 text-slate-400 mb-1" />
                                                <span className="text-[10px] text-slate-500 text-center font-medium">Upload Foto</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Hidden File Input */}
                                    <input
                                        ref={(el) => {
                                            fileInputRefs.current[`photo-${index}`] = el;
                                        }}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handlePhotoChange(index, e.target.files?.[0] || null)}
                                        className="hidden"
                                    />

                                    {/* Upload Button */}
                                    <div className="flex justify-center mt-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => fileInputRefs.current[`photo-${index}`]?.click()}
                                            className="text-xs h-7"
                                        >
                                            <Upload className="h-3 w-3 mr-1" />
                                            {getPhotoDisplay(item) ? 'Ganti Foto' : 'Pilih Foto'}
                                        </Button>
                                    </div>

                                    {/* File Info */}
                                    {typeof item.photo === 'string' && item.photo && (
                                        <p className="text-[10px] text-muted-foreground text-center mt-1 truncate">
                                            📁 {item.photo}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Baris 4: Tupoksi & Wewenang (Poin 4 - Modal Detail Profil) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200/80 dark:border-neutral-800">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold flex items-center gap-1.5 text-slate-700 dark:text-neutral-300">
                                    <ClipboardList className="h-3.5 w-3.5 text-brand-700 dark:text-gold-400" />
                                    <span>Tanggung Jawab & Tupoksi</span>
                                </Label>
                                <Textarea
                                    rows={4}
                                    value={item.responsibilities || ''}
                                    onChange={(e) => handleChange(index, 'responsibilities', e.target.value)}
                                    placeholder="Tuliskan uraian tugas & tanggung jawab (gunakan enter untuk poin baru):&#10;- Memimpin pelaksanaan penjaminan mutu&#10;- Bertanggung jawab langsung kepada Rektor&#10;- Menyusun laporan capaian tahunan"
                                    className="text-xs leading-relaxed"
                                />
                                <span className="text-[10px] text-muted-foreground block">
                                    Tips: Setiap baris baru akan otomatis ditampilkan sebagai butir daftar (*bullet point*) pada modal detail.
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold flex items-center gap-1.5 text-slate-700 dark:text-neutral-300">
                                    <Shield className="h-3.5 w-3.5 text-brand-700 dark:text-gold-400" />
                                    <span>Wewenang Jabatan</span>
                                </Label>
                                <Textarea
                                    rows={4}
                                    value={item.authorities || ''}
                                    onChange={(e) => handleChange(index, 'authorities', e.target.value)}
                                    placeholder="Tuliskan wewenang jabatan (gunakan enter untuk poin baru):&#10;- Menetapkan instrumen audit internal&#10;- Mengesahkan laporan akreditasi institusi&#10;- Memberikan rekomendasi mutu kepada prodi"
                                    className="text-xs leading-relaxed"
                                />
                                <span className="text-[10px] text-muted-foreground block">
                                    Tips: Setiap baris baru akan otomatis ditampilkan sebagai butir daftar (*bullet point*) pada modal detail.
                                </span>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 shrink-0"
                        onClick={() => handleRemove(index)}
                        title="Hapus Anggota"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}

            <Button
                type="button"
                variant="outline"
                onClick={handleAdd}
                className="w-full border-dashed border-slate-300 dark:border-neutral-700 hover:border-brand-700 hover:text-brand-700 dark:hover:border-gold-400 dark:hover:text-gold-400 h-11"
            >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Anggota Organisasi
            </Button>
        </div>
    );
}
