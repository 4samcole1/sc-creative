'use client'
// src/components/sections/ClientMapInner.tsx
// The actual Leaflet map — kept in a 'use client' module so it only runs in the browser.
// Loaded lazily via MapCanvas's dynamic() import (ssr:false).
import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import type { Client } from '@/lib/clients-data'
import { buildPopupHtml } from './clientMapUtils'

// Re-export so unit tests can import from this module's path without pulling in Leaflet.
export { buildPopupHtml }

// ─── Teal divIcon pin ────────────────────────────────────────────────────────
function makePinIcon(): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20S24 21 24 12C24 5.373 18.627 0 12 0z" fill="#1cc7c3"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>`,
    iconSize: [24, 32],
    iconAnchor: [12, 32],
    popupAnchor: [0, -34],
  })
}

// ─── Cluster layer child (uses useMap hook) ──────────────────────────────────
function ClusterLayer({ clients }: { clients: Client[] }) {
  const map = useMap()

  useEffect(() => {
    const group = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 40,
    })
    const pinIcon = makePinIcon()

    clients.forEach(client => {
      if (client.lat == null || client.lng == null) return
      const marker = L.marker([client.lat, client.lng], { icon: pinIcon })
      marker.bindPopup(buildPopupHtml(client), { maxWidth: 240 })
      group.addLayer(marker)
    })

    map.addLayer(group)
    return () => {
      map.removeLayer(group)
    }
  }, [map, clients])

  return null
}

// ─── Map component ───────────────────────────────────────────────────────────
export default function ClientMapInner({ clients }: { clients: Client[] }) {
  return (
    <MapContainer
      center={[33.6, -87.1]}
      zoom={8}
      scrollWheelZoom={false}
      style={{ height: '480px', width: '100%', borderRadius: '16px' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; OSM &copy; CARTO"
      />
      <ClusterLayer clients={clients} />
    </MapContainer>
  )
}
