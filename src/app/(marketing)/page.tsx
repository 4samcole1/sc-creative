import type { Metadata } from 'next'
import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import Approach from '@/components/sections/Approach'
import Systems from '@/components/sections/Systems'
import Ecosystem from '@/components/sections/Ecosystem'
import { getPageBySlug } from '@/lib/pages-data'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('home').catch(() => null)

  const title       = page?.meta_title       || "SC Creative — Walker County's Growth Partner"
  const description = page?.meta_description || 'We build the digital systems that grow local businesses in Walker County, AL.'
  const ogImage     = page?.og_image_url     || undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ecosystem />
      <Approach />
      <Services />
      <Systems />
    </>
  )
}
