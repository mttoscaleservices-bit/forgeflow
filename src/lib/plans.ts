export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceId: { monthly: null, annual: null },
    features: ["1 project", "Basic analytics", "Community support"],
  },
  pro: {
    name: "Pro",
    price: 2900,
    priceId: {
      monthly: "price_1Tjryt4GjO2q5G23O3fQy0EE",
      annual: "price_1Tjryt4GjO2q5G23y3dEOJuH",
    },
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
    priceId: {
      monthly: "price_1Tjryt4GjO2q5G23jGqHFQqM",
      annual: "price_1Tjryt4GjO2q5G23L2L1Kh2s",
    },
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

export const PRICE_TO_PLAN: Record<string, PlanKey> = {
  price_1Tjryt4GjO2q5G23O3fQy0EE: "pro",
  price_1Tjryt4GjO2q5G23y3dEOJuH: "pro",
  price_1Tjryt4GjO2q5G23jGqHFQqM: "enterprise",
  price_1Tjryt4GjO2q5G23L2L1Kh2s: "enterprise",
}