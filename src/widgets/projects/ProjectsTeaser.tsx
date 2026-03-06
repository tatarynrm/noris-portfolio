"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────── *
 *  ProjectsTeaser                                             *
 *  Sticky section: image starts tiny (scale 0.08), zooms to  *
 *  full-screen as the user scrolls through the 200vh section.*
 *  Title fades in from below once the image is large enough. *
 * ─────────────────────────────────────────────────────────── */
export function ProjectsTeaser() {
    const t = useTranslations("projects");
    const wrapRef = useRef<HTMLDivElement>(null);
    const imgWrapRef = useRef<HTMLDivElement>(null);
    const imgInnerRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!wrapRef.current || !imgWrapRef.current) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1.2,
                    invalidateOnRefresh: true,
                },
            });

            /* Image Wrapper: large → normal */
            tl.fromTo(
                imgWrapRef.current,
                { scale: 2 },
                { scale: 1, ease: "none" },
                0
            );

            /* Inner Image Parallax */
            if (imgInnerRef.current) {
                tl.fromTo(
                    imgInnerRef.current,
                    { y: "-10%" },
                    { y: "10%", ease: "none" },
                    0
                );
            }

            /* Label Container: fades in once image is ~30% grown */
            tl.fromTo(
                labelRef.current,
                { opacity: 0, filter: "blur(12px)" },
                { opacity: 1, filter: "blur(0px)", ease: "power2.out" },
                0.30
            );

            /* Words reveal stagger from depth */
            if (labelRef.current) {
                const words = labelRef.current.querySelectorAll(".teaser-word");
                if (words.length) {
                    tl.fromTo(
                        words,
                        { y: "150%", rotationX: -90, opacity: 0, scale: 0.8 },
                        { y: "0%", rotationX: 0, opacity: 1, scale: 1, stagger: 0.12, ease: "back.out(1.4)" },
                        0.35
                    );
                }

                /* Title pulse glow */
                tl.fromTo(
                    labelRef.current.querySelector(".teaser-glow"),
                    { opacity: 0, scale: 0.8 },
                    { opacity: 1, scale: 1.2, duration: 1, ease: "power2.out" },
                    0.5
                );
            }

            /* Label: fades out near the end (user is "passing through") */
            tl.to(
                labelRef.current,
                { opacity: 0, y: -50, scale: 1.1, filter: "blur(20px)", ease: "power3.in" },
                0.85
            );

        }, wrapRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={wrapRef}
            className="relative bg-black"
            style={{ height: "160vh" }}
        >
            {/* ── sticky viewport ── */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

                {/* Scaled image wrapper */}
                <div
                    ref={imgWrapRef}
                    className="absolute inset-x-0 inset-y-0 will-change-transform overflow-hidden"
                    style={{
                        transform: "scale(2)",
                        transformOrigin: "center center",
                    }}
                >
                    <div ref={imgInnerRef} className="absolute inset-x-0 -top-[15vh] w-full h-[130vh] will-change-transform">
                        <Image
                            src="/projects-teaser-hq.png"
                            alt="Projects preview"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    {/* Cinematic overlays */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 md:mix-blend-multiply" />

                    {/* Glowing radial center */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_60%)] pointer-events-none" />

                    {/* Scanlines texture */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-20"
                        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.8) 2px, rgba(0,0,0,0.8) 4px)' }}
                    />
                </div>

                {/* Label */}
                <div
                    ref={labelRef}
                    className="relative z-10 flex flex-col items-center gap-5 px-6 text-center"
                    style={{ opacity: 0 }}
                >
                    {/* eyebrow */}
                    <p className="text-[10px] font-mono tracking-[0.6em] text-blue-400/70 uppercase">
                        / {t("teaser_selected")} /
                    </p>

                    {/* Premium Typography Glow Behind Text */}
                    <div className="teaser-glow hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none -z-10" />

                    <h2
                        className="font-black uppercase leading-[0.85] tracking-[-0.04em] perspective-[1200px]"
                        style={{
                            fontSize: "clamp(3rem, 10vw, 9rem)",
                            background: "linear-gradient(135deg, #ffffff 20%, #93c5fd 60%, #3b82f6 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            filter: "drop-shadow(0 10px 40px rgba(59,130,246,0.4))",
                        }}
                    >
                        <div className="overflow-hidden pb-2"><div className="teaser-word inline-block origin-bottom transform-gpu">{t("teaser_headline_1")}</div></div><br />
                        <div className="overflow-hidden pb-2"><div className="teaser-word inline-block origin-bottom transform-gpu">{t("teaser_headline_2")}</div></div><br />

                        <div className="mt-6 sm:mt-8 overflow-hidden">
                            <span
                                className="teaser-word inline-block origin-bottom transform-gpu"
                                style={{ fontSize: "0.45em", letterSpacing: "0.2em", WebkitTextFillColor: "rgba(255,255,255,0.5)", textShadow: "none" }}
                            >
                                {t("teaser_sub")}
                            </span>
                        </div>
                    </h2>

                    {/* scroll hint arrow */}
                    <div className="flex flex-col items-center gap-1 mt-4 animate-bounce">
                        <div className="w-px h-8 bg-gradient-to-b from-transparent to-blue-400/60" />
                        <div
                            className="w-3 h-3 border-r-2 border-b-2 border-blue-400/60 rotate-45 -mt-2"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
