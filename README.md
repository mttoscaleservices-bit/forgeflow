# ForgeFlow SaaS Starter

**A production-ready SaaS boilerplate with Next.js 16, Stripe subscriptions, PostgreSQL, authentication, and a beautiful dashboard.**

[![Live Demo](https://img.shields.io/badge/demo-live-8B5CF6?style=for-the-badge)](https://saas-starter-three-zeta.vercel.app)
[![Deploy to Vercel](https://img.shields.io/badge/deploy-vercel-000?style=for-the-badge&logo=vercel)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FUSER%2Fforgeflow&env=DATABASE_URL,NEXTAUTH_SECRET,NEXTAUTH_URL,STRIPE_SECRET_KEY,STRIPE_WEBHOOK_SECRET,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,NEXT_PUBLIC_APP_URL)

## What You Get

- Landing page with animations and gradient design
- Authentication system (register/login with NextAuth v5)
- Protected dashboard with subscription management
- Pricing page with monthly/annual billing toggle
- Stripe Checkout integration (Pro $29/mo, Enterprise $99/mo)
- Stripe webhook processing (subscription lifecycle)
- Customer billing portal (cancel, update payment, etc.)
- PostgreSQL database with Prisma ORM
- SQLite support for local development
- Auto-detecting database configuration
- Responsive design (dark mode ready)
- Python automation tools included

## Quick Start

```bash
npm install
cp .env.example .env   # Configure your env vars
npx prisma db push
npm run dev
```

## Tech Stack

**Framework:** Next.js 16 (Turbopack) · TypeScript · Tailwind CSS  
**Database:** Prisma ORM · PostgreSQL (production) · SQLite (local)  
**Auth:** NextAuth v5 (Credentials provider)  
**Payments:** Stripe · Checkout · Webhooks · Customer Portal  
**Deployment:** Vercel · Docker · GitHub Actions  

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Auth encryption key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `NEXT_PUBLIC_APP_URL` | Your app URL |

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `.\deploy-all.ps1` | Full deployment pipeline |

## Python Tools Included

| Tool | Description | Market Price |
|------|-------------|--------------|
| Lead Generator | Scrape business emails from websites | $50-200 |
| Price Monitor | Track competitor pricing automatically | $30-100/mo |
| Image Optimizer | Bulk compress and resize images | $20-50 |
| SaaS Manager | CLI to deploy and monitor your app | Included |

## License

MIT
