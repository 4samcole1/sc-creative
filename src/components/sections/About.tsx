const facts = [
  { icon: '📍', text: 'Based in Cordova, AL — Walker County native' },
  { icon: '🏆', text: '13+ years of digital marketing & brand strategy' },
  { icon: '🤝', text: '100+ projects delivered across Walker County' },
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
              Not a Big Agency.<br />A Focused System Built for Walker County.
            </h2>
            <p className="text-[15px] text-[#555] leading-[1.7] mb-4">
              I&apos;ve been helping established local businesses grow for 13+ years. Based right here in Cordova, AL — I know this market, I know these businesses, and I know what it takes to stand out.
            </p>
            <p className="text-[15px] text-[#555] leading-[1.7] mb-8">
              When you work with SC Creative, you&apos;re working directly with me — not a junior designer or an account manager. Every strategy, every design decision, every system is built with your specific goals in mind.
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
