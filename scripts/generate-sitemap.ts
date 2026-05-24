import fs from 'fs';
import path from 'path';
import { getAllPosts } from '../lib/markdown';

const SITE_URL = 'https://atharvakokane.github.io';

const POSTS_PER_PAGE = 10;

function generateSitemap(): string {
  const posts = getAllPosts();
  const staticPages = ['', '/blog/', '/resume/', '/contact/'];
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE) || 1;
  const blogPages = Array.from({ length: totalPages - 1 }, (_, i) => `/blog/page/${i + 2}/`);

  const urls = [
    ...staticPages.map((p) => `${SITE_URL}${p}`),
    ...posts.map((p) => `${SITE_URL}/blog/${p.slug}/`),
    ...blogPages.map((p) => `${SITE_URL}${p}`),
  ];

  const urlEntries = urls
    .map(
      (url) => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === SITE_URL + '/' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

function generateRobots(): string {
  return `user-agent: *
allow: /
disallow: /admin/

sitemap: ${SITE_URL}/sitemap.xml
`.trim();
}

const outDir = path.join(process.cwd(), 'public');
fs.writeFileSync(path.join(outDir, 'sitemap.xml'), generateSitemap());
fs.writeFileSync(path.join(outDir, 'robots.txt'), generateRobots());
console.log('generated sitemap.xml and robots.txt');
