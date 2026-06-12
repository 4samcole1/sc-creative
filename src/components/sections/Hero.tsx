// src/components/sections/Hero.tsx
import Link from 'next/link'
import { MapPin, Settings, TrendingUp } from 'lucide-react'

const cards = [
  {
    Icon: MapPin,
    title: 'Local Focus',
    tagline: 'Walker County & Beyond',
  },
  {
    Icon: Settings,
    title: 'Modern Solutions',
    tagline: 'Strategic Design & Intelligent Systems',
  },
  {
    Icon: TrendingUp,
    title: 'Growth Driven',
    tagline: 'Built to Scale. Built to Last.',
  },
]

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background photo */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/jasper-hero.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.85) saturate(0.9)',
        }}
      />

      {/* Left-to-right gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(8,15,22,0.96) 0%, rgba(8,15,22,0.9) 38%, rgba(8,15,22,0.45) 60%, rgba(8,15,22,0.25) 100%)',
        }}
      />

      {/* Content grid */}
      <div
        className="relative z-10 h-full mx-auto px-5"
        style={{
          maxWidth: '1200px',
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          columnGap: '30px',
        }}
      >
        {/* Left column */}
        <div className="flex flex-col justify-center pt-16 pb-8">
          <p
            className="mb-4 font-semibold uppercase text-[#1cc7c3]"
            style={{ fontSize: '14px', letterSpacing: '1.5px' }}
          >
            Modern Growth Solutions
          </p>

          <h1
            className="font-extrabold text-[#f5f7fb] mb-6"
            style={{
              fontSize: 'clamp(38px, 4.5vw, 54px)',
              lineHeight: 1.1,
              textShadow: '0 2px 10px rgba(0,0,0,0.25)',
            }}
          >
            Build a smarter foundation for{' '}
            <span className="text-[#1cc7c3]">growth.</span>
          </h1>

          <p className="text-[#cfd6dd] mb-4" style={{ fontSize: '15px', lineHeight: 1.6, maxWidth: '480px' }}>
            SC Creative helps businesses across Jasper, Walker County, and beyond grow through
            strategic clarity, modern branding, high-performance websites, intelligent systems,
            and scalable growth solutions.
          </p>

          <p className="text-[#cfd6dd] mb-8" style={{ fontSize: '15px', lineHeight: 1.6, maxWidth: '480px' }}>
            Whether you&apos;re launching something new, modernizing an established company, or
            preparing for your next stage of growth, we help build the infrastructure behind
            long-term success.
          </p>

          <div className="flex gap-4 mb-8 flex-wrap">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-semibold rounded-md px-5 py-3 text-[#07262b] bg-[#1cc7c3]"
              style={{ fontSize: '14px', boxShadow: '0 8px 18px rgba(28,199,195,0.35)' }}
            >
              Start Your Project <span>+</span>
            </Link>
            <Link
              href="/process"
              className="inline-flex items-center font-semibold rounded-md px-5 py-3 text-[#dbe3ea]"
              style={{ fontSize: '14px', border: '2px solid #5c6a78' }}
            >
              Explore Our Process
            </Link>
          </div>

          <div className="flex items-start gap-3 text-[#b9c2cb]" style={{ fontSize: '13px', lineHeight: 1.5 }}>
            <MapPin className="text-[#1cc7c3] shrink-0 mt-0.5" size={20} />
            <div>
              <div>Proudly based in Jasper, Alabama</div>
              <div>Serving Walker County, Greater Birmingham, Northwest Alabama, and businesses nationwide.</div>
            </div>
          </div>
        </div>

        {/* Right column — cards pinned to bottom */}
        <div className="flex items-end justify-end pb-10">
          <div className="flex gap-4 w-full justify-end">
            {cards.map(({ Icon, title, tagline }) => (
              <div
                key={title}
                className="flex flex-col rounded-2xl p-5"
                style={{
                  width: '195px',
                  minHeight: '180px',
                  background: 'rgba(20,31,42,0.68)',
                  border: '1px solid rgba(31,45,58,0.62)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.28)',
                }}
              >
                <Icon className="text-[#1cc7c3] mb-3" size={28} />
                <h4 className="font-semibold text-[#f5f7fb] mb-2" style={{ fontSize: '16px' }}>
                  {title}
                </h4>
                <p className="text-[#b7c1cb]" style={{ fontSize: '13px', lineHeight: 1.5 }}>
                  {tagline}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
