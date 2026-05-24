'use client';
import { useState, useLayoutEffect } from 'react';
import { BootScreen } from './BootScreen';

type Phase = 'covering' | 'booting' | 'done';

/**
 * Three-phase approach:
 *   covering → dark overlay from SSR, nothing visible
 *   booting  → terminal sequence plays
 *   done     → overlay gone, site visible + hero animations running
 *
 * The key mechanism: we add .hero-ready to <html> as a CSS signal.
 *   • Return visit (ak_booted set): added synchronously in useLayoutEffect,
 *     before the first browser paint — animations start with the first frame.
 *   • First visit: added inside handleDone after the boot screen finishes,
 *     so the animations play visibly right after the boot sequence ends.
 *
 * Hero elements (.hero-letter / .hero-rise / .hero-fade in globals.css) are
 * paused until .hero-ready is present, so they never run silently underneath.
 */
export function BootWrapper({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>('covering');

  useLayoutEffect(() => {
    if (sessionStorage.getItem('ak_booted')) {
      document.documentElement.classList.add('hero-ready');
      setPhase('done');
    } else {
      setPhase('booting');
    }
  }, []);

  const handleDone = () => {
    sessionStorage.setItem('ak_booted', '1');
    document.documentElement.classList.add('hero-ready');
    setPhase('done');
  };

  return (
    <>
      {phase === 'covering' && (
        <div className="fixed inset-0 z-[100] bg-background" aria-hidden />
      )}
      {phase === 'booting' && <BootScreen onDone={handleDone} />}
      {children}
    </>
  );
}
