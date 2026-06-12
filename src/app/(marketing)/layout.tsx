// src/app/(marketing)/layout.tsx
import { getSiteConfig } from '@/lib/site-config'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const cfg = await getSiteConfig()

  return (
    <>
      <Nav logoDarkUrl={cfg.logo_dark_url} />
      <main className="flex-1">{children}</main>
      <Footer logoLightUrl={cfg.logo_light_url} />
    </>
  )
}
