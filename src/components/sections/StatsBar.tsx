// src/components/sections/StatsBar.tsx
const logos = [
  { src: '/images/logos/miller-roofing.png', alt: 'Miller Roofing' },
  { src: '/images/logos/wet.png', alt: 'WET' },
  { src: '/images/logos/glory-fellowship.png', alt: 'Glory Fellowship' },
  { src: '/images/logos/wmd.png', alt: 'WMD' },
  { src: '/images/logos/sanders.png', alt: 'Sanders' },
  { src: '/images/logos/seventy-eight.webp', alt: 'Seventy-Eight' },
  { src: '/images/logos/lavish.svg', alt: 'Lavish' },
  { src: '/images/logos/lemon-ridge.png', alt: 'Lemon Ridge' },
]

export default function TrustBar() {
  return (
    <section className="bg-white py-10 border-b border-gray-100 overflow-hidden">
      <p className="text-center text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-8">
        Trusted by Businesses Across the Region
      </p>

      <div className="relative">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10"
          style={{ background: 'linear-gradient(to right, white, transparent)' }} />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10"
          style={{ background: 'linear-gradient(to left, white, transparent)' }} />

        <div
          className="flex items-center"
          style={{ animation: 'marquee 28s linear infinite', width: 'max-content' }}
        >
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center shrink-0"
              style={{ width: '200px', padding: '0 32px' }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-h-10 w-auto object-contain"
                style={{ filter: 'grayscale(1) opacity(0.55)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
