// src/app/layout.tsx
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: { default: 'SC Creative — Walker County\'s Growth Partner', template: '%s | SC Creative' },
  description: 'We build the digital systems that grow local businesses in Walker County, AL.',
  metadataBase: new URL('https://samcolecreative.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0b1520] text-[#e8eef4]">{children}</body>
    </html>
  )
}
