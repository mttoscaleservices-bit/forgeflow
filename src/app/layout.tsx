import type { Metadata } from "next"
import { NextAuthProvider } from "@/providers/session-provider"
import { GoogleAnalytics } from "@/components/GoogleAnalytics"
import { CookieConsent } from "@/components/CookieConsent"
import "./globals.css"

export const metadata: Metadata = {
  title: { default: "ForgeFlow - Build Better Products", template: "%s | ForgeFlow" },
  description: "The all-in-one platform for modern teams to build, ship, and scale products faster than ever.",
  openGraph: {
    title: "ForgeFlow - Build Better Products",
    description: "The all-in-one platform for modern teams to build, ship, and scale products faster than ever.",
    type: "website",
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "ForgeFlow - Build Better Products",
    description: "The all-in-one platform for modern teams to build, ship, and scale products faster than ever.",
  },
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
        <GoogleAnalytics />
        <CookieConsent />
      </body>
    </html>
  )
}
