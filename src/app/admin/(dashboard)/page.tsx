import { createAdminClient } from '@/lib/supabase-admin'
import type { Lead } from '@/lib/types'
import { Users, FolderOpen, FileText, Star } from 'lucide-react'

async function getStats() {
  const db = createAdminClient()
  const [leadsRes, projectsRes, postsRes, testimonialsRes] = await Promise.all([
    db.from('leads').select('*').order('created_at', { ascending: false }).limit(8),
    db.from('projects').select('id', { count: 'exact', head: true }),
    db.from('posts').select('id', { count: 'exact', head: true }),
    db.from('testimonials').select('id', { count: 'exact', head: true }),
  ])
  return {
    leads: (leadsRes.data ?? []) as Lead[],
    leadsTotal: leadsRes.data?.length ?? 0,
    projectsTotal: projectsRes.count ?? 0,
    postsTotal: postsRes.count ?? 0,
    testimonialsTotal: testimonialsRes.count ?? 0,
  }
}

const statCard = (label: string, value: number | string, Icon: React.ElementType, color: string) => (
  <div
    key={label}
    style={{
      background: '#0b1520',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '12px',
      padding: '20px 22px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    }}
  >
    <div
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: `${color}14`,
        border: `1px solid ${color}30`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon size={17} style={{ color }} />
    </div>
    <div>
      <p style={{ fontSize: '22px', fontWeight: 800, color: '#f0f4f8', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: '12px', color: '#4a6a7a', marginTop: '3px' }}>{label}</p>
    </div>
  </div>
)

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f0f4f8', marginBottom: '4px' }}>Dashboard</h1>
        <p style={{ fontSize: '13px', color: '#4a6a7a' }}>Welcome back, Sam.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {statCard('Total Leads', stats.leadsTotal, Users, '#1cc7c3')}
        {statCard('Projects', stats.projectsTotal, FolderOpen, '#5a7aff')}
        {statCard('Blog Posts', stats.postsTotal, FileText, '#f0a020')}
        {statCard('Testimonials', stats.testimonialsTotal, Star, '#30c060')}
      </div>

      {/* Recent leads */}
      <div
        style={{
          background: '#0b1520',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#c0d0e0' }}>Recent Leads</h2>
          <a href="/admin/leads" style={{ fontSize: '12px', color: '#1cc7c3', textDecoration: 'none', fontWeight: 600 }}>View all →</a>
        </div>

        {stats.leads.length === 0 ? (
          <p style={{ padding: '32px 22px', fontSize: '13px', color: '#2a4a5a', textAlign: 'center' }}>No leads yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['Name', 'Business', 'Email', 'Service', 'Date'].map(h => (
                  <th key={h} style={{ padding: '10px 22px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#2a4a5a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.leads.map((lead, i) => (
                <tr
                  key={lead.id}
                  style={{ borderBottom: i < stats.leads.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                >
                  <td style={{ padding: '12px 22px', fontSize: '13px', fontWeight: 600, color: '#c0d0e0' }}>
                    {lead.first_name} {lead.last_name}
                  </td>
                  <td style={{ padding: '12px 22px', fontSize: '13px', color: '#5a7a8a' }}>
                    {lead.business ?? '—'}
                  </td>
                  <td style={{ padding: '12px 22px', fontSize: '13px', color: '#5a7a8a' }}>
                    {lead.email}
                  </td>
                  <td style={{ padding: '12px 22px' }}>
                    {lead.service_interest ? (
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#1cc7c3', background: 'rgba(28,199,195,0.1)', border: '1px solid rgba(28,199,195,0.18)', borderRadius: '4px', padding: '2px 8px' }}>
                        {lead.service_interest}
                      </span>
                    ) : (
                      <span style={{ fontSize: '13px', color: '#2a4a5a' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 22px', fontSize: '12px', color: '#2a4a5a' }}>
                    {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
