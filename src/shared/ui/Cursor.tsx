"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Cursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;
        if (!cursor || !follower) return;

        // Keep track of cursor position
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let followerX = 0;
        let followerY = 0;

        // Set up GSAP ticker for smooth follow
        const onFrame = () => {
            cursorX += (mouseX - cursorX) * 0.5;
            cursorY += (mouseY - cursorY) * 0.5;

            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;

            gsap.set(cursor, { x: cursorX, y: cursorY });
            gsap.set(follower, { x: followerX, y: followerY });
        };
        gsap.ticker.add(onFrame);

        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };
        window.addEventListener("mousemove", onMouseMove);

        // Hover effects on links/buttons
        const onMouseEnter = () => {
            gsap.to(cursor, { scale: 0, duration: 0.2 });
            gsap.to(follower, {
                scale: 1.5,
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderColor: "rgba(59, 130, 246, 0.8)",
                duration: 0.3,
                ease: "power2.out"
            });
        };

        const onMouseLeave = () => {
            gsap.to(cursor, { scale: 1, duration: 0.2 });
            gsap.to(follower, {
                scale: 1,
                backgroundColor: "transparent",
                borderColor: "rgba(255, 255, 255, 0.2)",
                duration: 0.3,
                ease: "power2.out"
            });
        };

        // Attach to all a, button, input elements
        const attachHover = () => {
            const interactables = document.querySelectorAll("a, button, input, textarea, .project-card, .story-img");
            interactables.forEach((el) => {
                el.addEventListener("mouseenter", onMouseEnter);
                el.addEventListener("mouseleave", onMouseLeave);
            });
        };
        attachHover();

        // Re-attach observer if DOM changes (like Route changes inside Next.js)
        const observer = new MutationObserver(() => {
            attachHover();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            gsap.ticker.remove(onFrame);
            observer.disconnect();
            const interactables = document.querySelectorAll("a, button, input, textarea, .project-card, .story-img");
            interactables.forEach((el) => {
                el.removeEventListener("mouseenter", onMouseEnter);
                el.removeEventListener("mouseleave", onMouseLeave);
            });
        };
    }, []);

    return (
        <div className="hidden md:block pointer-events-none z-[9999] fixed inset-0">
            {/* The main dot */}
            <div
                ref={cursorRef}
                className="absolute w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 mix-blend-difference z-[9999]"
                style={{ top: 0, left: 0 }}
            />
            {/* The trailing ring */}
            <div
                ref={followerRef}
                className="absolute w-10 h-10 border border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2 z-[9998] backdrop-blur-[2px]"
                style={{ top: 0, left: 0 }}
            />
        </div>
    );
}
