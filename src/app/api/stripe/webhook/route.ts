import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature") || ""

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    )

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any
      const userId = session.metadata?.userId

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: session.customer as string },
        })

        await prisma.subscription.upsert({
          where: { userId },
          update: {
            stripeId: session.subscription as string,
            status: "active",
            plan: "pro",
            periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
          create: {
            userId,
            stripeId: session.subscription as string,
            status: "active",
            plan: "pro",
          },
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }
}
