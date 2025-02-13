import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Trader Profile | Potion Leaderboard",
  description: "View detailed trader profile and performance",
}

export default function TraderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

