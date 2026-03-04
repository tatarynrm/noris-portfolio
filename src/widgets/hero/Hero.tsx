"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { useLenis } from "@studio-freight/react-lenis";
import { MagneticButton } from "@/shared/ui/MagneticButton";


// Utility to wrap words in spans for GSAP staggering without premium plugins
const splitWords = (text: string) => {
    return text.split(/(<br\s*\/?>|\s+)/).map((word, index) => {
        if (word.match(/<br\s*\/?>/i)) return <br key={index} />;
        if (word.trim() === "") return word; // preserve spaces
        return (
            <span key={index} className="inline-block overflow-hidden relative leading-tight align-bottom">
                <span className="inline-block split-word transform will-change-transform">{word}</span>
            </span>
        );
    });
};

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const t = useTranslations("Hero");
    const lenis = useLenis();

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
        e.preventDefault();
        lenis?.scrollTo(target, { offset: 0, duration: 1.5, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

            // Animate Top pill
            tl.from(".hero-pill", {
                y: 30,
                opacity: 0,
                duration: 1,
                delay: 0.2
            })
                // Stagger reveal words from bottom up inside their overflow:hidden container
                .from(".split-word", {
                    y: "120%",
                    rotationZ: 5,
                    opacity: 0,
                    duration: 1.2,
                    stagger: 0.04,
                }, "-=0.6")
                // Fade in subtle subtitle words
                .from(".hero-subtitle", {
                    y: 20,
                    opacity: 0,
                    duration: 1.2,
                    stagger: 0.02,
                }, "-=0.8")
                // Spring in the buttons
                .from(".hero-btn a", {
                    scale: 0.8,
                    opacity: 0,
                    y: 20,
                    duration: 1,
                    stagger: 0.1,
                    ease: "back.out(1.7)"
                }, "-=0.8");
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const headline = t("headline");
    const titleText = t("subtitle");

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        >
            {/* Background Aura — Light Mode Only */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none block dark:hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 blur-[120px] bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 rounded-full" />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center select-none">

                <div className="hero-pill inline-block mb-8 px-5 py-2.5 border border-blue-500/30 dark:border-blue-500/50 rounded-full bg-blue-500/10 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </div>
                        <span className="text-[10px] font-black tracking-[0.3em] text-blue-600 dark:text-blue-400 uppercase">
                            {t("status")}
                        </span>
                    </div>
                </div>

                <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-extrabold tracking-tighter text-gray-900 dark:text-white mb-8 leading-[1.1]">
                    {headline.split(' ').map((word, i) => (
                        <span key={i} className="inline-block overflow-hidden relative align-bottom mr-3 md:mr-6 last:mr-0">
                            <span className={`inline-block split-word transform will-change-transform ${i === 1 || word.includes('захоплюють') ? 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400' : ''}`}>
                                {word}
                            </span>
                        </span>
                    ))}
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-14 leading-relaxed font-light flex flex-wrap justify-center gap-[0.3rem]">
                    {titleText.split(' ').map((word, i) => (
                        <span key={i} className="hero-subtitle inline-block">{word}</span>
                    ))}
                </p>

                <div className="hero-btn flex flex-col sm:flex-row justify-center gap-6 w-full sm:w-auto">
                    <MagneticButton strength={20}>
                        <a
                            href="#skills"
                            onClick={(e) => handleScroll(e, '#skills')}
                            className="inline-block px-10 py-4 rounded-full bg-[#0f172a] text-white dark:bg-white dark:text-black font-semibold tracking-wide hover:scale-110 transition-transform duration-500 shadow-[0_10px_30px_rgba(15,23,42,0.15)] dark:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                        >
                            {t("explore")}
                        </a>
                    </MagneticButton>
                    <MagneticButton strength={20}>
                        <a
                            href="/CV_RomanNoris.pdf"
                            download
                            className="inline-flex px-10 py-4 items-center justify-center gap-3 rounded-full border border-gray-300 dark:border-white/20 backdrop-blur-md hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 hover:border-transparent transition-all duration-500 font-semibold tracking-wide group"
                        >
                            {t("download_cv")}
                            <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        </a>
                    </MagneticButton>
                </div>
            </div>
        </section>
    );
}
