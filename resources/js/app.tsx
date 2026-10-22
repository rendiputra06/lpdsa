import { createInertiaApp, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import PublicLayout from '@/layouts/public-layout';
import SettingsLayout from '@/layouts/settings/layout';

// Global error interceptor untuk mencegah popup modal HTML error bawaan Inertia (misal Cloudflare / Nginx 413, 502, 504)
router.on('httpException', (event) => {
    const response = (event as any).detail?.response;
    if (response?.status === 413) {
        event.preventDefault();
        toast.error('Ukuran berkas yang diunggah melebihi batas server/Cloudflare (Error 413: Payload Too Large). Silakan kurangi ukuran berkas atau gunakan opsi tautan Google Drive / Cloud.', {
            duration: 8000,
        });
        return;
    }

    if (response?.status === 502 || response?.status === 504) {
        event.preventDefault();
        toast.error(`Koneksi gateway server mengalami gangguan (Error ${response.status}). Silakan coba beberapa saat lagi.`, {
            duration: 6000,
        });
        return;
    }
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
            case name.startsWith('announcements/'):
            case name.startsWith('accreditations/'):
            case name.startsWith('spmi/'):
            case name === 'static-page':
                return PublicLayout;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#8B142C',
        delay: 200,
    },
});

// This will set light / dark mode on load...
initializeTheme();
