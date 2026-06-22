// src/app/layout.tsx
import type { Metadata } from 'next'
import { Poppins, Inter, Montserrat, Lato } from 'next/font/google'
import { getSiteConfig } from '@/lib/site-config'
import './globals.css'

const poppins    = Poppins({    subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-poppins' })
const inter      = Inter({      subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-inter' })
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-montserrat' })
const lato       = Lato({       subsets: ['latin'], weight: ['300', '400', '700'],                     variable: '--font-lato' })

const ALL_FONT_VARS = [poppins.variable, inter.variable, montserrat.variable, lato.variable].join(' ')

const FONT_VAR: Record<string, string> = {
  poppins:    'var(--font-poppins)',
  inter:      'var(--font-inter)',
  montserrat: 'var(--font-montserrat)',
  lato:       'var(--font-lato)',
}

function fontStack(name: string) {
  return `${FONT_VAR[name] ?? FONT_VAR.poppins}, ui-sans-serif, system-ui, sans-serif`
}

export async function generateMetadata(): Promise<Metadata> {
  const cfg = await getSiteConfig()
  return {
    title: {
      default: cfg.meta_title || "SC Creative — Walker County's Growth Partner",
      template: '%s | SC Creative',
    },
    description: cfg.meta_description || 'We build the digital systems that grow local businesses in Walker County, AL.',
    metadataBase: new URL('https://samcolecreative.com'),
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cfg = await getSiteConfig()

  const headingFont = fontStack(cfg.font_heading)
  const bodyFont    = fontStack(cfg.font_body)

  const cssVars = [
    `:root {`,
    `  --brand-primary:    ${cfg.color_primary};`,
    `  --brand-bg:         ${cfg.color_background};`,
    `  --brand-surface:    ${cfg.color_surface};`,
    `  --brand-text:       ${cfg.color_text};`,
    `  --brand-font-heading: ${headingFont};`,
    `  --brand-font-body:    ${bodyFont};`,
    `  --brand-h1-size:    ${cfg.h1_size}px;`,
    `  --brand-h1-weight:  ${cfg.h1_weight};`,
    `  --brand-h2-size:    ${cfg.h2_size}px;`,
    `  --brand-h2-weight:  ${cfg.h2_weight};`,
    `  --brand-h3-size:    ${cfg.h3_size}px;`,
    `  --brand-h3-weight:  ${cfg.h3_weight};`,
    `  --brand-h4-size:    ${cfg.h4_size}px;`,
    `  --brand-h4-weight:  ${cfg.h4_weight};`,
    `  --brand-body-size:        ${cfg.body_size}px;`,
    `  --brand-body-weight:      ${cfg.body_weight};`,
    `  --brand-body-line-height: ${cfg.body_line_height};`,
    `}`,
  ].join('\n')

  return (
    <html lang="en" className={`${ALL_FONT_VARS} h-full antialiased`}>
      {/* React 19: href+precedence hoists this into <head> and deduplicates it */}
      <style href="brand-vars" precedence="default">{cssVars}</style>
      <body
        className="min-h-full flex flex-col antialiased"
        style={{
          background:  cfg.color_background,
          color:       cfg.color_text,
          fontFamily:  bodyFont,
          fontSize:    `${cfg.body_size}px`,
          fontWeight:  cfg.body_weight,
          lineHeight:  cfg.body_line_height,
        }}
      >
        {children}
      </body>
    </html>
  )
}
