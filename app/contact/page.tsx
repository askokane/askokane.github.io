import dynamic from 'next/dynamic';
import { ScrollReveal } from '@/components/ScrollReveal';

export const metadata = {
  title: 'contact',
  description: 'get in touch with atharva kokane',
};

const ContactScene = dynamic(
  () => import('@/components/ContactScene').then((m) => m.ContactScene),
  { ssr: false },
);

const LINKS = [
  {
    label:   'email',
    display: 'atharvashashankk@vt.edu',
    href:    'mailto:atharvashashankk@vt.edu',
    desc:    'fastest way to reach me',
    external: false,
  },
  {
    label:   'linkedin',
    display: 'linkedin.com/in/atharvakokane',
    href:    'https://www.linkedin.com/in/atharvakokane/',
    desc:    'professional network',
    external: true,
  },
  {
    label:   'github',
    display: 'github.com/atharvakokane',
    href:    'https://github.com/atharvakokane',
    desc:    'code and projects',
    external: true,
  },
  {
    label:   'instagram',
    display: 'instagram.com/ath_arva_207',
    href:    'https://www.instagram.com/ath_arva_207/',
    desc:    'photos and life',
    external: true,
  },
  {
    label:   'spotify',
    display: 'open.spotify.com',
    href:    'https://open.spotify.com/user/31fx6hhsizbggjfkbw4y4oyfpeqa',
    desc:    'what i\'m listening to',
    external: true,
  },
  {
    label:   'goodreads',
    display: 'goodreads.com/atharva-kokane',
    href:    'https://www.goodreads.com/user/show/154124312-atharva-kokane',
    desc:    'what i\'m reading',
    external: true,
  },
  {
    label:   'letterboxd',
    display: 'letterboxd.com/atharva_kokane',
    href:    'https://letterboxd.com/Atharva_kokane/',
    desc:    'films i\'ve watched',
    external: true,
  },
];

export default function ContactPage() {
  return (
    <div className="relative max-w-2xl mx-auto px-6 pt-28 md:pt-36 pb-28">

      {/* ── 3D torus knot — top right corner ── */}
      <div
        className="absolute right-[-30px] top-8 opacity-[0.16] pointer-events-none select-none hidden md:block"
        aria-hidden
      >
        <ContactScene />
      </div>

      {/* ── Header ── */}
      <ScrollReveal>
        <header className="mb-16">
          <div className="w-10 h-px bg-gradient-to-r from-accent to-transparent mb-8" />
          <h1 className="font-heading text-5xl font-light text-bright tracking-tight leading-none mb-3">
            contact
          </h1>
          <p className="font-display text-[0.52rem] tracking-[0.25em] uppercase text-muted">
            get in touch
          </p>
        </header>
      </ScrollReveal>

      {/* ── Intro ── */}
      <ScrollReveal delay={0.06}>
        <p className="font-body text-foreground leading-relaxed text-lg mb-14 max-w-[38rem]">
          feel free to reach out — happy to chat about projects,
          collaborations, or anything else.
        </p>
      </ScrollReveal>

      {/* ── Contact cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {LINKS.map(({ label, display, href, desc, external }, i) => (
          <ScrollReveal key={label} delay={0.07 * (i + 1)}>
            <a
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="contact-card"
            >
              {/* Label */}
              <span className="font-display text-[0.48rem] tracking-[0.2em] uppercase text-accent block mb-2">
                {label}
              </span>

              {/* Display URL / address */}
              <span className="font-heading text-lg font-normal text-bright leading-tight block mb-1.5">
                {display}
                {external && (
                  <span className="font-display text-[0.55rem] text-muted ml-1.5 align-middle">↗</span>
                )}
              </span>

              {/* Description */}
              <span className="font-display text-[0.44rem] tracking-[0.14em] uppercase text-muted/70">
                {desc}
              </span>
            </a>
          </ScrollReveal>
        ))}
      </div>

    </div>
  );
}
