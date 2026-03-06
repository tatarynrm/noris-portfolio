"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { skillsData } from "@/shared/data/skills";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { HoverTilt } from "@/shared/ui/HoverTilt";

gsap.registerPlugin(ScrollTrigger);

export function Skills() {
    const t = useTranslations("skills");
    const headerRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const words = gsap.utils.toArray(".skill-word");

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: headerRef.current,
                    start: "top 85%",
                    once: true,
                }
            });

            tl.from(words, {
                opacity: 0,
                filter: "blur(10px)",
                x: -10,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out",
            })
                .from(".terminal-cursor", {
                    opacity: 0,
                    repeat: -1,
                    duration: 0.5,
                    ease: "steps(1)"
                }, "-=0.2");
        }, headerRef);

        return () => ctx.revert();
    }, []);

    const title1 = t("title_1");
    const title2 = t("title_2");

    return (
        <section id="skills" className="py-32 relative z-10">
            <div className="container mx-auto px-6">
                <h2
                    ref={headerRef}
                    className="text-5xl md:text-6xl font-extrabold text-center mb-24 tracking-tighter text-gray-900 dark:text-white flex items-center justify-center flex-wrap gap-x-4"
                >
                    {title1.split(' ').map((word, i) => (
                        <span key={i} className="skill-word inline-block">{word}</span>
                    ))}
                    {title2.split(' ').map((word, i) => (
                        <span
                            key={i}
                            className="skill-word inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 px-1"
                        >
                            {word}
                        </span>
                    ))}
                    <span className="terminal-cursor inline-block w-[4px] h-[0.9em] bg-blue-500 ml-2 self-center" />
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {skillsData.map((skill, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 60, scale: 0.9, rotateX: -25 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, delay: index * 0.12, type: "spring", bounce: 0.3 }}
                            key={index}
                            style={{ perspective: 1200 }}
                        >
                            <HoverTilt intensity={12}>
                                <div
                                    className="skill-card p-10 rounded-3xl backdrop-blur-xl bg-white/60 dark:bg-black/40 border border-gray-200/50 dark:border-white/10 hover:border-blue-400/60 dark:hover:border-blue-500/50 transition-all duration-500 group shadow-card hover:shadow-hover dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_8px_32px_rgba(59,130,246,0.3)] relative overflow-hidden"
                                >
                                    {/* Card glowing effect behind the icon */}
                                    <div className="absolute top-0 right-0 p-12 -mt-10 -mr-10 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-colors duration-500 z-0" />

                                    <div className="relative z-10 transition-transform duration-500" style={{ transform: "translateZ(30px)" }}>
                                        <div className="transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500">
                                            {skill.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 tracking-tight">
                                            {t(`item_${index}_cat`)}
                                        </h3>
                                        <ul className="flex flex-wrap gap-3">
                                            {skill.items.map((item, i) => (
                                                <li
                                                    key={i}
                                                    className="px-4 py-1.5 text-sm rounded-full bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-medium border border-gray-200 dark:border-white/5"
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Link
                                                href={`/skills/${skill.slug}`}
                                                className="inline-flex items-center text-blue-500 font-bold hover:text-blue-400 transition-colors"
                                            >
                                                {t("inspect")} <span className="ml-2">→</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </HoverTilt>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
