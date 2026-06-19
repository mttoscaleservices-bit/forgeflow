<#
╔══════════════════════════════════════════════════════════════╗
║     🚀 DEPLOY NOW — ForgeFlow SaaS → Live in 2 Minutes      ║
║     Sigue las instrucciones, pega los comandos y ya         ║
╚══════════════════════════════════════════════════════════════╝
#>

$ErrorActionPreference = "Stop"
$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$GIT = "C:\Program Files\Git\cmd\git.exe"
$GH = "$env:TEMP\gh-cli\bin\gh.exe"

Clear-Host
Write-Host @"
╔══════════════════════════════════════════════════════════╗
║       🚀  FORGEFLOW - DEPLOY AUTOMÁTICO                  ║
║       Tu SaaS a producción en 2 pasos                   ║
╚══════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

Write-Host @"

`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⏱️  PASO 1: CREAR REPO EN GITHUB (30 segundos)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. Abre este link en tu navegador:
     https://github.com/new

  2. Nombre del repo:    forgeflow
  3. Visibility:         Public
  4. NO marques nada más
  5. Click: "Create repository"

  6. En la página que aparece, busca "…or push an existing repository"
     y copia los 3 comandos. Pégalos aquí cuando te los pida.

"@ -ForegroundColor Yellow

Read-Host "`nPresiona ENTER cuando hayas creado el repo en GitHub"

Write-Host "`nPega los 3 comandos de GitHub (push an existing repository), uno por uno:`n" -ForegroundColor Cyan

# Let user paste git remote add command
$remoteCmd = Read-Host "Pega el 'git remote add origin...'"
Invoke-Expression "& `"$GIT`" $remoteCmd" 2>&1

$pushCmd = "push -u origin master"
Write-Host "`n$ git $pushCmd" -ForegroundColor Gray
& $GIT push -u origin master 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Push falló. Asegúrate de haber creado el repo y tener permisos." -ForegroundColor Red
    Write-Host "   Ejecuta manualmente en otra terminal:" -ForegroundColor Yellow
    Write-Host "   cd `"$ROOT`"" -ForegroundColor White
    Write-Host "   git push -u origin master" -ForegroundColor White
    pause
    exit
}

Write-Host @"
`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⏱️  PASO 2: DESPLEGAR EN VERCEL (30 segundos)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  👆 CLICK EN ESTE BOTÓN:
"@ -ForegroundColor Yellow
Write-Host "  https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USER/forgeflow" -ForegroundColor Cyan
Write-Host @"

  (Reemplaza YOUR_USER con tu usuario de GitHub)

  1. Conéctate con GitHub (si pide login)
  2. Selecciona el repo "forgeflow"
  3. Framework: Next.js (se auto-detecta)
  4. Click "Deploy"
  5. 🎉 ¡LISTO! Tu SaaS está live

`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⏱️  PASO 3: CONECTAR STRIPE (3 minutos)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"@ -ForegroundColor Yellow

Write-Host @"
  Después del deploy, en Vercel Dashboard:
  
  1. Ve a tu proyecto → Settings → Environment Variables
  
  2. Agrega estas variables:

     STRIPE_SECRET_KEY          = sk_live_...  (de Stripe Dashboard)
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_... (de Stripe)
     NEXTAUTH_SECRET            = (usa: openssl rand -base64 32)
     NEXTAUTH_URL               = https://tu-proyecto.vercel.app
     NEXT_PUBLIC_APP_URL        = https://tu-proyecto.vercel.app

  3. En Stripe → Developers → Webhooks → Add endpoint:
     URL: https://tu-proyecto.vercel.app/api/stripe/webhook
     Event: checkout.session.completed
     → Copia el Stripe Webhook Secret

  ⚡ ¡Y EMPIEZAS A COBRAR!

`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  💰 4 FORMAS DE GANAR $1000+
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  🟢  VENDER BOILERPLATE en Gumroad ($49-149/copia)
      → Listo: MONETIZE.md tiene el texto de venta

  🟢  SAAS SUBSCRIPTIONS ($29-99/mes)
      → Stripe ya integrado, pricing page lista

  🟢  FREELANCE ($500-3000/proyecto)
      → Usa como portafolio, personaliza para clientes

  🟢  PYTHON SERVICES en Fiverr ($20-200/job)
      → Herramientas listas en python-tools/

  📖 Guía completa: MONETIZE.md
"@ -ForegroundColor Green

Write-Host "`n`n🎉 ¡FELICIDADES! Tu SaaS está desplegado. Bienvenido a los $1000+ 💰" -ForegroundColor Cyan
