"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function MagneticButton({
    children,
    className = "",
    strength = 40
}: {
    children: React.ReactNode;
    className?: string;
    strength?: number;
}) {
    const magneticRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const magnetic = magneticRef.current;
        if (!magnetic) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { height, width, left, top } = magnetic.getBoundingClientRect();

            // Calculate distance relative to center of element
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);

            gsap.to(magnetic, {
                x: (x / width) * strength,
                y: (y / height) * strength,
                duration: 1,
                ease: "power3.out",
            });
        };

        const handleMouseLeave = () => {
            gsap.to(magnetic, {
                x: 0,
                y: 0,
                duration: 1,
                ease: "elastic.out(1, 0.3)", // The springy snap back
            });
        };

        magnetic.addEventListener("mousemove", handleMouseMove);
        magnetic.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            magnetic.removeEventListener("mousemove", handleMouseMove);
            magnetic.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [strength]);

    return (
        <div ref={magneticRef} className={`inline-block ${className}`}>
            {children}
        </div>
    );
}
