// src/app/layout.tsx
import type { Metadata } from 'next'
import { Poppins, Inter, Montserrat, Lato } from 'next/font/google'
import { createClient } from '@supabase/supabase-js'
import './globals.css'

const poppins    = Poppins({    subsets: ['latin'], weight: ['300', '400', '600', '700', '800'], variable: '--font-poppins' })
const inter      = Inter({      subsets: ['latin'], weight: ['300', '400', '600', '700', '800'], variable: '--font-inter' })
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '600', '700', '800'], variable: '--font-montserrat' })
const lato       = Lato({       subsets: ['latin'], weight: ['300', '400', '700'],               variable: '--font-lato' })

const ALL_FONT_VARS = [poppins.variable, inter.variable, montserrat.variable, lato.variable].join(' ')

const FONT_VAR_MAP: Record<string, string> = {
  poppins:    'var(--font-poppins)',
  inter:      'var(--font-inter)',
  montserrat: 'var(--font-montserrat)',
  lato:       'var(--font-lato)',
}

const THEME_DEFAULTS = {
  color_primary:    '#1cc7c3',
  color_background: '#070d17',
  color_surface:    '#0b1520',
  color_text:       '#e8eef4',
  font_family:      'poppins',
  font_size_base:   16,
}

async function getTheme() {
  try {
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    const { data } = await db
      .from('site_config')
      .select('color_primary,color_background,color_surface,color_text,font_family,font_size_base')
      .eq('id', 1)
      .single()
    return { ...THEME_DEFAULTS, ...(data ?? {}) }
  } catch {
    return THEME_DEFAULTS
  }
}

export const metadata: Metadata = {
  title: { default: "SC Creative — Walker County's Growth Partner", template: '%s | SC Creative' },
  description: 'We build the digital systems that grow local businesses in Walker County, AL.',
  metadataBase: new URL('https://samcolecreative.com'),
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getTheme()
  const fontStack = `${FONT_VAR_MAP[theme.font_family] ?? FONT_VAR_MAP.poppins}, ui-sans-serif, system-ui, sans-serif`

  const cssVars = `
:root {
  --brand-primary: ${theme.color_primary};
  --brand-bg: ${theme.color_background};
  --brand-surface: ${theme.color_surface};
  --brand-text: ${theme.color_text};
  --brand-font: ${fontStack};
  --brand-font-size: ${theme.font_size_base}px;
}`.trim()

  return (
    <html lang="en" className={`${ALL_FONT_VARS} h-full antialiased`}>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      <body
        className="min-h-full flex flex-col antialiased"
        style={{ background: theme.color_background, color: theme.color_text, fontFamily: fontStack }}
      >
        {children}
      </body>
    </html>
  )
}
