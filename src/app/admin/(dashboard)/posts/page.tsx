import { getPosts, deletePostAction, type Post } from './actions'
import { AdminPageHeader, NewButton, AdminTable, AdminTableRow, AdminTableCell, StatusBadge, EmptyState, DeleteButton } from '../components/AdminUI'

export default async function PostsPage() {
  let posts: Post[] = []
  let dbError = false
  try { posts = await getPosts() } catch { dbError = true }

  return (
    <div>
      <AdminPageHeader
        title="Blog Posts"
        subtitle={`${posts.length} post${posts.length !== 1 ? 's' : ''}`}
        action={<NewButton href="/admin/posts/new" label="New Post" />}
      />

      {dbError && (
        <div style={{ background: 'rgba(240,160,32,0.08)', border: '1px solid rgba(240,160,32,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#f0a020' }}>
          ⚠ Could not load posts — run the SQL migration to create the posts table.
        </div>
      )}

      {!dbError && posts.length === 0 ? (
        <EmptyState message="No posts yet. Create your first blog post to get started." />
      ) : (
        <AdminTable headers={['Title', 'Status', 'Category', 'Date', 'Actions']}>
          {posts.map((post, i) => (
            <AdminTableRow key={post.id} last={i === posts.length - 1}>
              <AdminTableCell>
                <div>
                  <a href={`/admin/posts/${post.id}/edit`} style={{ color: '#c0d0e0', fontWeight: 600, textDecoration: 'none', fontSize: '13px' }}>
                    {post.title || <span style={{ color: '#2a4a5a' }}>Untitled</span>}
                  </a>
                  <p style={{ fontSize: '11px', fontFamily: 'monospace', color: '#2a4a5a', marginTop: '2px' }}>/blog/{post.slug}</p>
                </div>
              </AdminTableCell>
              <AdminTableCell><StatusBadge status={post.status} /></AdminTableCell>
              <AdminTableCell muted>{post.category || '—'}</AdminTableCell>
              <AdminTableCell muted>
                {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </AdminTableCell>
              <AdminTableCell>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <a href={`/admin/posts/${post.id}/edit`} style={{ fontSize: '12px', color: '#1cc7c3', textDecoration: 'none', fontWeight: 600 }}>Edit</a>
                  <DeleteButton action={deletePostAction.bind(null, post.id)} noun="post" />
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}
    </div>
  )
}
