import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import readingTime from 'reading-time';

const contentDir = path.join(process.cwd(), 'content');
const postsDir = path.join(contentDir, 'posts');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string | undefined;
  readingTime: string;
}

export interface Post extends PostMeta {
  content: string;
}

function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '');
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir);
  return files
    .filter((f) => f.endsWith('.md'))
    .map((f) => getSlugFromFilename(f));
}

function formatDate(d: unknown): string {
  if (d instanceof Date) return d.toISOString().split('T')[0];
  if (typeof d === 'string') return d;
  return '';
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const stats = readingTime(content);

  return {
    slug,
    title: data.title || slug,
    date: formatDate(data.date) || '',
    excerpt: data.excerpt,
    readingTime: stats.text,
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  const slugs = getAllPostSlugs();
  const posts = slugs
    .map((slug) => {
      const post = getPostBySlug(slug);
      if (!post) return null;
      return {
        slug: post.slug,
        title: post.title,
        date: post.date,
        excerpt: post.excerpt,
        readingTime: post.readingTime,
      };
    })
    .filter((p): p is PostMeta => p !== null);

  return posts.sort((a, b) => (b.date > a.date ? 1 : -1));
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeKatex)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}

export function getResumeContent(): string {
  const resumePath = path.join(contentDir, 'resume.md');
  if (!fs.existsSync(resumePath)) return '';
  return fs.readFileSync(resumePath, 'utf8');
}

// ── Structured resume data (read from YAML frontmatter in resume.md) ────────

export interface ResumeEducation {
  institution: string;
  degree: string;
  location?: string;
  period?: string;
  courses?: string[];
}

export interface ResumeExperience {
  title: string;
  org: string;
  period?: string;
  location?: string;
  bullets?: string[];
}

export interface ResumeProject {
  name: string;
  period?: string;
  tech?: string[];
  bullets?: string[];
}

export interface ResumeSkillGroup {
  category: string;
  items: string[];
}

export interface ResumeContact {
  email?: string;
  linkedin?: string;
}

export interface ResumeData {
  education?: ResumeEducation[];
  experience?: ResumeExperience[];
  projects?: ResumeProject[];
  skills?: ResumeSkillGroup[];
  contact?: ResumeContact;
}

export function getResumeData(): ResumeData {
  const resumePath = path.join(contentDir, 'resume.md');
  if (!fs.existsSync(resumePath)) return {};
  const fileContents = fs.readFileSync(resumePath, 'utf8');
  const { data } = matter(fileContents);
  return (data as ResumeData) ?? {};
}
