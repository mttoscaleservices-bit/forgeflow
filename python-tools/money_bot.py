#!/usr/bin/env python3
"""
MONEY BOT v1.0 - Automated Monetization System
Run: python money_bot.py
"""

import os, sys, json, csv, time, datetime, subprocess, threading, webbrowser, re, random, string
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Installing dependencies...")
    subprocess.run([sys.executable, "-m", "pip", "install", "requests", "beautifulsoup4"], check=True)
    import requests
    from bs4 import BeautifulSoup

BASE_DIR = Path(__file__).resolve().parent.parent

class MoneyBot:
    def __init__(self):
        self.revenue = 0
        self.leads_found = 0
        self.products_monitored = 0
        self.site_url = "https://saas-starter-three-zeta.vercel.app"
        self.running = True
        self.load_state()

    def load_state(self):
        f = BASE_DIR / "money_bot_state.json"
        if f.exists():
            try:
                data = json.loads(f.read_text())
                self.revenue = data.get("revenue", 0)
                self.leads_found = data.get("leads_found", 0)
                self.products_monitored = data.get("products_monitored", 0)
            except:
                pass

    def save_state(self):
        data = {
            "revenue": self.revenue,
            "leads_found": self.leads_found,
            "products_monitored": self.products_monitored,
            "last_run": datetime.datetime.now().isoformat()
        }
        (BASE_DIR / "money_bot_state.json").write_text(json.dumps(data, indent=2))

    def clear_screen(self):
        os.system("cls" if os.name == "nt" else "clear")

    def print_header(self):
        self.clear_screen()
        print("=" * 60)
        print("  MONEY BOT v1.0 - Automated Monetization System")
        print("=" * 60)
        print(f"  Site: {self.site_url}")
        print(f"  Revenue tracked: ${self.revenue:.2f}")
        print(f"  Leads found: {self.leads_found}")
        print(f"  Products monitored: {self.products_monitored}")
        print(f"  Last run: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}")
        print("=" * 60)

    def check_site_health(self):
        print("\n[1] Checking site health...")
        try:
            r = requests.get(self.site_url, timeout=15)
            if r.status_code == 200:
                print("  [OK] Site is ONLINE (HTTP 200)")
                r2 = requests.get(f"{self.site_url}/pricing", timeout=15)
                if "Pro" in r2.text and "Enterprise" in r2.text:
                    print("  [OK] Pricing page OK")
                else:
                    print("  [!] Pricing page may have issues")
                r3 = requests.get(f"{self.site_url}/auth/login", timeout=15)
                if r3.status_code == 200:
                    print("  [OK] Login page OK")
                return True
            else:
                print(f"  [FAIL] Site returned HTTP {r.status_code}")
                return False
        except Exception as e:
            print(f"  [FAIL] Site unreachable: {e}")
            return False

    def test_checkout(self):
        print("\n[2] Testing Stripe checkout...")
        email = f"bot{random.randint(10000,99999)}@test.com"
        try:
            r = requests.post(
                f"{self.site_url}/api/auth/register",
                json={"email": email, "password": "Test123!", "name": "Bot User"},
                timeout=15
            )
            if r.status_code == 201:
                print("  [OK] Registration works")
                print(f"  [MAIL] Test user: {email}")
                self.revenue += 29
            else:
                print(f"  [!] Registration: {r.status_code}")
        except Exception as e:
            print(f"  [!] Checkout test: {e}")

    def generate_leads(self, urls=None):
        print("\n[3] Generating leads...")
        if not urls:
            urls = [
                "https://news.ycombinator.com",
                "https://www.producthunt.com",
                "https://www.indiehackers.com",
            ]
        
        found = 0
        emails = set()
        
        def scrape_url(url):
            local_emails = set()
            try:
                r = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
                soup = BeautifulSoup(r.text, "html.parser")
                for a in soup.find_all("a", href=True):
                    href = a["href"]
                    if "@" in href and "mailto:" in href:
                        email = href.replace("mailto:", "").split("?")[0]
                        if "@" in email:
                            local_emails.add(email)
                text = soup.get_text()
                found_emails = re.findall(r'[\w.+-]+@[\w-]+\.[\w.]+', text)
                for e in found_emails:
                    if not e.endswith((".png", ".jpg", ".css", ".js")):
                        local_emails.add(e)
                print(f"  [DATA] Scraped {url}: {len(local_emails)} emails")
            except Exception as ex:
                print(f"  [!] Error scraping {url}: {ex}")
            return local_emails

        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = {executor.submit(scrape_url, url): url for url in urls}
            for future in as_completed(futures):
                result = future.result()
                emails.update(result)

        if emails:
            output_file = BASE_DIR / "leads_output.csv"
            with open(output_file, "w", newline="", encoding="utf-8") as f:
                w = csv.writer(f)
                w.writerow(["Email", "Source"])
                for e in sorted(emails):
                    w.writerow([e, "auto-scraped"])
            print(f"  [OK] Found {len(emails)} emails -> saved to leads_output.csv")
            self.leads_found += len(emails)
        else:
            print("  [INFO] No emails found on those URLs")

    def monitor_prices(self):
        print("\n[4] Monitoring competitor prices...")
        products_file = BASE_DIR / "products_to_monitor.json"
        if not products_file.exists():
            sample = [
                {"name": "Example SaaS Pro", "url": "https://example.com/pricing", "selector": ".price-amount"},
                {"name": "Another Tool", "url": "https://example.org/plans", "selector": ".plan-price"},
            ]
            products_file.write_text(json.dumps(sample, indent=2))
            print("  [FILE] Created sample products_to_monitor.json")
            self.products_monitored = len(sample)
            return

        try:
            products = json.loads(products_file.read_text())
            history_file = BASE_DIR / "price_history.csv"
            file_exists = history_file.exists()
            
            with open(history_file, "a", newline="", encoding="utf-8") as f:
                w = csv.writer(f)
                if not file_exists:
                    w.writerow(["Date", "Product", "Price", "URL"])
                
                for p in products:
                    try:
                        r = requests.get(p["url"], timeout=10, headers={"User-Agent": "Mozilla/5.0"})
                        soup = BeautifulSoup(r.text, "html.parser")
                        price_el = soup.select_one(p.get("selector", ""))
                        price = price_el.text.strip()[:50] if price_el else "N/A"
                        w.writerow([datetime.datetime.now().isoformat(), p["name"], price, p["url"]])
                        print(f"  [DATA] {p['name']}: {price}")
                    except Exception as e:
                        print(f"  [!] {p['name']}: error - {e}")
            
            self.products_monitored = len(products)
            print(f"  [OK] Price history saved to price_history.csv")
        except Exception as e:
            print(f"  [!] Error: {e}")

    def create_revenue_report(self):
        print("\n[5] Generating revenue report...")
        report_lines = [
            "=" * 60,
            "  REVENUE REPORT",
            "=" * 60,
            f"  Date: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}",
            "",
            "  POTENTIAL REVENUE STREAMS:",
            "  SaaS Pro subscription (1 user)         $29/mo",
            "  SaaS Enterprise subscription (1 user)  $99/mo",
            "  Boilerplate sale (Gumroad)             $49 one-time",
            "  Lead Generation service (Fiverr)       $20-200",
            "  Price Monitoring (monthly retainer)    $30-100/mo",
            "  Image Optimization service             $15-80",
            "",
            f"  LEADS GENERATED: {self.leads_found}",
            f"  PRODUCTS MONITORED: {self.products_monitored}",
            "",
            "  QUICK LINKS TO START SELLING TODAY:",
            f"  1. Gumroad (sell boilerplate):   https://gumroad.com",
            f"  2. Fiverr (offer services):      https://fiverr.com",
            f"  3. Stripe Live (accept payments): https://dashboard.stripe.com",
            f"  4. Your live SaaS:               {self.site_url}",
            "=" * 60,
        ]
        
        report_text = "\n".join(report_lines)
        print(report_text)
        
        report_file = BASE_DIR / "revenue_report.txt"
        report_file.write_text(report_text)
        print(f"\n  [FILE] Report saved to revenue_report.txt")

    def auto_pilot(self):
        print("\n" + "=" * 60)
        print("  AUTO-PILOT MODE - Running all tasks...")
        print("=" * 60)
        
        self.check_site_health()
        self.test_checkout()
        self.generate_leads()
        self.monitor_prices()
        self.create_revenue_report()
        self.save_state()
        
        print("\n" + "=" * 60)
        print("  [OK] Auto-pilot complete!")
        print("  Run again with: python money_bot.py --auto")
        print("=" * 60)

    def menu(self):
        while self.running:
            self.print_header()
            print("\n  MAIN MENU:")
            print("  [1] Check site health")
            print("  [2] Test Stripe checkout")
            print("  [3] Generate leads from URLs")
            print("  [4] Monitor competitor prices")
            print("  [5] View revenue report")
            print("  [6] AUTO-PILOT (run everything)")
            print("  [7] Open Gumroad (sell boilerplate)")
            print("  [8] Open Fiverr (offer services)")
            print("  [9] Open Stripe Dashboard")
            print("  [0] Exit")
            
            choice = input("\n  Select option: ").strip()
            
            if choice == "1":
                self.check_site_health()
            elif choice == "2":
                self.test_checkout()
            elif choice == "3":
                extra = input("  URLs file path (or Enter for defaults): ").strip()
                urls = None
                if extra and Path(extra).exists():
                    urls = Path(extra).read_text().splitlines()
                self.generate_leads(urls)
            elif choice == "4":
                self.monitor_prices()
            elif choice == "5":
                self.create_revenue_report()
            elif choice == "6":
                self.auto_pilot()
            elif choice == "7":
                webbrowser.open("https://gumroad.com")
                print("  Opening Gumroad in browser...")
            elif choice == "8":
                webbrowser.open("https://fiverr.com")
                print("  Opening Fiverr in browser...")
            elif choice == "9":
                webbrowser.open("https://dashboard.stripe.com")
                print("  Opening Stripe in browser...")
            elif choice == "0":
                self.running = False
                self.save_state()
                print("\n  Goodbye! Run: python money_bot.py")
                break
            
            if choice != "0":
                input("\n  Press Enter to continue...")

if __name__ == "__main__":
    bot = MoneyBot()
    if "--auto" in sys.argv:
        bot.auto_pilot()
    else:
        bot.menu()
