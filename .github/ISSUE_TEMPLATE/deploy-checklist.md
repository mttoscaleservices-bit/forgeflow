---
name: Deployment Checklist
about: Track launch progress
title: 'Deploy to Production'
labels: deployment
assignees: ''
---

## 🚀 Launch Checklist

### Pre-Deploy
- [ ] Run `npm run build` successfully
- [ ] Test auth flow (register → login → dashboard)
- [ ] Test pricing page renders

### Vercel
- [ ] Deploy via `vercel --prod`
- [ ] Add env vars in dashboard
- [ ] Test live URL

### Stripe
- [ ] Create Stripe account
- [ ] Add API keys to Vercel
- [ ] Create products/prices
- [ ] Set up webhook endpoint

### Launch
- [ ] Post on Product Hunt
- [ ] Share on social media
- [ ] List on Gumroad
