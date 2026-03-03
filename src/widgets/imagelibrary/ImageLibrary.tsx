"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const images = [
    {
        src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop",
        alt: "Multi-monitor dark IDE setup",
        span: "col-span-1 md:col-span-2 row-span-2"
    },
    {
        src: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2000&auto=format&fit=crop",
        alt: "Clean HTML code on screen",
        span: "col-span-1 row-span-1"
    },
    {
        src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000&auto=format&fit=crop",
        alt: "Hacker terminal setup",
        span: "col-span-1 row-span-1"
    },
    {
        src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000&auto=format&fit=crop",
        alt: "Laptop typing view",
        span: "col-span-1 md:col-span-2 row-span-1"
    },
    {
        src: "https://images.unsplash.com/photo-1607799279861-4dddf91e46fa?q=80&w=2000&auto=format&fit=crop",
        alt: "Abstract neon tech hardware",
        span: "col-span-1 row-span-2"
    },
    {
        src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop",
        alt: "Processor motherboard glowing",
        span: "col-span-1 md:col-span-2 row-span-1"
    }
];

export function ImageLibrary() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".gallery-header", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power4.out"
            });

            gsap.from(".gallery-item", {
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top 70%",
                },
                scale: 0.8,
                rotationY: 10,
                opacity: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: "expo.out",
                transformOrigin: "center center"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Interactive 3D tilt tracking for premium glass elements
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -15; // Invert Y
        const rotateY = ((x - centerX) / centerX) * 15;  // Normal X

        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            ease: "power2.out",
            duration: 0.4,
            zIndex: 10,
            scale: 1.02
        });

        // Move inner reflection
        const reflection = card.querySelector(".glass-reflection");
        if (reflection) {
            gsap.to(reflection, {
                x: (x - centerX) * 0.2,
                y: (y - centerY) * 0.2,
                opacity: 0.8,
                duration: 0.4
            });
        }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            zIndex: 1,
            ease: "power3.out",
            duration: 0.7
        });

        const reflection = card.querySelector(".glass-reflection");
        if (reflection) {
            gsap.to(reflection, {
                x: 0,
                y: 0,
                opacity: 0,
                duration: 0.7
            });
        }
    };

    return (
        <section id="gallery" ref={sectionRef} className="py-32 relative z-10 perspective-[2000px]">
            <div className="container mx-auto px-6">

                <div className="gallery-header text-center mb-20 relative z-10">
                    <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-gray-900 dark:text-white mb-6">
                        System <span className="text-blue-500">Architecture</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto">
                        A visual library honoring the hardware and environments that run our algorithms.
                    </p>
                </div>

                <div
                    ref={gridRef}
                    className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-6 auto-rows-[250px]"
                >
                    {images.map((img, i) => (
                        <div
                            key={i}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            className={`gallery-item ${img.span} relative rounded-3xl overflow-hidden cursor-crosshair transform-gpu will-change-transform shadow-[0_15px_35px_rgba(0,0,0,0.1)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)]`}
                        >
                            {/* Base image layer */}
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover relative z-0 group-hover:scale-110 transition-transform duration-[2s] ease-out"
                            />

                            {/* Glassmorphism Frame Overlay */}
                            <div className="absolute inset-x-2 inset-y-2 lg:inset-x-4 lg:inset-y-4 rounded-2xl border border-white/10 dark:border-white/5 z-10 overflow-hidden backdrop-blur-md bg-white/5 dark:bg-black/20 group-hover:border-white/30 dark:group-hover:border-white/20 hover:bg-white/10 dark:hover:bg-black/40 transition-colors duration-500 shadow-[inset_0_0_30px_rgba(255,255,255,0.02)]">

                                <div className="absolute bottom-6 left-6 right-6">
                                    <h3 className="text-white text-xl md:text-2xl font-extrabold tracking-wide drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] group-hover:text-blue-300 transition-colors duration-300">
                                        {img.alt}
                                    </h3>
                                    {/* Premium Animated Highlight Line */}
                                    <div className="h-[2px] w-0 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-1/2 transition-all duration-700 ease-out mt-3 shadow-[0_0_15px_rgba(96,165,250,0.8)] rounded-full" />
                                </div>

                                {/* Dynamic Reflection div */}
                                <div className="glass-reflection absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 mix-blend-overlay pointer-events-none" />
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gray-50/50 dark:from-black/50 to-transparent -z-10 pointer-events-none" />
        </section>
    );
}
