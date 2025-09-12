// Navigation link configuration shared across the app.
// Extend this list (order matters for display in the navbar).
export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
  { label: 'Blog', href: '#blog' },
];
