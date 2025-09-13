This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Interactive Playground (`/generate/preview`)

This project includes an overhauled in-browser React playground:

- Live transpilation using `@babel/standalone` (React + env presets)
- Monaco editor with dark theme and instant updates (debounced ~280ms)
- UMD React 18 sandbox in an isolated iframe
- File explorer (demo list – future real FS integration)
- Assistant side panel (placeholder for AI features)
- GSAP + ScrollTrigger + Lenis powered micro-interactions
- Aceternity-inspired glassy UI primitives (`GradientText`, `Button`, `Card`)

### Animation Utilities
Located in `lib/animations.ts`:

- `useFadeInOnScroll` – fade + translate an element when entering viewport
- `useStaggerChildren` – stagger `[data-animate]` children for section reveals
- `useParallax` – simple parallax translation with `ScrollTrigger.scrub`
- `flash(el)` – quick highlight pulse utility

All hooks are **client-only** and rely on a registered GSAP `ScrollTrigger` plugin. Smooth scrolling is initialized in `components/AnimationProvider.tsx` using Lenis and tied to GSAP's RAF cycle.

### Extending the Playground
Potential next steps:

1. Implement real virtual file system (e.g. in-memory + persistence via API)
2. Integrate AI assistant to modify / explain selected code ranges
3. Add export (download ZIP) & shareable gist link generation
4. Provide theming (light / dark, font size control)
5. Add error overlay with clickable stack traces

### Dev Tips
If animations appear janky during local dev with React 19 Fast Refresh, ensure no duplicate GSAP registrations. Hooks are wrapped in `gsap.context()` for safe cleanup.

---

## Authentication

GitHub + Google OAuth are integrated via `next-auth`.

### Environment Variables
Create `.env.local`:

```
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=http://localhost:3000

GITHUB_ID=...
GITHUB_SECRET=...
GOOGLE_ID=...
GOOGLE_SECRET=...
```

Redirect URLs:
- GitHub: `http://localhost:3000/api/auth/callback/github`
- Google: `http://localhost:3000/api/auth/callback/google`

### UX Flow
- Navbar: gradient "Get Started" + subtle glass "Sign In" button.
- After sign-in: avatar (or initial) with dropdown + logout.
- `/signin`: two animated provider buttons (GitHub / Google).

Customize providers or callbacks in `lib/auth.ts`.
