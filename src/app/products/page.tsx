import Link from 'next/link';
import { getAllProducts } from '@/lib/products';

export const metadata = {
  title: 'Products',
  description: 'Open-source security tools I build and give away.',
};

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <main className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Full-page Watermark */}
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/branding/IMG_3003.JPG"
          alt=""
          className="w-full h-full object-cover opacity-[0.04]"
        />
      </div>

      {/* Hero */}
      <section className="relative z-10 pt-32 pb-4 overflow-hidden">
        <div className="px-6 mb-12 text-center">
          <p className="text-sm tracking-[0.4em] uppercase text-gray-400">
            Open-Source Security Tools I Build and Give Away
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-xs tracking-[0.4em] uppercase text-gray-500 text-center py-12">
            No tools published yet. Check back soon.
          </p>
        ) : (
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2">
            {products.map((product, index) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className={`group flex flex-col p-10 transition-all duration-300
                  hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:z-10 cursor-pointer border border-white/5
                  ${index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'}`}
              >
                {product.image && (
                  <div className="mb-6 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {product.tag && (
                  <span className="text-xs tracking-widest uppercase text-blue-400/70 group-hover:text-blue-300 mb-2 transition-colors duration-300 font-medium">
                    {product.tag}
                  </span>
                )}

                <h2 className="text-lg font-bold tracking-wide text-gray-200 group-hover:text-white mb-3 transition-colors duration-300">
                  {product.title}
                </h2>

                <p className="text-sm text-gray-400 group-hover:text-gray-300 leading-relaxed transition-colors duration-300 mb-5 flex-1">
                  {product.excerpt}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] tracking-widest uppercase text-gray-500 mb-5">
                  {product.language && <span>{product.language}</span>}
                  {product.language && product.license && <span>·</span>}
                  {product.license && <span>{product.license}</span>}
                </div>

                <span className="text-xs tracking-widest uppercase bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent opacity-70 group-hover:opacity-100 transition-opacity font-semibold">
                  View Tool →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center border-t border-white/10 mt-8">
        <p className="text-xs tracking-widest uppercase text-gray-500">
          &copy; {new Date().getFullYear()} AZ Solutions Inc. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
