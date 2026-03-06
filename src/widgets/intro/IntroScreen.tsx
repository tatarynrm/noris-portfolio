"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useTranslations } from "next-intl";

/* ─────────────────────────────────────────────────────────── *
 *  LoadingScreen                                              *
 *  Shows once per session.                                    *
 *  A centered wide vertical bar fills bottom-to-top          *
 *  with the same gradient as the scroll progress indicator.  *
 *  When full → section reveals with a cinematic wipe-out.    *
 * ─────────────────────────────────────────────────────────── */
export function IntroScreen() {
    const t = useTranslations("intro");
    const [visible, setVisible] = useState(false);

    const overlayRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);   // outer track (gray)
    const fillRef = useRef<HTMLDivElement>(null);   // colored fill
    const glowRef = useRef<HTMLDivElement>(null);   // glow tip
    const percentRef = useRef<HTMLSpanElement>(null);  // counter
    const logoRef = useRef<HTMLDivElement>(null);   // top logo text

    /* ── show for first 3 page loads ────────────────────── */
    useEffect(() => {
        const key = "loader_visit_count";
        const count = parseInt(localStorage.getItem(key) ?? "0", 10);
        if (count < 3) {
            localStorage.setItem(key, String(count + 1));
            setVisible(true);
        }
    }, []);

    /* ── run the loading animation ───────────────────────── */
    useEffect(() => {
        if (!visible) return;

        const tl = gsap.timeline({
            onComplete: () => {
                // Cinematic exit: wipe upward
                gsap.to(overlayRef.current, {
                    yPercent: -100,
                    duration: 0.9,
                    ease: "expo.inOut",
                    delay: 0.15,
                    onComplete: () => setVisible(false),
                });
            },
        });

        // Fade overlay in
        tl.from(overlayRef.current, { opacity: 0, duration: 0.4, ease: "power2.out" }, 0);

        // Logo reveal
        tl.from(logoRef.current, {
            opacity: 0,
            y: -20,
            filter: "blur(8px)",
            duration: 0.8,
            ease: "expo.out",
        }, 0.2);

        // Animate the fill from 0 → 100% height (scaleY from bottom)
        // Track height is 100% of its container, fill starts at scaleY 0
        tl.fromTo(
            fillRef.current,
            { scaleY: 0 },
            {
                scaleY: 1,
                duration: 2.2,
                ease: "power1.inOut",
                onUpdate() {
                    const p = Math.round(gsap.getProperty(fillRef.current!, "scaleY") as number * 100);
                    if (percentRef.current) percentRef.current.textContent = `${p}%`;
                    // Move glow tip to the top of the fill
                    if (glowRef.current && trackRef.current && fillRef.current) {
                        const trackH = trackRef.current.getBoundingClientRect().height;
                        const pct = gsap.getProperty(fillRef.current, "scaleY") as number;
                        glowRef.current.style.bottom = `${pct * trackH}px`;
                    }
                },
            },
            0.5
        );

        // Hold 100% briefly
        tl.to({}, { duration: 0.3 });

    }, [visible]);

    if (!visible) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[9999] bg-background dark:bg-[#020208] flex flex-col items-center justify-between py-16 overflow-hidden transition-colors duration-700"
        >
            {/*── Subtle dot-grid texture ─────────────────────*/}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.03] light:opacity-[0.05]"
                style={{
                    backgroundImage:
                        "linear-gradient(currentColor 1px,transparent 1px),linear-gradient(90deg,currentColor 1px,transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            {/*── Ambient center glow ──────────────────────────*/}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
                <div className="w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-blue-600/10 blur-[140px] rounded-full" />
            </div>

            {/*── TOP: Logo / name ─────────────────────────────*/}
            <div ref={logoRef} className="relative z-10 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.9)] animate-pulse" />
                    <span className="text-[10px] font-mono tracking-[0.5em] text-blue-400/70 uppercase">
                        roman.noris / portfolio
                    </span>
                </div>
                <p className="text-gray-400 dark:text-white/10 text-[10px] font-mono tracking-widest uppercase">
                    {t("initializing")}
                </p>
            </div>

            {/*── CENTER: Wide vertical loading bar ────────────*/}
            <div className="relative z-10 flex flex-col items-center gap-6 flex-1 justify-center w-full max-w-xs px-8">

                {/* Percentage counter */}
                <div className="flex items-baseline gap-1">
                    <span
                        ref={percentRef}
                        className="text-5xl font-black tabular-nums text-gray-900 dark:text-white leading-none"
                        style={{ textShadow: "0 0 30px rgba(59,130,246,0.3)" }}
                    >
                        0%
                    </span>
                </div>

                {/* Track */}
                <div
                    ref={trackRef}
                    className="relative w-12 sm:w-16 rounded-full bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.06] overflow-hidden"
                    style={{ height: "44vh" }}
                >
                    {/* Fill — grows from bottom upward */}
                    <div
                        ref={fillRef}
                        className="absolute bottom-0 left-0 right-0 rounded-full origin-bottom"
                        style={{
                            height: "100%",
                            transform: "scaleY(0)",
                            background: "linear-gradient(to top,#2563eb,#22d3ee,#3b82f6)",
                            boxShadow: "0 0 24px rgba(37,99,235,0.5), inset 0 0 20px rgba(34,211,238,0.15)",
                        }}
                    />

                    {/* Shimmer sweep inside fill */}
                    <div
                        aria-hidden
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: "linear-gradient(to bottom,rgba(255,255,255,0.08) 0%,transparent 60%)",
                        }}
                    />
                </div>

                {/* Glow tip — moves with the fill top edge */}
                <div
                    ref={glowRef}
                    className="absolute left-1/2 -translate-x-1/2 w-20 h-3 rounded-full pointer-events-none"
                    style={{
                        bottom: 0,
                        background: "radial-gradient(ellipse at center,rgba(34,211,238,0.7) 0%,transparent 70%)",
                        filter: "blur(6px)",
                        transition: "none",
                    }}
                />
            </div>

            {/*── BOTTOM: Tagline ──────────────────────────────*/}
            <div className="relative z-10 flex flex-col items-center gap-1">
                <p className="text-xs font-mono text-gray-600 tracking-[0.3em] uppercase">
                    {t("tagline")}
                </p>
            </div>
        </div>
    );
}
