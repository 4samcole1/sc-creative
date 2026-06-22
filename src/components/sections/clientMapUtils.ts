// src/components/sections/clientMapUtils.ts
// Pure utility — no Leaflet imports, safe for unit-test/Node environments.
import type { Client } from '@/lib/clients-data'

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Build the HTML string used inside a Leaflet popup for a given client.
 * Every optional field degrades gracefully — no empty gaps.
 */
export function buildPopupHtml(client: Client): string {
  const parts: string[] = []

  if (client.logoUrl) {
    parts.push(
      `<img src="${esc(client.logoUrl)}" alt="${esc(client.name)} logo" ` +
        `style="max-width:120px;max-height:40px;object-fit:contain;margin-bottom:6px;display:block;" />`
    )
  }

  parts.push(
    `<strong style="font-size:14px;color:#0a1320;display:block;margin-bottom:2px;">${esc(client.name)}</strong>`
  )
  parts.push(
    `<span style="font-size:12px;color:#6a7a8a;display:block;margin-bottom:4px;">${esc(client.city)}, ${esc(client.state)}</span>`
  )

  if (client.industry) {
    parts.push(
      `<span style="font-size:11px;color:#8a9aaa;display:block;margin-bottom:4px;">${esc(client.industry)}</span>`
    )
  }

  if (client.blurb) {
    parts.push(
      `<p style="font-size:12px;color:#4a5a6a;line-height:1.5;margin:0 0 6px;">${esc(client.blurb)}</p>`
    )
  }

  if (client.website) {
    parts.push(
      `<a href="${esc(client.website)}" target="_blank" rel="noopener" ` +
        `style="font-size:12px;color:#1cc7c3;font-weight:600;text-decoration:none;">Visit website →</a>`
    )
  }

  return `<div style="min-width:160px;max-width:220px;padding:4px 0;">${parts.join('')}</div>`
}
