const LINKS = [
  { label: 'email',    href: 'mailto:atharvashashankk@vt.edu',             external: false },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/atharvakokane/', external: true  },
  { label: 'github',   href: 'https://github.com/askokane',                external: true  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-8">
      <div className="max-w-2xl mx-auto px-6 py-10 md:py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">

          {/* Left — identity */}
          <div className="space-y-2">
            {/* Gold gradient rule */}
            <div className="w-8 h-px bg-gradient-to-r from-accent to-transparent mb-4" />
            <p className="font-heading text-xl font-light text-bright leading-none">
              atharva kokane
            </p>
            <p className="font-display text-[0.48rem] tracking-[0.22em] uppercase text-muted">
              computer science · virginia tech · 2029
            </p>
            <p className="font-display text-[0.44rem] tracking-[0.18em] uppercase text-muted/70 pt-2">
              © {new Date().getFullYear()} — all rights reserved
            </p>
          </div>

          {/* Right — links */}
          <nav aria-label="footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {LINKS.map(({ label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="font-display text-[0.5rem] tracking-[0.2em] uppercase
                               text-muted hover:text-accent transition-colors duration-300
                               relative after:absolute after:left-0 after:bottom-[-2px]
                               after:h-px after:w-0 after:bg-accent
                               after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

        </div>

        {/* Bottom tagline */}
        <p className="font-display text-[0.42rem] tracking-[0.18em] uppercase text-muted/50 mt-10">
          built with next.js · deployed on github pages
        </p>
      </div>
    </footer>
  );
}
