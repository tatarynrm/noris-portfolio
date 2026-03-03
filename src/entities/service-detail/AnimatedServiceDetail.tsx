"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

gsap.registerPlugin(TextPlugin);

export function AnimatedServiceDetail({ service }: { service: any }) {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const toolsRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Icon pop-in
            gsap.from(iconRef.current, {
                scale: 0,
                rotation: -180,
                opacity: 0,
                duration: 1,
                ease: "back.out(1.5)"
            });

            // Title fade & slide
            gsap.from(titleRef.current, {
                y: 50,
                opacity: 0,
                duration: 1,
                delay: 0.3,
                ease: "power4.out"
            });

            // Typing effect for the short description
            const originalText = service.shortDesc;
            gsap.to(descRef.current, {
                duration: originalText.length * 0.03, // Dynamic duration based on text length
                text: originalText,
                ease: "none",
                delay: 0.6
            });

            // Staggered tool pills
            if (toolsRef.current) {
                gsap.from(toolsRef.current.children, {
                    scale: 0.5,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "back.out(2)",
                    delay: 1.2
                });
            }

            // Fade up content blocks sequentially
            if (contentRef.current) {
                const elements = contentRef.current.querySelectorAll("h2, h3, p");
                gsap.from(elements, {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out",
                    delay: 1.5
                });
            }
        });

        return () => ctx.revert();
    }, [service]);

    return (
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
            <Link
                href="/#services"
                className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-blue-500 transition-colors mb-12 group"
            >
                <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-2 transition-transform" />
                Return to Architecture
            </Link>

            <header className="mb-16">
                <div ref={iconRef} className={`inline-flex items-center justify-center p-6 rounded-3xl backdrop-blur-md bg-white/50 dark:bg-white/5 border border-white/20 mb-8 shadow-xl ${service.border}`}>
                    {service.icon}
                </div>
                <h1 ref={titleRef} className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white mb-6">
                    {service.title}
                </h1>
                <p ref={descRef} className="text-xl md:text-2xl text-blue-500 font-light leading-relaxed min-h-[4rem]">
                    {/* GSAP will inject typing text here */}
                </p>
            </header>

            <div ref={toolsRef} className="flex flex-wrap gap-3 mb-16">
                {service.tools.map((tool: string, index: number) => (
                    <span
                        key={index}
                        className="px-5 py-2 rounded-full text-sm font-bold bg-white dark:bg-white/10 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.05)]"
                    >
                        {tool}
                    </span>
                ))}
            </div>

            <article ref={contentRef} className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-500 hover:prose-a:text-blue-400 prose-strong:text-cyan-600 dark:prose-strong:text-cyan-400 prose-p:leading-[1.8] prose-p:text-gray-600 dark:prose-p:text-gray-300">
                <ReactMarkdown>{service.content}</ReactMarkdown>
            </article>
        </div>
    );
}
