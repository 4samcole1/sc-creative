'use client'
// src/components/sections/MapCanvas.tsx
// Thin client wrapper: dynamic-imports ClientMapInner with ssr:false so Leaflet
// never runs on the server. Safe to use as a child of a Server Component.
import dynamic from 'next/dynamic'
import type { Client } from '@/lib/clients-data'

const ClientMapInner = dynamic(() => import('./ClientMapInner'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '480px',
        borderRadius: '16px',
        background: '#0a1320',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ fontSize: '13px', color: '#3a4a5a', fontWeight: 600 }}>Loading map…</span>
    </div>
  ),
})

export default function MapCanvas({ clients }: { clients: Client[] }) {
  return <ClientMapInner clients={clients} />
}
