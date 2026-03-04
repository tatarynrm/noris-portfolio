"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParticleImageProps {
    src: string;
    alt: string;
}

export default function ParticleImage({ src, alt }: ParticleImageProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.src = src;
        img.crossOrigin = "anonymous";

        img.onload = () => {
            // Set canvas size based on container or image aspect ratio
            const containerWidth = container.offsetWidth;
            const aspectRatio = img.height / img.width;
            const canvasWidth = containerWidth;
            const canvasHeight = containerWidth * aspectRatio;

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            // Draw image to temporary canvas to get pixel data
            const tempCanvas = document.createElement("canvas");
            const tempCtx = tempCanvas.getContext("2d");
            if (!tempCtx) return;

            tempCanvas.width = 80; // Resolution for particles
            tempCanvas.height = Math.round(80 * aspectRatio);
            tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const data = imageData.data;

            const particles: any[] = [];
            const particleSize = canvas.width / tempCanvas.width;

            for (let y = 0; y < tempCanvas.height; y++) {
                for (let x = 0; x < tempCanvas.width; x++) {
                    const index = (y * tempCanvas.width + x) * 4;
                    const r = data[index];
                    const g = data[index + 1];
                    const b = data[index + 2];
                    const a = data[index + 3];

                    if (a > 128) {
                        particles.push({
                            x: x * particleSize,
                            y: y * particleSize,
                            targetX: x * particleSize,
                            targetY: y * particleSize,
                            // Initial state: scattered below
                            currentX: x * particleSize + (Math.random() - 0.5) * 100,
                            currentY: canvas.height + Math.random() * 200,
                            size: particleSize * 0.9,
                            color: `rgb(${r},${g},${b})`,
                            alpha: 0,
                            delay: (tempCanvas.height - y) * 0.015 + Math.random() * 0.5,
                        });
                    }
                }
            }

            const render = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach((p) => {
                    ctx.globalAlpha = p.alpha;
                    ctx.fillStyle = p.color;
                    ctx.fillRect(p.currentX, p.currentY, p.size, p.size);
                });
            };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: "top 80%",
                    once: true,
                },
                onUpdate: render,
            });

            particles.forEach((p) => {
                tl.to(p, {
                    currentX: p.targetX,
                    currentY: p.targetY,
                    alpha: 1,
                    duration: 1.2,
                    delay: p.delay,
                    ease: "power3.out",
                }, 0);
            });
        };
    }, [src]);

    return (
        <div ref={containerRef} className="w-full h-full relative">
            <canvas
                ref={canvasRef}
                className="w-full h-full object-cover"
                style={{ filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.5))" }}
                aria-label={alt}
            />
        </div>
    );
}
