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

// 8 logos × 2 copies = 16 items, each 20vw wide → track = 320vw
// translateX(-50%) = -160vw = exactly one full set → seamless loop
export default function TrustBar() {
  return (
    <section className="bg-white py-10 border-b border-gray-100">
      <style>{`
        @keyframes logo-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        <p className="text-center text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-8">
          Trusted by Businesses Across the Region
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', overflow: 'hidden', position: 'relative' }}>
        {/* Left fade */}
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10"
          style={{ background: 'linear-gradient(to right, white, transparent)' }}
        />
        {/* Right fade */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10"
          style={{ background: 'linear-gradient(to left, white, transparent)' }}
        />

        {/* Track: 16 items × 20vw = 320vw total */}
        <div
          className="flex items-center"
          style={{
            width: `${logos.length * 2 * 20}vw`,
            animation: 'logo-marquee 24s linear infinite',
            willChange: 'transform',
          }}
        >
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center shrink-0"
              style={{ width: '20vw', padding: '0 3vw' }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="w-full max-h-10 object-contain"
                style={{ filter: 'grayscale(1) opacity(0.55)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
