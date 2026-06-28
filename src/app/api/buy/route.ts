import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/utils"

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: "price_1TnMZV4GjO2q5G23EkceZBXU", quantity: 1 }],
      success_url: absoluteUrl("/buy/success"),
      cancel_url: absoluteUrl("/buy"),
    })

    return NextResponse.json({ url: session.url })
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
