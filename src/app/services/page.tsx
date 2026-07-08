const serviceList = [
  {
    title: 'Cybersecurity Risk Management',
    description: 'End-to-end identification, assessment, and prioritization of cyber risks aligned to your business objectives. We deliver actionable risk registers, treatment plans, and executive-ready reporting that empower organizations to make informed security investments and meet regulatory obligations.',
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M32 6 L54 16 L54 32 C54 44 44 54 32 58 C20 54 10 44 10 32 L10 16 Z" />
        <line x1="32" y1="24" x2="32" y2="36" strokeWidth="2" />
        <circle cx="32" cy="42" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Security Architecture',
    description: 'Design and review of enterprise security architectures that are resilient, scalable, and aligned to frameworks such as SABSA, TOGAF, and Zero Trust. From network segmentation and identity design to secure-by-default cloud patterns, we translate strategy into technical blueprints your teams can build from.',
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="8" y="8" width="20" height="20" rx="2" />
        <rect x="36" y="8" width="20" height="20" rx="2" />
        <rect x="22" y="36" width="20" height="20" rx="2" />
        <line x1="18" y1="28" x2="32" y2="36" />
        <line x1="46" y1="28" x2="32" y2="36" />
      </svg>
    ),
  },
  {
    title: 'Multi-Cloud Solution Architecture',
    description: 'Design and delivery of workload architectures spanning AWS, Microsoft Azure, and Oracle Cloud. We help enterprises plan cloud adoption, optimize costs, enforce consistent governance, and architect hybrid or multi-cloud environments that are secure, observable, and operationally sustainable.',
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 40 C10 40 6 36 6 30 C6 24 10 20 16 20 C17 14 22 10 28 10 C34 10 39 14 40 20 C46 20 58 26 52 38 C50 42 46 44 42 44 L16 44 Z" />
        <line x1="24" y1="44" x2="24" y2="54" />
        <line x1="32" y1="44" x2="32" y2="54" />
        <line x1="40" y1="44" x2="40" y2="54" />
        <line x1="20" y1="54" x2="44" y2="54" />
      </svg>
    ),
  },
  {
    title: 'Cybersecurity Posture Management',
    description: 'Enterprise-grade continuous visibility into your security posture across cloud, on-premises, and hybrid environments. We implement and tune CSPM, SSPM, and CIEM tooling, establish baseline benchmarks, and deliver ongoing posture scoring with clear remediation roadmaps tracked against CIS and NIST CSF.',
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="32" cy="32" r="22" />
        <polyline points="20,32 27,40 44,22" strokeWidth="2" />
        <circle cx="32" cy="32" r="14" strokeDasharray="4 3" />
      </svg>
    ),
  },
  {
    title: 'Vulnerability Management',
    description: 'Structured programs to discover, classify, prioritize, and remediate vulnerabilities across your infrastructure, applications, and third-party supply chain. We build or mature vulnerability management programs with defined SLAs, risk-based prioritization, metrics dashboards, and integration into DevSecOps pipelines for continuous coverage.',
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M32 8 L56 20 L56 44 L32 56 L8 44 L8 20 Z" />
        <line x1="32" y1="22" x2="32" y2="36" strokeWidth="2" />
        <circle cx="32" cy="43" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Cybersecurity Program Development',
    description: 'End-to-end design, build, and maturation of enterprise cybersecurity programs from the ground up. We define governance structures, policy frameworks, and operating models aligned to ISO 27001, NIST CSF, and CIS Controls — then stand up the people, processes, and technology needed to run a sustainable, measurable security function that scales with your organization.',
    icon: (
      <svg viewBox="0 0 64 64" className="w-12 h-12 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="10" y="10" width="44" height="44" rx="3" />
        <line x1="10" y1="22" x2="54" y2="22" />
        <line x1="22" y1="22" x2="22" y2="54" />
        <line x1="32" y1="30" x2="46" y2="30" />
        <line x1="32" y1="38" x2="46" y2="38" />
        <line x1="32" y1="46" x2="46" y2="46" />
        <circle cx="16" cy="16" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <main className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Full-page Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/branding/IMG_3003.JPG" alt="" className="w-full h-full object-cover opacity-[0.04]" />
      </div>

      <section className="relative z-10 pt-32 pb-8 text-center">
        <div className="px-6 mb-12">
          <p className="text-sm tracking-[0.4em] uppercase text-gray-400">
            Consulting Services
          </p>
        </div>

        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {serviceList.map((service, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center p-10 transition-all duration-300
                hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] border border-white/5 bg-white/5"
            >
              <div className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300">
                {service.icon}
              </div>
              <h2 className="text-sm font-bold tracking-[0.15em] uppercase text-gray-100 group-hover:text-white mb-3 transition-colors">
                {service.title}
              </h2>
              <p className="text-sm text-gray-300 group-hover:text-white leading-relaxed transition-colors">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 py-6 text-center border-t border-white/10">
        <p className="text-xs tracking-widest uppercase text-gray-500">
          &copy; {new Date().getFullYear()} AZ Solutions Inc. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
