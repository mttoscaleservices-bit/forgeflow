# 🚀 ForgeFlow - Deployment Script
# Run this to deploy to Vercel (free tier)

Write-Host "=== ForgeFlow Deployment ===" -ForegroundColor Cyan

# Check for Vercel CLI
if (!(Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Build
Write-Host "`nBuilding application..." -ForegroundColor Yellow
npm run build

# Deploy
Write-Host "`nDeploying to Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Set up your Stripe keys in Vercel dashboard"
Write-Host "2. Configure your custom domain"
Write-Host "3. Set up Stripe webhook: https://yourdomain.com/api/stripe/webhook"
