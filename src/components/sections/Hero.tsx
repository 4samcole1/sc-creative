// src/components/sections/Hero.tsx
import Link from 'next/link'

const featureCards = [
  {
    icon: '📍',
    title: 'Local Focus',
    sub: 'Walker County & Beyond',
  },
  {
    icon: '⚙️',
    title: 'Modern Solutions',
    sub: 'Strategy, Design & Intelligent Systems',
  },
  {
    icon: '📈',
    title: 'Growth Driven',
    sub: 'Built to Scale. Built to Last.',
  },
]

export default function Hero() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center"
      style={{
        background: `
          radial-gradient(circle at top left, rgba(14,177,171,0.15), transparent 40%),
          linear-gradient(135deg, #020617 0%, #06111f 45%, #0b1020 100%)
        `,
      }}
    >
      <div className="max-w-[1500px] mx-auto px-8 w-full pt-[88px] grid grid-cols-2 gap-16 items-center py-20">
        {/* Left column */}
        <div>
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#009898] mb-5">
            Modern Growth Solutions
          </div>
          <h1 className="text-[clamp(36px,4vw,64px)] font-black leading-[1.1] tracking-tight text-white mb-6">
            Strategy. Design.<br />
            Systems. Growth.<br />
            <span className="text-[#0EB1AB]">All working together.</span>
          </h1>
          <p className="text-[17px] text-white/60 leading-[1.75] mb-10 max-w-[520px]">
            SC Creative helps businesses in Jasper, Walker County, and beyond build smarter
            foundations for growth through strategy, branding, websites, AI systems, and
            growth marketing that drive real results.
          </p>
          <div className="flex gap-6 flex-wrap mb-10">
            <Link
              href="/contact"
              className="bg-[#009898] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#0EB1AB] hover:shadow-[0_0_30px_rgba(14,177,171,0.5)] transition-all duration-200 text-[15px]"
            >
              Start Your Project →
            </Link>
            <Link
              href="/process"
              className="border border-white/30 text-white/80 font-medium px-8 py-4 rounded-xl hover:border-white/60 hover:text-white transition-all text-[15px]"
            >
              Explore Our Process
            </Link>
          </div>
          <div className="flex items-start gap-2.5 text-sm">
            <span className="text-[#009898] mt-0.5">📍</span>
            <div className="text-white/40 leading-relaxed">
              <span className="text-white/60">Proudly based in Jasper, Alabama</span>
              <br />
              Serving Walker County, Greater Birmingham &amp; Northwest Alabama
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="relative h-[540px]">
          <div className="relative h-full rounded-2xl overflow-hidden">
            <img
              src="/images/jasper-aerial.jpg"
              alt="Jasper, Alabama — home of SC Creative"
              className="w-full h-full object-cover"
            />
            {/* Fade left to blend with hero bg */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/80 via-transparent to-transparent" />
            {/* Fade bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/60 via-transparent to-transparent" />
            {/* Teal atmospheric glow */}
            <div className="absolute inset-0 bg-[rgba(14,177,171,0.06)]" />
          </div>

          {/* Glassmorphism feature cards */}
          <div className="absolute bottom-4 left-4 right-4 flex gap-3">
            {featureCards.map((card) => (
              <div
                key={card.title}
                className="flex-1 backdrop-blur-md bg-white/[0.08] border border-white/[0.12] rounded-xl p-3.5 shadow-[0_0_20px_rgba(14,177,171,0.15)]"
              >
                <div className="text-xl mb-1.5">{card.icon}</div>
                <div className="text-white text-xs font-bold mb-1">{card.title}</div>
                <div className="text-white/50 text-[10px] leading-snug">{card.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
