"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";

const stages = [
    {
        id: 1,
        titleKey: "stage_1_title",
        descKey: "stage_1_desc",
        image: "/images/stages/stage_1_analysis_1772789548948.png",
    },
    {
        id: 2,
        titleKey: "stage_2_title",
        descKey: "stage_2_desc",
        image: "/images/stages/stage_2_design_1772789563600.png",
    },
    {
        id: 3,
        titleKey: "stage_3_title",
        descKey: "stage_3_desc",
        image: "/images/stages/stage_3_dev_1772789581000.png",
    },
    {
        id: 4,
        titleKey: "stage_4_title",
        descKey: "stage_4_desc",
        image: "/images/stages/stage_4_release_1772789597302.png",
    }
];

export function WorkStages() {
    const t = useTranslations("work_stages");
    const containerRef = useRef<HTMLElement>(null);

    return (
        <section
            id="process"
            ref={containerRef}
            className="relative py-32 mt-20 mb-20 z-10 perspective-[2000px] overflow-visible"
        >
            <div className="container mx-auto px-6 max-w-7xl relative">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative items-start">

                    {/* Left Sticky Column */}
                    <div className="lg:w-5/12 lg:sticky lg:top-40 lg:h-[calc(100vh-160px)] flex flex-col justify-start pb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="bg-white/60 dark:bg-black/40 backdrop-blur-2xl p-10 rounded-[3rem] border border-gray-200/50 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                        >
                            <span className="text-xs font-bold tracking-[0.2em] uppercase text-blue-500 mb-6 block">
                                {t("label")}
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-gray-900 dark:text-white mb-8 leading-[1.1]">
                                {t("title_1")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 block">{t("title_2")}</span>
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 font-medium leading-relaxed max-w-sm">
                                {t("subtitle")}
                            </p>

                            <div className="flex items-center gap-6">
                                <button className="px-8 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-xs hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all duration-300 shadow-xl group">
                                    <span className="flex items-center gap-2">
                                        {t("button")}
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </button>
                                <button className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group">
                                    {t("details")}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Scrolling Column */}
                    <div className="lg:w-7/12 flex flex-col gap-16 pb-16">
                        {stages.map((stage) => (
                            <motion.div
                                key={stage.id}
                                initial={{ opacity: 0, scale: 0.95, y: 100 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: false, margin: "-150px" }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="relative bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-[3rem] border border-gray-200/50 dark:border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.05)] dark:shadow-card overflow-hidden group flex flex-col"
                            >
                                <div className="p-10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                                    <div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center font-black text-blue-500 text-xl border border-blue-500/20">
                                                0{stage.id}
                                            </div>
                                            <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white">
                                                {t(stage.titleKey as any)}
                                            </h3>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 md:pl-16 max-w-sm leading-relaxed font-medium">
                                            {t(stage.descKey as any)}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 mx-6 mb-6 relative overflow-hidden rounded-[2rem] border border-gray-200/50 dark:border-white/10 aspect-[16/10]">
                                    <Image
                                        src={stage.image}
                                        alt={t(stage.titleKey as any)}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        priority={stage.id === 1}
                                    />
                                    {/* Overlay for cinematic feel */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent pointer-events-none" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
