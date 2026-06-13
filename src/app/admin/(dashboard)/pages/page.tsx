import React from 'react'
import { getPages, deletePageAction, type Page } from './actions'
import { getMenusWithItems } from '../menus/actions'
import MenusClient from '../menus/MenusClient'
import { AdminPageHeader, NewButton, StatusBadge, DeleteButton } from '../components/AdminUI'

type PageNode = Page & { children: Page[] }

function buildTree(pages: Page[]): PageNode[] {
  return pages
    .filter(p => !p.parent_id)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(p => ({
      ...p,
      children: pages
        .filter(c => c.parent_id === p.id)
        .sort((a, b) => a.sort_order - b.sort_order),
    }))
}

function PageTreeRow({
  page,
  isChild,
  last,
}: {
  page: Page
  isChild: boolean
  last: boolean
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 220px 100px 110px',
        alignItems: 'center',
        padding: '11px 20px',
        paddingLeft: isChild ? '48px' : '20px',
        borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.04)',
        background: isChild ? 'rgba(0,0,0,0.12)' : 'transparent',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isChild && (
          <span style={{ color: '#1a3040', fontSize: '14px', lineHeight: 1, flexShrink: 0 }}>└─</span>
        )}
        <a
          href={`/admin/pages/${page.id}/edit`}
          style={{
            fontWeight: isChild ? 500 : 700,
            color: isChild ? '#90aabe' : '#c8d8e8',
            textDecoration: 'none',
            fontSize: '13px',
          }}
        >
          {page.title || <span style={{ color: '#2a4a5a' }}>Untitled</span>}
        </a>
      </div>

      <span style={{ fontSize: '12px', color: '#2a4a5a', fontFamily: 'monospace' }}>
        /{page.slug}
      </span>

      <StatusBadge status={page.status} />

      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
        <a
          href={`/admin/pages/${page.id}/edit`}
          style={{ fontSize: '12px', color: '#1cc7c3', textDecoration: 'none', fontWeight: 600 }}
        >
          Edit
        </a>
        <DeleteButton action={deletePageAction.bind(null, page.id)} noun="page" />
      </div>
    </div>
  )
}

export default async function PagesPage() {
  const [pages, menus] = await Promise.all([
    getPages().catch(() => [] as Page[]),
    getMenusWithItems().catch(() => []),
  ])

  const tree = buildTree(pages)
  const totalCount = pages.length

  return (
    <div>
      <AdminPageHeader
        title="Pages"
        subtitle={`${totalCount} page${totalCount !== 1 ? 's' : ''}`}
        action={<NewButton href="/admin/pages/new" label="New Page" />}
      />

      {/* ── Pages Tree ── */}
      <div
        style={{
          background: '#0b1520',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '52px',
        }}
      >
        {/* Column headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 220px 100px 110px',
            padding: '10px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {['Page', 'Slug', 'Status', 'Actions'].map(h => (
            <p
              key={h}
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#2a4a5a',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {h}
            </p>
          ))}
        </div>

        {tree.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#2a4a5a' }}>
              No pages yet — run the SQL migration or create a page to get started.
            </p>
          </div>
        ) : (
          tree.map((parent, pi) => {
            const lastParent = pi === tree.length - 1
            return (
              <React.Fragment key={parent.id}>
                <PageTreeRow
                  page={parent}
                  isChild={false}
                  last={lastParent && parent.children.length === 0}
                />
                {parent.children.map((child, ci) => (
                  <PageTreeRow
                    key={child.id}
                    page={child}
                    isChild={true}
                    last={lastParent && ci === parent.children.length - 1}
                  />
                ))}
              </React.Fragment>
            )
          })
        )}
      </div>

      {/* ── Site Navigation ── */}
      <div>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#f0f4f8', marginBottom: '4px' }}>
            Site Navigation
          </h2>
          <p style={{ fontSize: '13px', color: '#4a6a7a' }}>
            Manage the menu items displayed in each navigation location.
          </p>
        </div>

        {menus.length === 0 ? (
          <div
            style={{
              background: 'rgba(240,160,32,0.06)',
              border: '1px solid rgba(240,160,32,0.18)',
              borderRadius: '10px',
              padding: '14px 18px',
              fontSize: '13px',
              color: '#f0a020',
            }}
          >
            ⚠ No menus found — run the SQL migration to create the menus and menu_items tables.
          </div>
        ) : (
          <MenusClient menus={menus} />
        )}
      </div>
    </div>
  )
}
