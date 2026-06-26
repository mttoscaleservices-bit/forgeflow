"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { PLANS } from "@/lib/plans"
import { Check, Sparkles, ArrowRight } from "lucide-react"

export default function PricingPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState<string | null>(null)
  const [annual, setAnnual] = useState(false)

  async function handleCheckout(priceId: string) {
    if (!session) {
      window.location.href = "/auth/login"
      return
    }

    setLoading(priceId)
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    })

    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    }
    setLoading(null)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Nav */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">ForgeFlow</span>
            </Link>
            <div className="flex items-center gap-4">
              {session ? (
                <Link href="/dashboard"><Button variant="outline">Dashboard</Button></Link>
              ) : (
                <Link href="/auth/login"><Button variant="outline">Sign In</Button></Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Pricing */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-6xl font-bold">Simple, transparent pricing</h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Start free, upgrade when you grow.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 p-1">
              <button
                onClick={() => setAnnual(false)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!annual ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : ""}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${annual ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : ""}`}
              >
                Annual <span className="text-emerald-500 text-xs ml-1">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {([PLANS.free, PLANS.pro, PLANS.enterprise] as const).map((plan, i) => {
              const price = annual ? Math.round(plan.price * 0.8) : plan.price
              const priceId = plan.priceId ? (annual ? plan.priceId.annual : plan.priceId.monthly) : null

              return (
                <Card key={plan.name} className={`relative ${i === 1 ? "border-violet-500 shadow-xl shadow-violet-500/10 scale-105" : ""}`}>
                  {i === 1 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{i === 0 ? "Get started" : "For growing teams"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">${(price / 100).toFixed(0)}</span>
                      <span className="text-zinc-500 ml-1">/month</span>
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span className="text-zinc-600 dark:text-zinc-400">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {i === 0 ? (
                      <Link href={session ? "/dashboard" : "/auth/register"} className="w-full">
                        <Button className="w-full" variant="outline">Get Started Free</Button>
                      </Link>
                    ) : (
                      <Button
                        className="w-full"
                        variant={i === 1 ? "gradient" : "default"}
                        disabled={loading === priceId}
                        onClick={() => handleCheckout(priceId || "")}
                      >
                        {loading === priceId ? "Loading..." : "Subscribe"} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
