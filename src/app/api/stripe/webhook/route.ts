import { NextResponse } from "next/server"
import { PRICE_TO_PLAN } from "@/lib/plans"
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
      const priceId = session.metadata?.priceId
      const plan = priceId ? (PRICE_TO_PLAN[priceId] || "pro") : "pro"

      if (userId) {
        const sub = (await stripe.subscriptions.retrieve(session.subscription as string)) as any

        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: session.customer as string },
        })

        await prisma.subscription.upsert({
          where: { userId },
          update: {
            stripeId: session.subscription as string,
            status: "active",
            plan,
            periodEnd: new Date(sub.current_period_end * 1000),
          },
          create: {
            userId,
            stripeId: session.subscription as string,
            status: "active",
            plan,
            periodEnd: new Date(sub.current_period_end * 1000),
          },
        })
      }
    }

    if (event.type === "invoice.paid") {
      const invoice = event.data.object as any
      const subscriptionId = invoice.subscription as string

      if (subscriptionId) {
        const sub = (await stripe.subscriptions.retrieve(subscriptionId)) as any
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id
        const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } })

        if (user) {
          await prisma.subscription.update({
            where: { userId: user.id },
            data: {
              status: "active",
              periodEnd: new Date(sub.current_period_end * 1000),
            },
          })
        }
      }
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as any
      const subscriptionId = invoice.subscription as string

      if (subscriptionId) {
        const sub = (await stripe.subscriptions.retrieve(subscriptionId)) as any
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id
        const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } })

        if (user) {
          await prisma.subscription.update({
            where: { userId: user.id },
            data: { status: "past_due" },
          })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }
}
