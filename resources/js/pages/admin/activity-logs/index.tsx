import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Clock } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function Index({ logs, filters }: any) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        get('/admin/activity-logs');
    };

    return (
        <>
            <Head title="Log Aktivitas" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold">Log Aktivitas</h1>
                <p className="text-slate-500">Pantau aktivitas pengguna di dalam sistem.</p>
            </div>

            <div className="bg-white rounded-lg shadow dark:bg-neutral-900 overflow-hidden">
                <div className="p-4 border-b dark:border-neutral-800">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Cari aktivitas atau nama..."
                                className="pl-10"
                                value={data.search}
                                onChange={e => setData('search', e.target.value)}
                            />
                        </div>
                        <Button type="submit" variant="secondary">Filter</Button>
                    </form>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Waktu</TableHead>
                            <TableHead>Pengguna</TableHead>
                            <TableHead>Aktivitas</TableHead>
                            <TableHead>Target</TableHead>
                            <TableHead>Alamat IP</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.data.map((log: any) => (
                            <TableRow key={log.id}>
                                <TableCell className="whitespace-nowrap text-xs text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(log.created_at).toLocaleString('id-ID')}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-univrab-blue">{log.user?.name || 'System'}</TableCell>
                                <TableCell>{log.activity}</TableCell>
                                <TableCell className="text-xs text-slate-400">
                                    {log.target_type && `${log.target_type} #${log.target_id}`}
                                </TableCell>
                                <TableCell className="text-xs"><code>{log.ip_address}</code></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {logs.links.length > 3 && (
                    <div className="p-4 border-t dark:border-neutral-800 flex justify-center gap-2">
                        {logs.links.map((link: any, i: number) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1 text-xs rounded border ${link.active ? 'bg-univrab-blue text-white border-univrab-blue' : 'bg-white text-slate-600 border-slate-200'}`}
                            />
                        ))}
                    </div>
                )}
                
                {logs.data.length === 0 && (
                    <div className="py-20 text-center text-slate-500">Belum ada catatan aktivitas.</div>
                )}
            </div>
        </>
    );
}
