'use client';

const LINE1 = 'atharva';
const LINE2 = 'kokane.';
const STEP  = 0.065;
const BASE  = 0.05;
const NAME_END = BASE + (LINE1.length + LINE2.length) * STEP;

/**
 * Hero text block.
 *
 * Animations are defined via CSS classes (.hero-letter / .hero-rise / .hero-fade)
 * and are PAUSED by default. BootWrapper adds .hero-ready to <html> once the boot
 * sequence finishes (or immediately on return visits), at which point the browser
 * starts playing all three animation types simultaneously.
 *
 * Per-element delay is passed through the --hd CSS custom property.
 */
export function HeroContent() {
  const afterName = `${(NAME_END + 0.18).toFixed(2)}s`;

  return (
    <div className="md:max-w-[400px]">

      {/* Gold rule */}
      <div
        className="w-10 h-px bg-gradient-to-r from-accent to-transparent mb-10 hero-fade"
        style={{ '--hd': '0.05s' } as React.CSSProperties}
      />

      {/* Name — letter-by-letter spring entrance */}
      <h1
        className="font-heading font-light text-bright tracking-tight leading-[1.05] select-none"
        style={{ fontSize: 'clamp(3.2rem, 9vw, 5.8rem)' }}
      >
        {[LINE1, LINE2].map((word, wi) => (
          <span key={wi} className="block">
            {word.split('').map((ch, ci) => {
              const delay = BASE + (wi === 0 ? ci : LINE1.length + ci) * STEP;
              return (
                <span
                  key={ci}
                  className="inline-block hero-letter"
                  style={{ '--hd': `${delay}s` } as React.CSSProperties}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        ))}
      </h1>

      {/* Bio */}
      <p
        className="font-body text-foreground text-lg mt-8 leading-relaxed hero-rise"
        style={{ '--hd': afterName } as React.CSSProperties}
      >
        <span className="text-bright font-semibold">
          computer science freshmen @ virginia tech
        </span>
        <br />
        hi. i write about code, projects, and things i find interesting.
      </p>

      {/* Scroll cue */}
      <div
        className="mt-12 flex items-center gap-3 hero-fade"
        style={{ '--hd': `calc(${afterName} + 0.4s)` } as React.CSSProperties}
      >
        <div className="w-px h-10 bg-gradient-to-b from-accent to-transparent" />
        <span className="font-display text-[0.5rem] tracking-[0.42em] uppercase text-muted">
          scroll
        </span>
      </div>

    </div>
  );
}
