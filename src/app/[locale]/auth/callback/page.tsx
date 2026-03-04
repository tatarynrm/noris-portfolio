'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

function CallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            Cookies.set('token', token, { expires: 1 });
            router.push('/');
        } else {
            router.push('/auth/login');
        }
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black/90">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-white/70 font-medium tracking-widest text-sm uppercase animate-pulse">Authenticating...</div>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-black/90">
                <div className="text-white/70 font-medium tracking-widest text-sm uppercase animate-pulse">Loading...</div>
            </div>
        }>
            <CallbackHandler />
        </Suspense>
    );
}
