// src/components/sections/Work.tsx
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'

const fallbackProjects = [
  {
    category: 'WEBSITE DESIGN',
    title: 'Industrial Manufacturing Website',
    description: 'Custom WordPress website with advanced product filtering and lead generation systems.',
  },
  {
    category: 'E-COMMERCE',
    title: 'Custom E-Commerce Platform',
    description: 'Advanced Shopify build for a high-volume retailer with custom integrations.',
  },
  {
    category: 'WEB APPLICATION',
    title: 'Client Portal & Dashboard',
    description: 'Custom portal with reporting, document management, and task automation.',
  },
]

export default async function Work() {
  let items: {
    id: string
    title: string
    slug: string
    client: string | null
    services: string[]
    cover_image: string | null
  }[] = []

  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase
      .from('projects')
      .select('id, title, slug, client, services, cover_image')
      .eq('status', 'published')
      .order('sort_order')
      .limit(3)
    items = data ?? []
  } catch {
    // Supabase not configured — show fallback cards
  }

  return (
    <section id="work" className="bg-white py-24">
      <div className="max-w-[1500px] mx-auto px-8">
        <div className="flex items-end justify-between mb-14">
          <div>
            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#009898] mb-3">
              Recent Work
            </div>
            <h2 className="text-[clamp(28px,3vw,48px)] font-black text-gray-900 leading-[1.15]">
              Solutions built for real businesses.
            </h2>
          </div>
          <Link
            href="/work"
            className="text-[14px] font-bold text-[#009898] hover:text-[#0EB1AB] transition-colors shrink-0 mb-2"
          >
            View All Projects →
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {items.length > 0
            ? items.map((p) => (
                <Link
                  key={p.id}
                  href={`/work/${p.slug}`}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="h-[220px] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {p.cover_image ? (
                      <img
                        src={p.cover_image}
                        alt={p.client ?? p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#020617] to-[#071426]" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#009898] mb-2">
                      {p.services[0] ?? 'PROJECT'}
                    </div>
                    <h3 className="font-black text-gray-900 text-lg mb-2">{p.client ?? p.title}</h3>
                    <p className="text-gray-500 text-[13px] leading-relaxed mb-4">
                      {p.services.join(' · ')}
                    </p>
                    <span className="text-[13px] font-bold text-[#009898]">View Project →</span>
                  </div>
                </Link>
              ))
            : fallbackProjects.map((p) => (
                <div
                  key={p.title}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="h-[220px] bg-gradient-to-br from-[#020617] to-[#071426] overflow-hidden" />
                  <div className="p-6">
                    <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#009898] mb-2">
                      {p.category}
                    </div>
                    <h3 className="font-black text-gray-900 text-lg mb-2">{p.title}</h3>
                    <p className="text-gray-500 text-[13px] leading-relaxed mb-4">{p.description}</p>
                    <span className="text-[13px] font-bold text-[#009898]">View Project →</span>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}
