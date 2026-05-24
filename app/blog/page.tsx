import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getAllPosts } from '@/lib/markdown';
import { ScrollReveal } from '@/components/ScrollReveal';

const BlogScene = dynamic(
  () => import('@/components/BlogScene').then((m) => m.BlogScene),
  { ssr: false },
);

const POSTS_PER_PAGE = 10;

export function generateStaticParams() {
  const posts = getAllPosts();
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE) || 1;
  return Array.from({ length: totalPages }, (_, i) => ({ page: String(i + 1) }));
}

export default function BlogIndexPage() {
  const allPosts    = getAllPosts();
  const totalPages  = Math.ceil(allPosts.length / POSTS_PER_PAGE) || 1;
  const posts       = allPosts.slice(0, POSTS_PER_PAGE);

  return (
    <div className="relative max-w-2xl mx-auto px-6 pt-28 md:pt-36 pb-28">

      {/* ── 3D decoration ── */}
      <div
        className="absolute right-[-10px] top-10 opacity-[0.13] pointer-events-none select-none hidden md:block"
        aria-hidden
      >
        <BlogScene />
      </div>

      {/* ── Header ── */}
      <ScrollReveal>
        <header className="mb-16">
          <div className="w-10 h-px bg-gradient-to-r from-accent to-transparent mb-8" />
          <h1 className="font-heading text-5xl font-light text-bright tracking-tight leading-none mb-3">
            blog
          </h1>
          <div className="flex items-center gap-5">
            <span className="font-display text-[0.52rem] tracking-[0.25em] uppercase text-muted">
              all posts
            </span>
            <div className="h-px flex-1 bg-border" />
            <span className="font-display text-[0.48rem] tracking-[0.18em] uppercase text-muted/60">
              {allPosts.length} {allPosts.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
        </header>
      </ScrollReveal>

      {/* ── Post list ── */}
      {posts.length === 0 ? (
        <p className="font-body text-muted">no posts yet.</p>
      ) : (
        <ul>
          {posts.map((post, i) => (
            <li key={post.slug}>
              <ScrollReveal delay={0.06 * (i + 1)}>
                <Link
                  href={`/blog/${post.slug}/`}
                  className="flex gap-5 py-7 border-b border-border group
                             hover:border-accent/25 transition-colors duration-300"
                >
                  {/* Index number */}
                  <span
                    className="font-display text-[0.44rem] tracking-[0.14em] uppercase
                               text-muted/40 group-hover:text-accent/70 transition-colors
                               duration-300 shrink-0 pt-[0.35rem] w-6 text-right"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h2
                      className="font-heading text-2xl font-normal text-bright
                                 group-hover:text-accent transition-colors duration-300
                                 leading-snug mb-2"
                    >
                      {post.title}
                    </h2>
                    <p className="font-display text-[0.48rem] tracking-[0.15em] uppercase text-muted mb-3">
                      {post.date} · {post.readingTime}
                    </p>
                    {post.excerpt && (
                      <p className="font-body text-foreground leading-relaxed text-[0.95rem] line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Arrow */}
                  <span
                    className="font-display text-[0.52rem] tracking-[0.1em] text-muted/40
                               group-hover:text-accent transition-colors duration-300
                               shrink-0 self-start mt-[0.3rem]"
                  >
                    →
                  </span>
                </Link>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <ScrollReveal delay={0.05} className="mt-12">
          <nav className="flex items-center gap-8">
            <span className="font-display text-[0.52rem] tracking-[0.2em] uppercase text-muted">
              page 1 of {totalPages}
            </span>
            <Link
              href="/blog/page/2/"
              className="font-display text-[0.52rem] tracking-[0.2em] uppercase
                         text-foreground hover:text-accent transition-colors duration-300"
            >
              next →
            </Link>
          </nav>
        </ScrollReveal>
      )}
    </div>
  );
}
