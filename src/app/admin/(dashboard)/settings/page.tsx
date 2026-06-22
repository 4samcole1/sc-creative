import { loadSettings } from './actions'
import { SITE_CONFIG_DEFAULTS } from '@/lib/site-config'
import SettingsForm from './SettingsForm'

export default async function SettingsPage() {
  const saved = await loadSettings()
  const config = saved ? { ...SITE_CONFIG_DEFAULTS, ...saved } : SITE_CONFIG_DEFAULTS

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f0f4f8', marginBottom: '4px' }}>Settings</h1>
        <p style={{ fontSize: '13px', color: '#4a6a7a' }}>Global site configuration — changes take effect after the next page load.</p>
      </div>
      <SettingsForm config={config} />
    </div>
  )
}
