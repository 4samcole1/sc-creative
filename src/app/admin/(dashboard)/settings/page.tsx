import { loadSettings, type SiteConfig } from './actions'
import SettingsForm from './SettingsForm'

const defaults: SiteConfig = {
  business_name: 'SC Creative',
  tagline: "Walker County's Growth Partner",
  phone: '(678) 997-1106',
  email: 'info@samcolecreative.com',
  address: 'Jasper, AL',
  meta_title: "SC Creative — Walker County's Growth Partner",
  meta_description: 'We build the digital systems that grow local businesses in Walker County, AL.',
  facebook_url: '',
  instagram_url: '',
  linkedin_url: '',
  twitter_url: '',
  youtube_url: '',
  color_primary: '#1cc7c3',
  color_background: '#070d17',
  color_surface: '#0b1520',
  color_text: '#e8eef4',
  font_family: 'poppins',
  font_size_base: 16,
}

export default async function SettingsPage() {
  const saved = await loadSettings()
  const config: SiteConfig = saved ? { ...defaults, ...saved } : defaults

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f0f4f8', marginBottom: '4px' }}>Settings</h1>
        <p style={{ fontSize: '13px', color: '#4a6a7a' }}>Global site configuration — changes apply site-wide after deploy.</p>
      </div>

      <SettingsForm config={config} />
    </div>
  )
}
