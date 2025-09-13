"use client";
import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * AnimationProvider sets up Lenis smooth scrolling and syncs it with ScrollTrigger.
 */
const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const update = () => ScrollTrigger.update();
    lenis.on('scroll', update);

    return () => {
      lenis.off('scroll', update);
      (lenis as unknown as { destroy: () => void }).destroy();
    };
  }, []);

  return <>{children}</>;
};

export default AnimationProvider;
