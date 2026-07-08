const products = [
  {
    icon: (
      <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto mb-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="8" y="12" width="48" height="40" rx="2" />
        <line x1="8" y1="24" x2="56" y2="24" />
        <circle cx="20" cy="18" r="2" fill="currentColor" stroke="none" />
        <circle cx="28" cy="18" r="2" fill="currentColor" stroke="none" />
        <circle cx="36" cy="18" r="2" fill="currentColor" stroke="none" />
        <polyline points="20,34 26,40 44,32" strokeWidth="2" />
      </svg>
    ),
    title: 'Compliance Assessment Platform',
    description:
      'Streamline your regulatory compliance with our automated assessment platform. Map controls to frameworks like NIST, ISO 27001, SOC 2, and HIPAA with real-time dashboards and audit-ready reporting.',
    tag: 'Compliance & Governance',
    bg: 'bg-gray-200',
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto mb-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="32" cy="32" r="20" />
        <circle cx="32" cy="32" r="10" />
        <line x1="32" y1="4" x2="32" y2="12" />
        <line x1="32" y1="52" x2="32" y2="60" />
        <line x1="4" y1="32" x2="12" y2="32" />
        <line x1="52" y1="32" x2="60" y2="32" />
        <line x1="12" y1="12" x2="18" y2="18" />
        <line x1="46" y1="46" x2="52" y2="52" />
        <line x1="52" y1="12" x2="46" y2="18" />
        <line x1="18" y1="46" x2="12" y2="52" />
      </svg>
    ),
    title: 'Threat Risk Assessment Platform',
    description:
      'Identify, prioritize, and mitigate cyber threats with our enterprise threat risk assessment platform. Leverages threat intelligence feeds, asset inventory, and risk scoring to give you full visibility.',
    tag: 'Risk Management',
    bg: 'bg-gray-300',
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto mb-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="32,8 44,20 44,44 32,56 20,44 20,20" />
        <line x1="32" y1="8" x2="32" y2="56" />
        <line x1="20" y1="20" x2="44" y2="44" />
        <line x1="44" y1="20" x2="20" y2="44" />
        <circle cx="32" cy="32" r="5" />
      </svg>
    ),
    title: 'Attack Simulation',
    description:
      'Test your defenses before attackers do. Our attack simulation platform runs adversary emulations and breach-and-attack simulations (BAS) against your environment to expose gaps and validate controls.',
    tag: 'Offensive Security',
    bg: 'bg-gray-300',
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto mb-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="10" y="20" width="16" height="28" rx="1" />
        <rect x="30" y="12" width="16" height="36" rx="1" />
        <circle cx="18" cy="12" r="5" />
        <circle cx="38" cy="6" r="5" />
        <line x1="18" y1="17" x2="18" y2="20" />
        <line x1="38" y1="11" x2="38" y2="12" />
        <line x1="26" y1="30" x2="30" y2="28" />
      </svg>
    ),
    title: 'Products Pipeline',
    description:
      'Get a first look at what we are building next. Our products pipeline showcases innovations in development — from AI-driven security tools to next-gen compliance automation coming soon.',
    tag: 'Coming Soon',
    bg: 'bg-gray-200',
  },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Full-page Watermark */}
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <img
          src="/branding/IMG_3003.JPG"
          alt=""
          className="w-full h-full object-cover opacity-[0.04]"
        />
      </div>

      {/* Hero */}
      <section className="relative z-10 pt-32 pb-4 text-center overflow-hidden">
        <div className="px-6 mb-12">
          <p className="text-sm tracking-[0.4em] uppercase text-gray-400">
            Purpose-Built Platforms for Modern Security Challenges
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2">
          {products.map((product, index) => (
            <div
              key={index}
              className={`group flex flex-col items-center text-center p-10 transition-all duration-300
                hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:z-10 cursor-default border border-white/5
                ${
                  index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'
                }`}
            >
              <div className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300">
                {product.icon}
              </div>

              <span className="text-xs tracking-widest uppercase text-blue-400/70 group-hover:text-blue-300 mb-2 transition-colors duration-300 font-medium">
                {product.tag}
              </span>

              <h2 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-300 group-hover:text-white mb-3 transition-colors duration-300">
                {product.title}
              </h2>

              <p className="text-sm text-gray-400 group-hover:text-gray-300 leading-relaxed transition-colors duration-300">
                {product.description}
              </p>
            </div>
          ))}
        </div>


      </section>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center border-t border-white/10">
        <p className="text-xs tracking-widest uppercase text-gray-500">
          &copy; {new Date().getFullYear()} AZ Solutions Inc. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
