"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

export function Experience() {
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const t = useTranslations("Experience");

    const experiences = [
        {
            year: t("0_year"),
            title: t("0_title"),
            company: t("0_company"),
            desc: t("0_desc")
        },
        {
            year: t("1_year"),
            title: t("1_title"),
            company: t("1_company"),
            desc: t("1_desc")
        },
        {
            year: t("2_year"),
            title: t("2_title"),
            company: t("2_company"),
            desc: t("2_desc")
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Pin the entire section and animate the cards entering
            const cards = gsap.utils.toArray(".exp-card");

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    pin: true,
                    scrub: 1,
                    snap: 1 / (cards.length - 1),
                    end: () => "+=" + containerRef.current!.offsetWidth * 2
                }
            });

            tl.to(cards, {
                xPercent: -100 * (cards.length - 1),
                ease: "none",
            }, 0);

            // Animate timeline progress bar
            tl.fromTo(".exp-progress",
                { scaleX: 0 },
                { scaleX: 1, ease: "none" },
                0
            );

            // Animate glowing orb
            tl.fromTo(".exp-orb",
                { left: "0%" },
                { left: "100%", ease: "none" },
                0
            );

            // Fade in the title
            gsap.from(".exp-title", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // 3D tilt effect on hover
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            ease: "power1.out",
            duration: 0.4
        });
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        gsap.to(e.currentTarget, {
            rotationX: 0,
            rotationY: 0,
            ease: "power3.out",
            duration: 0.7
        });
    };

    return (
        <section id="experience" ref={containerRef} className="h-screen relative z-10 flex flex-col justify-center overflow-hidden bg-black/5 dark:bg-white/5 backdrop-blur-sm border-y border-white/10 mt-32">
            <div className="container mx-auto px-6 mb-12 flex-shrink-0">
                <h2 className="exp-title text-5xl md:text-6xl font-extrabold tracking-tighter text-gray-900 dark:text-white">
                    {t("title_1")} <span className="text-blue-500">{t("title_2")}</span>
                </h2>
                <p className="exp-title mt-4 text-xl text-gray-500 max-w-2xl font-light">
                    {t("subtitle")}
                </p>
            </div>

            <div ref={timelineRef} className="flex w-[300vw] h-[50vh] items-center px-6 md:px-20 perspective-[2000px]">
                {experiences.map((exp, i) => (
                    <div key={i} className="exp-card w-[100vw] md:w-[60vw] flex-shrink-0 px-4 md:px-10">
                        <div
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            className="relative transform-gpu will-change-transform p-10 md:p-16 rounded-3xl backdrop-blur-2xl bg-white/40 dark:bg-black/40 border border-white/30 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_rgba(59,130,246,0.15)] hover:border-blue-500/50 transition-colors duration-500 group"
                        >

                            <div className="absolute -top-10 -right-10 text-[8rem] font-bold text-gray-900/5 dark:text-white/5 group-hover:text-blue-500/10 transition-colors duration-500 pointer-events-none select-none">
                                {exp.year}
                            </div>

                            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-bold tracking-widest mb-6 border border-blue-500/20">
                                {exp.year}
                            </span>

                            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100 tracking-tight">
                                {exp.title}
                            </h3>

                            <h4 className="text-2xl font-semibold mb-8 text-blue-500">
                                {exp.company}
                            </h4>

                            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-3xl">
                                {exp.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Scroll Progress Timeline */}
            <div className="absolute bottom-20 left-10 right-10 md:left-20 md:right-20 h-[2px] bg-gray-300/20 dark:bg-white/10 rounded-full overflow-visible">
                <div className="exp-progress h-full w-full bg-gradient-to-r from-blue-500 to-purple-500 origin-left" style={{ transform: "scaleX(0)" }} />

                {/* Glowing Orb Tracking Progress */}
                <div className="exp-orb absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_20px_10px_rgba(59,130,246,0.6)]" style={{ left: "0%" }}>
                    <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75" />
                </div>
            </div>
        </section>
    );
}
