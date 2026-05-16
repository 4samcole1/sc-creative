const facts = [
  { icon: '📍', text: 'Based in Cordova, AL — serving Walker County and beyond' },
  { icon: '🏆', text: '13 years in digital marketing · 33-year family legacy in the industry' },
  { icon: '🌍', text: 'Hundreds of businesses served locally, regionally, nationally & internationally' },
]

export default function About() {
  return (
    <section id="about" className="bg-white py-[90px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="grid grid-cols-[280px_1fr] gap-16 items-center">
          <div className="bg-[#e8f0f8] rounded-2xl aspect-square flex items-center justify-center text-7xl">
            👤
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-[.12em] uppercase text-[#00b5a5] mb-3">Meet Sam Cole</div>
            <h2 className="text-[clamp(24px,2.5vw,36px)] font-extrabold text-[#1a3557] leading-[1.2] mb-5">
              World-Class Digital Marketing.<br />Right Here in Walker County.
            </h2>
            <p className="text-[15px] text-[#555] leading-[1.7] mb-4">
              SC Creative was built with one mission: bring the same caliber of digital marketing that Fortune 500 brands get to the businesses that need it most. Our family has been delivering results for industry-leading clients for 33 years. Now we do it right here.
            </p>
            <p className="text-[15px] text-[#555] leading-[1.7] mb-8">
              When you work with SC Creative, you work directly with me — not a junior designer or an account manager. Every strategy, system, and design decision is built around your specific market, your competitors, and the growth you&apos;re trying to achieve.
            </p>
            <div className="flex flex-col gap-3">
              {facts.map((f) => (
                <div key={f.text} className="flex items-center gap-3 text-[14px] text-[#444]">
                  <span className="text-lg">{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
