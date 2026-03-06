"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { ArrowLeft, Cpu, Network, Monitor, Smartphone, Bot } from "lucide-react";
import { useRef, useState } from "react";
import gsap from "gsap";

export default function AllProjectsPage() {
    const t = useTranslations("projects");
    const router = useRouter();
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Placeholder array simulating a massive database of projects
    const allProjects = [
        {
            slug: "iot-water-dispenser",
            title: t("p1_title"),
            desc: t("p1_desc"),
            icon: <Cpu className="w-10 h-10 text-blue-400" />,
            color: "from-blue-600 to-cyan-500",
            bg: "bg-blue-950/20 dark:bg-blue-900/10",
        },
        {
            slug: "global-logistics-crm",
            title: t("p2_title"),
            desc: t("p2_desc"),
            icon: <Network className="w-10 h-10 text-purple-400" />,
            color: "from-purple-600 to-pink-500",
            bg: "bg-purple-950/20 dark:bg-purple-900/10",
        },
        {
            slug: "core-graphics-engine",
            title: "Project Zero: The Core Engine",
            desc: "A highly experimental graphics pipeline engine built directly into WebAssembly. Processes complex geometries at sub-millisecond latencies.",
            icon: <Monitor className="w-10 h-10 text-emerald-400" />,
            color: "from-emerald-600 to-teal-500",
            bg: "bg-emerald-950/20 dark:bg-emerald-900/10",
        },
        {
            slug: "phantom-mobile-ios",
            title: "Phantom Mobile Application",
            desc: "A fully decentralized architecture iOS application operating exclusively on edge networks. Handled 3 million secured packets per hour in strict isolation.",
            icon: <Smartphone className="w-10 h-10 text-rose-400" />,
            color: "from-rose-600 to-orange-500",
            bg: "bg-rose-950/20 dark:bg-rose-900/10",
        },
        {
            slug: "algorithmic-trading-bot",
            title: "Automated Algorithmic AI Node",
            desc: "A headless background demon actively trading synthetic data assets. Maintained 99.999% uptime utilizing an aggressive Rust garbage collector implementation.",
            icon: <Bot className="w-10 h-10 text-indigo-400" />,
            color: "from-indigo-600 to-violet-500",
            bg: "bg-indigo-950/20 dark:bg-indigo-900/10",
        }
    ];

    const handleProjectClick = (e: React.MouseEvent, index: number, slug: string) => {
        e.preventDefault();
        if (isTransitioning) return;
        setIsTransitioning(true);

        const card = cardsRef.current[index];
        if (!card) return;

        // Capture geometry
        const rect = card.getBoundingClientRect();

        // Create a seamless clone to animate to 100vw/100vh
        const clone = card.cloneNode(true) as HTMLDivElement;

        // Strip hover animations specifically so it doesn't skew visually
        clone.classList.remove("sm:hover:-translate-y-2");

        document.body.appendChild(clone);

        gsap.set(clone, {
            position: 'fixed',
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            margin: 0,
            zIndex: 99999, // Cover entire DOM
            transformOrigin: "center center",
            cursor: "default"
        });

        // Hide original card instantly
        gsap.set(card, { opacity: 0 });

        // Phase 1: Expansion
        gsap.to(clone, {
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            borderRadius: 0,
            duration: 1.4,
            ease: "expo.inOut",
            onComplete: () => {
                // Programmatic Route push
                router.push(`/projects/${slug}`);

                // Phase 2: Cleanup clone after target page has theoretically mounted
                setTimeout(() => {
                    gsap.to(clone, {
                        opacity: 0,
                        duration: 0.8,
                        ease: "power2.inOut",
                        onComplete: () => clone.remove()
                    });
                    setIsTransitioning(false);
                }, 1400);
            }
        });

        // Drop global opacity to push focus entirely to the animating block
        gsap.to("main", { opacity: 0, duration: 0.8 });
        gsap.to("header", { opacity: 0, duration: 0.8 });
    };

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 relative z-10 selection:bg-blue-500/30">
            <div className="container mx-auto max-w-7xl">

                <div className="mb-16">
                    <Link
                        href="/#projects"
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-gray-300 dark:border-white/20 hover:border-blue-500 dark:hover:border-blue-500 text-sm font-bold tracking-widest uppercase transition-colors mb-12 group backdrop-blur-md bg-white/5"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Return to Headquarters
                    </Link>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-gray-900 dark:text-white mb-6">
                        Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Arsenal</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-light max-w-3xl">
                        A comprehensively synchronized database of every major architectural system, framework, and ecosystem I have designed and deployed.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {allProjects.map((proj, i) => (
                        <div
                            key={i}
                            ref={(el) => { cardsRef.current[i] = el; }}
                            onClick={(e) => handleProjectClick(e, i, proj.slug)}
                            className="group relative p-8 md:p-12 rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden bg-white/5 dark:bg-black/5 backdrop-blur-xl hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] transition-all duration-500 sm:hover:-translate-y-2 cursor-pointer"
                        >
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-br ${proj.color} transition-opacity duration-500`}></div>

                            <div className="relative z-10 flex flex-col h-full justify-between gap-8 pointer-events-none">
                                <div className="w-16 h-16 rounded-2xl bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-white/20 flex items-center justify-center backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
                                    {proj.icon}
                                </div>

                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                        {proj.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                                        {proj.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
