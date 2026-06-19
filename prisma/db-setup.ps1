<#
╔════════════════════════════════════════════════════════╗
║    🗄️  Database Setup — ForgeFlow                      ║
║    Auto-detects SQLite or PostgreSQL                   ║
╚════════════════════════════════════════════════════════╝
#>

$ROOT = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$SCHEMA_DIR = Join-Path $ROOT "prisma"

Write-Host "=== Database Setup ===" -ForegroundColor Cyan

$dbUrl = $env:DATABASE_URL
if ([string]::IsNullOrEmpty($dbUrl)) {
    Write-Host "`n⚠️  No DATABASE_URL found in environment." -ForegroundColor Yellow
    Write-Host "`nChoose your database:" -ForegroundColor Cyan
    Write-Host "  1) SQLite (local dev, simple)" -ForegroundColor White
    Write-Host "  2) PostgreSQL (required for Vercel/Production)" -ForegroundColor White
    Write-Host "  3) Get FREE PostgreSQL from Neon (1-click)" -ForegroundColor White
    
    $choice = Read-Host "`nChoice (1/2/3)"
} else {
    if ($dbUrl -like "file:*") {
        Write-Host "`n📁 Detected SQLite database" -ForegroundColor Green
        $choice = "1"
    } elseif ($dbUrl -like "postgres*") {
        Write-Host "`n🐘 Detected PostgreSQL database" -ForegroundColor Green
        $choice = "2"
    } else {
        Write-Host "`n⚠️  Unknown database type: $dbUrl" -ForegroundColor Yellow
        $choice = "1"
    }
}

switch ($choice) {
    "1" {
        Write-Host "`n📁 Configuring SQLite..." -ForegroundColor Yellow
        Copy-Item (Join-Path $SCHEMA_DIR "schema.sqlite.prisma") (Join-Path $SCHEMA_DIR "schema.prisma") -Force
        
        $envFile = Join-Path $ROOT ".env"
        $content = Get-Content $envFile -Raw
        if ($content -notmatch 'DATABASE_URL="file:') {
            $content = $content -replace 'DATABASE_URL=.*', 'DATABASE_URL="file:./dev.db"'
            Set-Content $envFile $content
        }
        
        Write-Host "  ✅ SQLite configured" -ForegroundColor Green
    }
    "2" {
        Write-Host "`n🐘 Configuring PostgreSQL..." -ForegroundColor Yellow
        Copy-Item (Join-Path $SCHEMA_DIR "schema.postgres.prisma") (Join-Path $SCHEMA_DIR "schema.prisma") -Force
        Write-Host "  ✅ PostgreSQL configured" -ForegroundColor Green
        Write-Host "  ⚠️  Make sure DATABASE_URL env var is set to your Postgres connection string" -ForegroundColor Yellow
    }
    "3" {
        Write-Host "`n🌐 Opening Neon (FREE Postgres)..." -ForegroundColor Cyan
        Write-Host "  1. Create account at: https://console.neon.tech/signup" -ForegroundColor White
        Write-Host "  2. Create a project" -ForegroundColor White
        Write-Host "  3. Copy the connection string" -ForegroundColor White
        Write-Host "  4. Add to Vercel env vars or .env file" -ForegroundColor White
        Start-Process "https://console.neon.tech/signup"
        
        Write-Host "`n🐘 Configuring PostgreSQL..." -ForegroundColor Yellow
        Copy-Item (Join-Path $SCHEMA_DIR "schema.postgres.prisma") (Join-Path $SCHEMA_DIR "schema.prisma") -Force
        Write-Host "  ✅ Schema configured" -ForegroundColor Green
    }
}

# Generate Prisma client
Write-Host "`n⚡ Generating Prisma client..." -ForegroundColor Yellow
Set-Location $ROOT
npx prisma generate 2>&1
Write-Host "  ✅ Done!" -ForegroundColor Green

Write-Host "`n📊 Pushing database schema..." -ForegroundColor Yellow
npx prisma db push 2>&1
Write-Host "  ✅ Database synced!" -ForegroundColor Green
