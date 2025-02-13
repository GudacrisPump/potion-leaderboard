import { Sora } from "next/font/google"
import type { Metadata } from "next"
import "./globals.css"
import type React from "react"
import { TraderProvider } from "@/contexts/TraderContext"

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  preload: true,
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "Potion Leaderboard",
  description: "Track and analyze crypto trading performance",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={sora.variable}>
      <body className={`${sora.variable} font-sans bg-[#060611] text-white overflow-hidden`}>
        <TraderProvider>
          {children}
        </TraderProvider>
      </body>
    </html>
  )
}



import './globals.css'