"""
E-commerce Price Monitor - Track competitor prices
Sell as a service: $30-100/month per client
Usage: python price_monitor.py
"""

import csv
import json
import re
import time
from datetime import datetime
import requests
from bs4 import BeautifulSoup

PRODUCTS_FILE = "products_to_monitor.json"
OUTPUT_FILE = "price_history.csv"

sample_products = [
    {"name": "Example Product", "url": "https://example.com/product", "selector": ".price"},
]

def load_products():
    try:
        with open(PRODUCTS_FILE) as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"No {PRODUCTS_FILE} found. Creating sample...")
        with open(PRODUCTS_FILE, "w") as f:
            json.dump(sample_products, f, indent=2)
        return sample_products

def check_price(url, selector):
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        resp = requests.get(url, timeout=10, headers=headers)
        soup = BeautifulSoup(resp.text, "html.parser")
        element = soup.select_one(selector)
        if element:
            price_text = element.get_text(strip=True)
            price = re.search(r"[\d,.]+", price_text.replace(",", ""))
            if price:
                return float(price.group())
        return None
    except Exception as e:
        print(f"Error checking {url}: {e}")
        return None

def main():
    products = load_products()
    print(f"Monitoring {len(products)} products...")
    print("Press Ctrl+C to stop")

    try:
        while True:
            timestamp = datetime.now().isoformat()
            for product in products:
                price = check_price(product["url"], product["selector"])
                if price:
                    with open(OUTPUT_FILE, "a", newline="") as f:
                        writer = csv.writer(f)
                        if f.tell() == 0:
                            writer.writerow(["timestamp", "product", "price"])
                        writer.writerow([timestamp, product["name"], price])
                    print(f"[{timestamp}] {product['name']}: ${price}")

            time.sleep(3600)  # Check every hour
    except KeyboardInterrupt:
        print(f"\nSaved to {OUTPUT_FILE}")
        print("💡 Sell this monitoring service for $30-100/month per client")

if __name__ == "__main__":
    main()
