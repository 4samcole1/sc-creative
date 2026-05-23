// src/components/sections/PartnerCTA.tsx
import Link from 'next/link'

export default function PartnerCTA() {
  return (
    <section
      className="relative overflow-hidden py-24"
      style={{
        background: 'linear-gradient(135deg, #020617 0%, #071426 50%, #020617 100%)',
      }}
    >
      {/* Background workspace image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent" />
      </div>

      <div className="relative max-w-[1500px] mx-auto px-8 grid grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#009898] mb-5">
            Built for Businesses That Want More
          </div>
          <h2 className="text-[clamp(28px,3vw,48px)] font-black text-white leading-[1.15] mb-6">
            More than a vendor.<br />
            We&apos;re your growth partner.
          </h2>
          <p className="text-[17px] text-white/60 leading-[1.75] mb-10 max-w-[480px]">
            We combine strategy, creativity, development, and intelligent systems to help
            businesses across Walker County and beyond grow with confidence.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#009898] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#0EB1AB] hover:shadow-[0_0_30px_rgba(14,177,171,0.5)] transition-all duration-200 text-[15px]"
          >
            Let&apos;s Talk About Your Goals →
          </Link>
        </div>

        {/* Right */}
        <div className="relative h-[400px]">
          <img
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80"
            alt="Modern workspace"
            className="w-full h-full object-cover rounded-2xl opacity-50"
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#020617]/80 via-transparent to-transparent" />
          <div className="absolute inset-0 rounded-2xl bg-[rgba(14,177,171,0.05)]" />
        </div>
      </div>
    </section>
  )
}
