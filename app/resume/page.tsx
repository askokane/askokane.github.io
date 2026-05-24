import dynamic from 'next/dynamic';
import { ScrollReveal } from '@/components/ScrollReveal';
import { getResumeData } from '@/lib/markdown';

export const metadata = {
  title: 'resume',
  description: 'atharva kokane – resume',
};

const ResumeScene = dynamic(
  () => import('@/components/ResumeScene').then((m) => m.ResumeScene),
  { ssr: false },
);

// ── Helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-5 mb-8">
      <span className="font-display text-[0.58rem] tracking-[0.28em] uppercase text-accent shrink-0">
        {children}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <li className="flex gap-2.5 text-foreground font-body text-[0.95rem] leading-relaxed">
      <span className="text-accent mt-[0.35rem] text-[0.55rem] shrink-0">›</span>
      <span>{text}</span>
    </li>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ResumePage() {
  const data = getResumeData();
  const EDUCATION  = data.education  ?? [];
  const EXPERIENCE = data.experience ?? [];
  const PROJECTS   = data.projects   ?? [];
  const SKILLS     = data.skills     ?? [];
  const CONTACT    = data.contact    ?? {};

  return (
    <div className="relative max-w-2xl mx-auto px-6 pt-28 md:pt-36 pb-28">

      {/* ── 3D decoration ── */}
      <div
        className="absolute right-[-20px] top-12 opacity-[0.13] pointer-events-none select-none hidden md:block"
        aria-hidden
      >
        <ResumeScene />
      </div>

      {/* ── Header ── */}
      <ScrollReveal>
        <header className="mb-20">
          <div className="w-10 h-px bg-gradient-to-r from-accent to-transparent mb-8" />
          <h1 className="font-heading text-5xl font-light text-bright tracking-tight leading-none mb-2">
            resume
          </h1>
          <p className="font-display text-[0.52rem] tracking-[0.25em] uppercase text-muted mb-8">
            atharva kokane
          </p>
          <a
            href="https://drive.google.com/file/d/1rJoNhTDqb5sKN4cEiTHE5lSIvpOJgB0X/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-muted
                       hover:text-accent hover:border-accent/40 transition-all duration-300
                       font-display text-[0.52rem] tracking-[0.2em] uppercase"
          >
            download pdf
            <span className="text-[0.6rem]">↗</span>
          </a>
        </header>
      </ScrollReveal>

      {/* ── Education ── */}
      <section className="mb-20">
        <ScrollReveal delay={0.05}>
          <SectionLabel>education</SectionLabel>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-4">
          {EDUCATION.map((edu, i) => (
            <ScrollReveal key={i} delay={0.1 + i * 0.08}>
              <div className="resume-edu-card h-full">
                <h3 className="font-heading text-xl text-bright font-normal leading-tight mb-1">
                  {edu.institution}
                </h3>
                <p className="font-body text-foreground text-[0.95rem]">{edu.degree}</p>
                <p className="font-display text-[0.44rem] tracking-[0.14em] uppercase text-muted mt-1 mb-4">
                  {edu.location} · {edu.period}
                </p>
                {edu.courses && edu.courses.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {edu.courses.map((c, j) => (
                      <span key={j} className="resume-skill-chip">{c}</span>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Experience ── */}
      <section className="mb-20">
        <ScrollReveal delay={0.05}>
          <SectionLabel>experience</SectionLabel>
        </ScrollReveal>
        <div className="resume-timeline">
          {EXPERIENCE.map((exp, i) => (
            <ScrollReveal key={i} delay={0.08 * (i + 1)}>
              <div className="resume-timeline-entry">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 mb-1">
                  <h3 className="font-heading text-xl text-bright font-normal leading-tight">
                    {exp.title}
                  </h3>
                  <span className="font-display text-[0.44rem] tracking-[0.12em] uppercase text-muted">
                    {exp.period}
                  </span>
                </div>
                <p className="font-display text-[0.5rem] tracking-[0.18em] uppercase text-accent mb-1">
                  {exp.org}
                </p>
                <p className="font-display text-[0.42rem] tracking-[0.12em] uppercase text-muted/60 mb-3">
                  {exp.location}
                </p>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="space-y-1.5">
                    {exp.bullets.map((b, j) => <Bullet key={j} text={b} />)}
                  </ul>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Projects ── */}
      <section className="mb-20">
        <ScrollReveal delay={0.05}>
          <SectionLabel>projects</SectionLabel>
        </ScrollReveal>
        <div className="space-y-4">
          {PROJECTS.map((proj, i) => (
            <ScrollReveal key={i} delay={0.1 + i * 0.08}>
              <div className="resume-project-card">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 mb-3">
                  <h3 className="font-heading text-xl text-bright font-normal">{proj.name}</h3>
                  <span className="font-display text-[0.44rem] tracking-[0.12em] uppercase text-muted">
                    {proj.period}
                  </span>
                </div>
                {proj.tech && proj.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.tech.map((t, j) => (
                      <span key={j} className="resume-skill-chip">{t}</span>
                    ))}
                  </div>
                )}
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className="space-y-1.5">
                    {proj.bullets.map((b, j) => <Bullet key={j} text={b} />)}
                  </ul>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Skills ── */}
      <section className="mb-20">
        <ScrollReveal delay={0.05}>
          <SectionLabel>skills</SectionLabel>
        </ScrollReveal>
        <div className="space-y-4">
          {SKILLS.map((group, i) => (
            <ScrollReveal key={i} delay={0.06 * (i + 1)}>
              <div className="flex gap-5 items-start">
                <span className="font-display text-[0.44rem] tracking-[0.18em] uppercase text-muted
                                 shrink-0 pt-[0.35rem] w-20 text-right">
                  {group.category}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item, j) => (
                    <span key={j} className="resume-skill-chip">{item}</span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Contact ── */}
      <section>
        <ScrollReveal delay={0.05}>
          <SectionLabel>contact</SectionLabel>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="space-y-2">
            {CONTACT.email && (
              <a
                href={`mailto:${CONTACT.email}`}
                className="block font-body text-foreground hover:text-accent transition-colors duration-300 text-base"
              >
                {CONTACT.email}
              </a>
            )}
            {CONTACT.linkedin && (
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-body text-foreground hover:text-accent transition-colors duration-300 text-base"
              >
                {CONTACT.linkedin.replace('https://www.', '')}
              </a>
            )}
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
