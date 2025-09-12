"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card, Button } from './ui/aceternity';
import { FEATURE_ITEMS } from '../config/features';

gsap.registerPlugin(ScrollTrigger);

/**
 * Feature Grid
 * ------------------------------------------------------------
 * Stagger‑animates feature cards into view with ScrollTrigger.
 * Data is sourced from FEATURE_ITEMS config for easy edits.
 */
const Feature: React.FC = () => {
  const cardsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!cardsRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-card]', {
        opacity: 0,
        y: 60,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 80%',
        },
      });
      // Card tilt / spotlight
      document.querySelectorAll('[data-card]').forEach(card => {
        const c = card as HTMLElement;
        const spot = document.createElement('span');
        spot.className = 'pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100';
        spot.style.background = 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18), transparent 70%)';
        c.appendChild(spot);
        c.addEventListener('pointermove', (e) => {
          const r = c.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width) * 100;
          const y = ((e.clientY - r.top) / r.height) * 100;
          spot.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.18), transparent 70%)`;
          gsap.to(c, { rotateX: (0.5 - y/100) * 8, rotateY: (x/100 - 0.5) * 12, transformPerspective: 800, duration: 0.6, ease: 'expo.out' });
        });
        c.addEventListener('pointerleave', () => gsap.to(c, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'expo.out' }));
      });
    }, cardsRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={cardsRef} id="features" className="mx-auto -mt-10 max-w-7xl px-4 pb-40 md:px-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURE_ITEMS.map((item, idx) => (
          <Card
            data-card
            key={item.title}
            tone={['fuchsia','indigo','cyan','neutral','fuchsia','indigo'][idx % 6] as any}
            className="flex flex-col justify-between gap-4"
          >
            <div>
              <h3 className="mb-2 text-lg font-semibold tracking-wide">{item.title}</h3>
              <p className="text-sm leading-relaxed text-neutral-300/90">{item.desc}</p>
            </div>
            <div className="mt-2 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <Button variant="subtle" size="sm" className="gap-1 text-fuchsia-300 hover:text-fuchsia-200 px-0">
              Explore <span className="translate-y-px transition group-hover:translate-x-0.5">→</span>
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Feature;
