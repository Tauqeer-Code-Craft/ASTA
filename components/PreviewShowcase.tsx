"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/*
  PreviewShowcase
  ------------------------------------------------------------------
  Renders a stylized dashboard preview similar to the provided reference image:
  - Curved sunrise arc glow behind the mock dashboard
  - Subtle orange/amber accent borders
  - Glass panels with metric cards & activity lists
  This is a purely presentational mock (no charts lib) using CSS gradients + svg spark lines.
*/

// Sparkline path (purely decorative). Keeping short path for bundle weight.
const sparkPath = "M1 12 C 6 2, 10 22, 15 8 C 18 2, 22 18, 28 6";

interface Metric { label: string; value: string; delta: string; up: boolean }
const metrics: Metric[] = [
  { label: 'Total Users', value: '72,350', delta: '+6.9%', up: true },
  { label: 'Sessions', value: '29.4%', delta: '-12.5%', up: false },
  { label: 'Avg. Click Rate', value: '56.8%', delta: '+19.3%', up: true },
  { label: 'Pageviews', value: '92,913', delta: '-12.5%', up: false },
];

interface Integration { name: string; type: string }
const integrations: Integration[] = [
  { name: 'Huse', type: 'Users' },
  { name: 'Penta', type: 'Users' },
  { name: 'Border', type: 'Logs' },
  { name: 'Eclipse', type: 'Events' },
];

/* ---------------- Sub‑Components ---------------- */
const MetricCard: React.FC<{ metric: Metric }> = ({ metric }) => (
  <div className="group relative overflow-hidden rounded-lg border border-amber-500/15 bg-neutral-950/50 p-4 shadow-inner shadow-black/40 ring-1 ring-black/40">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[11px] uppercase tracking-wide text-neutral-400">{metric.label}</p>
        <p className="mt-2 text-sm font-semibold text-neutral-200">{metric.value}</p>
      </div>
      <span className={`text-[11px] font-medium ${metric.up ? 'text-emerald-400' : 'text-rose-400'}`}>{metric.delta}</span>
    </div>
    <svg viewBox="0 0 30 24" className="mt-3 h-10 w-full stroke-amber-400/70" fill="none">
      <path d={sparkPath} vectorEffect="non-scaling-stroke" strokeWidth={1.4} strokeLinecap="round" className="transition group-hover:stroke-amber-300" />
    </svg>
    <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(circle_at_70%_30%,rgba(255,170,60,0.15),transparent_70%)]" />
  </div>
);

const IntegrationRow: React.FC<{ integration: Integration }> = ({ integration }) => (
  <li className="flex items-center justify-between rounded-md border border-white/5 bg-neutral-900/40 px-3 py-2">
    <div className="flex items-center gap-2">
      <span className="h-6 w-6 rounded-md bg-gradient-to-br from-neutral-700 to-neutral-800 ring-1 ring-white/10" />
      <div>
        <p className="font-medium text-neutral-300">{integration.name}</p>
        <p className="text-[10px] uppercase tracking-wide text-neutral-500">{integration.type}</p>
      </div>
    </div>
    <button className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[10px] font-medium text-amber-300 shadow-inner shadow-black/40 transition hover:bg-amber-500/20">Launch importer</button>
  </li>
);

const PreviewShowcase: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-dashboard-fade]', { opacity: 0, y: 40, duration: 1, stagger: 0.12, ease: 'power3.out' });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative mx-auto -mt-10 mb-24 max-w-6xl px-4 md:px-8">
      {/* Arc glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
        <div className="relative h-[420px] w-full max-w-5xl">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,130,46,0.55),rgba(0,0,0,0)_70%)] blur-2xl" />
          <div className="absolute left-1/2 top-1/2 h-[340px] w-[900px] -translate-x-1/2 -translate-y-1/2 rotate-[8deg] rounded-[50%] border border-white/5 bg-[conic-gradient(from_140deg_at_50%_50%,rgba(255,120,40,0.9),rgba(255,90,20,0.2),rgba(0,0,0,0)_70%)] opacity-60 blur-md" />
          <div className="absolute left-1/2 top-1/2 h-[360px] w-[940px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-gradient-to-r from-amber-500/20 via-transparent to-orange-500/20 blur-3xl" />
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-3 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_4px_24px_-4px_rgba(0,0,0,0.5)]" data-dashboard-fade>
        {/* Top bar */}
        <div className="flex items-center justify-between rounded-lg border border-white/5 bg-neutral-950/70 px-5 py-3">
          <div className="flex items-center gap-2 font-semibold tracking-wide text-neutral-200 text-sm">
            <span className="mr-1 inline-flex h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />WebMaker
          </div>
          <nav className="hidden items-center gap-6 text-xs font-medium text-neutral-400 md:flex">
            {['Analytics','Products','Customers','Campaigns','Settings'].map(i => (
              <span key={i} className="relative cursor-default transition hover:text-neutral-200">
                {i}
              </span>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button className="rounded-md border border-white/10 bg-neutral-800/60 px-3 py-1.5 text-xs text-neutral-300 shadow-inner shadow-black/40 transition hover:border-amber-500/40 hover:text-white">Invite users</button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 ring-1 ring-white/10" />
          </div>
        </div>

        <div className="grid gap-6 p-5 md:grid-cols-5">
          <div className="md:col-span-5" data-dashboard-fade>
            <h3 className="mb-5 text-xl font-semibold text-neutral-100">Dashboard</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map(m => <MetricCard key={m.label} metric={m} />)}
            </div>
          </div>

          <div className="md:col-span-3" data-dashboard-fade>
            <div className="h-full rounded-lg border border-amber-500/20 bg-neutral-950/40 p-5 shadow-inner shadow-black/40">
              <h4 className="mb-4 text-sm font-semibold text-neutral-200">Import data into Front Dashboard</h4>
              <ul className="space-y-2 text-xs">
                {integrations.map(integ => <IntegrationRow key={integ.name} integration={integ} />)}
              </ul>
            </div>
          </div>

          <div className="md:col-span-2" data-dashboard-fade>
            <div className="h-full rounded-lg border border-amber-500/20 bg-neutral-950/40 p-5 shadow-inner shadow-black/40 flex flex-col">
              <h4 className="mb-4 text-sm font-semibold text-neutral-200">Monthly expenses</h4>
              <div className="mt-auto grid grid-cols-7 items-end gap-1 pt-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="relative flex h-28 w-full items-end">
                    <div className="w-full rounded-sm bg-gradient-to-t from-neutral-800 to-neutral-700">
                      <div style={{ height: `${30 + (i * 8) % 70}%` }} className="w-full rounded-sm bg-gradient-to-t from-orange-600 via-amber-500 to-amber-300 shadow-[0_0_0_1px_rgba(0,0,0,0.4)]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PreviewShowcase;
