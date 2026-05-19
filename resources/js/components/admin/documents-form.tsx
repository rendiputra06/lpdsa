import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, GripVertical } from 'lucide-react';

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

    return (
        <div className="space-y-4">
            {(data || []).map((item, index) => {
                const isExternal = item.is_external_link === true || item.is_external_link === 'true' || item.is_external_link === 1 || item.is_external_link === '1';

                return (
                    <div key={index} className="flex gap-4 p-4 border rounded-lg bg-slate-50 dark:bg-neutral-900/50 items-start">
                        <div className="pt-2 cursor-grab text-slate-400">
                            <GripVertical className="h-5 w-5" />
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 lg:col-span-2">
                                <Label>Judul Dokumen/Link</Label>
                                <Input 
                                    value={item.title} 
                                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                                    placeholder="Pedoman Akademik 2026"
                                />
                            </div>
                            <div className="space-y-2 lg:col-span-2">
                                <Label>Deskripsi Singkat</Label>
                                <Input 
                                    value={item.description} 
                                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                                    placeholder="Penjelasan singkat mengenai dokumen..."
                                />
                            </div>
                            
                            <div className="space-y-2 flex items-center gap-2 mt-2">
                                <input 
                                    type="checkbox" 
                                    id={`is_link_${index}`}
                                    checked={isExternal}
                                    onChange={(e) => handleChange(index, 'is_external_link', e.target.checked)}
                                    className="rounded border-gray-300 text-univrab-blue focus:ring-univrab-blue"
                                />
                                <Label htmlFor={`is_link_${index}`} className="cursor-pointer">Ini adalah Link Eksternal</Label>
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
                                        <Label>Upload File (PDF/DOC)</Label>
                                        <Input 
                                            type="file"
                                            onChange={(e) => handleChange(index, 'file', e.target.files?.[0] || null)}
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
