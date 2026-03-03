"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { ArrowRight, Cpu, Network, Truck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function StackedProjects() {
    const t = useTranslations("Projects");
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const router = useRouter();
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate each card's scale and brightness as the next one scrolls over it
            cardsRef.current.forEach((card, index) => {
                if (!card || index === cardsRef.current.length - 1) return;

                gsap.to(card, {
                    scale: 0.9,
                    opacity: 0.4,
                    filter: "blur(10px)",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 120px", // When this card hits its sticky point
                        endTrigger: cardsRef.current[index + 1],
                        end: "top 120px", // Until the next card hits its sticky point
                        scrub: true,
                        invalidateOnRefresh: true,
                    }
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleProjectClick = (e: React.MouseEvent, index: number, slug: string) => {
        e.preventDefault();
        if (isTransitioning) return;
        setIsTransitioning(true);

        const card = cardsRef.current[index];

        // Brief tactile feedback on the card, then navigate
        if (card) {
            gsap.to(card, {
                scale: 0.97,
                duration: 0.15,
                ease: "power2.in",
                onComplete: () => {
                    router.push(`/projects/${slug}`);
                    // Reset in case user comes back
                    setTimeout(() => {
                        gsap.set(card, { scale: 1 });
                        setIsTransitioning(false);
                    }, 800);
                }
            });
        } else {
            router.push(`/projects/${slug}`);
        }
    };

    const projects = [
        {
            slug: "iot-water-dispenser",
            title: t("p1_title"),
            desc: t("p1_desc"),
            icon: <Cpu className="w-10 h-10 text-blue-400" />,
            color: "from-blue-600 to-cyan-500",
            bg: "bg-blue-950/40 dark:bg-blue-900/20",
            image: "/projects/iot_water.png"
        },
        {
            slug: "global-logistics-crm",
            title: t("p2_title"),
            desc: t("p2_desc"),
            icon: <Network className="w-10 h-10 text-purple-400" />,
            color: "from-purple-600 to-pink-500",
            bg: "bg-purple-950/40 dark:bg-purple-900/20",
            image: "/projects/logistics_crm.png"
        },
        {
            slug: "carrier-fleet-portal",
            title: t("p3_title"),
            desc: t("p3_desc"),
            icon: <Truck className="w-10 h-10 text-orange-400" />,
            color: "from-orange-600 to-yellow-500",
            bg: "bg-orange-950/40 dark:bg-orange-900/20",
            image: "/projects/carrier_fleet.png"
        }
    ];

    return (
        <section ref={containerRef} className="relative w-full py-32 px-4 md:px-8 max-w-7xl mx-auto" id="projects">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                <div>
                    <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-gray-900 dark:text-white leading-tight">
                        {t("title_1")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">{t("title_2")}</span>
                    </h2>
                </div>

                <Link
                    href="/projects"
                    className="group flex items-center gap-3 px-8 py-4 rounded-full border border-gray-300 dark:border-white/20 hover:border-blue-500 dark:hover:border-blue-500 transition-colors backdrop-blur-md bg-white/5 font-bold tracking-widest uppercase text-sm"
                >
                    {t("show_all")}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
            </div>

            {/* Stacked Cards Container */}
            <div className="relative flex flex-col gap-12 pb-[20vh]">
                {projects.map((proj, i) => (
                    <div
                        key={i}
                        ref={(el) => { cardsRef.current[i] = el; }}
                        style={{ top: "120px" }} // The sticky pin coordinate
                        onClick={(e) => handleProjectClick(e, i, proj.slug)}
                        className={`project-card group sticky w-full h-[60vh] md:h-[500px] flex flex-col justify-between overflow-hidden rounded-3xl border border-white/20 shadow-2xl transition-all origin-top cursor-pointer hover:shadow-[0_0_50px_rgba(59,130,246,0.3)] bg-gradient-to-br ${proj.color}`}
                    >
                        {/* Hover Image Reveal Layer */}
                        <div className="absolute inset-0 z-0 transition-transform duration-700 ease-out group-hover:scale-105">
                            <img
                                src={proj.image}
                                alt={proj.title}
                                className="w-full h-full object-cover opacity-30 dark:opacity-40 group-hover:opacity-60 dark:group-hover:opacity-70 transition-opacity duration-700"
                            />
                        </div>

                        {/* Beautiful Background Gradient */}
                        <div className={`absolute inset-0 z-0 opacity-80 group-hover:opacity-60 bg-gradient-to-br ${proj.color} mix-blend-overlay transition-opacity duration-700`}></div>
                        <div className={`absolute inset-0 z-0 ${proj.bg} backdrop-blur-3xl group-hover:backdrop-blur-md transition-all duration-700`}></div>

                        {/* Content */}
                        <div className="relative z-10 p-8 md:p-16 h-full flex flex-col justify-between pointer-events-none">
                            <div className="w-20 h-20 rounded-2xl bg-white/10 dark:bg-black/20 border border-white/20 flex items-center justify-center backdrop-blur-md mb-8 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                                {proj.icon}
                            </div>

                            <div className="transition-transform duration-500 group-hover:translate-x-4 flex items-end justify-between">
                                <div>
                                    <h3 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6 drop-shadow-md">
                                        {proj.title}
                                    </h3>
                                    <p className="text-lg md:text-xl text-gray-100 max-w-3xl leading-relaxed font-medium drop-shadow-lg">
                                        {proj.desc}
                                    </p>
                                </div>

                                {/* Explore Button */}
                                <div className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold tracking-widest uppercase text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                                    Explore <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </section>
    );
}
