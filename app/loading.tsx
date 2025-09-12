"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Route-level Loading UI (Next.js will show this during suspense / route transitions)
 * "Cool AF" concept: A cosmic forge – rotating glass ring, pulsing core, orbiting shards,
 * progress ticker simulation and skeleton shimmer bars.
 */
const Loading: React.FC = () => {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      gsap.to('[data-rotate]', { rotate: 360, repeat: -1, ease: 'linear', duration: 18 });
      gsap.to('[data-spin-fast]', { rotate: 360, repeat: -1, ease: 'linear', duration: 6 });
      gsap.from('[data-fade-in]', { opacity: 0, y: 30, stagger: 0.12, duration: 0.8, ease: 'power3.out' });
      gsap.to('[data-pulse]', { opacity: 0.35, repeat: -1, yoyo: true, ease: 'sine.inOut', duration: 1.8 });
      gsap.to('[data-orbit] > span', {
        repeat: -1,
        keyframes: {
          '0%': { rotate: 0 },
          '50%': { rotate: 180 },
          '100%': { rotate: 360 },
        },
        ease: 'none',
        duration: 14,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-neutral-950 text-neutral-200">
      {/* Background gradients / stars */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[35%] h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-fuchsia-600/10 blur-3xl" />
        <div className="absolute left-[15%] top-[60%] h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute right-[5%] top-[30%] h-[420px] w-[420px] rounded-full bg-cyan-500/5 blur-[140px]" />
      </div>

      {/* Central construct */}
      <div className="relative mb-16 h-[340px] w-[340px]" data-fade-in>
        {/* Outer glass ring */}
        <div
          data-rotate
          className="absolute inset-0 rounded-full border border-white/10 bg-gradient-to-b from-white/10 to-white/0 backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_8px_40px_-6px_rgba(0,0,0,0.6)]"
        >
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_120deg,rgba(168,85,247,0.4),transparent_40%,transparent_60%,rgba(99,102,241,0.35),transparent_90%)] mix-blend-overlay" />
        </div>
        {/* Inner energy core */}
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 blur-md" data-pulse />
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-950/80 ring-1 ring-white/10 backdrop-blur" />
        {/* Spinner overlay */}
        <svg className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2" data-spin-fast viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="22" strokeWidth="3" className="fill-none stroke-fuchsia-400/30" />
          <circle cx="25" cy="25" r="22" strokeWidth="3" className="fill-none stroke-gradient" strokeDasharray="1 200" strokeLinecap="round" />
        </svg>
        {/* Orbiting shards */}
        <div className="absolute inset-0" data-orbit>
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              style={{ transformOrigin: '170px 170px', rotate: `${(360 / 6) * i}deg` }}
              className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-fuchsia-400 to-indigo-400 shadow-[0_0_12px_2px_rgba(124,58,237,0.6)]"
            />
          ))}
        </div>
      </div>

      {/* Progress + skeleton */}
      <div className="flex w-full max-w-md flex-col gap-8" data-fade-in>
        <div className="space-y-3">
          <div className="h-3 w-1/3 rounded-full loading-gradient-mask" />
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-neutral-800/80">
            <div className="progress-bar h-full w-0 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 shadow-[0_0_0_1px_rgba(255,255,255,0.15)] transition-[width] duration-300 ease-out" />
          </div>
          <p className="text-xs font-medium tracking-wide text-neutral-400">Preparing workspace...</p>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-neutral-800/70 ring-1 ring-white/5 loading-gradient-mask" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 w-2/5 rounded-full bg-neutral-800/70 loading-gradient-mask" />
                <div className="h-2 w-3/5 rounded-full bg-neutral-800/70 loading-gradient-mask" />
              </div>
              <div className="h-2 w-10 rounded-full bg-neutral-800/70 loading-gradient-mask" />
            </div>
          ))}
        </div>
      </div>

      {/* Version / subtle meta */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-wider text-neutral-500" data-fade-in>
        WEBMAKER ENGINE v0.1 • Assembling component graph
      </div>

      <style jsx global>{`
        .stroke-gradient { stroke: url(#grad); animation: dash 2.4s ease-in-out infinite; }
        .progress-bar { width: 0; }
      `}</style>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f472b6" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Loading;
