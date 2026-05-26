export const plans = {
  free: {
    id: 'free',
    name: 'Free',
    stripePriceId: null
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID ?? null
  }
} as const;

export type PlanId = keyof typeof plans;
