import React from 'react';
import clsx from 'clsx';

/**
 * GlassPanel
 * Layered, translucent panel with subtle inner border glow, gradient film,
 * optional accent ring, and noise overlay. Keeps styling minimal and theme-aligned.
 */
export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: 'indigo' | 'fuchsia' | 'purple' | 'none';
  as?: keyof HTMLElementTagNameMap | React.ComponentType<any>;
}

const accentMap: Record<string, string> = {
  none: '',
  indigo: 'before:from-indigo-500/25 before:to-indigo-400/5',
  fuchsia: 'before:from-fuchsia-500/25 before:to-fuchsia-400/5',
  purple: 'before:from-purple-500/25 before:to-purple-400/5'
};

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({
    accent = 'none',
    as: Comp = 'div',
    className,
    children,
    ...rest
  }, ref) => {
    const Tag: any = Comp; // polymorphic support
    return (
      <Tag
        ref={ref}
        className={clsx(
          'relative rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_4px_16px_-2px_rgba(0,0,0,0.6)] overflow-hidden',
          'before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-70',
          'after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_65%)]',
          'before:transition-opacity after:transition-opacity',
          accentMap[accent],
          className
        )}
        {...rest}
      >
        {/* Noise Layer */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/></filter><rect width='600' height='600' filter='url(%23n)' opacity='0.35'/></svg>")`
          }}
        />
        <div className="relative z-10 p-8">
          {children}
        </div>
        {/* Accent ring (focusable containers could show this via focus-visible) */}
        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
      </Tag>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';

export default GlassPanel;
