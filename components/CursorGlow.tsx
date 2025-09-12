"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * CursorGlow
 * ---------------------------------------------------------------------------
 * Creates a trailing radial gradient glow + small dot that lerps towards the
 * pointer for a smooth, slightly delayed feel. Separated into two absolutely
 * positioned layers so the glow can blur heavily without affecting pointer.
 */
const CursorGlow: React.FC = () => {
    const dotRef = useRef<HTMLDivElement | null>(null);
    const glowRef = useRef<HTMLDivElement | null>(null);
    const pos = useRef({ x: 0, y: 0 });
    const target = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            target.current.x = e.clientX;
            target.current.y = e.clientY;
        };
        window.addEventListener('mousemove', handleMove, { passive: true });

        const tick = () => {
            // Lerp for smooth motion - 0.08 factor gives longer easing tail.
            pos.current.x += (target.current.x - pos.current.x) * 0.08;
            pos.current.y += (target.current.y - pos.current.y) * 0.08;
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
            }
            if (glowRef.current) {
                glowRef.current.style.transform = `translate(${pos.current.x - 200}px, ${pos.current.y - 200}px)`;
            }
            requestAnimationFrame(tick);
        };
        tick();

        return () => {
            window.removeEventListener('mousemove', handleMove);
        };
    }, []);

    return (
        <>
            <div
                ref={glowRef}
                aria-hidden
                className="pointer-events-none fixed left-0 top-0 z-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-fuchsia-500/25 via-indigo-500/15 to-transparent blur-3xl will-change-transform"
            />
            <div
                ref={dotRef}
                aria-hidden
                className="pointer-events-none fixed left-0 top-0 z-50 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-fuchsia-400 to-indigo-400 shadow-[0_0_8px_2px_rgba(168,85,247,0.6)] will-change-transform mix-blend-screen"
            />
        </>
    );
};

export default CursorGlow;
