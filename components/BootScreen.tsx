'use client';
import { useState, useEffect, useCallback } from 'react';

// ── Sequence ─────────────────────────────────────────────────────────────────
// 550 ms between lines → feels deliberate, not rushed
const LINES = [
  { text: '> init atharva.dev',             ms:    0 },
  { text: '> loading modules        [done]', ms:  550 },
  { text: '> compiling routes       [done]', ms: 1150 },
  { text: '> mounting filesystem    [done]', ms: 1750 },
  { text: '> warming caches         [done]', ms: 2350 },
  { text: '> all systems go.',               ms: 2950 },
];

const FADE_AT   = 3550;   // ms — start fading after last line settles
const UNMOUNT   = 4400;   // ms — call onDone (transition + buffer)

export function BootScreen({ onDone }: { onDone: () => void }) {
  const [lines,  setLines]  = useState<string[]>([]);
  const [fading, setFading] = useState(false);

  const done = useCallback(onDone, [onDone]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    LINES.forEach(({ text, ms }) =>
      timers.push(setTimeout(() => setLines(v => [...v, text]), ms))
    );

    timers.push(setTimeout(() => setFading(true), FADE_AT));
    timers.push(setTimeout(() => done(),           UNMOUNT));

    return () => timers.forEach(clearTimeout);
  }, [done]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-background flex items-start justify-start"
      style={{
        padding: 'clamp(3.5rem, 9vw, 7rem)',
        opacity:    fading ? 0 : 1,
        transition: 'opacity 0.75s ease-in-out',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      {/* Top-left label */}
      <div className="w-full">
        <p
          className="font-display text-[0.52rem] tracking-[0.35em] uppercase text-muted mb-6"
          style={{ animation: 'fadeIn 0.4s ease-out forwards' }}
        >
          atharva kokane / system init
        </p>

        <div className="space-y-[0.6rem]">
          {lines.map((line, i) => {
            const isLast = i === lines.length - 1;
            return (
              <p
                key={i}
                className="font-mono text-[0.8rem] md:text-sm tracking-wide flex items-center gap-2"
                style={{
                  color: isLast ? '#c9a84c' : '#3d3629',
                  animation: 'fadeInUp 0.4s ease-out forwards',
                  opacity: 0,
                }}
              >
                {line}
                {isLast && !fading && (
                  <span
                    className="inline-block w-[0.4em] h-[1em] bg-accent"
                    style={{ animation: 'bootCursor 0.85s steps(1, end) infinite' }}
                  />
                )}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
