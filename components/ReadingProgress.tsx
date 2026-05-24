'use client';
import { useState, useEffect } from 'react';

/**
 * Thin gold vertical bar fixed to the left edge of the viewport.
 * Grows from top to bottom as the user scrolls through the page.
 */
export function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setPct(total > 0 ? Math.min((scrolled / total) * 100, 100) : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      className="fixed left-0 top-0 h-screen w-[2px] z-50 pointer-events-none"
      aria-hidden
    >
      {/* Track */}
      <div className="absolute inset-0 bg-border opacity-60" />
      {/* Progress fill */}
      <div
        className="absolute top-0 left-0 w-full bg-accent"
        style={{ height: `${pct}%`, transition: 'height 80ms linear' }}
      />
    </div>
  );
}
