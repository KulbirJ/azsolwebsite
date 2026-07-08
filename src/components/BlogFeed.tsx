'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/lib/blog';

const PAGE_SIZE = 6;

export default function BlogFeed({ posts }: { posts: BlogPost[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < posts.length && !loading) {
          setLoading(true);
          setTimeout(() => {
            setVisibleCount(c => Math.min(c + PAGE_SIZE, posts.length));
            setLoading(false);
          }, 300);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, posts.length, loading]);

  const visiblePosts = posts.slice(0, visibleCount);
  const allLoaded = visibleCount >= posts.length;

  if (posts.length === 0) {
    return (
      <p className="text-xs tracking-[0.4em] uppercase text-gray-500 text-center py-12">
        No posts published yet. Check back soon.
      </p>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto grid gap-0 md:grid-cols-2 lg:grid-cols-3">
        {visiblePosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col p-8 border border-white/5 bg-white/5 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-all duration-300 cursor-pointer"
          >
            {post.image && (
              <div className="mb-5 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <p className="text-xs tracking-widest uppercase text-blue-400/70 mb-2">
              {new Date(post.date).toLocaleDateString('en-CA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              <span className="text-gray-500"> · {post.readingTime} min read</span>
            </p>
            <h3 className="text-sm font-semibold text-gray-200 group-hover:text-white mb-3 transition-colors duration-300 leading-relaxed">
              {post.title}
            </h3>
            <p className="text-sm text-gray-400 group-hover:text-gray-300 leading-relaxed transition-colors duration-300 mb-5 flex-1 line-clamp-3">
              {post.excerpt}
            </p>
            <span className="text-xs tracking-widest uppercase bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent opacity-70 group-hover:opacity-100 transition-opacity font-semibold">
              Read More →
            </span>
          </Link>
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="mt-12 flex justify-center pb-8">
        {loading && (
          <div className="w-6 h-6 border-2 border-white/20 border-t-blue-400 rounded-full animate-spin" />
        )}
        {allLoaded && posts.length > PAGE_SIZE && (
          <p className="text-xs tracking-[0.3em] uppercase text-gray-600">
            You&apos;ve reached the end
          </p>
        )}
      </div>
    </>
  );
}
