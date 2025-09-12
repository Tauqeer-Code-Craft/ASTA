/**
 * UI Primitives (Aceternity‑inspired)
 * ---------------------------------------------------------------------------
 * Lightweight, minimal components (GradientText, Button, Card) that cover the
 * surface needs of the landing without locking into a heavy dependency.
 * Replace or extend with a design system later.
 */
"use client";
import React, { ElementType } from 'react';
import clsx from 'clsx';

export interface PrimitiveProps {
  className?: string;
  children?: React.ReactNode;
}

/** GradientText – applies a multi‑stop gradient to the text via background‑clip. */
export const GradientText: React.FC<PrimitiveProps> = ({ children, className }) => (
  <span
    className={clsx(
      'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent',
      className,
    )}
  >
    {children}
  </span>
);

// ========================= BUTTON =========================
interface ButtonProps extends PrimitiveProps {
  variant?: 'primary' | 'glass' | 'outline' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  type?: 'button' | 'submit' | 'reset';
}

const buttonBase = 'relative inline-flex items-center justify-center font-medium rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 disabled:opacity-60 disabled:cursor-not-allowed';
const buttonSizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-5 py-2.5',
  lg: 'text-sm px-7 py-3',
};
const buttonVariants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-700/30 ring-1 ring-white/10 hover:brightness-110',
  glass: 'text-fuchsia-200 bg-white/5 ring-1 ring-white/15 backdrop-blur hover:bg-white/10',
  outline: 'text-fuchsia-300 border border-fuchsia-400/40 hover:border-fuchsia-300 bg-transparent',
  subtle: 'text-neutral-200 hover:text-white bg-transparent',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  href,
  type = 'button',
  ...rest
}) => {
  const classes = clsx(buttonBase, buttonSizes[size], buttonVariants[variant], className, 'group');
  const innerGlow = (
    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
      <span className="absolute inset-[-1px] rounded-[inherit] bg-gradient-to-br from-white/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-40" />
    </span>
  );
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {innerGlow}
        <span className="relative z-10 flex items-center gap-1">{children}</span>
      </a>
    );
  }
  return (
    <button type={type} className={classes} {...rest}>
      {innerGlow}
      <span className="relative z-10 flex items-center gap-1">{children}</span>
    </button>
  );
};

// ==================== CARD (Glassy / Glow) ====================
interface CardProps extends PrimitiveProps {
  as?: ElementType;
  interactive?: boolean;
  variant?: 'glass' | 'subtle' | 'outlined';
  tone?: 'indigo' | 'fuchsia' | 'cyan' | 'neutral';
}

// Tone map: influences subtle overlay gradient tint.
const toneMap: Record<NonNullable<CardProps['tone']>, string> = {
  indigo: 'from-indigo-400/25 via-indigo-300/10 to-transparent',
  fuchsia: 'from-fuchsia-400/25 via-fuchsia-300/10 to-transparent',
  cyan: 'from-cyan-400/25 via-cyan-300/10 to-transparent',
  neutral: 'from-white/30 via-white/10 to-transparent',
};

export const Card: React.FC<CardProps> = ({
  children,
  className,
  as: Comp = 'div',
  interactive = true,
  variant = 'glass',
  tone = 'fuchsia',
}) => {
  return (
    <Comp
      className={clsx(
        'group relative overflow-hidden rounded-2xl p-6',
        // Base surfaces per variant
        variant === 'glass' && 'backdrop-blur-xl bg-white/5 border border-white/10',
        variant === 'subtle' && 'bg-white/3 border border-white/5',
        variant === 'outlined' && 'bg-transparent border border-white/15',
        // Depth & shadow
        'shadow-[0_4px_18px_-6px_rgba(0,0,0,0.45)]',
        interactive && 'transition-transform duration-300 hover:-translate-y-1',
        className,
      )}
    >
      {/* Soft gradient tint */}
      <span
        className={clsx(
          'pointer-events-none absolute inset-0 opacity-60 mix-blend-overlay',
          'bg-gradient-to-br',
          toneMap[tone],
        )}
      />
      {/* Top hairline highlight */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      {/* Hover glow ring (very subtle) */}
      <span className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-30 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),rgba(255,255,255,0)_60%)]" />
      <div className="relative z-10 flex h-full flex-col gap-4">{children}</div>
    </Comp>
  );
};

// Backwards compatibility export for previous name
export const GlassCard = Card;
