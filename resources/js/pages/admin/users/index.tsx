import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import DeleteUserDialog from '@/components/delete-user-dialog';
import { Edit, Plus, Search, X } from 'lucide-react';
import React from 'react';

export default function Index({ users }: any) {
    const { auth } = usePage<any>().props;
    const [editingUser, setEditingUser] = React.useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'admin' as 'admin' | 'super_admin',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            put(`/admin/users/${editingUser.id}`, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setEditingUser(null);
                    reset();
                },
            });
        } else {
            post('/admin/users', {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const openEditDialog = (user: any) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
        });
        setIsDialogOpen(true);
    };

    const filteredUsers = users.filter((user: any) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Head title="Manajemen Pengguna" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Pengguna & Admin</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Kelola data pengguna, hak akses administrator, dan kata sandi.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama, email, role..."
                            className="pl-9 w-full sm:w-[250px]"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) {
                            setEditingUser(null);
                            reset();
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-univrab-blue shrink-0">
                                <Plus className="mr-2 h-4 w-4" /> Tambah Pengguna
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Nama lengkap..."
                                    />
                                    {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="email@univrab.ac.id"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Role</Label>
                                        <Select 
                                            value={data.role} 
                                            onValueChange={(val: any) => setData('role', val)}
                                            disabled={editingUser?.id === auth.user.id}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="super_admin">Super Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {editingUser?.id === auth.user.id && (
                                            <p className="text-amber-600 dark:text-amber-400 text-[10px] mt-1 leading-tight">
                                                Anda tidak dapat mengubah role Anda sendiri untuk mencegah hilangnya akses.
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">{editingUser ? 'Password Baru (Opsional)' : 'Password'}</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                        />
                                        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={processing} className="bg-univrab-blue">
                                        {editingUser ? 'Perbarui' : 'Simpan'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow dark:bg-neutral-900 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Terdaftar Pada</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <Search className="h-8 w-8 opacity-40 animate-pulse" />
                                        <p className="text-sm">Tidak ada pengguna ditemukan</p>
                                        {searchQuery && (
                                            <Button variant="link" size="sm" onClick={() => setSearchQuery('')}>
                                                Reset pencarian untuk melihat semua
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user: any) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant={user.role === 'super_admin' ? 'default' : 'secondary'}
                                            className={user.role === 'super_admin' ? 'bg-univrab-blue hover:bg-univrab-blue/90' : ''}
                                        >
                                            {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(user.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <DeleteUserDialog 
                                                user={user} 
                                                disabled={user.id === auth.user.id} 
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Manajemen Pengguna', href: '/admin/users' },
    ],
};
