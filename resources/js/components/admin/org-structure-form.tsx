import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, GripVertical, Upload, X, User } from 'lucide-react';
import { useState, useRef } from 'react';

export default function OrgStructureForm({ data, onChange }: { data: any[], onChange: (data: any[]) => void }) {
    const [previewImages, setPreviewImages] = useState<{[key: string]: string}>({});
    const fileInputRefs = useRef<{[key: string]: HTMLInputElement | null}>({});
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

    const handlePhotoChange = (index: number, file: File | null) => {
        const key = `photo-${index}`;
        
        if (file) {
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImages(prev => ({ ...prev, [key]: e.target?.result as string }));
            };
            reader.readAsDataURL(file);
            
            // Update data
            handleChange(index, 'photo', file);
        } else {
            // Clear preview and data
            setPreviewImages(prev => {
                const newPreviews = { ...prev };
                delete newPreviews[key];
                return newPreviews;
            });
            handleChange(index, 'photo', null);
        }
    };

    const handleRemovePhoto = (index: number) => {
        handlePhotoChange(index, null);
        // Clear file input
        const fileInput = fileInputRefs.current[`photo-${index}`];
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const getPhotoDisplay = (item: any, index: number) => {
        const key = `photo-${index}`;
        
        // Show preview if exists
        if (previewImages[key]) {
            return previewImages[key];
        }
        
        // Show existing photo if string
        if (typeof item.photo === 'string' && item.photo) {
            return `/storage/${item.photo}`;
        }
        
        return null;
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
                            <Card className="border-dashed border-2 hover:border-univrab-blue/50 transition-colors">
                                <CardContent className="p-4">
                                    {/* Photo Preview Area */}
                                    <div className="relative group">
                                        {getPhotoDisplay(item, index) ? (
                                            <div className="relative">
                                                <img 
                                                    src={getPhotoDisplay(item, index) || ''} 
                                                    alt={`Preview ${item.name || 'Photo'}`}
                                                    className="h-32 w-32 mx-auto rounded-full object-cover border-4 border-univrab-blue/10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemovePhoto(index)}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="h-32 w-32 mx-auto rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                                                 onClick={() => fileInputRefs.current[`photo-${index}`]?.click()}>
                                                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                                <span className="text-xs text-gray-500 text-center">Upload Foto</span>
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
                                            className="text-xs"
                                        >
                                            <Upload className="h-3 w-3 mr-1" />
                                            {getPhotoDisplay(item, index) ? 'Ganti Foto' : 'Pilih Foto'}
                                        </Button>
                                    </div>
                                    
                                    {/* File Info */}
                                    {typeof item.photo === 'string' && item.photo && (
                                        <p className="text-[10px] text-muted-foreground text-center mt-2">
                                            <span className="inline-block max-w-full truncate">
                                                📁 {item.photo}
                                            </span>
                                        </p>
                                    )}
                                    
                                    {/* Requirements */}
                                    <div className="text-[10px] text-muted-foreground text-center mt-2">
                                        <p>Format: JPG, PNG, WebP</p>
                                        <p>Maks: 2MB, Rasio 1:1</p>
                                    </div>
                                </CardContent>
                            </Card>
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
