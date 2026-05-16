const facts = [
  { label: 'Years of personal expertise', value: '13' },
  { label: 'Year family legacy in digital marketing', value: '33yr' },
  { label: 'Businesses served — locally, nationally & beyond', value: '100s' },
]

export default function About() {
  return (
    <section id="about" className="bg-[#f8f7f5] py-[100px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="grid grid-cols-[320px_1fr] gap-20 items-center">
          <div className="bg-[#dde6f0] rounded-2xl aspect-square flex items-center justify-center text-7xl">
            👤
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-[.14em] uppercase text-[#00b5a5] mb-5">Meet Sam Cole</div>
            <h2 className="text-[clamp(28px,3vw,44px)] font-extrabold text-[#1a3557] leading-[1.12] mb-6">
              World-class digital marketing.<br />Right here in Walker County.
            </h2>
            <p className="text-[15px] text-[#666] leading-[1.75] mb-4">
              SC Creative was built with one mission: bring the same caliber of digital marketing that Fortune 500 brands get — to the businesses that need it most. Our family has been delivering results for industry-leading clients for 33 years. Now we do it right here.
            </p>
            <p className="text-[15px] text-[#666] leading-[1.75] mb-10">
              When you work with SC Creative, you work directly with me — not a junior designer or an account manager. Every strategy, system, and design decision is built around your specific market, your competitors, and the growth you&apos;re trying to achieve.
            </p>
            <div className="grid grid-cols-3 gap-6 border-t border-[#e5e0d8] pt-8">
              {facts.map((f) => (
                <div key={f.label}>
                  <div className="text-[28px] font-extrabold text-[#00b5a5] leading-none mb-1.5">{f.value}</div>
                  <div className="text-[11px] text-[#999] leading-snug">{f.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
