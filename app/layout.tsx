import type { Metadata } from 'next';
import { Cormorant_Garamond, Crimson_Pro, Cinzel } from 'next/font/google';
import './globals.css';
import 'highlight.js/styles/github-dark.css';
import 'katex/dist/katex.min.css';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-crimson',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cinzel',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'atharva kokane',
  description: 'personal blog and portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${crimsonPro.variable} ${cinzel.variable} antialiased scroll-smooth`}
    >
      <body className="min-h-screen bg-background text-foreground font-body">
        {/* Absolute nav overlays all pages including full-screen hero */}
        <header className="absolute top-0 left-0 right-0 z-50 pt-10 md:pt-14">
          <div className="max-w-2xl mx-auto px-6">
            <Nav />
          </div>
        </header>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
