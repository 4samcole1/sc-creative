'use client'
import Link from 'next/link'
import { useState } from 'react'

const MAX_HRS = 20

function getMetrics(hrs: number) {
  const bizPct = Math.round(100 - hrs * 3.5)
  const mktPct = Math.round(hrs * 5)
  const callout =
    hrs === 0
      ? 'Drag the slider to see where your time really goes.'
      : hrs < 5
      ? `${hrs} hours a week on marketing barely moves the needle — and pulls you away from the work that pays.`
      : hrs < 10
      ? `${hrs} hours is real effort. But without a system, it's inconsistent and hard to scale.`
      : `${hrs} hours a week on marketing is a serious commitment — is it producing serious results?`
  return { bizPct, mktPct, callout }
}

export default function Systems() {
  const [hrs, setHrs] = useState(0)
  const { bizPct, mktPct, callout } = getMetrics(hrs)

  return (
    <section id="systems" className="bg-[#f5f3ef] py-[90px]">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="text-center max-w-[900px] mx-auto mb-16">
          <div className="text-[11px] font-bold tracking-[.14em] uppercase text-[#00b5a5] mb-4">The Real Cost</div>
          <h2 className="text-[clamp(28px,2.8vw,42px)] font-extrabold text-[#1a3557] leading-[1.2] mb-4">
            Stop Trading Time for <span className="text-[#00b5a5]">Inconsistent Results</span>
          </h2>
          <p className="text-[16px] text-[#5a6e84] leading-[1.7]">
            Most local business owners try to handle marketing themselves. See what that actually costs — then see what a system changes.
          </p>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(26,53,87,.08)]">
          <div className="p-10">
            <div className="text-[10px] font-bold tracking-[.14em] uppercase text-[#a0aec0] mb-7">Without SC Creative</div>
            <div className="mb-8">
              <div className="text-[13px] text-[#4a5568] mb-3 font-medium">Hours spent on marketing per week:</div>
              <input
                type="range"
                min={0}
                max={MAX_HRS}
                value={hrs}
                onChange={(e) => setHrs(Number(e.target.value))}
                className="w-full h-1 rounded-full bg-[#e2e8f0] outline-none cursor-pointer accent-[#00b5a5]"
              />
              <div className="text-[13px] text-[#a0aec0] mt-2.5">
                <span className="text-[22px] font-extrabold text-[#1a3557]">{hrs}</span> hrs / week
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <div className="text-[12px] text-[#718096] font-medium mb-2">Time on core business</div>
                <div className="h-2 bg-[#edf2f7] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#e05c5c] to-[#f08040] transition-all duration-300" style={{ width: `${bizPct}%` }} />
                </div>
                <div className="flex justify-end mt-1.5">
                  <span className="text-[12px] font-bold text-[#a0aec0]">{bizPct}%</span>
                </div>
              </div>
              <div>
                <div className="text-[12px] text-[#718096] font-medium mb-2">Time on marketing</div>
                <div className="h-2 bg-[#edf2f7] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#cbd5e0] transition-all duration-300" style={{ width: `${mktPct}%` }} />
                </div>
                <div className="flex justify-end mt-1.5">
                  <span className="text-[12px] font-bold text-[#a0aec0]">{mktPct}%</span>
                </div>
              </div>
            </div>
            <div className={`mt-7 p-4 rounded-lg text-[13px] leading-relaxed min-h-[64px] transition-all border-l-[3px] ${hrs > 0 ? 'bg-[#f7fafc] border-[#e05c5c] text-[#4a5568]' : 'bg-[#f7fafc] border-[#e2e8f0] text-[#a0aec0]'}`}>
              {callout}
            </div>
          </div>

          <div className="w-px bg-[#e2e8f0] flex items-center justify-center">
            <span className="bg-white border border-[#e2e8f0] text-[#a0aec0] text-[10px] font-bold tracking-widest px-3 py-2 rounded-full">OR</span>
          </div>

          <div className="p-10">
            <div className="text-[10px] font-bold tracking-[.14em] uppercase text-[#00b5a5] mb-7">With SC Creative</div>
            <div className="flex flex-col gap-5 mb-7">
              <div>
                <div className="text-[12px] text-[#718096] font-medium mb-2">Time on core business</div>
                <div className="h-2 bg-[#edf2f7] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#00b5a5] to-[#00d4c0]" style={{ width: '95%' }} />
                </div>
                <div className="flex justify-end mt-1.5">
                  <span className="text-[12px] font-bold text-[#00b5a5]">95%</span>
                </div>
              </div>
              <div>
                <div className="text-[12px] text-[#718096] font-medium mb-2">Marketing (handled for you)</div>
                <div className="h-2 bg-[#edf2f7] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#00b5a5] to-[#00d4c0]" style={{ width: '100%' }} />
                </div>
                <div className="flex justify-end mt-1.5">
                  <span className="text-[12px] font-bold text-[#00b5a5]">100%</span>
                </div>
              </div>
            </div>
            <div className="text-[13px] text-[#5a6e84] leading-relaxed p-4 bg-[rgba(0,181,165,.06)] rounded-lg border-l-[3px] border-[#00b5a5] mb-7">
              Your brand, website, AI, and SEO run as one integrated system — while you focus entirely on doing the work you&apos;re great at.
            </div>
            <a
              href="#package-builder"
              className="inline-block bg-[#00b5a5] text-white text-[13px] font-bold px-6 py-3 rounded-md hover:bg-[#009d8f] transition-colors tracking-[.04em]"
            >
              Build My Package →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
