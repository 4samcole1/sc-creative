'use client'
import { useEffect, useRef, useState } from 'react'

const TABS = ['Blueprint', 'Branding', 'Website', 'AI Leads', 'Growth']
const TAB_DURATION = 4000

export default function HeroDemo() {
  const [active, setActive] = useState(0)
  const progressRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function goTo(i: number) {
    setActive(i)
    if (progressRef.current) {
      progressRef.current.style.transition = 'none'
      progressRef.current.style.width = '0%'
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (progressRef.current) {
            progressRef.current.style.transition = `width ${TAB_DURATION}ms linear`
            progressRef.current.style.width = '100%'
          }
        })
      })
    }
  }

  useEffect(() => {
    goTo(0)
    const tick = () => {
      setActive((prev) => {
        const next = (prev + 1) % TABS.length
        goTo(next)
        return next
      })
    }
    timerRef.current = setInterval(tick, TAB_DURATION)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  return (
    <div>
      <div className="flex gap-1.5 mb-3">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => { if (timerRef.current) clearInterval(timerRef.current); goTo(i) }}
            className={`text-[10px] font-bold tracking-[.08em] uppercase px-3 py-1.5 rounded-full border transition-all ${
              active === i
                ? 'bg-[#00b5a5] text-white border-[#00b5a5]'
                : 'text-white/40 border-white/20 hover:text-white/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative w-full h-[320px] rounded-[14px] bg-[#071829] border border-white/10 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,.65)]">
        {/* Panel 1: Brand Blueprint */}
        <div className={`absolute inset-0 p-4 transition-opacity duration-500 ${active === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-white h-full rounded-lg overflow-hidden flex flex-col">
            <div className="bg-gradient-to-br from-[#1a3557] to-[#0d2a40] p-3 rounded-t-lg">
              <div className="text-[9px] font-bold tracking-widest uppercase text-[#00b5a5] mb-1">Brand Blueprint</div>
              <div className="text-[13px] font-extrabold text-white">Walker County HVAC</div>
              <div className="text-[10px] text-white/50">Generated just now</div>
            </div>
            <div className="p-4 flex-1 space-y-3">
              {['Executive Summary', 'Target Market Analysis', 'Brand Messaging', 'Sales Toolkit', 'Implementation Guide'].map((item, i) => (
                <div key={item} className="flex items-center gap-2 text-[11px] text-gray-600 border-b border-gray-100 pb-2">
                  <span className="text-[#00b5a5] font-bold">✓</span>
                  {item}
                  <span className="ml-auto text-[10px] text-[#00b5a5] font-bold">{i < 3 ? 'Done' : 'Ready'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 2: Visual Branding */}
        <div className={`absolute inset-0 p-4 transition-opacity duration-500 ${active === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-white h-full rounded-lg overflow-hidden grid grid-cols-2">
            <div className="bg-[#e8f0f8] flex flex-col items-center justify-center p-4 border-r border-gray-200">
              <svg viewBox="0 0 90 80" className="w-16 h-14 mb-2">
                <polygon points="0,2 36,2 50,40 14,40" fill="#1a5f8a"/>
                <polygon points="54,2 90,2 76,40 40,40" fill="#00b5a5"/>
                <polygon points="14,40 50,40 36,78 0,78" fill="#c8921a"/>
                <polygon points="40,40 76,40 90,78 54,78" fill="#1a3557"/>
              </svg>
              <div className="text-[10px] font-extrabold tracking-widest uppercase text-[#1a3557]">Cedar Vale</div>
              <div className="text-[7px] tracking-widest uppercase text-[#1a3557]/50 mt-1">Builders</div>
              <div className="flex gap-1.5 mt-3">
                {['#1a3557','#00b5a5','#c8921a'].map((c) => (
                  <div key={c} className="w-5 h-5 rounded-full" style={{ background: c }} />
                ))}
              </div>
            </div>
            <div className="p-3 flex flex-col justify-center">
              <div className="text-[7px] font-bold tracking-widest uppercase text-gray-300 mb-1">Typography</div>
              <div className="text-[40px] font-extrabold text-[#1a3557] leading-none">Aa</div>
              <div className="text-[8px] text-gray-400 mt-1 mb-3">Montserrat · Bold / Regular</div>
              <div className="text-[11px] font-extrabold text-[#1a3557] mb-1">Building Excellence</div>
              <div className="text-[9px] text-gray-400 leading-relaxed">Residential · Commercial · Est. 2011</div>
              <div className="mt-3 bg-[#f0fdfb] border border-[#00b5a5] rounded px-2 py-1 text-[9px] font-bold text-[#00b5a5] text-center">✓ Brand Identity Complete</div>
            </div>
          </div>
        </div>

        {/* Panel 3: Website */}
        <div className={`absolute inset-0 flex flex-col p-4 transition-opacity duration-500 ${active === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-white h-full rounded-lg overflow-hidden p-4 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#00b5a5]">Website Launch</span>
              <span className="text-[10px] text-gray-400 font-mono">smithhvac.com</span>
            </div>
            {[
              { icon: '🎨', label: 'Design Complete', score: 'Complete' },
              { icon: '📱', label: 'Mobile Optimized', score: 'Complete' },
              { icon: '⚡', label: 'PageSpeed Score', score: '98/100' },
              { icon: '🔐', label: 'SSL Certificate', score: 'Secured' },
              { icon: '🗺️', label: 'Sitemap Submitted', score: 'Active' },
            ].map(({ icon, label, score }) => (
              <div key={label} className="flex items-center gap-2 py-2 border-b border-gray-100 text-[11px] text-gray-700">
                <span>{icon}</span>
                <span className="flex-1">{label}</span>
                <span className="text-[#00b5a5] font-bold text-[10px]">✓ {score}</span>
              </div>
            ))}
            <div className="mt-auto flex items-center gap-2 bg-[rgba(0,181,165,.1)] border border-[rgba(0,181,165,.3)] rounded p-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-[#00897f]">Site is Live</span>
            </div>
          </div>
        </div>

        {/* Panel 4: AI Leads */}
        <div className={`absolute inset-0 grid grid-cols-[56%_44%] transition-opacity duration-500 ${active === 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-white p-3 border-r border-gray-100 flex flex-col gap-1 overflow-hidden">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[9px] font-bold tracking-widest uppercase text-[#00b5a5]">AI Chat Active</span>
            </div>
            {[
              { type: 'user', text: 'Hey, need HVAC service in Jasper' },
              { type: 'ai', text: 'Happy to help! Is this repair or a new install?' },
              { type: 'user', text: 'AC replacement — 2,400 sqft home' },
              { type: 'ai', text: "Perfect. Can I get your name to prep a quote?" },
            ].map((m, i) => (
              <div key={i} className={`text-[9px] px-2 py-1.5 rounded-lg max-w-[90%] leading-snug ${m.type === 'user' ? 'bg-[rgba(0,181,165,.1)] border border-[rgba(0,181,165,.3)] text-[#006b62] ml-auto' : 'bg-[#eef2f7] text-gray-700'}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="bg-[#f8fafc] p-3 flex flex-col gap-2">
            <div className="text-[8px] font-bold tracking-widest uppercase text-gray-400 pb-1 border-b border-gray-200">Lead Captured</div>
            {[['Name', 'David Park'], ['City', 'Jasper, AL'], ['Job', 'AC Replacement']].map(([k, v]) => (
              <div key={k}>
                <div className="text-[8px] uppercase tracking-wider text-gray-400">{k}</div>
                <div className="text-[10px] font-semibold text-[#1a3557]">{v}</div>
              </div>
            ))}
            <div className="bg-[rgba(0,181,165,.1)] border border-[rgba(0,181,165,.3)] rounded p-2 mt-1">
              <div className="text-[8px] text-[#00b5a5] uppercase tracking-wider mb-1">Score</div>
              <div className="text-[20px] font-extrabold text-[#00b5a5] leading-none">94 <span className="text-[8px] font-bold bg-red-100 text-red-600 border border-red-200 rounded px-1">🔥 Hot</span></div>
            </div>
          </div>
        </div>

        {/* Panel 5: Growth */}
        <div className={`absolute inset-0 bg-[#f5f7fa] p-4 transition-opacity duration-500 ${active === 4 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[['↑147%', 'Organic Traffic'], ['23', 'Leads / Month'], ['4.9★', 'Google Rating'], ['#1', 'Local Rank']].map(([val, label]) => (
              <div key={label} className="bg-white border border-[#e0ecf4] rounded-lg p-2 text-center">
                <div className="text-[20px] font-extrabold text-[#00b5a5] leading-none">{val}</div>
                <div className="text-[8px] text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
          <div className="text-[8px] font-bold tracking-widest uppercase text-gray-400 mb-2">Live Leads</div>
          <div className="space-y-1.5">
            {[['David P. — Jasper · AC Replacement', 'just now'], ['Lisa K. — Cordova · Kitchen Remodel', '2m ago'], ['Sunrise Homes — Commercial Build', '5m ago']].map(([info, time]) => (
              <div key={info} className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                <span className="text-[9px] text-gray-700 flex-1">{info}</span>
                <span className="text-[8px] text-gray-400">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[3px] bg-white/10 rounded-full mt-2 overflow-hidden">
        <div ref={progressRef} className="h-full bg-[#00b5a5] rounded-full w-0" />
      </div>
    </div>
  )
}
