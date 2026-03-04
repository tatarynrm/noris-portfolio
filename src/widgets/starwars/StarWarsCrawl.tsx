"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────── */
/*  Sinister Eye Pair — pure CSS, blinks via keyframe         */
/* ─────────────────────────────────────────────────────────── */
interface EyePairProps {
    style?: React.CSSProperties;
    glowColor?: string;
    size?: number;
    blinkDelay?: number;
    blinkSpeed?: number;
}

function EyePair({ style, glowColor = "#f59e0b", size = 1, blinkDelay = 0, blinkSpeed = 3.2 }: EyePairProps) {
    const eyeW = 36 * size;
    const eyeH = 20 * size;
    const pupilW = 6 * size;

    return (
        <div className="eye-pair absolute flex gap-3 opacity-0 pointer-events-none" style={style}>
            {[0, 1].map((e) => (
                <div key={e} className="relative" style={{ width: eyeW, height: eyeH }}>
                    {/* iris glow */}
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background: glowColor,
                            boxShadow: `0 0 ${12 * size}px ${6 * size}px ${glowColor}80, 0 0 ${28 * size}px ${glowColor}40`,
                        }}
                    />
                    {/* vertical slit pupil */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"
                        style={{ width: pupilW, height: eyeH * 0.85 }}
                    />
                    {/* animated eyelid */}
                    <div
                        className="absolute inset-0 rounded-full bg-black origin-top"
                        style={{ animation: `blink-lid ${blinkSpeed}s ${blinkDelay}s ease-in-out infinite` }}
                    />
                </div>
            ))}
            <style>{`
                @keyframes blink-lid {
                    0%,42%  { transform: scaleY(0); }
                    44%     { transform: scaleY(1); }
                    46%     { transform: scaleY(0); }
                    48%,92% { transform: scaleY(0); }
                    94%     { transform: scaleY(1); }
                    96%     { transform: scaleY(0); }
                    100%    { transform: scaleY(0); }
                }
            `}</style>
        </div>
    );
}

/* Eye placement config */
const EYES: EyePairProps[] = [
    { style: { left: "8%", bottom: "18%" }, glowColor: "#f59e0b", size: 1.4, blinkDelay: 0, blinkSpeed: 3.1 },
    { style: { left: "78%", bottom: "22%" }, glowColor: "#ef4444", size: 1.1, blinkDelay: 0.8, blinkSpeed: 4.2 },
    { style: { left: "55%", bottom: "8%" }, glowColor: "#a78bfa", size: 0.9, blinkDelay: 1.5, blinkSpeed: 2.8 },
    { style: { left: "22%", bottom: "5%" }, glowColor: "#f59e0b", size: 1.2, blinkDelay: 2.1, blinkSpeed: 3.7 },
    { style: { left: "88%", bottom: "6%" }, glowColor: "#ef4444", size: 0.8, blinkDelay: 0.4, blinkSpeed: 5.0 },
    { style: { left: "40%", bottom: "30%" }, glowColor: "#fbbf24", size: 0.7, blinkDelay: 1.2, blinkSpeed: 2.5 },
];

/* ─────────────────────────────────────────────────────────── */
/*  Star Wars Crawl                                            */
/* ─────────────────────────────────────────────────────────── */
export function StarWarsCrawl() {
    const t = useTranslations("StarWars");
    const wrapRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const crawlRef = useRef<HTMLDivElement>(null);
    const paraRefs = useRef<HTMLParagraphElement[]>([]);
    const eyesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!crawlRef.current || !wrapRef.current) return;

            /* ── 1. Crawl upward (scrubbed) ── */
            gsap.fromTo(crawlRef.current,
                { y: "10%" },
                {
                    y: "-105%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: wrapRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1,
                        invalidateOnRefresh: true,
                    },
                }
            );

            /* ── 2. Gray → white paragraphs ── */
            paraRefs.current.forEach((para) => {
                if (!para) return;
                gsap.fromTo(para,
                    { color: "rgba(150,150,150,0.5)" },
                    {
                        color: "rgba(255,255,255,1)",
                        ease: "power1.out",
                        scrollTrigger: {
                            trigger: wrapRef.current,
                            start: "top 70%",
                            end: "bottom 30%",
                            scrub: 1.2,
                        },
                    }
                );
            });

            /* ── 3. Section fade in ── */
            gsap.from(stageRef.current, {
                opacity: 0,
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: wrapRef.current,
                    start: "top 80%",
                    once: true,
                },
            });

            /* ── 4. Sinister eyes emerge from darkness — appear once, stay ── */
            const eyeEls = eyesRef.current?.querySelectorAll(".eye-pair");
            const isMobile = window.innerWidth < 768; // simple check during mount

            if (eyeEls?.length) {
                gsap.fromTo(
                    Array.from(eyeEls),
                    { opacity: 0, scale: 0.5, filter: isMobile ? "blur(0px)" : "blur(10px)" },
                    {
                        opacity: 1,
                        scale: 1,
                        filter: "blur(0px)",
                        stagger: 0.3,
                        duration: 1.4,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: wrapRef.current,
                            start: "60% bottom",
                            toggleActions: "play none none none",
                            once: true,
                        },
                    }
                );
            }
            /* ── Starfield parallax ── */
            gsap.to(".stars-bg", {
                y: "15%",
                ease: "none",
                scrollTrigger: {
                    trigger: wrapRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
            gsap.to(".stars-fg", {
                y: "40%",
                ease: "none",
                scrollTrigger: {
                    trigger: wrapRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }, wrapRef);

        return () => ctx.revert();
    }, []);

    const paragraphs = [
        t("p1"),
        t("p2"),
        t("p3"),
        t("p4"),
    ];

    return (
        <section ref={wrapRef} className="relative bg-black overflow-hidden" style={{ height: "180vh" }}>

            {/* ── sticky viewport ── */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">

                {/* top vignette */}
                <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[30%]"
                    style={{ background: "linear-gradient(to bottom, #000 0%, transparent 100%)" }} />
                {/* bottom vignette */}
                <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[28%]"
                    style={{ background: "linear-gradient(to top, #000 0%, transparent 100%)" }} />

                {/* starfield */}
                <div aria-hidden className="absolute inset-0 z-0">
                    {/* Slow moving background stars */}
                    <div className="stars-bg absolute inset-0">
                        {Array.from({ length: 150 }).map((_, i) => (
                            <div key={`bg-${i}`} className="absolute rounded-full bg-white" style={{
                                width: Math.random() < 0.3 ? "2px" : "1px",
                                height: Math.random() < 0.3 ? "2px" : "1px",
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                opacity: Math.random() * 0.4 + 0.1,
                            }} />
                        ))}
                    </div>
                    {/* Faster moving foreground stars - hidden on mobile to save composite cycles */}
                    <div className="stars-fg absolute inset-0 hidden md:block">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <div key={`fg-${i}`} className="absolute rounded-full bg-blue-100" style={{
                                width: Math.random() < 0.5 ? "3px" : "2px",
                                height: Math.random() < 0.5 ? "3px" : "2px",
                                top: `${Math.random() * 120 - 10}%`,
                                left: `${Math.random() * 100}%`,
                                opacity: Math.random() * 0.5 + 0.3,
                                filter: "blur(1px)"
                            }} />
                        ))}
                    </div>
                </div>

                {/* ── SINISTER EYES ── */}
                <div ref={eyesRef} className="absolute inset-0 z-40 pointer-events-none">
                    {EYES.map((props, i) => <EyePair key={i} {...props} />)}
                </div>

                {/* ── Episode title ── */}
                <div className="relative z-20 flex flex-col items-center pt-16 pb-6 shrink-0">
                    <p className="text-[10px] font-mono tracking-[0.5em] text-blue-400/60 uppercase mb-4">
                        / {t("episode")} {new Date().getFullYear()} /
                    </p>
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-[-0.02em] uppercase text-center leading-tight">
                        <span className="text-white">{t("title_logic_part_1")}&nbsp;</span>
                        <span className="text-transparent bg-clip-text" style={{
                            backgroundImage: "linear-gradient(to right, #60a5fa, #67e8f9, #3b82f6)",
                            WebkitBackgroundClip: "text",
                            filter: "drop-shadow(0 0 18px rgba(96,165,250,0.5))",
                        }}>{t("title_logic_part_2")}</span>
                    </h2>
                </div>

                {/* ── 3-D Perspective stage ── */}
                <div ref={stageRef} className="relative z-10 flex-1 flex items-start justify-center overflow-hidden"
                    style={{ perspective: "420px", perspectiveOrigin: "50% 10%" }}>

                    <div ref={crawlRef} className="w-full max-w-[760px] px-6 sm:px-10 will-change-transform"
                        style={{ transformOrigin: "50% 100%", transform: "rotateX(26deg)" }}>

                        <div style={{ height: "60vh" }} />

                        {paragraphs.map((text, i) => (
                            <p
                                key={i}
                                ref={(el) => { if (el) paraRefs.current[i] = el; }}
                                className="font-bold leading-[1.85] mb-16 text-center"
                                style={{
                                    fontSize: i === paragraphs.length - 1 ? "clamp(1.8rem,4vw,3rem)" : "clamp(1.3rem,2.5vw,2rem)",
                                    letterSpacing: i === paragraphs.length - 1 ? "0.25em" : "0.08em",
                                    color: "rgba(220,235,255,0.6)",
                                    textShadow: "0 4px 24px rgba(59,130,246,0.6), 0 0 10px rgba(0,0,0,1)",
                                    fontFamily: "'News Cycle','Franklin Gothic Medium',Arial Narrow,sans-serif",
                                }}
                            >{text}</p>
                        ))}

                        <div style={{ height: "10vh" }} />
                    </div>
                </div>

            </div>
        </section>
    );
}
