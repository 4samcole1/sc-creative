export default function SettingsPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f0f4f8', marginBottom: '4px' }}>Settings</h1>
        <p style={{ fontSize: '13px', color: '#4a6a7a' }}>Manage global site configuration.</p>
      </div>

      <div
        style={{
          background: '#0b1520',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '14px', color: '#2a4a5a' }}>
          Global settings coming next — business info, SEO defaults, social links, and brand config.
        </p>
      </div>
    </div>
  )
}
