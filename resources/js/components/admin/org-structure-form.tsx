import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, GripVertical } from 'lucide-react';

export default function OrgStructureForm({ data, onChange }: { data: any[], onChange: (data: any[]) => void }) {
    const handleAdd = () => {
        onChange([...(data || []), { name: '', position: '', level: '1', photo: null }]);
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
            {(data || []).map((item, index) => (
                <div key={index} className="flex gap-4 p-4 border rounded-lg bg-slate-50 dark:bg-neutral-900/50 items-start">
                    <div className="pt-2 cursor-grab text-slate-400">
                        <GripVertical className="h-5 w-5" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nama Lengkap</Label>
                            <Input 
                                value={item.name} 
                                onChange={(e) => handleChange(index, 'name', e.target.value)}
                                placeholder="Dr. H. Nama Lengkap, M.Kom"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Jabatan</Label>
                            <Input 
                                value={item.position} 
                                onChange={(e) => handleChange(index, 'position', e.target.value)}
                                placeholder="Ketua LPDSA"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Level (Urutan/Hirarki)</Label>
                            <Input 
                                type="number"
                                value={item.level} 
                                onChange={(e) => handleChange(index, 'level', e.target.value)}
                                placeholder="1"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Foto Profil</Label>
                            <Input 
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleChange(index, 'photo', e.target.files?.[0] || null)}
                                className="text-xs file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-univrab-blue/10 file:text-univrab-blue"
                            />
                            {typeof item.photo === 'string' && (
                                <p className="text-[10px] text-muted-foreground truncate">Saat ini: {item.photo}</p>
                            )}
                        </div>
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 mt-6" onClick={() => handleRemove(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}

            <Button type="button" variant="outline" onClick={handleAdd} className="w-full border-dashed">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Anggota
            </Button>
        </div>
    );
}
