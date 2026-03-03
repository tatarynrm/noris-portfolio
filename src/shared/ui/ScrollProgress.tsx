"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import { usePathname } from "next/navigation";

export function ScrollProgress() {
    const pathname = usePathname();
    const progressRef = useRef<HTMLDivElement>(null);
    const [percent, setPercent] = useState(0);

    // Only show on the main landing page
    const isHomePage = pathname === "/en" || pathname === "/uk" || pathname === "/pl" || pathname === "/fr" || pathname === "/de" || pathname === "/";

    useEffect(() => {
        if (!isHomePage) return;

        // Progress Bar Width & Percent Tracking
        const st = ScrollTrigger.create({
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: true, // Immediate bidirectional sync
            onUpdate: (self) => {
                const p = Math.round(self.progress * 100);
                setPercent(p);
                if (progressRef.current) {
                    gsap.set(progressRef.current, { scaleX: self.progress });
                }
            }
        });

        return () => st.kill();
    }, [isHomePage]);

    if (!isHomePage) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-1.5 z-[10000] pointer-events-none flex items-center">
            {/* Background Track */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md" />

            {/* Progress Fill */}
            <div
                ref={progressRef}
                className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 origin-left scale-x-0 h-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"
            >
                {/* Neon Percentage Tip */}
                <div className="absolute right-0 top-4 -translate-y-0 px-3 py-1 bg-black/80 border border-blue-500/50 rounded-full backdrop-blur-xl flex items-center justify-center min-w-[3rem]">
                    <span className="text-[10px] font-black tracking-tighter text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)] tabular-nums">
                        {percent}%
                    </span>
                    {/* Tiny Glow Dot */}
                    <div className="absolute -top-4 right-0 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa]" />
                </div>
            </div>
        </div>
    );
}
