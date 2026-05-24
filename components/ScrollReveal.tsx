'use client';
import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;       // seconds
  distance?: number;    // px translateY at start
  className?: string;
}

/**
 * Wraps any content and animates it into view when it enters the viewport.
 * Uses IntersectionObserver + CSS animation (no JS spring library needed).
 */
export function ScrollReveal({
  children,
  delay = 0,
  distance = 14,
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.animationPlayState = 'running';
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        animation: `scrollReveal 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s forwards`,
        animationPlayState: 'paused',
        ['--sr-dist' as string]: `${distance}px`,
      }}
    >
      {children}
    </div>
  );
}
