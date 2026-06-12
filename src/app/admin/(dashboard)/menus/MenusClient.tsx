'use client'
import { useActionState } from 'react'
import { addMenuItemAction, updateMenuItemAction, deleteMenuItemAction, reorderMenuItemAction, type Menu, type MenuItem } from './actions'
import { FormLabel, inputStyle } from '../components/AdminUI'

function AddItemForm({ menuId }: { menuId: string }) {
  const [state, formAction, isPending] = useActionState(addMenuItemAction, { error: '', success: false })
  return (
    <form action={formAction} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '8px', alignItems: 'end', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <input type="hidden" name="menu_id" value={menuId} />
      <div>
        <FormLabel>Label</FormLabel>
        <input name="label" type="text" placeholder="About" style={inputStyle} key={state.success ? Date.now() : 'label'} />
      </div>
      <div>
        <FormLabel>URL</FormLabel>
        <input name="url" type="text" placeholder="/about" style={inputStyle} key={state.success ? Date.now() : 'url'} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#4a6a7a', marginBottom: '6px', cursor: 'pointer' }}>
          <input type="checkbox" name="opens_new_tab" style={{ accentColor: '#1cc7c3' }} />
          New tab
        </label>
      </div>
      <button type="submit" disabled={isPending}
        style={{ background: '#1cc7c3', color: '#070d17', fontWeight: 700, fontSize: '12px', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: isPending ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
        {isPending ? '…' : '+ Add'}
      </button>
      {state.error && <p style={{ gridColumn: '1/-1', fontSize: '12px', color: '#f06060' }}>{state.error}</p>}
    </form>
  )
}

function MenuItemRow({ item, isFirst, isLast }: { item: MenuItem; isFirst: boolean; isLast: boolean }) {
  const [editState, editAction, editPending] = useActionState(updateMenuItemAction, { error: '', success: false })

  return (
    <form action={editAction}>
      <input type="hidden" name="id" value={item.id} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto auto', gap: '8px', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <input name="label" type="text" defaultValue={item.label}
          style={{ ...inputStyle, padding: '8px 10px', fontSize: '13px' }} key={item.id + '-label'} />
        <input name="url" type="text" defaultValue={item.url}
          style={{ ...inputStyle, padding: '8px 10px', fontSize: '13px', fontFamily: 'monospace' }} key={item.id + '-url'} />
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#4a6a7a', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          <input type="checkbox" name="opens_new_tab" defaultChecked={item.opens_new_tab} style={{ accentColor: '#1cc7c3' }} />
          New tab
        </label>

        {/* Reorder buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <form action={reorderMenuItemAction.bind(null, item.id, 'up')}>
            <button type="submit" disabled={isFirst}
              style={{ fontSize: '10px', background: 'none', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: isFirst ? '#1a3040' : '#4a6a7a', cursor: isFirst ? 'default' : 'pointer', padding: '2px 5px', display: 'block', width: '100%' }}>↑</button>
          </form>
          <form action={reorderMenuItemAction.bind(null, item.id, 'down')}>
            <button type="submit" disabled={isLast}
              style={{ fontSize: '10px', background: 'none', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: isLast ? '#1a3040' : '#4a6a7a', cursor: isLast ? 'default' : 'pointer', padding: '2px 5px', display: 'block', width: '100%' }}>↓</button>
          </form>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button type="submit" disabled={editPending}
            style={{ fontSize: '12px', fontWeight: 600, color: '#1cc7c3', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            {editPending ? '…' : 'Save'}
          </button>
          <form action={deleteMenuItemAction.bind(null, item.id)}
            onSubmit={e => { if (!confirm('Remove this menu item?')) e.preventDefault() }}>
            <button type="submit"
              style={{ fontSize: '12px', fontWeight: 600, color: '#f06060', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              Remove
            </button>
          </form>
        </div>
      </div>
      {editState.error && <p style={{ fontSize: '12px', color: '#f06060', marginTop: '4px' }}>{editState.error}</p>}
    </form>
  )
}

export default function MenusClient({ menus }: { menus: Array<Menu & { items: MenuItem[] }> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {menus.map(menu => (
        <div key={menu.id} style={{ background: '#0b1520', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#c0d0e0' }}>{menu.name}</h2>
              <p style={{ fontSize: '11px', color: '#2a4a5a', marginTop: '2px', fontFamily: 'monospace' }}>location: {menu.location}</p>
            </div>
            <span style={{ fontSize: '12px', color: '#2a4a5a' }}>{menu.items.length} items</span>
          </div>

          <div style={{ padding: '0 20px' }}>
            {menu.items.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#2a4a5a', padding: '20px 0' }}>No items yet — add one below.</p>
            ) : (
              <div>
                {/* Column headers */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto auto', gap: '8px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#2a4a5a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Label</p>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#2a4a5a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>URL</p>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#2a4a5a', letterSpacing: '0.1em', textTransform: 'uppercase' }}></p>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#2a4a5a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Order</p>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#2a4a5a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Actions</p>
                </div>
                {menu.items.map((item, idx) => (
                  <MenuItemRow
                    key={item.id}
                    item={item}
                    isFirst={idx === 0}
                    isLast={idx === menu.items.length - 1}
                  />
                ))}
              </div>
            )}
            <AddItemForm menuId={menu.id} />
            <div style={{ height: '20px' }} />
          </div>
        </div>
      ))}
    </div>
  )
}
