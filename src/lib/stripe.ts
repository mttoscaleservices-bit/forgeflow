import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  typescript: true,
})

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    features: ["1 project", "Basic analytics", "Community support"],
  },
  pro: {
    name: "Pro",
    price: 2900,
    priceId: "price_pro_monthly",
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "Custom domain",
      "Team members",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: 9900,
    priceId: "price_enterprise_monthly",
    features: [
      "Everything in Pro",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
      "White label",
    ],
  },
} as const

export type PlanKey = keyof typeof PLANS
