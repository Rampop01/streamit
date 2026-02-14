import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'PayStream | x402-Stacks Powered Content Monetization',
  description: 'Stream payments, stream content. Monetize your premium content with instant STX payments powered by x402-stacks on the Stacks blockchain.',
  keywords: ['x402', 'stacks', 'blockchain', 'content monetization', 'STX', 'payments', 'web3'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground noise-overlay`}>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(17, 11, 36, 0.9)',
              border: '1px solid rgba(85, 70, 255, 0.2)',
              backdropFilter: 'blur(20px)',
              color: '#fafafa',
            },
          }}
        />
      </body>
    </html>
  )
}
