"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, LogOut, BarChart3, Zap, Users, Settings, Activity, ArrowRight } from "lucide-react"

const statCards = [
  { label: "Active Projects", value: "3", icon: BarChart3, change: "+2 this month", color: "from-violet-600 to-indigo-600" },
  { label: "API Calls", value: "12.4K", icon: Zap, change: "+18% this week", color: "from-emerald-500 to-teal-600" },
  { label: "Team Members", value: "5", icon: Users, change: "+1 this month", color: "from-amber-500 to-orange-600" },
  { label: "Uptime", value: "99.9%", icon: Activity, change: "All systems go", color: "from-rose-500 to-pink-600" },
]

const recentActivity = [
  { action: "New deployment", project: "web-app", time: "2 min ago", status: "success" },
  { action: "Database backup", project: "api-server", time: "15 min ago", status: "success" },
  { action: "SSL renewal", project: "client-portal", time: "1 hour ago", status: "warning" },
  { action: "CDN purge", project: "web-app", time: "3 hours ago", status: "success" },
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex items-center gap-2 text-zinc-500">
          <Sparkles className="h-5 w-5 animate-spin" />
          Loading...
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hidden lg:block">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold">ForgeFlow</span>
        </Link>

        <nav className="space-y-1">
          {[
            { label: "Dashboard", icon: BarChart3, active: true },
            { label: "Projects", icon: Zap },
            { label: "Team", icon: Users },
            { label: "Settings", icon: Settings },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                item.active
                  ? "bg-zinc-100 dark:bg-zinc-800 font-medium"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Button
            variant="ghost"
            className="w-full justify-start text-zinc-600 dark:text-zinc-400"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between px-6 h-16">
            <div>
              <h2 className="text-lg font-semibold">{greeting}, {session.user?.name || "there"}</h2>
              <p className="text-sm text-zinc-500">Here&apos;s what&apos;s happening today.</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/pricing">
                <Button variant="gradient" size="sm">Upgrade Plan</Button>
              </Link>
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => signOut()}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-zinc-500">{stat.label}</p>
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-zinc-500 mt-1">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-zinc-500">{activity.project} · {activity.time}</p>
                      </div>
                      <Badge variant={activity.status === "success" ? "success" : "warning"}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "New Project", desc: "Create a new project", icon: Zap },
                    { label: "Invite Team", desc: "Add team members", icon: Users },
                    { label: "View Analytics", desc: "Check your metrics", icon: BarChart3 },
                    { label: "Settings", desc: "Configure your account", icon: Settings },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className="flex flex-col items-start gap-1 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 text-left hover:border-violet-500/50 transition-all group"
                    >
                      <action.icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      <span className="text-sm font-medium">{action.label}</span>
                      <span className="text-xs text-zinc-500">{action.desc}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
