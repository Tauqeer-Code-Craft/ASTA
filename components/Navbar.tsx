"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { NAV_LINKS } from '../config/navigation';


const SCROLL_SHADOW_THRESHOLD = 6;

/* ---------------- Hooks ---------------- */
/** Hook encapsulating hover highlight animation logic for desktop nav links. */
function useHoverHighlight() {
  const listRef = useRef<HTMLUListElement | null>(null);
  const highlightRef = useRef<HTMLSpanElement | null>(null);

  const moveTo = (el: HTMLElement | null) => {
    if (!highlightRef.current || !el || !listRef.current) return;
    const listRect = listRef.current.getBoundingClientRect();
    const { left, width } = el.getBoundingClientRect();
    const x = left - listRect.left;
    highlightRef.current.style.transform = `translateX(${x}px)`;
    highlightRef.current.style.width = `${width}px`;
    highlightRef.current.style.opacity = '1';
  };

  const reset = () => {
    if (!highlightRef.current) return;
    highlightRef.current.style.opacity = '0';
    // scaleX shrink gives a gentle retreat effect
    highlightRef.current.style.transform += ' scaleX(0.6)';
  };

  return { listRef, highlightRef, moveTo, reset } as const;
}

const Navbar: React.FC = () => {
  // State: mobile menu open + shadow/backdrop after minimal scroll
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close menu automatically when viewport crosses md breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle backdrop style when user scrolls down a few pixels
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggle = useCallback(() => setOpen(o => !o), []);
  const close = useCallback(() => setOpen(false), []);

  // Hover highlight (desktop only)
  const { listRef, highlightRef, moveTo, reset } = useHoverHighlight();

  return (
    <header
      className={`sticky top-0 z-50 w-screen border-b transition-colors ${
        scrolled
          ? 'backdrop-blur-md bg-neutral-950/80 border-white/10'
          : 'bg-neutral-950/40 border-transparent'
      }`}
      role="banner"
    >
        <nav className="flex max-w-screen-xl mx-auto items-center justify-between px-4 py-3 md:py-4" aria-label="Main Navigation">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="group inline-flex items-center gap-2" onClick={close}>
            <span className="relative flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-white font-semibold shadow-sm ring-1 ring-black/5">
              <span className="text-sm">ASTA</span>
            </span>
            {/* <span className="font-semibold text-lg tracking-tight">WebMaker</span> */}
          </Link>
        </div>

        {/* Desktop Links */}
        <ul
          ref={listRef}
          className="relative hidden md:flex items-center gap-8 text-sm font-medium"
          role="menubar"
          onMouseLeave={reset}
        >
          {/* Animated highlight bar */}
          <span
            ref={highlightRef}
            aria-hidden
            className="pointer-events-none absolute -bottom-2 left-0 h-[2px] w-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 opacity-0 transition-all duration-300 ease-[cubic-bezier(.65,.2,.2,1)]"
          />
          {NAV_LINKS.map(l => (
            <li key={l.href} role="none" className="relative">
              <a
                role="menuitem"
                href={l.href}
                onMouseEnter={(e) => moveTo(e.currentTarget)}
                className="relative inline-flex items-center py-1 text-gray-300 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:text-white"
              >
                <span className="relative z-10">
                  {l.label}
                </span>
                {/* Subtle per-link underline (fallback / accent) */}
                <span className="absolute left-0 -bottom-2 h-[2px] w-full scale-x-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 opacity-0 transition duration-300 ease-out group-hover:opacity-100 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        {/* Right side (CTA + Auth) */}
        <div className="hidden md:flex items-center gap-3 ">
          <Link
            href="#signup"
            className="inline-flex items-center rounded-md bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-shadow hover:from-indigo-500 hover:to-fuchsia-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400"
          >
            Get Started
          </Link>
          <AuthActions />
        </div>

        {/* Mobile toggle */}
        <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-label="Toggle navigation menu"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <span className="sr-only">Menu</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {open ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile panel */}
      <div
        className={`md:hidden absolute left-0 right-0 top-full origin-top transition-transform duration-200 ease-out ${
          open ? 'scale-y-100 opacity-100' : 'pointer-events-none scale-y-75 opacity-0'
        }`}
      >
        <div className="w-full px-4 pb-4 relative">
          <ul className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-black/70 backdrop-blur shadow-sm" role="menu">
            {NAV_LINKS.map(l => (
              <li key={l.href} className="first:pt-2 last:pb-2" role="none">
                <a
                  role="menuitem"
                  href={l.href}
                  onClick={close}
                  className="block px-5 py-3 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-gray-800/70"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="p-3" role="none">
              <Link
                href="#signup"
                onClick={close}
                className="flex w-full items-center justify-center rounded-md bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-indigo-600/50 hover:from-indigo-500 hover:to-fuchsia-500"
              >
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

/* ---------------- Auth Actions Component ---------------- */
const AuthActions: React.FC = () => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const firstItemRef = useRef<HTMLButtonElement | null>(null);

  // Click outside & escape close
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowDown' && open) firstItemRef.current?.focus();
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  if (status === 'loading') {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-neutral-800/60 border border-white/10" />;
  }

  if (!session) {
    return (
      <button
        onClick={() => { setPending(true); signIn(undefined, { callbackUrl: '/' }); }}
        disabled={pending}
        className={"inline-flex items-center rounded-md border border-white/10 bg-neutral-900/60 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 " + (pending ? 'opacity-60 cursor-wait' : 'text-neutral-200 hover:border-fuchsia-500/40 hover:text-white')}
        aria-busy={pending}
      >
        {pending && <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-fuchsia-400 border-t-transparent" />}
        Sign In
      </button>
    );
  }

  const avatar = session.user?.image;
  const name = session.user?.name || 'User';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={btnRef}
        onClick={() => setOpen(o => !o)}
        className="h-9 w-9 rounded-full overflow-hidden border border-white/10 ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 transition hover:border-fuchsia-400/50"
        aria-haspopup="menu" aria-expanded={open} aria-label="Account menu"
      >
        {avatar ? (
          <Image src={avatar} alt={name} width={36} height={36} className="object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-[11px] font-medium bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white">{name.charAt(0)}</div>
        )}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-3 w-52 origin-top-right overflow-hidden rounded-xl border border-white/10 bg-neutral-900/90 backdrop-blur shadow-lg text-sm divide-y divide-white/5 animate-in fade-in slide-in-from-top-1"
          style={{
            animation: 'fadeIn 120ms ease, scaleIn 140ms cubic-bezier(.65,.2,.25,1)'
          }}
        >
          <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes scaleIn{from{transform:translateY(-4px) scale(.96)}to{transform:translateY(0) scale(1)}}`}</style>
          <div className="px-4 py-3">
            <p className="font-medium text-neutral-100 truncate">{name}</p>
            {session.user?.email && <p className="text-[11px] text-neutral-400 truncate">{session.user.email}</p>}
          </div>
          <div className="py-1" role="none">
            <button
              ref={firstItemRef}
              onClick={() => { /* placeholder manage account */ setOpen(false); }}
              className="w-full text-left px-4 py-2.5 hover:bg-white/5 text-neutral-200 transition focus-visible:outline-none focus-visible:bg-white/10"
              role="menuitem"
            >Manage Account</button>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full text-left px-4 py-2.5 hover:bg-white/5 text-neutral-200 transition focus-visible:outline-none focus-visible:bg-white/10"
              role="menuitem"
            >Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};
