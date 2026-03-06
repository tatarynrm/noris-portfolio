"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@/i18n/routing";
import { ArrowLeft, ArrowDown, Activity, Shield, Zap, Database } from "lucide-react";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

const projectData: Record<string, any> = {
    "iot-water-dispenser": {
        color: "from-blue-600 to-cyan-500",
        bg: "bg-blue-950/40 dark:bg-blue-900/20",
        image: "/projects/iot_water.png",
        secondaryImages: ["/projects/iot_water_sec1.png", "/projects/iot_water_sec2.png"],
        stats: [
            { label: "Active Nodes", value: "48,210" },
            { label: "Uptime", value: "99.99%" },
            { label: "Latency", value: "12ms" }
        ],
        paragraphs: [
            "The architecture consists of thousands of dispersed hardware nodes demanding real-time synchronization.",
            "By engineering a custom WebSocket-driven telemetry layer, we achieved sub-20ms round-trip latency globally.",
            "The localized dashboard provides commanders with absolute control over reboot sequences and firmware deployments.",
            "Hardware sensor matrix continually scans for temperature fluctuations, packet drops, and voltage irregularity at the edge.",
            "All telemetry streams are autonomously backed up to our global cloud sink via redundant, encrypted satellite bands."
        ]
    },
    "global-logistics-crm": {
        color: "from-purple-600 to-pink-500",
        bg: "bg-purple-950/40 dark:bg-purple-900/20",
        image: "/projects/logistics_crm.png",
        secondaryImages: ["/projects/logistics_crm_sec1.png", "/projects/logistics_crm_sec2.png"],
        stats: [
            { label: "Daily Routes", value: "12,400" },
            { label: "DB Ops/sec", value: "85,000" },
            { label: "Accuracy", value: "99.9%" }
        ],
        paragraphs: [
            "Logistics at a global scale requires absolute database integrity and zero-latency indexing.",
            "We engineered a distributed PostgreSQL cluster handling millions of complex geographic route calculations per minute.",
            "The overarching CRM fuses predictive analytics with actual real-time vehicle traversal vectors.",
            "Advanced weather tracking algorithms proactively recalculate shipping lanes to avoid cyclone formations in real time.",
            "The core database architecture relies on an aggressive B-Tree indexing structure operating entirely in volatile memory."
        ]
    },
    "carrier-fleet-portal": {
        color: "from-orange-600 to-yellow-500",
        bg: "bg-orange-950/40 dark:bg-orange-900/20",
        image: "/projects/carrier_fleet.png",
        secondaryImages: ["/projects/carrier_fleet_sec1.png", "/projects/carrier_fleet_sec2.png"],
        stats: [
            { label: "Fleet Size", value: "5,000+" },
            { label: "Cost Saved", value: "29.1%" },
            { label: "Route Match", value: "98.4%" }
        ],
        paragraphs: [
            "Carriers required an edge-authenticated portal to securely view and alter active route manifestations.",
            "Integrating custom hardware GPS trackers, the portal computes optimal predictive paths natively in the browser.",
            "Driver monitoring and cost-margin automation run continuously in a highly isolated web worker architecture.",
            "Raw satellite coordinate geometry is processed via customized high-gain receivers hardwired into the truck's telemetry.",
            "The edge-computing workers execute Dijkstra's A* pathfinding strictly on the client browser independently of the main thread."
        ]
    }
};

import { useParams } from "next/navigation";

export default function ProjectDynamicPage() {
    const params = useParams();
    const slug = params.slug as string;
    const data = projectData[slug];
    const t = useTranslations("projects");
    const containerRef = useRef<HTMLDivElement>(null);

    // If no specific project is mapped (like Project Zero), fallback to a generic dark layout
    const safeData = data || {
        color: "from-emerald-600 to-teal-500",
        bg: "bg-emerald-950/40 dark:bg-emerald-900/20",
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=2070&auto=format&fit=crop",
        secondaryImages: ["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80", "https://images.unsplash.com/photo-1586528116311-ad8ed7c80a56?q=80"],
        stats: [{ label: "System", value: "ONLINE" }],
        paragraphs: ["Experimental architecture deployed.", "Awaiting secondary sequence commands.", "Executing background demon threads.", "Securing edge nodes.", "System verified."]
    };

    // Which title to pull? 
    let titleKey = "p1_title";
    if (slug === "global-logistics-crm") titleKey = "p2_title";
    if (slug === "carrier-fleet-portal") titleKey = "p3_title";
    const localizedTitle = t.has(titleKey) ? t(titleKey) : "Accessing Database...";

    useEffect(() => {
        // SCROLLYTELLING ANIMATIONS
        const ctx = gsap.context(() => {
            // 1. Initial Hero Fade In - Softened (Removed blur for performance)
            gsap.fromTo(".hero-content",
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1.8, delay: 0.8, ease: "expo.out" }
            );

            // 2. Parallax Background Image
            gsap.to(".parallax-bg", {
                yPercent: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero-section",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });

            // 3. Staggered Text & Image Reveals (Scrollytelling)
            const revealElements = gsap.utils.toArray([".story-text", ".story-img"]);
            revealElements.forEach((el: any) => {
                gsap.fromTo(el,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1.5,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

            // Note: Removed pinning on stats-container as it conflicts with Lenis on dynamic routes
            gsap.from(".stats-container", {
                scrollTrigger: {
                    trigger: ".stats-container",
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 1,
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={containerRef} className="bg-black min-h-screen text-white selection:bg-blue-500/30">

            {/* HERO SECTION (Matches the expanded card exactly) */}
            <section className="hero-section relative w-full h-screen flex flex-col justify-end p-8 md:p-24 overflow-hidden">
                <img
                    src={safeData.image}
                    alt="Architecture"
                    className="parallax-bg absolute inset-0 w-full object-cover opacity-50 z-0"
                    style={{ height: '130%', top: '-15%' }}
                />
                {/* Replaced heavy mix-blend-mode and backdrop-blur with simple gradients to fix scroll lag */}
                <div className={`absolute inset-0 z-0 opacity-60 bg-gradient-to-br ${safeData.color}`}></div>
                <div className={`absolute inset-0 z-0 bg-black/40`}></div>

                <div className="relative z-10 hero-content max-w-5xl">
                    <Link
                        href="/projects"
                        className="group inline-flex items-center gap-2 mb-12 px-6 py-3 rounded-full border border-white/20 hover:border-white text-sm font-bold tracking-widest uppercase transition-colors backdrop-blur-md bg-black/20"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Core Directory
                    </Link>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-6 drop-shadow-xl leading-tight">
                        {localizedTitle}
                    </h1>

                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center animate-bounce mt-12 backdrop-blur-md bg-white/10">
                            <ArrowDown className="w-5 h-5 text-white" />
                        </div>
                        <p className="mt-12 text-sm font-bold uppercase tracking-widest text-white/50">Scroll to Initiate Sequence</p>
                    </div>
                </div>
            </section>

            {/* SCROLLYTELLING CONTENT */}
            <section className="relative z-20 py-32 px-6 md:px-24 max-w-6xl mx-auto flex flex-col gap-40">

                {/* Intro Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="story-text text-4xl md:text-5xl font-black mb-8 tracking-tight">System Initialization</h2>
                        <p className="story-text text-xl md:text-2xl text-gray-400 font-light leading-relaxed">
                            {safeData.paragraphs[0]}
                        </p>
                    </div>
                    <div className="story-text h-full aspect-square md:aspect-auto rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${safeData.color} opacity-10`} />
                        <Activity className="w-12 h-12 text-white/50" />
                        <div className="text-right">
                            <p className="text-6xl font-black tracking-tighter">01</p>
                            <p className="text-sm font-bold tracking-widest uppercase text-gray-500">Core Node</p>
                        </div>
                    </div>
                </div>

                {/* Pinned Stats Section */}
                <div className="stats-container w-full bg-white/5 border border-white/10 rounded-[3rem] p-12 md:p-24 backdrop-blur-md relative overflow-hidden my-16">
                    <div className={`absolute -right-64 -top-64 w-[500px] h-[500px] bg-gradient-to-br ${safeData.color} rounded-full blur-[120px] opacity-20`} />
                    <h2 className="text-3xl font-bold mb-16 tracking-tighter">Live Telemetry Metrics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {safeData.stats.map((stat: any, i: number) => (
                            <div key={i} className="flex flex-col gap-2 relative">
                                <div className="absolute -left-6 top-2 w-1 h-12 bg-white/20 rounded-full" />
                                <p className="text-sm font-bold tracking-widest uppercase text-gray-400">{stat.label}</p>
                                <p className="text-6xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Deep Dive Matrix: Alternating Left/Right */}
                <div className="flex flex-col gap-32">

                    {/* Database / Architecture (Left Image, Right Text) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="story-img w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative order-2 lg:order-1 group aspect-[4/3] md:aspect-auto">
                            <div className="absolute inset-0 z-0 bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                            <img
                                src={safeData.secondaryImages[0]}
                                alt="Architecture Diagram"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <div className="order-1 lg:order-2">
                            <h2 className="story-text text-4xl md:text-5xl font-black mb-8 tracking-tight">Computational Matrix</h2>
                            <p className="story-text text-xl md:text-2xl text-gray-400 font-light leading-relaxed mb-6">
                                {safeData.paragraphs[1]}
                            </p>
                            <p className="story-text text-lg text-gray-500 font-medium leading-relaxed">
                                {safeData.paragraphs[2]}
                            </p>
                        </div>
                    </div>

                    {/* Edge Nodes / Security (Left Text, Right Image) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="story-text text-4xl md:text-5xl font-black mb-8 tracking-tight">Perimeter Integrity</h2>
                            <p className="story-text text-xl md:text-2xl text-gray-400 font-light leading-relaxed mb-6">
                                {safeData.paragraphs[3]}
                            </p>
                            <p className="story-text text-lg text-gray-500 font-medium leading-relaxed">
                                {safeData.paragraphs[4]}
                            </p>
                        </div>
                        <div className="story-img w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group aspect-[4/3] md:aspect-auto">
                            <div className="absolute inset-0 z-0 bg-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                            <img
                                src={safeData.secondaryImages[1]}
                                alt="Data Flow Matrix"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    </div>
                </div>

                {/* Final Footer Spacer */}
                <div className="h-[20vh] w-full flex items-center justify-center">
                    <p className="text-gray-600 font-bold tracking-widest uppercase text-xs story-text">// END OF TRANSMISSION //</p>
                </div>

            </section>
        </main>
    );
}
