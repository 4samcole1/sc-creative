import { getSiteConfig } from '@/lib/site-config'
import { getNavMenuItems } from '@/lib/pages-data'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [cfg, navLinks] = await Promise.all([
    getSiteConfig(),
    getNavMenuItems().catch(() => []),
  ])

  return (
    <>
      <Nav logoDarkUrl={cfg.logo_dark_url} links={navLinks} />
      <main className="flex-1">{children}</main>
      <Footer
        logoLightUrl={cfg.logo_light_url}
        phone={cfg.phone}
        email={cfg.email}
        address={cfg.address}
        facebookUrl={cfg.facebook_url}
        instagramUrl={cfg.instagram_url}
        linkedinUrl={cfg.linkedin_url}
        twitterUrl={cfg.twitter_url}
        youtubeUrl={cfg.youtube_url}
      />
    </>
  )
}
