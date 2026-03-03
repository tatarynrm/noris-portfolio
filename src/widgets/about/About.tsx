"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────── *
 *  RADAR RING component                                       *
 * ─────────────────────────────────────────────────────────── */
function RadarRing() {
    return (
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
            {/* outer sweeping ring */}
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="absolute rounded-full border border-blue-500/20"
                    style={{
                        inset: `-${i * 18}px`,
                        animation: `pulse-ring ${2 + i * 0.5}s ease-out infinite`,
                        animationDelay: `${i * 0.4}s`,
                    }}
                />
            ))}
            {/* rotating sweep line */}
            <div
                className="absolute inset-0 rounded-full overflow-hidden"
                style={{ inset: "-56px" }}
            >
                <div
                    className="absolute top-1/2 left-1/2 w-[50%] h-[1px] origin-left"
                    style={{
                        background: "linear-gradient(to right, transparent, rgba(59,130,246,0.6))",
                        animation: "radar-sweep 3s linear infinite",
                    }}
                />
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────── *
 *  TYPEWRITER hook                                            *
 * ─────────────────────────────────────────────────────────── */
function useTypewriter(text: string, speed = 28, startDelay = 400) {
    const [displayed, setDisplayed] = useState("");
    useEffect(() => {
        setDisplayed("");
        let i = 0;
        const timer = setTimeout(() => {
            const id = setInterval(() => {
                i++;
                setDisplayed(text.slice(0, i));
                if (i >= text.length) clearInterval(id);
            }, speed);
            return () => clearInterval(id);
        }, startDelay);
        return () => clearTimeout(timer);
    }, [text, speed, startDelay]);
    return displayed;
}

/* ─────────────────────────────────────────────────────────── *
 *  STAT COUNTER                                               *
 * ─────────────────────────────────────────────────────────── */
function Stat({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let current = 0;
        const step = value / 60;
        const id = setInterval(() => {
            current = Math.min(current + step, value);
            el.textContent = Math.round(current) + suffix;
            if (current >= value) clearInterval(id);
        }, 16);
        return () => clearInterval(id);
    }, [value, suffix]);

    return (
        <div className="flex flex-col items-center text-center">
            <span
                ref={ref}
                className="text-4xl lg:text-5xl font-black text-white tabular-nums leading-none"
            >
                {value}{suffix}
            </span>
            <span className="mt-2 text-[10px] font-mono tracking-[0.3em] text-gray-500 uppercase">
                {label}
            </span>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────── *
 *  MAIN COMPONENT                                             *
 * ─────────────────────────────────────────────────────────── */
export function About() {
    const t = useTranslations("About");
    const sectionRef = useRef<HTMLDivElement>(null);
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);

    const bio = t("p1");
    const typedBio = useTypewriter(bio, 22, 800);

    useEffect(() => {
        let mm = gsap.matchMedia();

        const ctx = gsap.context(() => {
            mm.add("(max-width: 767px)", () => {
                // MOBILE ANIMATIONS - Optimized
                gsap.from(".rv-item", {
                    opacity: 0,
                    y: 20,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: { trigger: rightRef.current, start: "top 85%", once: true },
                });

                gsap.from(leftRef.current, {
                    opacity: 0,
                    y: 30,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: { trigger: leftRef.current, start: "top 90%", once: true },
                });

                gsap.from(".about-img-wrap", {
                    opacity: 0,
                    scale: 0.95,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: { trigger: leftRef.current, start: "top 90%", once: true },
                });

                gsap.from(".info-panel", {
                    opacity: 0,
                    y: 10,
                    duration: 1,
                    delay: 0.2,
                    ease: "power2.out",
                    scrollTrigger: { trigger: leftRef.current, start: "top 85%", once: true },
                });

                gsap.from(".vcard", {
                    opacity: 0,
                    x: 20,
                    stagger: 0.1,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: { trigger: ".vcard-grid", start: "top 90%", once: true },
                });

                gsap.from(".badge-chip", {
                    opacity: 0,
                    scale: 0.8,
                    stagger: 0.05,
                    duration: 0.4,
                    ease: "power2.out",
                    scrollTrigger: { trigger: ".badge-row", start: "top 95%", once: true },
                });
            });

            mm.add("(min-width: 768px)", () => {
                // DESKTOP ANIMATIONS - Premium
                gsap.from(".rv-item", {
                    opacity: 0,
                    y: 44,
                    filter: "blur(12px)",
                    stagger: 0.15,
                    duration: 1.1,
                    ease: "power3.out",
                    scrollTrigger: { trigger: rightRef.current, start: "top 80%", once: true },
                });

                gsap.from(leftRef.current, {
                    opacity: 0,
                    y: 60,
                    duration: 1.4,
                    ease: "expo.out",
                    scrollTrigger: { trigger: leftRef.current, start: "top 85%", once: true },
                });

                gsap.from(".about-img-wrap", {
                    scale: 0.92,
                    rotationX: 8,
                    rotationY: -15,
                    filter: "grayscale(1) brightness(0.5) contrast(1.3)",
                    duration: 2,
                    ease: "power3.out",
                    scrollTrigger: { trigger: leftRef.current, start: "top 85%", once: true },
                });

                gsap.from(".info-panel", {
                    x: -60,
                    y: 20,
                    opacity: 0,
                    rotate: -5,
                    duration: 1.4,
                    delay: 0.6,
                    ease: "back.out(1.5)",
                    scrollTrigger: { trigger: leftRef.current, start: "top 80%", once: true },
                });

                gsap.from(".vcard", {
                    opacity: 0,
                    x: 60,
                    filter: "blur(8px)",
                    stagger: 0.12,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: { trigger: ".vcard-grid", start: "top 85%", once: true },
                });

                gsap.from(".badge-chip", {
                    opacity: 0,
                    scale: 0.6,
                    stagger: 0.06,
                    duration: 0.6,
                    ease: "back.out(1.7)",
                    scrollTrigger: { trigger: ".badge-row", start: "top 90%", once: true },
                });
            });
        }, sectionRef);

        return () => {
            ctx.revert();
            mm.revert();
        };
    }, []);

    const values = [
        { emoji: "⚡", key: "m1" as const },
        { emoji: "💎", key: "m2" as const },
        { emoji: "💸", key: "m3" as const },
    ];

    const stack = ["Next.js", "NestJS", "TypeScript", "GSAP", "PostgreSQL", "React", "Tailwind"];

    return (
        <>
            {/* ── keyframes injected via style tag ─────────────── */}
            <style>{`
                @keyframes radar-sweep {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes pulse-ring {
                    0%   { opacity: 0.6; transform: scale(1); }
                    100% { opacity: 0;   transform: scale(1.12); }
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50%      { opacity: 0; }
                }
                @keyframes scan-line {
                    0%   { top: -10%; }
                    100% { top: 110%; }
                }
                .cursor-blink::after {
                    content: '|';
                    animation: blink 0.85s step-end infinite;
                    color: #60a5fa;
                    margin-left: 2px;
                }
            `}</style>

            <section
                id="about"
                ref={sectionRef}
                className="relative bg-[#020202] py-24 lg:py-36 overflow-hidden"
            >
                {/* ── full-page dark grid texture ─────────────── */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />

                {/* ── giant faint title watermark ─────────────── */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden"
                >
                    <span
                        className="text-[22vw] font-black tracking-[-0.08em] text-white/[0.018] uppercase leading-none"
                    >
                        NORIS
                    </span>
                </div>

                {/* ── ambient glows ───────────────────────────── */}
                <div aria-hidden className="pointer-events-none absolute inset-0">
                    <div className="absolute top-[15%] left-[8%] w-[35vw] h-[35vw] max-w-[550px] max-h-[550px] bg-blue-700/10 blur-[130px] rounded-full" />
                    <div className="absolute bottom-[10%] right-[5%] w-[28vw] h-[28vw] max-w-[440px] max-h-[440px] bg-indigo-700/10 blur-[110px] rounded-full" />
                </div>

                <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-14">

                    {/* ══════════════════════════════════════════ *
                     *  TOP LABEL                                 *
                     * ══════════════════════════════════════════ */}
                    <div className="rv-item flex items-center gap-4 mb-16 lg:mb-20">
                        <div className="w-7 h-[1.5px] bg-blue-500/60" />
                        <p className="text-[10px] font-mono tracking-[0.5em] text-blue-400/60 uppercase">
                            / about.system / identity_confirmed /
                        </p>
                    </div>

                    {/* ══════════════════════════════════════════ *
                     *  MAIN GRID                                 *
                     * ══════════════════════════════════════════ */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-16 lg:gap-24 items-start">

                        {/* ── LEFT — PORTRAIT ──────────────────── */}
                        <div ref={leftRef} className="flex flex-col items-center lg:items-start gap-10">

                            {/* photo frame with radar */}
                            <div className="relative w-full max-w-[320px] mx-auto lg:mx-0 perspective-[1000px]">
                                <RadarRing />

                                <div className="about-img-wrap relative aspect-[3/4] w-full rounded-[2.5rem] overflow-hidden border border-white/8 shadow-[0_50px_130px_rgba(0,0,0,0.75)]">
                                    <Image
                                        src="/me.jpg"
                                        alt="Roman Noris"
                                        fill
                                        className="object-cover"
                                        priority
                                    />

                                    {/* moving scanline */}
                                    <div
                                        aria-hidden
                                        className="pointer-events-none absolute left-0 w-full h-[40%]"
                                        style={{
                                            background:
                                                "linear-gradient(to bottom,transparent,rgba(59,130,246,0.06) 50%,transparent)",
                                            animation: "scan-line 4s linear infinite",
                                        }}
                                    />

                                    {/* vignette */}
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                                    {/* HUD corner brackets */}
                                    {[
                                        "top-4 left-4 border-t-2 border-l-2 rounded-tl",
                                        "top-4 right-4 border-t-2 border-r-2 rounded-tr",
                                        "bottom-4 left-4 border-b-2 border-l-2 rounded-bl",
                                        "bottom-4 right-4 border-b-2 border-r-2 rounded-br",
                                    ].map((cls, i) => (
                                        <div key={i} aria-hidden className={`absolute w-7 h-7 border-blue-400/60 pointer-events-none ${cls}`} />
                                    ))}

                                    {/* identity badge */}
                                    <div className="absolute bottom-5 inset-x-5 flex items-end justify-between">
                                        <div>
                                            <p className="text-[8px] font-mono text-blue-400/50 tracking-[0.4em] uppercase">
                                                auth &mdash; granted
                                            </p>
                                            <p className="text-sm font-black text-white tracking-[0.12em] uppercase mt-0.5">
                                                Roman Noris
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" style={{ animation: "blink 1.5s step-end infinite" }} />
                                            <span className="text-[8px] font-mono text-green-400/70 tracking-widest">LIVE</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Sliding Info Panel */}
                                <div className="info-panel absolute -right-6 lg:-right-16 bottom-16 lg:bottom-24 z-20 backdrop-blur-md bg-black/40 border border-white/10 p-4 lg:p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] max-w-[180px] lg:max-w-[220px]">
                                    <div className="flex items-center gap-3 mb-2.5">
                                        <div className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                                        </div>
                                        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em]">Current Status</span>
                                    </div>
                                    <p className="text-xs lg:text-sm text-gray-200 font-medium leading-relaxed">
                                        Crafting <span className="text-white font-bold">hyper-performant</span> web experiences with <span className="text-blue-400">Next.js & GSAP</span>.
                                    </p>
                                </div>
                            </div>

                            {/* ── STATS row ──────────────────── */}
                            <div className="rv-item grid grid-cols-3 gap-6 w-full max-w-[320px] mx-auto lg:mx-0 px-4 py-5 rounded-2xl bg-gray-50 dark:bg-white/[0.025] border border-gray-200 dark:border-white/[0.06] backdrop-blur-sm">
                                <Stat value={4} suffix="+" label="Years" />
                                <Stat value={30} suffix="+" label="Projects" />
                                <Stat value={99} suffix="%" label="Uptime" />
                            </div>
                        </div>

                        {/* ── RIGHT — CONTENT ──────────────────── */}
                        <div ref={rightRef} className="flex flex-col gap-10">

                            {/* ── HEADING ───────────────────── */}
                            <header className="rv-item">
                                <h2
                                    className="font-black uppercase leading-[0.82] tracking-[-0.04em] text-white"
                                    style={{ fontSize: "clamp(3rem,8vw,8rem)" }}
                                >
                                    {t("title_1")}
                                    <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">
                                        {t("title_2")}
                                    </span>
                                </h2>
                            </header>

                            {/* ── TYPEWRITER BIO ─────────────── */}
                            <div className="rv-item p-6 lg:p-8 rounded-2xl bg-gray-50 dark:bg-white/[0.015] border border-gray-200 dark:border-white/[0.06] font-mono">
                                <p className="text-[10px] text-green-400/60 tracking-[0.35em] uppercase mb-3">
                                    $ bio --load
                                </p>
                                <p className="text-base lg:text-lg text-gray-200 leading-relaxed cursor-blink min-h-[3rem]">
                                    {typedBio}
                                </p>
                            </div>

                            {/* ── VALUE CARDS ────────────────── */}
                            <div className="vcard-grid grid grid-cols-1 gap-3">
                                {values.map((v, i) => (
                                    <div
                                        key={i}
                                        className="vcard group flex items-center gap-5 px-6 py-5 rounded-2xl bg-gray-50 dark:bg-white/[0.025] border border-gray-200 dark:border-white/[0.06] hover:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/[0.05] transition-all duration-500 cursor-default"
                                    >
                                        <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            {v.emoji}
                                        </span>
                                        <p className="text-sm lg:text-base text-gray-200 font-light leading-snug">
                                            {t(v.key)}
                                        </p>
                                        <span className="ml-auto text-white/10 group-hover:text-blue-400/50 group-hover:translate-x-1 transition-all duration-300 shrink-0">
                                            →
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* ── SUBLINE ────────────────────── */}
                            <p className="rv-item text-sm text-gray-500 font-mono leading-relaxed max-w-lg">
                                {t("p2")}
                            </p>

                            {/* ── STACK BADGES ───────────────── */}
                            <div className="badge-row rv-item flex flex-wrap gap-2.5">
                                {stack.map((b) => (
                                    <span
                                        key={b}
                                        className="badge-chip px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.25em] uppercase text-gray-600 dark:text-white/60 bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.07] hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-white/90 transition-all duration-300 cursor-default"
                                    >
                                        {b}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
