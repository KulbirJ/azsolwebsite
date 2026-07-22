import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getAllProducts, getProductBySlug } from '@/lib/products';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Tool Not Found',
    };
  }

  return {
    title: product.title,
    description: product.excerpt,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
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
              href="/products"
              className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-gray-400 hover:text-white transition-colors py-2"
            >
              &larr; Back to Products
            </Link>
          </div>

          <article className="border border-white/10 bg-white/5 p-10">
            {/* Featured Image */}
            {product.image && (
              <div className="mb-8 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
              </div>
            )}

            {/* Header */}
            <header className="mb-8 border-b border-white/10 pb-8">
              {product.tag && (
                <p className="text-xs tracking-[0.3em] uppercase text-blue-400/70 mb-3">
                  {product.tag}
                </p>
              )}
              <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-wide text-white mb-4">
                {product.title}
              </h1>

              {/* Metadata bar */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-gray-500 text-xs tracking-widest uppercase mb-6">
                <time dateTime={product.date}>
                  {new Date(product.date).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </time>
                <span>&middot;</span>
                <span>{product.readingTime} min read</span>
                {product.language && (
                  <>
                    <span>&middot;</span>
                    <span>{product.language}</span>
                  </>
                )}
                {product.license && (
                  <>
                    <span>&middot;</span>
                    <span>{product.license} License</span>
                  </>
                )}
              </div>

              {/* GitHub CTA */}
              {product.github && (
                <a
                  href={product.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white text-xs tracking-[0.2em] uppercase font-semibold hover:opacity-90 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  View on GitHub ↗
                </a>
              )}
            </header>

            {/* Key Stats */}
            {product.stats && product.stats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-px mb-8 bg-white/10 border border-white/10">
                {product.stats.map((stat) => (
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

            {/* Content */}
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
                {product.content}
              </ReactMarkdown>
            </div>

            {/* Footer */}
            <footer className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-4">
              {product.github && (
                <a
                  href={product.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white text-xs tracking-[0.3em] uppercase font-semibold hover:opacity-90 transition-opacity"
                >
                  View on GitHub ↗
                </a>
              )}
              <Link
                href="/products"
                className="inline-block px-8 py-3 border border-white/20 text-gray-300 text-xs tracking-[0.3em] uppercase font-semibold hover:bg-white/10 hover:text-white transition-colors"
              >
                &larr; All Products
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
