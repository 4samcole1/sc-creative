// src/components/sections/Community.tsx

const locations = ['Jasper, AL', 'Walker County, AL', 'Greater Birmingham', 'Northwest Alabama']

function MapGraphic() {
  return (
    <svg
      viewBox="0 0 200 240"
      className="w-full max-w-[260px] opacity-50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="100" cy="120" r="70" stroke="#009898" strokeWidth="0.8" strokeDasharray="4 4" />
      <circle cx="100" cy="120" r="42" stroke="#009898" strokeWidth="0.5" strokeDasharray="2 6" />
      <circle cx="100" cy="120" r="10" fill="#009898" opacity="0.8" />
      <circle cx="100" cy="120" r="5" fill="#fff" />
      <line x1="100" y1="110" x2="100" y2="52" stroke="#009898" strokeWidth="0.8" opacity="0.4" />
      <line x1="110" y1="114" x2="162" y2="84" stroke="#009898" strokeWidth="0.8" opacity="0.4" />
      <line x1="110" y1="126" x2="162" y2="156" stroke="#009898" strokeWidth="0.8" opacity="0.4" />
      <line x1="100" y1="130" x2="100" y2="188" stroke="#009898" strokeWidth="0.8" opacity="0.4" />
      <line x1="90" y1="126" x2="38" y2="156" stroke="#009898" strokeWidth="0.8" opacity="0.4" />
      <line x1="90" y1="114" x2="38" y2="84" stroke="#009898" strokeWidth="0.8" opacity="0.4" />
      <circle cx="100" cy="52" r="5" fill="#009898" opacity="0.7" />
      <circle cx="162" cy="84" r="4" fill="#009898" opacity="0.5" />
      <circle cx="162" cy="156" r="4" fill="#009898" opacity="0.5" />
      <circle cx="100" cy="188" r="5" fill="#009898" opacity="0.6" />
      <circle cx="38" cy="156" r="4" fill="#009898" opacity="0.5" />
      <circle cx="38" cy="84" r="4" fill="#009898" opacity="0.5" />
      <text x="100" y="42" textAnchor="middle" fill="#009898" opacity="0.8" fontSize="8" fontWeight="600">Jasper</text>
      <text x="170" y="87" textAnchor="start" fill="#009898" opacity="0.5" fontSize="7">Walker Co.</text>
      <text x="170" y="159" textAnchor="start" fill="#009898" opacity="0.5" fontSize="7">Sumiton</text>
      <text x="100" y="204" textAnchor="middle" fill="#009898" opacity="0.5" fontSize="7">Birmingham</text>
      <text x="30" y="159" textAnchor="end" fill="#009898" opacity="0.5" fontSize="7">Cordova</text>
      <text x="30" y="87" textAnchor="end" fill="#009898" opacity="0.5" fontSize="7">Carbon Hill</text>
    </svg>
  )
}

export default function Community() {
  return (
    <section className="bg-[#f8fafc] py-24">
      <div className="max-w-[1500px] mx-auto px-8 grid grid-cols-[1fr_280px_1fr] gap-12 items-center">
        {/* Left */}
        <div>
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#009898] mb-4">
            Rooted in Our Community
          </div>
          <h2 className="text-[clamp(26px,2.8vw,44px)] font-black text-gray-900 leading-[1.15] mb-5">
            Proudly serving Jasper,<br />Walker County, and beyond.
          </h2>
          <p className="text-[16px] text-gray-500 leading-[1.75] mb-8 max-w-[400px]">
            We&apos;re proud to be part of this community and even more proud to help local
            businesses grow, compete, and win.
          </p>
          <ul className="space-y-3">
            {locations.map((loc) => (
              <li key={loc} className="flex items-center gap-2.5 text-[14px] text-gray-600">
                <span className="text-[#009898] text-base">📍</span>
                {loc}
              </li>
            ))}
          </ul>
        </div>

        {/* Center — abstract map */}
        <div className="flex items-center justify-center py-8">
          <MapGraphic />
        </div>

        {/* Right — testimonial */}
        <div>
          <div
            className="bg-white rounded-2xl p-8 border border-gray-100"
            style={{ boxShadow: '0 8px 40px rgba(0,152,152,0.08), 0 2px 12px rgba(0,0,0,0.05)' }}
          >
            <div className="text-5xl text-[#009898] leading-none mb-4 font-serif">&ldquo;</div>
            <p className="text-[15px] text-gray-700 leading-[1.8] mb-6 italic">
              SC Creative transformed the way we present our business online. The new website,
              branding, and SEO strategy have brought us more leads and more customers than
              ever before.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#009898] to-[#0EB1AB] flex items-center justify-center text-white font-bold text-sm shrink-0">
                J
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">Josh T.</div>
                <div className="text-gray-400 text-xs">Owner, Construction Company</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
