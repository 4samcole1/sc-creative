// src/components/sections/ClientMap.tsx
// Async Server Component — fetches clients and renders the map section.
// No 'use client' directive: this runs only on the server.
import { getMapClients } from '@/lib/clients-data'
import { t } from '@/lib/typography'
import MapCanvas from './MapCanvas'

export default async function ClientMap() {
  const clients = await getMapClients()

  const cityCount = new Set(clients.map(c => `${c.city}, ${c.state}`)).size

  return (
    <section style={{ background: '#070d17', padding: '120px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '42fr 58fr',
            gap: '72px',
            alignItems: 'center',
          }}
        >
          {/* Left column */}
          <div>
            <p style={{ ...t.eyebrow, marginBottom: '20px' }}>Rooted in Our Community</p>
            <h2 style={{ ...t.h2, color: '#f0f4f8', marginBottom: '24px' }}>
              The businesses we&apos;re proud to{' '}
              <span style={{ color: '#1cc7c3' }}>partner with.</span>
            </h2>
            <p style={{ ...t.body, color: '#7a8898', margin: '0 0 28px' }}>
              From Walker County to communities across Alabama and beyond, we&apos;re honored to
              support local business owners who are building something that matters. Every pin on
              this map represents a real relationship — and real results.
            </p>
            {clients.length > 0 && (
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#1cc7c3',
                  letterSpacing: '0.04em',
                  margin: 0,
                }}
              >
                {clients.length} client{clients.length !== 1 ? 's' : ''} across {cityCount}{' '}
                {cityCount !== 1 ? 'cities' : 'city'}
              </p>
            )}
          </div>

          {/* Right column — the map */}
          <div>
            <MapCanvas clients={clients} />
          </div>
        </div>
      </div>
    </section>
  )
}
