import type { Metadata } from "next"
import { NextAuthProvider } from "@/providers/session-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "ForgeFlow - Build Better Products",
  description: "The all-in-one platform for modern teams to build, ship, and scale products faster than ever.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  )
}
