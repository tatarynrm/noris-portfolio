"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { servicesData } from "@/shared/data/services";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

export function Services() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const t = useTranslations("Services");

    useEffect(() => {
        let mm = gsap.matchMedia();

        const ctx = gsap.context(() => {
            gsap.from(".service-header", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power4.out"
            });

            mm.add("(max-width: 767px)", () => {
                // Mobile: simplified animation
                gsap.from(".service-card", {
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: "top 85%",
                    },
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out",
                });
            });

            mm.add("(min-width: 768px)", () => {
                // Desktop: premium 3D & blur animation
                gsap.from(".service-card", {
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: "top 85%",
                    },
                    y: 120,
                    scale: 0.85,
                    rotationX: 25,
                    opacity: 0,
                    filter: "blur(12px)",
                    duration: 1.4,
                    stagger: 0.12,
                    ease: "power4.out",
                    transformOrigin: "50% 100%"
                });
            });
        }, sectionRef);

        return () => {
            ctx.revert();
            mm.revert();
        };
    }, []);

    // Handling 3D tilt effect on hover natively without heavy dependencies
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            ease: "power1.out",
            duration: 0.3
        });
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        gsap.to(e.currentTarget, {
            rotationX: 0,
            rotationY: 0,
            ease: "power3.out",
            duration: 0.5
        });
    };

    return (
        <section id="services" ref={sectionRef} className="py-32 relative z-10 perspective-[2000px] overflow-hidden">
            <div className="container mx-auto px-6">

                <div className="service-header text-center mb-24">
                    <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-gray-900 dark:text-white mb-6">
                        {t("title_1")} <span className="text-blue-500">{t("title_2")}</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto">
                        {t("subtitle")}
                    </p>
                </div>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                    {servicesData.map((service, i) => (
                        <div
                            key={i}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            className={`service-card transform-gpu will-change-transform relative group p-10 rounded-3xl backdrop-blur-xl bg-white dark:bg-black/40 border border-gray-200/80 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,20,0.07)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(59,130,246,0.12)] dark:hover:shadow-[0_15px_40px_rgba(59,130,246,0.2)] transition-colors duration-500 ${service.border} h-full flex flex-col`}
                        >
                            {/* Inner ambient glow */}
                            <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 bg-gradient-to-br ${service.color} transition-opacity duration-700 pointer-events-none blur-xl -z-10`} />

                            <div className="relative z-10 flex-grow">
                                {service.icon}
                                <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100 tracking-tight">
                                    {service.title}
                                </h3>
                                <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-6">
                                    {service.shortDesc}
                                </p>
                            </div>

                            {/* Corner accent & Read More */}
                            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500 z-20">
                                <Link
                                    href={`/services/${service.slug}`}
                                    className="px-6 py-2 rounded-full bg-blue-500 text-white font-bold text-sm shadow-lg hover:bg-blue-400 transition-colors"
                                >
                                    {t("deep_dive")}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -z-20" />
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none -z-20" />
        </section>
    );
}
