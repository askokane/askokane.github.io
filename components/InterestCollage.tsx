'use client';
import { type MouseEvent } from 'react';

// ── Data ─────────────────────────────────────────────────────────────────────
const CARDS = [
  {
    id: 'math',
    label: 'mathematics',
    symbol: '∫',
    subSymbols: '∑  ∂  ∇  ∞',
    description: 'analysis · topology · abstraction',
    large: true,
    href: null,
    delay: 0,
  },
  {
    id: 'lit',
    label: 'literature',
    symbol: '§',
    subSymbols: null,
    description: 'fiction · poetry · criticism',
    large: false,
    href: 'https://www.goodreads.com/user/show/154124312-atharva-kokane',
    delay: 0.07,
  },
  {
    id: 'cs',
    label: 'computer science',
    symbol: 'λ',
    subSymbols: null,
    description: 'algorithms · systems · theory',
    large: false,
    href: null,
    delay: 0.14,
  },
  {
    id: 'cinema',
    label: 'cinema',
    symbol: '▷',
    subSymbols: null,
    description: 'film theory · visual stories',
    large: false,
    href: 'https://letterboxd.com/Atharva_kokane/',
    delay: 0.21,
  },
  {
    id: 'music',
    label: 'music',
    symbol: '♩',
    subSymbols: null,
    description: 'classical · jazz · ambient',
    large: false,
    href: 'https://open.spotify.com/user/31fx6hhsizbggjfkbw4y4oyfpeqa',
    delay: 0.28,
  },
] as const;

// ── Tilt handlers (no re-render — direct DOM) ────────────────────────────────
function onEnter(e: MouseEvent<HTMLElement>) {
  e.currentTarget.style.transition = 'transform 0.09s linear, border-color 0.4s ease';
}
function onMove(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - r.left)  / r.width  - 0.5;
  const y = (e.clientY - r.top)   / r.height - 0.5;
  e.currentTarget.style.transform =
    `perspective(700px) rotateY(${x * 13}deg) rotateX(${-y * 13}deg) translateZ(8px)`;
  e.currentTarget.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
  e.currentTarget.style.setProperty('--my', `${(y + 0.5) * 100}%`);
}
function onLeave(e: MouseEvent<HTMLElement>) {
  e.currentTarget.style.transition =
    'transform 0.65s cubic-bezier(0.16,1,0.3,1), border-color 0.4s ease';
  e.currentTarget.style.transform =
    'perspective(700px) rotateY(0deg) rotateX(0deg) translateZ(0)';
}

// ── Card ─────────────────────────────────────────────────────────────────────
type Card = typeof CARDS[number];

function CardInner({ card }: { card: Card }) {
  return (
    <>
      {/* Moving gold shine that follows the cursor */}
      <div className="interest-shine absolute inset-0 z-20 pointer-events-none
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Top edge accent on hover */}
      <div className="absolute inset-x-0 top-0 h-px z-10 pointer-events-none
                      bg-gradient-to-r from-transparent via-accent/60 to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Large-card background watermark */}
      {card.large && (
        <span
          className="absolute right-4 top-1/2 -translate-y-1/2 font-heading leading-none
                     select-none pointer-events-none text-accent/[0.045]
                     group-hover:text-accent/[0.08] transition-colors duration-700"
          style={{ fontSize: 'clamp(5rem,18vw,9rem)', animation: 'mathBg 10s ease-in-out infinite' }}
          aria-hidden
        >
          ∑
        </span>
      )}

      {/* Content */}
      {card.large ? (
        <div className="relative z-10 h-full flex flex-col justify-between p-5 md:p-6">
          {/* Symbol block */}
          <div>
            <span
              className="font-heading font-light leading-none block
                         text-accent/50 group-hover:text-accent/85 transition-colors duration-400"
              style={{ fontSize: 'clamp(3rem,8vw,4.5rem)' }}
            >
              {card.symbol}
            </span>
            <span className="font-display text-[0.42rem] tracking-[0.45em] uppercase
                             text-muted/40 group-hover:text-muted/70 transition-colors duration-400 mt-1 block">
              {card.subSymbols}
            </span>
          </div>

          {/* Label + description */}
          <div>
            <h3 className="font-display text-[0.56rem] tracking-[0.22em] uppercase
                           text-bright group-hover:text-accent transition-colors duration-300">
              {card.label}
            </h3>
            <p className="font-body text-sm text-muted mt-1 leading-relaxed">
              {card.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="relative z-10 h-full flex flex-col justify-between p-4">
          <span
            className="font-heading font-light leading-none
                       text-accent/40 group-hover:text-accent/75 transition-colors duration-400"
            style={{ fontSize: 'clamp(1.8rem,5vw,2.4rem)' }}
          >
            {card.symbol}
          </span>
          <div>
            <h3 className="font-display text-[0.48rem] tracking-[0.2em] uppercase
                           text-bright group-hover:text-accent transition-colors duration-300">
              {card.label}
            </h3>
            <p className="font-body text-xs text-muted mt-0.5 leading-snug">
              {card.description}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// ── Collage ──────────────────────────────────────────────────────────────────
export function InterestCollage() {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-3.5"
      style={{ gridAutoRows: '156px' }}
    >
      {CARDS.map((card) => {
        const spanClass = card.large
          ? 'col-span-2 row-span-2'
          : 'col-span-1 row-span-1';

        const sharedClass =
          `${spanClass} interest-card relative border border-border bg-surface overflow-hidden group` +
          (card.href ? ' cursor-pointer' : '');

        const sharedStyle: React.CSSProperties = {
          willChange: 'transform',
          transformStyle: 'preserve-3d',
          animation: `cardEntrance 0.7s cubic-bezier(0.16,1,0.3,1) ${card.delay}s both`,
        };

        if (card.href) {
          return (
            <a
              key={card.id}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className={sharedClass}
              style={sharedStyle}
              onMouseEnter={onEnter}
              onMouseMove={onMove}
              onMouseLeave={onLeave}
            >
              <CardInner card={card} />
            </a>
          );
        }

        return (
          <div
            key={card.id}
            className={sharedClass}
            style={sharedStyle}
            onMouseEnter={onEnter}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
          >
            <CardInner card={card} />
          </div>
        );
      })}
    </div>
  );
}
