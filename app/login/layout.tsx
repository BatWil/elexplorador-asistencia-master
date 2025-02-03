import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Indentificate',
  description: 'Created with v0',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  )
}
