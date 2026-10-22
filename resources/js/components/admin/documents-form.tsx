import { Trash2, Plus, GripVertical, AlertTriangle } from 'lucide-react';
import React, { useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DocumentsForm({ data, onChange }: { data: any[], onChange: (data: any[]) => void }) {
    const handleAdd = () => {
        onChange([...(data || []), { title: '', description: '', file: null, is_external_link: false, url: '' }]);
    };

    const handleRemove = (index: number) => {
        const newData = [...data];
        newData.splice(index, 1);
        onChange(newData);
    };

    const handleChange = (index: number, field: string, value: any) => {
        const newData = [...data];
        newData[index][field] = value;
        onChange(newData);
    };

    const handleToggleExternal = (index: number, isExt: boolean) => {
        const newData = [...data];
        newData[index] = {
            ...newData[index],
            is_external_link: isExt,
            // Jika beralih ke link, bersihkan file. Jika beralih ke file, bersihkan url.
            file: isExt ? null : newData[index].file,
            url: isExt ? (newData[index].url || '') : '',
        };
        onChange(newData);
    };

    const totalUploadSizeBytes = useMemo(() => {
        return (data || []).reduce((acc, item) => {
            if (item.file instanceof File) {
                return acc + item.file.size;
            }
            return acc;
        }, 0);
    }, [data]);

    return (
        <div className="space-y-4">
            {totalUploadSizeBytes > 15 * 1024 * 1024 && (
                <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                    <div className="leading-relaxed">
                        <p className="font-bold">Total berkas yang akan diunggah cukup besar ({(totalUploadSizeBytes / (1024 * 1024)).toFixed(1)} MB).</p>
                        <p className="text-[11px] mt-0.5 text-amber-700 dark:text-amber-400">
                            Untuk menjaga kestabilan jaringan dan menghindari pembatasan Cloudflare/server (Error 413), disarankan menggunakan opsi <strong>Link Eksternal (Google Drive)</strong> untuk sebagian dokumen.
                        </p>
                    </div>
                </div>
            )}

            {(data || []).map((item, index) => {
                const isExternal = item.is_external_link === true || item.is_external_link === 'true' || item.is_external_link === 1 || item.is_external_link === '1';

                return (
                    <div key={index} className="flex gap-4 p-4 border rounded-lg bg-slate-50 dark:bg-neutral-900/50 items-start">
                        <div className="pt-2 cursor-grab text-slate-400">
                            <GripVertical className="h-5 w-5" />
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 lg:col-span-2">
                                <Label className="flex items-center gap-1 font-semibold text-xs">
                                    <span>Judul Dokumen / Link</span>
                                    <span className="text-red-500 font-bold">*</span>
                                </Label>
                                <Input 
                                    value={item.title} 
                                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                                    placeholder="Contoh: Pedoman Penulisan Skripsi 2026"
                                    className="bg-white dark:bg-neutral-900"
                                />
                            </div>
                            <div className="space-y-2 lg:col-span-2">
                                <Label className="font-semibold text-xs">Deskripsi Singkat</Label>
                                <Input 
                                    value={item.description} 
                                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                                    placeholder="Penjelasan singkat mengenai dokumen..."
                                    className="bg-white dark:bg-neutral-900"
                                />
                            </div>
                            
                            <div className="space-y-2 flex items-center gap-2 mt-2">
                                <input 
                                    type="checkbox" 
                                    id={`is_link_${index}`}
                                    checked={isExternal}
                                    onChange={(e) => handleToggleExternal(index, e.target.checked)}
                                    className="rounded border-gray-300 text-univrab-blue focus:ring-univrab-blue cursor-pointer"
                                />
                                <Label htmlFor={`is_link_${index}`} className="cursor-pointer text-xs font-medium">Ini adalah Link Eksternal (Google Drive / Cloud)</Label>
                            </div>

                            <div className="space-y-2 lg:col-span-2">
                                {isExternal ? (
                                    <>
                                        <Label>URL Tujuan</Label>
                                        <Input 
                                            type="url"
                                            value={item.url} 
                                            onChange={(e) => handleChange(index, 'url', e.target.value)}
                                            placeholder="https://..."
                                        />
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <Label>Upload File (PDF/DOC)</Label>
                                            <span className="text-[10px] text-muted-foreground">Maksimal 10 MB</span>
                                        </div>
                                        <Input 
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                if (file && file.size > 10 * 1024 * 1024) {
                                                    toast.error(`Ukuran file "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas 10 MB. Silakan gunakan opsi Link Eksternal Google Drive.`);
                                                    e.target.value = '';
                                                    handleChange(index, 'file', null);
                                                    return;
                                                }
                                                handleChange(index, 'file', file);
                                            }}
                                            className="text-xs file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-univrab-blue/10 file:text-univrab-blue"
                                        />
                                        {typeof item.file === 'string' && (
                                            <p className="text-[10px] text-muted-foreground truncate">Saat ini: {item.file}</p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 mt-6" onClick={() => handleRemove(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            })}

            <Button type="button" variant="outline" onClick={handleAdd} className="w-full border-dashed">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Dokumen/Link
            </Button>
        </div>
    );
}
