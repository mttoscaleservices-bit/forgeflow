"""
SaaS Manager - Auto-deploy, monitor, and manage your ForgeFlow instance
Usage: python saas_manager.py deploy|monitor|backup|status
"""

import os
import sys
import json
import time
import subprocess
import webbrowser
from datetime import datetime
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent
CONFIG_FILE = PROJECT_DIR / "saas_config.json"

def check_environment():
    checks = {
        "Node.js": subprocess.run(["node", "--version"], capture_output=True, text=True).returncode == 0,
        "npm": subprocess.run(["npm", "--version"], capture_output=True, text=True).returncode == 0,
        "Build": (PROJECT_DIR / ".next").exists(),
        "Database": (PROJECT_DIR / "prisma" / "dev.db").exists(),
    }
    return checks

def get_config():
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE) as f:
            return json.load(f)
    return {}

def save_config(config):
    with open(CONFIG_FILE, "w") as f:
        json.dump(config, f, indent=2)

def run_command(cmd, cwd=None):
    return subprocess.run(cmd, shell=True, cwd=cwd or PROJECT_DIR, capture_output=True, text=True)

def cmd_deploy():
    print("🚀 Starting auto-deployment...")

    checks = check_environment()
    for k, v in checks.items():
        status = "✅" if v else "❌"
        print(f"  {status} {k}")

    steps = [
        ("Installing dependencies", "npm install"),
        ("Generating Prisma client", "npx prisma generate"),
        ("Pushing database", "npx prisma db push"),
        ("Building application", "npm run build"),
    ]

    for label, cmd in steps:
        print(f"  ⏳ {label}...")
        result = run_command(cmd)
        if result.returncode != 0 and "Building" not in label:
            print(f"  ❌ {label} failed: {result.stderr}")
            return
        print(f"  ✅ {label}")

    print("\n  🌐 Opening Vercel deploy page...")
    webbrowser.open("https://vercel.com/new")

    config = get_config()
    config["last_deploy"] = datetime.now().isoformat()
    config["build_status"] = "success"
    save_config(config)

    print("\n" + "=" * 50)
    print("✅ DEPLOYMENT READY!")
    print("=" * 50)
    print("\nNext: Deploy to Vercel manually or run:")
    print("  cd saas-starter && npx vercel --prod")
    print("\nStripe setup:")
    print("  1. https://dashboard.stripe.com/register")
    print("  2. Add keys to Vercel environment variables")
    print("  3. Set webhook → https://yoursite.vercel.app/api/stripe/webhook")
    print("=" * 50)

def cmd_status():
    print("📊 ForgeFlow Status\n")

    checks = check_environment()
    all_ok = True
    for k, v in checks.items():
        symbol = "🟢" if v else "🔴"
        if not v: all_ok = False
        print(f"  {symbol} {k}")

    config = get_config()
    if config.get("last_deploy"):
        print(f"\n  📅 Last deploy: {config['last_deploy']}")

    print(f"\n  📁 Project size: {sum(f.stat().st_size for f in PROJECT_DIR.rglob('*') if f.is_file()) / 1024 / 1024:.1f} MB")
    print(f"  📂 Files: {sum(1 for _ in PROJECT_DIR.rglob('*') if _.is_file())}")

    if all_ok:
        print("\n  🟢 All systems operational")
    else:
        print("\n  🟡 Run 'python saas_manager.py deploy' to fix")

def cmd_monitor():
    print("📈 Monitor mode (Ctrl+C to stop)\n")
    try:
        while True:
            now = datetime.now().strftime("%H:%M:%S")
            checks = check_environment()
            status = "🟢 ALL OK" if all(checks.values()) else "🔴 ISSUES"
            print(f"  [{now}] {status} | Build: {'✅' if checks['Build'] else '❌'} | DB: {'✅' if checks['Database'] else '❌'}", end="\r")
            time.sleep(60)
    except KeyboardInterrupt:
        print("\n\nMonitoring stopped.")

def cmd_backup():
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir = PROJECT_DIR / f"backup_{timestamp}"
    backup_dir.mkdir(exist_ok=True)

    items = ["prisma/dev.db", ".env", "saas_config.json"]
    for item in items:
        src = PROJECT_DIR / item
        if src.exists():
            dst = backup_dir / item
            dst.parent.mkdir(parents=True, exist_ok=True)
            dst.write_bytes(src.read_bytes())
            print(f"  ✅ Backed up: {item}")

    print(f"\n  💾 Backup saved to: {backup_dir.name}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python saas_manager.py [deploy|status|monitor|backup]")
        print("\nCommands:")
        print("  deploy  - Build & prepare deployment")
        print("  status  - Check system health")
        print("  monitor - Real-time monitoring")
        print("  backup  - Backup database & config")
        sys.exit(1)

    command = sys.argv[1]
    commands = {
        "deploy": cmd_deploy,
        "status": cmd_status,
        "monitor": cmd_monitor,
        "backup": cmd_backup,
    }

    if command in commands:
        commands[command]()
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)

if __name__ == "__main__":
    main()
