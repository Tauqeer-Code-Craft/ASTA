// Feature cards data displayed beneath the hero section.
export interface FeatureItem {
  title: string;
  desc: string;
}

export const FEATURE_ITEMS: FeatureItem[] = [
  {
    title: 'One‑Click Clone',
    desc: 'Paste any public URL; we parse structure, colors, typography & assets into editable components.',
  },
  {
    title: 'AI Refactor',
    desc: 'Clean React / Next code + Tailwind tokens generated from messy legacy markup & inline styles.',
  },
  {
    title: 'Instant Theme',
    desc: 'Swap palettes, fonts and radius scales globally—design tokens update everything at once.',
  },
  {
    title: 'Smart Sections',
    desc: 'Detected hero, nav, footer & CTAs become reusable blocks you can remix or export.',
  },
  {
    title: 'Animation Layer',
    desc: 'GSAP timeline suggestions for entrances, scroll reveals & micro‑interactions.',
  },
  {
    title: 'Version & Diff',
    desc: 'Track edits vs original source. Roll back or compare changes visually & in code.',
  },
];
