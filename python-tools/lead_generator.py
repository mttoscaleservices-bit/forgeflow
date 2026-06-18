"""
Lead Generator - Find business emails from websites
Sell as a service: $50-200 per list
Usage: python lead_generator.py list_of_urls.txt
"""

import re
import csv
import sys
import requests
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor, as_completed

email_pattern = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
contact_pages = ["contact", "about", "team", "support", "help"]

def extract_emails_from_url(url):
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        resp = requests.get(url, timeout=10, headers=headers)
        emails = set(email_pattern.findall(resp.text))
        domain = urlparse(url).netloc
        return [(e, domain, url) for e in emails if not e.endswith((".png", ".jpg", ".css"))]
    except:
        return []

def find_contact_page(base_url):
    parsed = urlparse(base_url)
    for page in contact_pages:
        urls = [
            f"{parsed.scheme}://{parsed.netloc}/{page}",
            f"{parsed.scheme}://{parsed.netloc}/{page}/",
        ]
        for u in urls:
            try:
                resp = requests.get(u, timeout=5)
                if resp.status_code == 200:
                    emails = extract_emails_from_url(u)
                    if emails:
                        return emails
            except:
                continue
    return []

def process_url(url):
    url = url.strip()
    if not url.startswith("http"):
        url = "https://" + url
    emails = extract_emails_from_url(url)
    if not emails:
        emails = find_contact_page(url)
    return emails

def main():
    if len(sys.argv) < 2:
        print("Usage: python lead_generator.py <file_with_urls>")
        sys.exit(1)

    input_file = sys.argv[1]
    with open(input_file) as f:
        urls = [line.strip() for line in f if line.strip()]

    print(f"Processing {len(urls)} URLs...")
    all_leads = []

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(process_url, url): url for url in urls}
        for future in as_completed(futures):
            result = future.result()
            if result:
                all_leads.extend(result)

    output = "leads_output.csv"
    with open(output, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Email", "Domain", "Source URL"])
        writer.writerows(all_leads)

    print(f"Found {len(all_leads)} emails!")
    print(f"Saved to {output}")
    print(f"\n💡 Sell this list on Upwork/Fiverr for $50-200")

if __name__ == "__main__":
    main()
