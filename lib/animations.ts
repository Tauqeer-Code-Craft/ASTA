"use client";
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useFadeInOnScroll
 * Fades & translates an element in when it enters viewport.
 */
export function useFadeInOnScroll<T extends HTMLElement>(options?: { y?: number; duration?: number; delay?: number }) {
  const ref = useRef<T | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.set(el, { autoAlpha: 0, y: options?.y ?? 24 });
      gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        ease: 'power3.out',
        duration: options?.duration ?? 0.9,
        delay: options?.delay ?? 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [options?.y, options?.duration, options?.delay]);
  return ref;
}

/**
 * useStaggerChildren
 * Staggers child elements with [data-animate] attribute when parent hits viewport.
 */
export function useStaggerChildren<T extends HTMLElement>(options?: { duration?: number; stagger?: number; y?: number }) {
  const ref = useRef<T | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll('[data-animate]');
    const ctx = gsap.context(() => {
      gsap.set(targets, { autoAlpha: 0, y: options?.y ?? 18 });
      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        ease: 'power3.out',
        duration: options?.duration ?? 0.7,
        stagger: options?.stagger ?? 0.08,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [options?.duration, options?.stagger, options?.y]);
  return ref;
}

/**
 * useParallax
 * Basic parallax translation on scroll relative to viewport.
 */
export function useParallax<T extends HTMLElement>(factor = 0.4) {
  const ref = useRef<T | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { y: () => 80 * factor }, {
        y: () => -80 * factor,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          scrub: true,
          start: 'top bottom',
          end: 'bottom top',
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [factor]);
  return ref;
}

/** Utility to quickly animate a highlight / pulse */
export function flash(el: HTMLElement | null) {
  if (!el) return;
  gsap.fromTo(el, { boxShadow: '0 0 0px 0px rgba(255,255,255,0.0)' }, { boxShadow: '0 0 32px 4px rgba(255,255,255,0.25)', duration: 0.5, yoyo: true, repeat: 1, ease: 'power2.out' });
}
