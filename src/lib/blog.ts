import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');
const WORDS_PER_MINUTE = 200;

export interface BlogStat {
  value: string;
  label: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image?: string;
  stats?: BlogStat[];
  readingTime: number;
  content: string;
}

function readPost(slug: string): BlogPost {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), 'utf8');
  const { data, content } = matter(raw);
  const wordCount = content.trim().split(/\s+/).length;

  return {
    slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt ?? '',
    image: data.image,
    stats: data.stats,
    readingTime: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
    content,
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const slugs = fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));

  return slugs
    .map(readPost)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    return readPost(slug);
  } catch {
    return null;
  }
}
