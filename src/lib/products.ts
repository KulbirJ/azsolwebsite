import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { BlogStat } from '@/lib/blog';

const PRODUCTS_DIR = path.join(process.cwd(), 'src', 'content', 'products');
const WORDS_PER_MINUTE = 200;

export interface Product {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image?: string;
  stats?: BlogStat[];
  readingTime: number;
  content: string;
  github: string;
  language?: string;
  license?: string;
  tag?: string;
}

function readProduct(slug: string): Product {
  const raw = fs.readFileSync(path.join(PRODUCTS_DIR, `${slug}.md`), 'utf8');
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
    github: data.github ?? '',
    language: data.language,
    license: data.license,
    tag: data.tag,
  };
}

export function getAllProducts(): Product[] {
  if (!fs.existsSync(PRODUCTS_DIR)) return [];
  const slugs = fs
    .readdirSync(PRODUCTS_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));

  return slugs
    .map(readProduct)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getProductBySlug(slug: string): Product | null {
  try {
    return readProduct(slug);
  } catch {
    return null;
  }
}
