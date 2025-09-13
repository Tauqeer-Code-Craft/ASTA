"use client";
import { signIn } from "next-auth/react";
import { Github, Globe2, Moon } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { GlassPanel } from '../../components/ui/GlassPanel';
import { useTilt } from '../../lib/useTilt';

export default function SignInPage() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const tiltRef = useTilt<HTMLDivElement>({ max: 10, scale: 1.02 });

  const handle = (prov: string) => {
    setLoadingProvider(prov);
    signIn(prov, { callbackUrl: '/' });
  };

  const baseBtn = 'group w-full relative overflow-hidden rounded-lg border border-white/10 bg-neutral-900/60 px-4 py-3 text-sm font-medium text-neutral-100 shadow-sm backdrop-blur transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 disabled:opacity-60 disabled:cursor-wait';

  return (
    <main className="relative min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Ambient Orbs */}
      <AmbientOrbs />
      <div className="relative w-full max-w-md">
        <GlassPanel ref={tiltRef as any} accent="purple" className="p-10 backdrop-saturate-150">
          <div className="space-y-8">
            <header className="text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-fuchsia-500/30 ring-1 ring-white/10 shadow-inner shadow-fuchsia-500/10">
                <Moon className="w-6 h-6 text-fuchsia-200" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">Welcome Back</h1>
              <p className="text-[13px] text-neutral-400 max-w-xs mx-auto leading-relaxed">Sign in using a provider below. We never store passwords – OAuth only.</p>
            </header>
            <div className="space-y-4">
              <ProviderButton
                icon={<Github className="w-4 h-4" />}
                label="Continue with GitHub"
                loadingLabel="Redirecting…"
                loading={loadingProvider === 'github'}
                onClick={() => handle('github')}
                variant="indigo"
                disabled={!!loadingProvider}
              />
              <ProviderButton
                icon={<Globe2 className="w-4 h-4" />}
                label="Continue with Google"
                loadingLabel="Redirecting…"
                loading={loadingProvider === 'google'}
                onClick={() => handle('google')}
                variant="fuchsia"
                disabled={!!loadingProvider}
              />
            </div>
            <p className="text-center text-[11px] leading-relaxed text-neutral-500">
              By continuing you agree to our <Link href="#" className="underline decoration-dotted hover:text-neutral-300">Terms</Link> & <Link href="#" className="underline decoration-dotted hover:text-neutral-300">Privacy</Link>.
            </p>
          </div>
        </GlassPanel>
      </div>
    </main>
  );
}

/* Provider Button */
const ProviderButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  loadingLabel: string;
  loading?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'indigo' | 'fuchsia';
}> = ({ icon, label, loadingLabel, loading, onClick, disabled, variant = 'indigo' }) => {
  const color = variant === 'indigo'
    ? 'hover:border-indigo-400/60 focus-visible:ring-indigo-400/40'
    : 'hover:border-fuchsia-400/60 focus-visible:ring-fuchsia-400/40';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-busy={loading}
      className={`relative w-full overflow-hidden rounded-lg border border-white/10 bg-neutral-900/70 px-4 py-3 text-sm font-medium text-neutral-100 backdrop-blur group transition focus-visible:outline-none focus-visible:ring-2 ${color} disabled:opacity-60 disabled:cursor-wait`}
    >
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-fuchsia-500/10" />
      <span className="relative flex items-center justify-center gap-2">
        {loading && <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />}
        {icon}
        {loading ? loadingLabel : label}
      </span>
    </button>
  );
};

/* Ambient Orbs */
const AmbientOrbs: React.FC = () => {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <style>{`@keyframes floatPulse{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-28px) scale(1.06)}}@keyframes drift{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(40px,-30px,0)}}`}</style>
      <div className="absolute w-[420px] h-[420px] -top-32 -left-32 rounded-full bg-gradient-to-br from-indigo-600/30 via-purple-600/25 to-fuchsia-600/20 blur-3xl animate-[drift_14s_ease-in-out_infinite]" />
      <div className="absolute w-60 h-60 top-1/3 -right-24 rounded-full bg-gradient-to-br from-fuchsia-500/25 via-purple-500/20 to-indigo-500/20 blur-2xl animate-[floatPulse_11s_ease-in-out_infinite]" />
    </div>
  );
};
