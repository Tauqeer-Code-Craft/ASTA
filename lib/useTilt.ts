import { useEffect, useRef } from 'react';

/**
 * useTilt
 * Adds a subtle 3D tilt / parallax effect driven by pointer position.
 * - Respects prefers-reduced-motion (no effect applied if user prefers reduced motion).
 * - Accepts max angles and optional scale while active.
 * - Cleans up event listeners on unmount.
 */
export function useTilt<T extends HTMLElement>(options?: { max?: number; scale?: number; friction?: number; disabled?: boolean; }) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
  const el = ref.current;
  if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || options?.disabled) return;

    const max = options?.max ?? 10; // degrees
    const scale = options?.scale ?? 1.015;
    const friction = options?.friction ?? 0.12;

    let frame = 0;
    let currentX = 0, currentY = 0, targetX = 0, targetY = 0;
    let hovering = false;

    function animate(){
      currentX += (targetX - currentX) * friction;
      currentY += (targetY - currentY) * friction;
      const transform = hovering
        ? `perspective(900px) rotateX(${currentY.toFixed(2)}deg) rotateY(${currentX.toFixed(2)}deg) scale(${scale})`
        : 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
  if (el) el.style.transform = transform;
      frame = requestAnimationFrame(animate);
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0 - 1
      const y = (e.clientY - rect.top) / rect.height; // 0 - 1
      targetX = (0.5 - x) * max; // rotateY
      targetY = (y - 0.5) * max; // rotateX
    };
    const onEnter = () => { hovering = true; };
    const onLeave = () => { hovering = false; targetX = 0; targetY = 0; };

    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [options?.max, options?.scale, options?.friction, options?.disabled]);
  return ref;
}
