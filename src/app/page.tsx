"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Menu, X, Sparkles, BarChart3, Zap, Shield, Users, Globe } from "lucide-react"
import { motion } from "framer-motion"

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "#" },
]

const features = [
  { icon: Zap, title: "Lightning Fast", description: "10x faster than traditional tools with our optimized infrastructure" },
  { icon: BarChart3, title: "Analytics", description: "Real-time insights and beautiful dashboards for data-driven decisions" },
  { icon: Shield, title: "Enterprise Security", description: "SOC 2 compliant with end-to-end encryption and audit logs" },
  { icon: Users, title: "Team Collaboration", description: "Work together in real-time with built-in version control" },
  { icon: Globe, title: "Global Scale", description: "Deploy to 30+ regions worldwide with automatic scaling" },
  { icon: Sparkles, title: "AI-Powered", description: "Smart suggestions and automations powered by advanced AI" },
]

const testimonials = [
  { name: "Sarah Chen", role: "CTO, TechFlow", content: "ForgeFlow transformed our development pipeline. We ship 3x faster now." },
  { name: "Marcus Rivera", role: "Founder, StartupX", content: "The analytics alone saved us hours of manual reporting every week." },
  { name: "Emily Watson", role: "Product Lead, ScaleUp", content: "Best platform we've used. The team collaboration features are incredible." },
]

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
} as const

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800" : "bg-transparent"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">ForgeFlow</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              {session ? (
                <Link href="/dashboard">
                  <Button variant="gradient">
                    Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button variant="gradient">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="block text-sm text-zinc-600 dark:text-zinc-400 py-2" onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 space-y-2">
                {session ? (
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full" variant="gradient">Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full" variant="outline">Sign In</Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full" variant="gradient">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

        <div className="relative mx-auto max-w-6xl px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-4 py-1.5 text-sm mb-8">
              <Sparkles className="h-4 w-4 text-violet-500" />
              <span className="text-zinc-600 dark:text-zinc-400">Now in Public Beta</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight">
              Build{" "}
              <span className="gradient-text">Better</span>
              <br />
              Products Faster
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              The all-in-one platform for modern teams. Ship features, track analytics, and scale your product with powerful tools.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {session ? (
                <Link href="/dashboard">
                  <Button size="xl" variant="gradient">
                    Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/register">
                    <Button size="xl" variant="gradient">
                      Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button size="xl" variant="outline">
                      View Pricing
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-zinc-500">
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> No credit card</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> 14-day free trial</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Cancel anytime</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-bold">Everything you need to scale</h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Powerful features to help you build, launch, and grow your product.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 hover:border-violet-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10K+", label: "Active Users" },
              { value: "99.9%", label: "Uptime" },
              { value: "1M+", label: "Requests/Day" },
              { value: "4.9★", label: "Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold">Loved by teams worldwide</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8"
              >
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">"{t.content}"</p>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-zinc-500">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 bg-gradient-to-br from-violet-600 to-indigo-600">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white">Ready to accelerate your workflow?</h2>
          <p className="mt-4 text-lg text-violet-100 max-w-xl mx-auto">
            Join thousands of teams already building better with ForgeFlow.
          </p>
          <div className="mt-10">
            <Link href={session ? "/dashboard" : "/auth/register"}>
              <Button size="xl" className="bg-white text-violet-600 hover:bg-zinc-100 shadow-xl">
                {session ? "Go to Dashboard" : "Get Started Free"} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold">Stay in the loop</h3>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Get product updates and exclusive offers.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!") }}
            className="mt-6 mx-auto flex max-w-md gap-3"
          >
            <input
              type="email"
              placeholder="you@example.com"
              required
              className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-offset-zinc-900 dark:placeholder:text-zinc-400"
            />
            <Button type="submit" className="shrink-0 h-11">Subscribe</Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold">ForgeFlow</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <Link href="/pricing" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Pricing</Link>
              <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Terms</Link>
            </div>
            <p className="text-sm text-zinc-500">© 2024 ForgeFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
