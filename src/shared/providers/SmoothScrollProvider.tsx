"use client";

import { ReactLenis } from '@studio-freight/react-lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<any>(null);
    const pathname = usePathname();

    const isExcludedRoute = pathname.includes('/projects') || pathname.includes('/profile');

    useEffect(() => {
        function update(time: number) {
            lenisRef.current?.lenis?.raf(time * 1000);
        }

        gsap.ticker.add(update);

        return () => {
            gsap.ticker.remove(update);
        };
    }, []);

    const prevPathname = useRef(pathname);

    // Force scroll reset and layout refresh on real route changes
    useEffect(() => {
        if (prevPathname.current !== pathname) {
            if (lenisRef.current?.lenis) {
                // Instantly jump to top for Lenis
                lenisRef.current.lenis.scrollTo(0, { immediate: true });
            } else {
                // Native scroll reset
                window.scrollTo(0, 0);
            }
            prevPathname.current = pathname;
        }

        // Allow DOM to settle, then refresh ScrollTrigger measurements
        const timer = setTimeout(() => {
            requestAnimationFrame(() => {
                ScrollTrigger.refresh();
            });
        }, 100);
        return () => clearTimeout(timer);

    }, [pathname]);

    if (isExcludedRoute) {
        return <>{children}</>;
    }

    return (
        <ReactLenis root ref={lenisRef} autoRaf={false} options={{ lerp: 0.08, smoothWheel: true }}>
            {children as any}
        </ReactLenis>
    );
}
