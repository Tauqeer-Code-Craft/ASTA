"use client";
import React from 'react';
/**
 * Footer
 * ---------------------------------------------------------------------------
 * Multi‑column application footer with email capture (non‑functional stub),
 * product / resource / company link groups and social icons.
 * Form submit is intentionally prevented; integrate with backend or service
 * (e.g., Resend / MailerLite) later.
 */

const year = new Date().getFullYear();

interface LinkGroup {
  heading: string;
  links: { label: string; href: string }[];
}

const GROUPS: LinkGroup[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Clone a Site', href: '#get-started' },
      { label: 'AI Refactor', href: '#features' },
      { label: 'Theming', href: '#features' },
      { label: 'Animation Layer', href: '#features' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Docs', href: '#docs' },
      { label: 'Guides', href: '#guides' },
      { label: 'Changelog', href: '#changelog' },
      { label: 'Roadmap', href: '#roadmap' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Blog', href: '#blog' },
      { label: 'Careers', href: '#careers' },
      { label: 'Contact', href: '#contact' },
    ],
  },
];

const SOCIAL = [
  { label: 'GitHub', href: 'https://github.com/', icon: GithubIcon },
  { label: 'X (Twitter)', href: 'https://x.com/', icon: XIcon },
];

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-10 border-t border-white/10 bg-neutral-950/70 backdrop-blur">
      {/* Glow accent */}
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-fuchsia-500/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand & blurb */}
            <div className="space-y-6 lg:col-span-2">
              <div className="flex items-center gap-2" aria-label="WebMaker brand">
                <span className="relative flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-white font-semibold shadow-sm ring-1 ring-black/5">
                  <span className="text-sm">WM</span>
                </span>
                <span className="text-lg font-semibold tracking-tight">WebMaker</span>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-neutral-400">
                Paste a URL. Get editable component code, design tokens and motion suggestions. Transform existing sites into your own product in minutes—not weeks.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="relative flex w-full max-w-sm items-center gap-2"
              >
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60"
                />
                <button
                  type="submit"
                  className="relative inline-flex items-center justify-center rounded-md bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-4 py-2 text-xs font-semibold text-white shadow ring-1 ring-white/20 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                >
                  Join
                </button>
              </form>
            </div>
          {/* Link columns */}
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:col-span-3">
            {GROUPS.map(group => (
              <nav key={group.heading} aria-label={group.heading} className="space-y-4">
                <h4 className="text-sm font-semibold tracking-wide text-white/90">{group.heading}</h4>
                <ul className="space-y-2 text-xs">
                  {group.links.map(link => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="relative inline-flex items-center gap-1 text-neutral-400 transition hover:text-white focus:outline-none focus-visible:text-white"
                      >
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 transition-all duration-300 group-hover:w-full" />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-neutral-400">
            <p>© {year} WebMaker. All rights reserved.</p>
            <a href="#privacy" className="hover:text-white">Privacy</a>
            <a href="#terms" className="hover:text-white">Terms</a>
            <a href="#security" className="hover:text-white">Security</a>
          </div>
          <ul className="flex items-center gap-4">
            {SOCIAL.map(s => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  className="group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 text-neutral-300 transition hover:text-white hover:border-white/25"
                >
                  <s.icon className="h-4 w-4" />
                  <span className="pointer-events-none absolute inset-0 opacity-0 blur-sm transition group-hover:opacity-40 bg-gradient-to-br from-fuchsia-500/40 to-indigo-500/40" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

/* ---------------- Icons ---------------- */
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M9 19c-4.5 1.5-4.5-2.5-6-3m12 5v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0018 3.77 5.07 5.07 0 0017.91 1S16.73.65 14 2.48a13.38 13.38 0 00-10 0C1.27.65.09 1 .09 1A5.07 5.07 0 000 3.77a5.44 5.44 0 00-1.5 3.76c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 004 18.13V22" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M18 2L11.5 9.5M22 22L13.5 13.5M2 2l7.5 7.5M2 22l7.5-7.5" />
    </svg>
  );
}

export default Footer;
