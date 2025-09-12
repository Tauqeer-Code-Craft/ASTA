"use client";
import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';

/**
 * SplashScreen – full screen pre-entry animation shown only once on initial load.
 * After animation completes (or user clicks skip), it fades out and unmounts.
 */
const MIN_VISIBLE_MS = 1600; // guarantee we show at least this long

const SplashScreen: React.FC = () => {
  const [done, setDone] = useState(false);
  const [start] = useState(() => performance.now());

  useEffect(() => {
    // Main timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.splash-ring', { scale: 0.4, opacity: 0, duration: 0.9 })
      .from('.splash-logo', { y: 40, opacity: 0, duration: 0.6 }, '-=0.4')
      .from('.splash-sub', { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
      .to('.splash-pulse', { opacity: 0.2, repeat: -1, yoyo: true, duration: 1.4 }, '-=1');

    const spin = gsap.to('.splash-arc', { rotate: 360, repeat: -1, ease: 'linear', duration: 8 });

    return () => { tl.kill(); spin.kill(); };
  }, []);

  const finish = () => {
    const elapsed = performance.now() - start;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
    setTimeout(() => setDone(true), remaining);
  };

  useEffect(() => {
    // Auto finish after timeline + min duration (approx) – could tie to asset preload.
    const auto = setTimeout(finish, 3000);
    return () => clearTimeout(auto);
  }, []);

  if (done) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950 text-neutral-100">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/15 blur-3xl" />
        <div className="absolute left-[20%] top-[65%] h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-indigo-600/15 blur-2xl" />
        <div className="absolute right-[15%] top-[35%] h-[420px] w-[420px] rounded-full bg-pink-500/10 blur-[140px]" />
      </div>
      {/* Core content */}
      <div className="relative flex flex-col items-center">
        <div className="relative mb-10 h-60 w-60">
          <div className="absolute inset-0 rounded-full border border-white/10 backdrop-blur splash-ring" />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),rgba(255,255,255,0)_70%)]" />
          <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 blur splash-pulse" />
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-950/80 ring-1 ring-white/10" />
          <span className="absolute left-1/2 top-1/2 h-[2px] w-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent splash-arc" />
        </div>
        <h1 className="splash-logo mb-3 bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent">WebMaker</h1>
        <p className="splash-sub mb-8 text-sm text-neutral-400">Cloning the canvas...</p>
        <button onClick={finish} className="group relative inline-flex items-center gap-2 rounded-md bg-white/10 px-5 py-2 text-xs font-medium text-neutral-200 ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15">
          Skip
          <span className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),rgba(255,255,255,0)_60%)]" />
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;
