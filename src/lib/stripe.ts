import Stripe from "stripe"
export { PLANS, PRICE_TO_PLAN } from "./plans"
export type { PlanKey } from "./plans"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  typescript: true,
})
