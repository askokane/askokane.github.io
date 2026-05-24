import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-6 pt-28 md:pt-36 pb-28 space-y-8">
      <div className="w-10 h-px bg-gradient-to-r from-accent to-transparent" />
      <h1 className="font-heading text-4xl font-light text-bright tracking-tight">not found</h1>
      <p className="font-body text-foreground leading-relaxed">
        the page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-block font-display text-[0.58rem] tracking-[0.2em] uppercase text-muted hover:text-accent transition-colors duration-300"
      >
        back to home
      </Link>
    </div>
  );
}
