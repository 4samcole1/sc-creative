'use client'
import { useActionState, useRef } from 'react'
import { upsertPageAction, type Page } from './actions'
import { FormLabel, FormField, FormCard, FormSelect, SaveBar, inputStyle } from '../components/AdminUI'

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function PageForm({ page }: { page?: Page | null }) {
  const isEdit = !!page
  const slugRef = useRef<HTMLInputElement>(null)
  const [state, formAction, isPending] = useActionState(upsertPageAction, { error: '', success: false })

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isEdit && slugRef.current && !slugRef.current.dataset.touched) {
      slugRef.current.value = slugify(e.target.value)
    }
  }

  return (
    <form action={formAction}>
      {page?.id && <input type="hidden" name="id" value={page.id} />}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#0b1520', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <FormLabel>Title <span style={{ color: '#f06060' }}>*</span></FormLabel>
              <input
                name="title"
                type="text"
                defaultValue={page?.title}
                placeholder="Page title"
                onChange={handleTitleChange}
                style={{ ...inputStyle, fontSize: '18px', fontWeight: 600, padding: '10px 14px' }}
              />
            </div>
            <div>
              <FormLabel>Slug <span style={{ color: '#f06060' }}>*</span></FormLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#2a4a5a', whiteSpace: 'nowrap' }}>/</span>
                <input
                  ref={slugRef}
                  name="slug"
                  type="text"
                  defaultValue={page?.slug}
                  placeholder="page-slug"
                  onFocus={e => { e.currentTarget.dataset.touched = '1' }}
                  style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          <div style={{ background: '#0b1520', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#4a6a7a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Content</p>
              <span style={{ fontSize: '11px', color: '#2a4a5a' }}>Markdown supported</span>
            </div>
            <div style={{ padding: '18px' }}>
              <textarea
                name="content"
                defaultValue={page?.content}
                placeholder="Page content…"
                style={{ ...inputStyle, minHeight: '400px', resize: 'vertical', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}
              />
            </div>
          </div>

          <FormCard title="SEO">
            <FormField label="Meta Title" name="meta_title" value={page?.meta_title} placeholder="Defaults to page title" hint="~60 characters" />
            <FormField label="Meta Description" name="meta_description" value={page?.meta_description} type="textarea" placeholder="~160 character description" />
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
        </div>
      </div>
    </form>
  )
}
