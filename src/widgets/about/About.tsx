"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ParticleImage from "./ParticleImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

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
                className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tabular-nums leading-none"
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
 *  SPOILER CARD                                               *
 * ─────────────────────────────────────────────────────────── */
function SpoilerCard({ emoji, text, revealText }: { emoji: string; text: string; revealText: string }) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 8x3 grid for scatter blocks to make it look fragmented
    const cols = 8;
    const rows = 3;
    const blocks = Array.from({ length: cols * rows });

    return (
        <div
            className="vcard group flex items-center gap-5 px-6 py-5 rounded-2xl bg-gray-50/50 dark:bg-white/[0.025] border border-gray-200 dark:border-white/[0.06] overflow-hidden hover:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/[0.05] transition-all duration-500 shadow-sm hover:shadow-md cursor-pointer md:cursor-default relative"
            onMouseEnter={() => mounted && setIsRevealed(true)}
            onClick={() => mounted && setIsRevealed(true)}
        >
            <span className="text-2xl shrink-0 text-gray-900 dark:text-white relative z-10 group-hover:scale-110 transition-transform duration-300">
                {emoji}
            </span>

            <div className="relative flex-1 min-h-[3rem] flex items-center">

                {/* Real text underneath */}
                <motion.p
                    initial={false}
                    animate={{
                        opacity: isRevealed ? 1 : 0,
                        filter: isRevealed ? 'blur(0px)' : 'blur(8px)',
                        scale: isRevealed ? 1 : 0.95
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-sm lg:text-base text-gray-600 dark:text-gray-200 font-light leading-snug w-full relative z-0"
                >
                    {text}
                </motion.p>

                {/* Cover that scatters */}
                <div
                    className="absolute inset-x-0 inset-y-[-4px] z-10 flex items-center justify-center pointer-events-none"
                >
                    {/* The scatter blocks wrapper */}
                    <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, gap: '2px' }}>
                        {blocks.map((_, i) => {
                            // deterministic pseudo-random logic to completely avoid SSR Hydration Mismatch
                            const pseudoRandom1 = (Math.sin(i * 12.9898) * 43758.5453) % 1;
                            const pseudoRandom2 = (Math.cos(i * 78.233) * 43758.5453) % 1;
                            const pseudoRandom3 = (Math.sin(i * 45.123) * 43758.5453) % 1;

                            return (
                                <motion.div
                                    key={i}
                                    initial={false}
                                    animate={isRevealed ? {
                                        opacity: 0,
                                        x: pseudoRandom1 * 200,
                                        y: pseudoRandom2 * 200,
                                        scale: 0,
                                        rotate: pseudoRandom3 * 260
                                    } : {
                                        opacity: 1,
                                        x: 0, y: 0, scale: 1, rotate: 0
                                    }}
                                    transition={{ duration: 0.6, ease: "easeOut", delay: Math.abs(pseudoRandom1) * 0.1 }}
                                    className="bg-gray-300/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-[2px] border border-white/20 dark:border-white/5"
                                />
                            );
                        })}
                    </div>

                    {/* The "Reveal" button for mobile */}
                    <motion.button
                        initial={false}
                        animate={isRevealed ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="pointer-events-auto relative z-20 px-4 py-1.5 bg-blue-500/90 backdrop-blur-md text-white border border-blue-400/50 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-lg shadow-lg md:hidden"
                    >
                        {revealText}
                    </motion.button>
                </div>
            </div>

            <span className={`ml-auto shrink-0 transition-all duration-300 relative z-10 ${isRevealed ? 'text-blue-500 translate-x-1' : 'text-gray-300 dark:text-white/10 group-hover:text-blue-500'}`}>
                →
            </span>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────── *
 *  MAIN COMPONENT                                             *
 * ─────────────────────────────────────────────────────────── */
export function About() {
    const t = useTranslations("about");
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

    const badges = [t("badge_0"), t("badge_1"), t("badge_2")];
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
                className="relative bg-background py-24 lg:py-36 overflow-hidden md:no-alt-bg"
            >
                {/* ── full-page dark grid texture ─────────────── */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.025] light:opacity-[0.05]"
                    style={{
                        backgroundImage:
                            "linear-gradient(currentColor 1px,transparent 1px),linear-gradient(90deg,currentColor 1px,transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />

                {/* ── giant faint title watermark ─────────────── */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden"
                >
                    <span
                        className="text-[22vw] font-black tracking-[-0.08em] text-black/[0.015] dark:text-white/[0.018] uppercase leading-none"
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

                                <div className="about-img-wrap relative aspect-[3/4] w-full rounded-[2.5rem] overflow-hidden border border-black/5 dark:border-white/8 shadow-[0_50px_130px_rgba(0,0,0,0.15)] dark:shadow-[0_50px_130px_rgba(0,0,0,0.75)] bg-black/5 dark:bg-black/20">
                                    <ParticleImage
                                        src="/me.jpg"
                                        alt="Roman Noris"
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
                                <div className="info-panel absolute -right-6 lg:-right-16 bottom-16 lg:bottom-24 z-20 backdrop-blur-md bg-white/40 dark:bg-black/40 border border-black/5 dark:border-white/10 p-4 lg:p-5 rounded-2xl shadow-card dark:shadow-[0_10px_40px_rgba(0,0,20,0.5)] max-w-[180px] lg:max-w-[220px]">
                                    <div className="flex items-center gap-3 mb-2.5">
                                        <div className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                                        </div>
                                        <span className="text-[10px] font-mono text-blue-500 dark:text-blue-400 uppercase tracking-[0.2em]">{t("status_label")}</span>
                                    </div>
                                    <p className="text-xs lg:text-sm text-gray-700 dark:text-gray-200 font-medium leading-relaxed">
                                        {t.rich("status_text", {
                                            b: (chunks) => <b className="text-gray-900 dark:text-white font-bold">{chunks}</b>
                                        })}
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
                                    className="font-black uppercase leading-[0.82] tracking-[-0.04em] text-gray-900 dark:text-white"
                                    style={{ fontSize: "clamp(3rem,8vw,8rem)" }}
                                >
                                    {t("title_1")}
                                    <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-cyan-300 dark:to-blue-500">
                                        {t("title_2")}
                                    </span>
                                </h2>
                            </header>

                            {/* ── TYPEWRITER BIO ─────────────── */}
                            <div className="rv-item p-6 lg:p-8 rounded-2xl bg-gray-50/50 dark:bg-white/[0.015] border border-gray-200 dark:border-white/[0.06] font-mono">
                                <p className="text-[10px] text-green-600 dark:text-green-400/60 tracking-[0.35em] uppercase mb-3">
                                    $ bio --load
                                </p>
                                <p className="text-base lg:text-lg text-gray-700 dark:text-gray-200 leading-relaxed cursor-blink min-h-[3rem]">
                                    {typedBio}
                                </p>
                            </div>

                            {/* ── VALUE CARDS ────────────────── */}
                            <div className="vcard-grid grid grid-cols-1 gap-3">
                                {values.map((v, i) => (
                                    <SpoilerCard
                                        key={i}
                                        emoji={v.emoji}
                                        text={t(v.key)}
                                        revealText={t("reveal")}
                                    />
                                ))}
                            </div>

                            {/* ── SUBLINE ────────────────────── */}
                            <p className="rv-item text-sm text-gray-500 font-mono leading-relaxed max-w-lg">
                                {t("p2")}
                            </p>

                            {/* ── STACK BADGES ───────────────── */}
                            <div className="badge-row rv-item flex flex-wrap gap-2.5">
                                {badges.map((b) => (
                                    <span
                                        key={b}
                                        className="badge-chip px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.25em] uppercase text-blue-600/70 dark:text-blue-400/60 bg-blue-500/5 border border-blue-500/10 hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-white/90 transition-all duration-300 cursor-default"
                                    >
                                        {b}
                                    </span>
                                ))}
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
