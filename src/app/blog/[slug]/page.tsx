import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getAllPosts, getPostBySlug } from '@/lib/blog';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Full-page Watermark */}
      <div className="fixed inset-0 pointer-events-none select-none z-0" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/branding/IMG_3003.JPG" alt="" className="w-full h-full object-cover opacity-[0.04]" />
      </div>

      <div className="relative z-10 pt-32 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-gray-400 hover:text-white transition-colors py-2"
            >
              &larr; Back to Blog
            </Link>
          </div>

          <article className="border border-white/10 bg-white/5 p-10">
            {/* Featured Image */}
            {post.image && (
              <div className="mb-8 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
              </div>
            )}

            {/* Post Header */}
            <header className="mb-8 border-b border-white/10 pb-8">
              <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-wide text-white mb-4">
                {post.title}
              </h1>
              <div className="flex items-center gap-3 text-gray-500 text-xs tracking-widest uppercase">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </time>
                <span>&middot;</span>
                <span>{post.readingTime} min read</span>
              </div>
            </header>

            {/* Key Stats */}
            {post.stats && post.stats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-px mb-8 bg-white/10 border border-white/10">
                {post.stats.map((stat) => (
                  <div key={stat.label} className="bg-gray-900 p-6 text-center">
                    <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs tracking-widest uppercase text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Post Content */}
            <div className="text-gray-300 leading-relaxed text-base prose prose-invert prose-base max-w-none prose-headings:text-white prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-code:text-green-400 prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-img:w-full">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  blockquote: ({ children }) => (
                    <blockquote className="not-italic border-0 border-l-2 pl-6 my-8 py-1 [border-image:linear-gradient(to_bottom,#4ade80,#3b82f6,#9333ea)_1]">
                      <div className="text-lg md:text-xl italic font-medium text-gray-100 leading-relaxed">
                        {children}
                      </div>
                    </blockquote>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Post Footer */}
            <footer className="mt-12 pt-8 border-t border-white/10">
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white text-xs tracking-[0.3em] uppercase font-semibold hover:opacity-90 transition-opacity"
              >
                &larr; All Posts
              </Link>
            </footer>
          </article>
        </div>
      </div>

      <footer className="relative z-10 py-6 text-center border-t border-white/10">
        <p className="text-xs tracking-widest uppercase text-gray-500">
          &copy; {new Date().getFullYear()} AZ Solutions Inc. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
