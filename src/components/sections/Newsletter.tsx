// src/components/sections/Newsletter.tsx
'use client'
import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Email collection to be wired to a service (Mailchimp, ConvertKit, etc.) later
    setEmail('')
  }

  return (
    <section
      className="py-16"
      style={{
        background: 'linear-gradient(135deg, #020617 0%, #071426 60%, #020617 100%)',
      }}
    >
      <div className="max-w-[1500px] mx-auto px-8 flex items-center justify-between gap-12">
        <div>
          <h2 className="text-[clamp(20px,2.5vw,32px)] font-black text-white mb-2">
            Stay ahead of the growth game.
          </h2>
          <p className="text-white/50 text-[15px]">
            Insights, systems, and strategies to help your business grow smarter.
          </p>
        </div>

        <form className="flex gap-3 shrink-0" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-[280px] bg-white/[0.08] backdrop-blur-sm border border-white/[0.12] text-white placeholder:text-white/30 rounded-xl px-5 py-3.5 text-[14px] outline-none focus:border-[#009898]/60 transition-colors"
          />
          <button
            type="submit"
            className="bg-[#009898] text-white font-bold px-7 py-3.5 rounded-xl hover:bg-[#0EB1AB] hover:shadow-[0_0_20px_rgba(14,177,171,0.4)] transition-all duration-200 text-[14px] shrink-0"
          >
            Subscribe →
          </button>
        </form>
      </div>
    </section>
  )
}
