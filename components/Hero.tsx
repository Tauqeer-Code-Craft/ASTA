"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChatBox from './Designs/ChatBox';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero Section
 * ------------------------------------------------------------
 * Animated marketing hero introducing the cloning/remix value prop.
 * Uses GSAP for staggered entrance of badge, heading, copy & CTA buttons.
 */
const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const animateHeading = () => {
      const heading = heroRef.current!.querySelector('[data-hero-heading]');
      if (!heading) return;

      // If we've already split (SSR re-hydration), skip.
      if (heading.querySelector('[data-word]')) return;

      const original = (heading.textContent || '').trim();
      const words = original.split(/\s+/);
      heading.textContent = '';
      words.forEach((w, i) => {
        const span = document.createElement('span');
        span.dataset.word = 'true';
        span.className = 'inline-block will-change-transform';
        span.textContent = w; // no trailing space inside
        heading.appendChild(span);
        // Add real text node space so browsers render spacing (inline-block gaps) correctly
        if (i < words.length - 1) heading.appendChild(document.createTextNode(' '));
      });

      gsap.from(heading.querySelectorAll('[data-word]'), {
        yPercent: 120,
        opacity: 0,
        rotateX: -50,
        transformOrigin: '50% 100% -20',
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.05,
      });
    };

    const ctx = gsap.context(() => {
      animateHeading();

      gsap.from('[data-hero-fade]', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
      });

    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
  <section id="hero" ref={heroRef} className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pt-10 pb-20 text-center md:px-8 md:pt-16 md:pb-24">
      {/* Decorative radial gradients scoped to hero */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-1/2 h-[300px] w-[300px] sm:h-[500px] md:h-[600px] md:w-[600px] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-1/2 h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px] translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>
      <span data-hero-fade className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium tracking-wide backdrop-blur-md">
        <span className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400" />
        Cooking: <strong className="font-semibold">Something new</strong>
      </span>
      <h1 data-hero-heading className="mx-auto max-w-5xl text-3xl font-bold sm:text-4xl md:text-5xl">
        Let's bring a new vision to life
      </h1>
      <p data-hero-fade className="mx-auto mt-4 max-w-3xl text-balance text-base sm:text-lg leading-relaxed tracking-wider text-neutral-300">
        We turn any website link into a clean, editable design workspace.
      </p>

        {/* Input Field For  Chat Prompt */}
        <ChatBox />
    </section>
  );
};

export default Hero;

/* ---------------- Magnetic Wrapper ---------------- */
interface MagneticProps { children: React.ReactNode; strength?: number }
const Magnetic: React.FC<MagneticProps> = ({ children, strength = 0.25 }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / r.width;
      const y = (e.clientY - (r.top + r.height / 2)) / r.height;
      gsap.to(el, { x: x * 40 * strength, y: y * 40 * strength, duration: 0.4, ease: 'expo.out' });
    };
    const reset = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'expo.out' });
    el.addEventListener('mouseenter', () => window.addEventListener('mousemove', onMove));
    el.addEventListener('mouseleave', () => { window.removeEventListener('mousemove', onMove); reset(); });
    return () => { window.removeEventListener('mousemove', onMove); };
  }, [strength]);
  return <div ref={ref} className="will-change-transform">{children}</div>;
};
