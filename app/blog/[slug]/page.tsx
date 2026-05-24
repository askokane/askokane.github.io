import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPostSlugs, getAllPosts, markdownToHtml } from '@/lib/markdown';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ReadingProgress } from '@/components/ReadingProgress';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'post not found' };
  return { title: post.title, description: post.excerpt || post.title };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  // Capitalize first letter of body
  const body = post.content.replace(/^(\s*)([a-z])/, (_, ws, ch) => ws + ch.toUpperCase());
  const html = await markdownToHtml(body);

  // Prev / next (allPosts sorted newest-first)
  const allPosts = getAllPosts();
  const idx      = allPosts.findIndex((p) => p.slug === params.slug);
  const newer    = idx > 0                    ? allPosts[idx - 1] : null;
  const older    = idx < allPosts.length - 1  ? allPosts[idx + 1] : null;

  return (
    <>
      <ReadingProgress />

      <div className="max-w-2xl mx-auto px-6 pt-28 md:pt-36 pb-28">
        <article className="space-y-12">

          {/* ── Header ── */}
          <ScrollReveal>
            <header>
              <div className="w-10 h-px bg-gradient-to-r from-accent to-transparent mb-6" />
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="font-heading text-4xl md:text-5xl font-light text-bright tracking-tight leading-tight">
                  {post.title}
                </h1>
                <Link
                  href="/blog/"
                  className="font-display text-[0.52rem] tracking-[0.2em] uppercase text-muted
                             hover:text-accent transition-colors duration-300 shrink-0 mt-2"
                >
                  all posts
                </Link>
              </div>
              <p className="font-display text-[0.52rem] tracking-[0.2em] uppercase text-muted">
                {post.date} · {post.readingTime}
              </p>
            </header>
          </ScrollReveal>

          {/* ── Body ── */}
          <ScrollReveal delay={0.08} distance={8}>
            <div
              className="blog-post-content"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </ScrollReveal>

        </article>

        {/* ── Prev / next navigation ── */}
        {(older || newer) && (
          <nav className="blog-post-nav">
            {older ? (
              <Link href={`/blog/${older.slug}/`} className="blog-post-nav-link">
                <span className="blog-post-nav-direction">← older</span>
                <span className="blog-post-nav-title">{older.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {newer ? (
              <Link href={`/blog/${newer.slug}/`} className="blog-post-nav-link justify-end">
                <span className="blog-post-nav-direction">newer →</span>
                <span className="blog-post-nav-title">{newer.title}</span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}
      </div>
    </>
  );
}
