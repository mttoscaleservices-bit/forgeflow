import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { PLANS } from "@/lib/plans"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const sub = user.subscription
    const planKey = (sub?.plan as keyof typeof PLANS) || "free"
    const plan = PLANS[planKey] || PLANS.free

    return NextResponse.json({
      plan: planKey,
      planName: plan.name,
      status: sub?.status || "inactive",
      periodEnd: sub?.periodEnd,
      stripeCustomerId: user.stripeCustomerId,
    })
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
