import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2, AlertTriangle } from 'lucide-react';

type DeleteUserDialogProps = {
    user: {
        id: number;
        name: string;
        email: string;
    };
    disabled?: boolean;
};

export default function DeleteUserDialog({ user, disabled }: DeleteUserDialogProps) {
    const [open, setOpen] = useState(false);
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(`/admin/users/${user.id}`, {
            onSuccess: () => {
                setOpen(false);
                toast.success('Pengguna berhasil dihapus');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    disabled={disabled}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Hapus Pengguna
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className="space-y-3">
                            <p>
                                Apakah Anda yakin ingin menghapus pengguna{' '}
                                <span className="font-semibold text-foreground">&quot;{user.name}&quot;</span> ({user.email})?
                                Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800/30 dark:bg-red-950/20">
                                <div className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400">
                                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                                    <span>Seluruh riwayat, data aktivitas, dan akses pengguna ini ke sistem akan dihapus secara permanen.</span>
                                </div>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary" disabled={processing}>
                            Batal
                        </Button>
                    </DialogClose>
                    <Button variant="destructive" disabled={processing} onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        {processing ? 'Menghapus...' : 'Hapus Pengguna'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
