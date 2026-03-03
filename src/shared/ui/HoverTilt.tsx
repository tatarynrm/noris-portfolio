"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function HoverTilt({
    children,
    className = "",
    intensity = 15, // Max rotation angle
}: {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
}) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const onMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            // Calculate center
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Normalize coordinates from -1 to 1 based on mouse position relative to center
            const xVal = (e.clientX - centerX) / (rect.width / 2);
            const yVal = -(e.clientY - centerY) / (rect.height / 2); // Negate Y so top is positive

            gsap.to(card, {
                rotationY: xVal * intensity,
                rotationX: yVal * intensity,
                transformPerspective: 1000,
                ease: "power1.out",
                duration: 0.6
            });
        };

        const onMouseLeave = () => {
            gsap.to(card, {
                rotationY: 0,
                rotationX: 0,
                ease: "elastic.out(1, 0.3)",
                duration: 1.2
            });
        };

        card.addEventListener("mousemove", onMouseMove);
        card.addEventListener("mouseleave", onMouseLeave);

        return () => {
            card.removeEventListener("mousemove", onMouseMove);
            card.removeEventListener("mouseleave", onMouseLeave);
        };
    }, [intensity]);

    return (
        <div
            ref={cardRef}
            className={`will-change-transform ${className}`}
            style={{ transformStyle: "preserve-3d" }}
        >
            {/* The child contents should ideally have translateZ to pop out */}
            {children}
        </div>
    );
}
