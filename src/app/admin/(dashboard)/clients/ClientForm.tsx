'use client'
import { useActionState } from 'react'
import type { CSSProperties } from 'react'
import { upsertClientAction } from './actions'
import { FormCard, FormField, SaveBar } from '../components/AdminUI'
import type { Client } from '@/lib/clients-data'

const checkboxRow: CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#c0d0e0' }

export function ClientForm({ client }: { client?: Client }) {
  const [state, formAction, isPending] = useActionState(upsertClientAction, { error: '', success: false })

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '640px' }}>
      {client && <input type="hidden" name="id" defaultValue={client.id} />}

      <FormCard title="Business">
        <FormField label="Name"     name="name"     value={client?.name}     required />
        <FormField label="Industry" name="industry" value={client?.industry} required />
        <FormField label="City"     name="city"     value={client?.city}     required />
        <FormField label="State"    name="state"    value={client?.state}    required placeholder="AL" />
        <FormField label="Website"  name="website"  value={client?.website}  placeholder="https://…" />
        <FormField label="Logo URL" name="logo_url" value={client?.logoUrl}  placeholder="https://…" />
        <FormField label="Blurb"    name="blurb"    value={client?.blurb}    type="textarea" hint="One line: what we did." />
      </FormCard>

      <p style={{ fontSize: '12px', color: '#5a7080', margin: '-4px 2px 0', lineHeight: 1.5 }}>
        📍 The map pin is set automatically from the <strong style={{ color: '#7a90a0' }}>City + State</strong> above
        when you save — no coordinates needed. Tick “Map” below to show this client on the map.
      </p>

      <FormCard title="Placement">
        <label style={checkboxRow}>
          <input type="checkbox" name="show_trust_bar" defaultChecked={client?.show.trustBar} /> Trust bar
        </label>
        <label style={checkboxRow}>
          <input type="checkbox" name="show_map" defaultChecked={client?.show.map} /> Map
        </label>
        <label style={checkboxRow}>
          <input type="checkbox" name="show_portfolio" defaultChecked={client?.show.portfolio} /> Portfolio (no surface yet)
        </label>
        <label style={checkboxRow}>
          <input type="checkbox" name="needs_review" defaultChecked={client?.needsReview} /> Needs review
        </label>
      </FormCard>

      <SaveBar isPending={isPending} success={state.success} error={state.error} />
    </form>
  )
}
