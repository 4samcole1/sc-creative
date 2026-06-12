'use client'
import { useActionState } from 'react'
import { upsertLocalPageAction, type LocalPage } from './actions'
import { FormLabel, FormField, FormCard, FormSelect, SaveBar, inputStyle } from '../components/AdminUI'

export default function LocalPageForm({ page }: { page?: LocalPage | null }) {
  const [state, formAction, isPending] = useActionState(upsertLocalPageAction, { error: '', success: false })

  return (
    <form action={formAction}>
      {page?.id && <input type="hidden" name="id" value={page.id} />}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Location */}
          <div style={{ background: '#0b1520', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div>
                <FormLabel>City <span style={{ color: '#f06060' }}>*</span></FormLabel>
                <input name="city" type="text" defaultValue={page?.city} placeholder="Jasper"
                  style={{ ...inputStyle, fontSize: '16px', fontWeight: 600, padding: '10px 14px' }} />
              </div>
              <div>
                <FormLabel>State</FormLabel>
                <input name="state" type="text" defaultValue={page?.state ?? 'AL'} placeholder="AL"
                  style={{ ...inputStyle, fontSize: '16px', fontWeight: 600, padding: '10px 14px' }} />
              </div>
            </div>
            <div>
              <FormLabel>Slug</FormLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#2a4a5a', whiteSpace: 'nowrap' }}>/</span>
                <input name="slug" type="text" defaultValue={page?.slug} placeholder="auto-generated from city + state"
                  style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '13px' }} />
              </div>
              <p style={{ fontSize: '11px', color: '#2a4a5a', marginTop: '4px' }}>Leave blank to auto-generate from city and state.</p>
            </div>
          </div>

          {/* Content */}
          <div style={{ background: '#0b1520', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#4a6a7a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Content</p>
              <span style={{ fontSize: '11px', color: '#2a4a5a' }}>Markdown supported</span>
            </div>
            <div style={{ padding: '18px' }}>
              <textarea
                name="content"
                defaultValue={page?.content}
                placeholder={`## Web Design in Jasper, AL\n\nContent targeting local search for this city…`}
                style={{ ...inputStyle, minHeight: '400px', resize: 'vertical', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}
              />
            </div>
          </div>

          <FormCard title="SEO">
            <FormField label="Meta Title" name="meta_title" value={page?.meta_title} placeholder="Web Design in Jasper, AL | SC Creative" hint="~60 characters" />
            <FormField label="Meta Description" name="meta_description" value={page?.meta_description} type="textarea"
              placeholder="SC Creative builds websites for businesses in Jasper, Alabama…" hint="~160 characters" />
          </FormCard>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormCard>
            <SaveBar isPending={isPending} success={state.success} error={state.error} />
          </FormCard>
          <FormCard title="Status">
            <FormSelect
              label="Publish Status"
              name="status"
              value={page?.status ?? 'draft'}
              options={[{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }]}
            />
          </FormCard>
          <FormCard title="About Local Pages">
            <p style={{ fontSize: '12px', color: '#2a4a5a', lineHeight: 1.6 }}>
              Local pages are SEO landing pages targeting specific cities and regions. Each page lives at its own URL and can rank for location-specific searches like "web design in Jasper AL".
            </p>
          </FormCard>
        </div>
      </div>
    </form>
  )
}
