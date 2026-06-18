<#
╔══════════════════════════════════════════════════════════════╗
║           🚀 ForgeFlow - Auto Deployment System              ║
║   Zero-click deployment: git → Vercel → Stripe → Live $$$    ║
╚══════════════════════════════════════════════════════════════╝
#>

$ErrorActionPreference = "Stop"
$VERSION = "2.0"

function Show-Banner {
    Clear-Host
    Write-Host @"
╔══════════════════════════════════════════════════════╗
║          🚀 FORGEFLOW - AUTO-DEPLOY v$VERSION          ║
║     Complete SaaS Deployment & Monetization Engine    ║
╚══════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan
}

function Install-RequiredTools {
    Write-Host "`n📦 Checking prerequisites..." -ForegroundColor Yellow
    
    # Check Node.js
    $nodeVer = node --version 2>$null
    if ($nodeVer) {
        Write-Host "  ✅ Node.js $nodeVer" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Node.js required. Download from https://nodejs.org" -ForegroundColor Red
        return $false
    }

    # Install Vercel CLI
    $vercelVer = npx vercel --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Vercel CLI available" -ForegroundColor Green
    } else {
        Write-Host "  ⏳ Installing Vercel CLI..." -ForegroundColor Yellow
        npm install -g vercel 2>&1 | Out-Null
    }

    return $true
}

function Setup-Environment {
    param([string]$Step = "all")
    
    Write-Host "`n🔧 Step: $Step" -ForegroundColor Cyan
    
    switch ($Step) {
        "git" {
            Write-Host "`n📤 Initializing Git repository..." -ForegroundColor Yellow
            if (Test-Path ".git") { Remove-Item -Recurse -Force ".git" -ErrorAction SilentlyContinue }
            git init
            git add -A
            git commit -m "🚀 Initial commit: ForgeFlow SaaS"
            Write-Host "  ✅ Git repo initialized" -ForegroundColor Green
            Write-Host "  ℹ️  Run: git remote add origin https://github.com/YOUR_USER/forgeflow.git" -ForegroundColor Cyan
            Write-Host "  ℹ️  Then: git push -u origin main" -ForegroundColor Cyan
        }
        "env" {
            Write-Host "`n🔐 Creating .env file..." -ForegroundColor Yellow
            if (!(Test-Path ".env")) {
                @"
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="$( -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object { [char]$_ }) )"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_placeholder"
STRIPE_WEBHOOK_SECRET="whsec_placeholder"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_placeholder"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
"@ | Set-Content ".env"
                Write-Host "  ✅ .env created with random NEXTAUTH_SECRET" -ForegroundColor Green
            } else {
                Write-Host "  ✅ .env already exists" -ForegroundColor Green
            }
        }
        "database" {
            Write-Host "`n🗄️  Setting up database..." -ForegroundColor Yellow
            npx prisma generate
            npx prisma db push
            Write-Host "  ✅ Database ready!" -ForegroundColor Green
        }
        "build" {
            Write-Host "`n🏗️  Building application..." -ForegroundColor Yellow
            npm run build
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✅ Build successful!" -ForegroundColor Green
            } else {
                Write-Host "  ❌ Build failed!" -ForegroundColor Red
                return $false
            }
        }
        "vercel" {
            Write-Host "`n🌐 Deploying to Vercel..." -ForegroundColor Yellow
            Write-Host "  ℹ️  If you haven't logged in, you'll be prompted." -ForegroundColor Cyan
            vercel --prod
        }
    }
    return $true
}

function Show-Monetization {
    Write-Host @"

╔══════════════════════════════════════════════════════════════╗
║                    💰 MONETIZATION ENGINE                     ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  🟢  PATH 1: SELL BOILERPLATE (Fast $$$)                    ║
║     → List on Gumroad for $49-149                            ║
║     → List on CodeCanyon for $30-60                          ║
║     → 10 sales = $500-1500                                   ║
║                                                              ║
║  🟢  PATH 2: SAAS SUBSCRIPTIONS (Recurring)                  ║
║     → $29/mo Pro plan (Stripe ready)                         ║
║     → 4 customers = $116/mo recurring                        ║
║                                                              ║
║  🟢  PATH 3: FREELANCE SERVICES                              ║
║     → Customize this for clients                             ║
║     → Charge $500-3000 per project                           ║
║                                                              ║
║  🟢  PATH 4: PYTHON AUTOMATION TOOLS                         ║
║     → Lead generation: $50-200/list                          ║
║     → Price monitoring: $30-100/mo/client                    ║
║     → Image optimization: $20-50/batch                       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Green
}

function Show-ActionPlan {
    param([string]$Mode = "full")
    
    Write-Host @"

╔══════════════════════════════════════════════════════════════╗
║                  📋 EXECUTION PLAN                             ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  STEP 1: Deploy to Vercel (FREE, 2 min)                     ║
║     Run: .\deploy-all.ps1 -Mode quick                       ║
║     Or manually: npm run build && vercel --prod              ║
║                                                              ║
║  STEP 2: Connect Stripe (FREE, 5 min)                       ║
║     1. Go to https://dashboard.stripe.com/register          ║
║     2. Get API keys → add to Vercel env vars                ║
║     3. Set webhook: https://yoursite.vercel.app/api/stripe  ║
║                                                              ║
║  STEP 3: Launch! (Same day)                                 ║
║     - Share on Product Hunt, Twitter, LinkedIn              ║
║     - List on Gumroad as a boilerplate                      ║
║     - Offer on Fiverr/Upwork as a service                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan
}

function Start-Deployment {
    param([string]$Mode = "full")
    
    Show-Banner
    
    if (!(Install-RequiredTools)) {
        Write-Host "`n❌ Missing prerequisites. Install manually." -ForegroundColor Red
        return
    }

    switch ($Mode) {
        "full" {
            Setup-Environment -Step "env"
            Setup-Environment -Step "database"
            Setup-Environment -Step "build"
            Setup-Environment -Step "vercel"
            Show-Monetization
            Show-ActionPlan
        }
        "quick" {
            Setup-Environment -Step "env"
            Setup-Environment -Step "build"
            Setup-Environment -Step "vercel"
        }
        "build-only" {
            Setup-Environment -Step "build"
        }
    }
}

# Parse command line
$mode = "full"
if ($args.Count -gt 0) { $mode = $args[0] }

Start-Deployment -Mode $mode
