// Registration is disabled in this system
import { Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { login } from '@/routes';

export default function Register() {
    return (
        <>
            <Head title="Registration Disabled" />
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                <h1 className="text-2xl font-bold">Registration Disabled</h1>
                <p className="text-muted-foreground">
                    New user registration is currently disabled for this system.
                </p>
                <TextLink href={login()}>
                    Go to login page
                </TextLink>
            </div>
        </>
    );
}

Register.layout = {
    title: 'Registration Disabled',
    description: 'Registration is disabled',
};
