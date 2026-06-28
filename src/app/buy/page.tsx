"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Check, Download, ArrowRight } from "lucide-react"

export default function BuyPage() {
  const [loading, setLoading] = useState(false)

  async function handleBuy() {
    setLoading(true)
    const res = await fetch("/api/buy", { method: "POST" })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <nav className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold">ForgeFlow</span>
          </Link>
        </div>
      </nav>

      <section className="py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 dark:bg-violet-950 px-4 py-1.5 text-sm text-violet-600 dark:text-violet-400 mb-6">
            <Download className="h-4 w-4" /> Instant Download
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Next.js 16 SaaS Starter Kit</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl mx-auto">
            Launch your subscription-based SaaS in hours. Includes auth, Stripe payments, dashboard, landing page, and PostgreSQL.
          </p>

          <div className="max-w-sm mx-auto mb-12">
            <div className="rounded-2xl border border-violet-500 bg-white dark:bg-zinc-900 p-8 shadow-xl shadow-violet-500/10">
              <div className="text-5xl font-bold mb-2">$49</div>
              <p className="text-sm text-zinc-500 mb-6">One-time payment. Lifetime updates.</p>
              <Button
                className="w-full h-12 text-base"
                variant="gradient"
                disabled={loading}
                onClick={handleBuy}
              >
                {loading ? "Redirecting to payment..." : "Buy Now"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
            {[
              "Next.js 16 with Turbopack",
              "Stripe Checkout + Webhooks",
              "NextAuth v5 authentication",
              "PostgreSQL + Prisma ORM",
              "Beautiful dashboard",
              "Customer billing portal",
              "Landing page with animations",
              "Python automation tools",
            ].map((f) => (
              <div key={f} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-zinc-600 dark:text-zinc-400">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
