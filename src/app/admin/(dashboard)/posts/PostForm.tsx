'use client'
import { useActionState, useRef } from 'react'
import { upsertPostAction, type Post } from './actions'
import { FormLabel, FormField, FormCard, FormSelect, SaveBar, inputStyle } from '../components/AdminUI'

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function PostForm({ post }: { post?: Post | null }) {
  const isEdit = !!post
  const slugRef = useRef<HTMLInputElement>(null)
  const [state, formAction, isPending] = useActionState(upsertPostAction, { error: '', success: false })

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isEdit && slugRef.current && !slugRef.current.dataset.touched) {
      slugRef.current.value = slugify(e.target.value)
    }
  }

  return (
    <form action={formAction}>
      {post?.id && <input type="hidden" name="id" value={post.id} />}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Title + slug */}
          <div style={{ background: '#0b1520', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <FormLabel>Title <span style={{ color: '#f06060' }}>*</span></FormLabel>
              <input
                name="title"
                type="text"
                defaultValue={post?.title}
                placeholder="Post title"
                onChange={handleTitleChange}
                style={{ ...inputStyle, fontSize: '18px', fontWeight: 600, padding: '10px 14px' }}
              />
            </div>
            <div>
              <FormLabel>Slug <span style={{ color: '#f06060' }}>*</span></FormLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#2a4a5a', whiteSpace: 'nowrap' }}>/blog/</span>
                <input
                  ref={slugRef}
                  name="slug"
                  type="text"
                  defaultValue={post?.slug}
                  placeholder="my-post-slug"
                  onFocus={e => { e.currentTarget.dataset.touched = '1' }}
                  style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <FormCard title="Excerpt">
            <textarea
              name="excerpt"
              defaultValue={post?.excerpt}
              placeholder="A short summary shown in blog listings and SEO…"
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </FormCard>

          {/* Content */}
          <div style={{ background: '#0b1520', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#4a6a7a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Content</p>
              <span style={{ fontSize: '11px', color: '#2a4a5a' }}>Markdown supported</span>
            </div>
            <div style={{ padding: '18px' }}>
              <textarea
                name="content"
                defaultValue={post?.content}
                placeholder="Write your post content here…&#10;&#10;## Heading&#10;&#10;Paragraph text with **bold** and *italic* support."
                style={{ ...inputStyle, minHeight: '420px', resize: 'vertical', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}
              />
            </div>
          </div>

          {/* SEO */}
          <FormCard title="SEO">
            <FormField label="Meta Title" name="meta_title" value={post?.meta_title} placeholder="Defaults to post title if empty" hint="~60 characters max" />
            <FormField label="Meta Description" name="meta_description" value={post?.meta_description} type="textarea" placeholder="~160 character description for search engines" />
          </FormCard>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormCard>
            <SaveBar isPending={isPending} success={state.success} error={state.error} />
          </FormCard>

          <FormCard title="Status">
            <FormSelect
              label="Publish Status"
              name="status"
              value={post?.status ?? 'draft'}
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' },
              ]}
            />
            {post?.published_at && (
              <p style={{ fontSize: '11px', color: '#2a4a5a' }}>
                Published {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            )}
          </FormCard>

          <FormCard title="Taxonomy">
            <FormField label="Category" name="category" value={post?.category} placeholder="e.g. Marketing" />
            <FormField label="Tags" name="tags" value={post?.tags} placeholder="e.g. branding, web design, seo" hint="Comma-separated" />
          </FormCard>

          <FormCard title="Featured Image">
            <FormField label="Image URL" name="featured_image_url" value={post?.featured_image_url} placeholder="https://…" hint="Paste a Supabase Storage or external URL" />
            {post?.featured_image_url && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={post.featured_image_url} alt="Featured" style={{ width: '100%', borderRadius: '6px', objectFit: 'cover', aspectRatio: '16/9' }} />
            )}
          </FormCard>
        </div>
      </div>
    </form>
  )
}
