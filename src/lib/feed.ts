import type { BlogPost } from '@/lib/blog';
import type { Product } from '@/lib/products';

export interface FeedItem {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image?: string;
  readingTime: number;
  href: string;
  kind: 'post' | 'tool';
}

export function postToFeedItem(post: BlogPost): FeedItem {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    image: post.image,
    readingTime: post.readingTime,
    href: `/blog/${post.slug}`,
    kind: 'post',
  };
}

export function productToFeedItem(product: Product): FeedItem {
  return {
    slug: product.slug,
    title: product.title,
    date: product.date,
    excerpt: product.excerpt,
    image: product.image,
    readingTime: product.readingTime,
    href: `/products/${product.slug}`,
    kind: 'tool',
  };
}
