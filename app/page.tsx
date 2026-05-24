import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getAllPosts } from '@/lib/markdown';
import { BootWrapper } from '@/components/BootWrapper';
import { ScrollReveal } from '@/components/ScrollReveal';
import { InterestCollage } from '@/components/InterestCollage';
import { HeroContent } from '@/components/HeroContent';

// Three.js — client-only
const HomepageCanvas = dynamic(
  () => import('@/components/HomepageCanvas').then((m) => m.HomepageCanvas),
  { ssr: false },
);

const RECENT_POSTS_COUNT = 5;


export default function HomePage() {
  const allPosts    = getAllPosts();
  const recentPosts = allPosts.slice(0, RECENT_POSTS_COUNT);

  const featured = recentPosts[0];
  const rest     = recentPosts.slice(1);

  return (
    <BootWrapper>

      {/* ── Full-viewport 3D hero ──────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Canvas — right side */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-[58%] opacity-25 md:opacity-100 pointer-events-none">
          <HomepageCanvas />
        </div>

        {/* Gradient masks */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(to right, #0C0B0E 42%, rgba(12,11,14,0.88) 58%, rgba(12,11,14,0.18) 80%, transparent 100%)',
          }}
        />
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

        {/* Text — left column */}
        <div className="relative z-20 max-w-2xl mx-auto px-6 w-full">
          <HeroContent />
        </div>
      </section>

      {/* ── Interest collage ─────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-6 pb-16">
        <ScrollReveal delay={0.05}>
          <div className="flex items-center gap-5 mb-8">
            <span className="font-display text-[0.58rem] tracking-[0.28em] uppercase text-muted shrink-0">
              interests
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <InterestCollage />
        </ScrollReveal>
      </section>

      {/* ── Recent posts ──────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-6 pb-32 relative">

        {/* Decorative background glyph */}
        <span
          className="absolute -right-4 top-0 font-heading text-[11rem] leading-none select-none pointer-events-none"
          style={{ color: 'rgba(42,36,32,0.55)' }}
          aria-hidden
        >
          ∑
        </span>

        {/* Section header */}
        <ScrollReveal delay={0.05}>
          <div className="flex items-center gap-5 mb-10">
            <span className="font-display text-[0.58rem] tracking-[0.28em] uppercase text-muted shrink-0">
              recent posts
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
        </ScrollReveal>

        {recentPosts.length === 0 ? (
          <p className="text-muted font-body">no posts yet.</p>
        ) : (
          <>
            {/* ── Featured card (most recent) ── */}
            {featured && (
              <ScrollReveal delay={0.12}>
                <Link href={`/blog/${featured.slug}/`} className="block group">
                  <div className="blog-card-featured">
                    <span className="font-display text-[0.52rem] tracking-[0.3em] uppercase text-accent block mb-4">
                      latest
                    </span>
                    <h3 className="font-heading text-2xl md:text-3xl font-normal text-bright group-hover:text-accent transition-colors duration-400 leading-snug mb-3">
                      {featured.title}
                    </h3>
                    {featured.excerpt && (
                      <p className="font-body text-foreground text-base leading-relaxed mb-5 line-clamp-2">
                        {featured.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-display text-[0.52rem] tracking-[0.14em] uppercase text-muted">
                        {featured.date} · {featured.readingTime}
                      </span>
                      <span className="font-display text-[0.52rem] tracking-[0.12em] uppercase text-muted group-hover:text-accent transition-colors duration-300">
                        read →
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            )}

            {/* ── Numbered list (remaining posts) ── */}
            {rest.length > 0 && (
              <div className="mt-3">
                {rest.map((post, i) => (
                  <ScrollReveal key={post.slug} delay={0.08 * (i + 1)}>
                    <Link href={`/blog/${post.slug}/`} className="blog-row group">
                      <span className="blog-row-index">{String(i + 2).padStart(2, '0')}</span>
                      <span className="blog-row-title">{post.title}</span>
                      <span className="blog-row-meta">{post.readingTime}</span>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            )}

            {/* View all */}
            {allPosts.length > RECENT_POSTS_COUNT && (
              <ScrollReveal delay={0.05} className="mt-8">
                <Link
                  href="/blog/"
                  className="inline-block font-display text-[0.58rem] tracking-[0.2em] uppercase text-muted hover:text-accent transition-colors duration-300"
                >
                  view all posts →
                </Link>
              </ScrollReveal>
            )}
          </>
        )}
      </section>

    </BootWrapper>
  );
}
