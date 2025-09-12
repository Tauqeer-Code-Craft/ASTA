"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Ambient – subtle moving gradient blobs reacting to scroll + pointer */
const Ambient: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const blobs = el.querySelectorAll('[data-blob]');
    // Scroll parallax
    blobs.forEach((b, i) => {
      gsap.to(b, { yPercent: i % 2 === 0 ? -15 : 18, scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }, ease: 'none' });
    });
    // Pointer shift
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      gsap.to(blobs, { x, y, duration: 2, ease: 'expo.out' });
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div data-blob className="absolute left-[-10%] top-[10%] h-[50vw] w-[50vw] rounded-full bg-fuchsia-600/25 blur-[140px] mix-blend-screen" />
      <div data-blob className="absolute right-[-15%] top-[25%] h-[45vw] w-[45vw] rounded-full bg-indigo-600/20 blur-[160px] mix-blend-screen" />
      <div data-blob className="absolute left-[30%] bottom-[-20%] h-[55vw] w-[55vw] rounded-full bg-purple-600/20 blur-[160px] mix-blend-screen" />
    </div>
  );
};

export default Ambient;
