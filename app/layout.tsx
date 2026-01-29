import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kenya Schools Training Centers Map',
  description: 'Interactive map showing 97 schools across 10 counties with 24 regional training centers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
