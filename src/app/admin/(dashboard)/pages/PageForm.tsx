'use client'
import { useActionState, useRef, useState } from 'react'
import { upsertPageAction, type Page } from './actions'
import { FormLabel, FormField, FormCard, FormSelect, SaveBar, inputStyle } from '../components/AdminUI'

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function PageForm({ page, allPages }: { page?: Page | null; allPages?: Page[] }) {
  const isEdit = !!page
  const slugRef = useRef<HTMLInputElement>(null)
  const [ogUrl, setOgUrl] = useState(page?.og_image_url ?? '')
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

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Title + Slug */}
          <div style={{ background: '#0b1520', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <FormLabel>Page Title <span style={{ color: '#f06060' }}>*</span></FormLabel>
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
              <FormLabel>URL Slug <span style={{ color: '#f06060' }}>*</span></FormLabel>
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

          {/* SEO */}
          <FormCard title="SEO">
            <FormField
              label="Meta Title"
              name="meta_title"
              value={page?.meta_title}
              placeholder="Defaults to page title if blank"
              hint="~60 characters · shown in browser tab and Google"
            />
            <FormField
              label="Meta Description"
              name="meta_description"
              value={page?.meta_description}
              type="textarea"
              placeholder="Brief summary of this page…"
              hint="~160 characters · shown in Google search results"
            />
          </FormCard>

          {/* Social / Link Preview */}
          <div style={{ background: '#0b1520', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#4a6a7a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Social / Link Preview Image</p>
              <p style={{ fontSize: '11px', color: '#2a4a5a', marginTop: '3px' }}>Shown when this page is shared on Slack, iMessage, Twitter, etc. · Recommended: 1200×630px</p>
            </div>
            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <FormLabel>Image URL</FormLabel>
                <input
                  name="og_image_url"
                  type="url"
                  value={ogUrl}
                  onChange={e => setOgUrl(e.target.value)}
                  placeholder="https://…"
                  style={inputStyle}
                />
              </div>

              {/* Live preview */}
              {ogUrl ? (
                <div>
                  <FormLabel>Preview</FormLabel>
                  <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden', maxWidth: '480px' }}>
                    <img
                      src={ogUrl}
                      alt="OG preview"
                      style={{ width: '100%', aspectRatio: '1200/630', objectFit: 'cover', display: 'block' }}
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                    />
                    <div style={{ padding: '10px 14px', background: '#0d1a26', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <p style={{ fontSize: '12px', color: '#4a6a7a', marginBottom: '2px' }}>samcolecreative.com</p>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#c0d0e0' }}>{page?.meta_title || page?.title || 'Page title'}</p>
                      <p style={{ fontSize: '12px', color: '#4a6a7a', marginTop: '2px' }}>{page?.meta_description || 'Meta description…'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px', textAlign: 'center', maxWidth: '480px' }}>
                  <p style={{ fontSize: '12px', color: '#2a4a5a' }}>Paste an image URL above to preview how this page looks when shared.</p>
                </div>
              )}
            </div>
          </div>

          {/* Content (optional — for page-builder use) */}
          <div style={{ background: '#0b1520', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#4a6a7a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Content</p>
              <span style={{ fontSize: '11px', color: '#2a4a5a' }}>Optional · Markdown · for dynamic pages only</span>
            </div>
            <div style={{ padding: '18px' }}>
              <textarea
                name="content"
                defaultValue={page?.content}
                placeholder="Leave blank for pages built with React components…"
                style={{ ...inputStyle, minHeight: '200px', resize: 'vertical', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}
              />
            </div>
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormCard>
            <SaveBar isPending={isPending} success={state.success} error={state.error} />
          </FormCard>

          <FormCard title="Publish">
            <FormSelect
              label="Status"
              name="status"
              value={page?.status ?? 'draft'}
              options={[
                { value: 'draft',     label: 'Draft'     },
                { value: 'published', label: 'Published' },
              ]}
            />
          </FormCard>

          {allPages && allPages.filter(p => p.id !== page?.id && !p.parent_id).length > 0 && (
            <FormCard title="Hierarchy">
              <FormSelect
                label="Parent Page"
                name="parent_id"
                value={page?.parent_id ?? ''}
                options={[
                  { value: '', label: '— None (top-level) —' },
                  ...allPages
                    .filter(p => p.id !== page?.id && !p.parent_id)
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map(p => ({ value: p.id, label: p.title })),
                ]}
              />
            </FormCard>
          )}

          {page && (
            <FormCard title="Page Info">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#2a4a5a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>URL</p>
                  <p style={{ fontSize: '12px', color: '#4a6a7a', fontFamily: 'monospace' }}>/{page.slug}</p>
                </div>
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#2a4a5a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>Last Updated</p>
                  <p style={{ fontSize: '12px', color: '#4a6a7a' }}>
                    {new Date(page.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </FormCard>
          )}
        </div>
      </div>
    </form>
  )
}
