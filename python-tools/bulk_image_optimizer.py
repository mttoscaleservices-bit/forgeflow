"""
Bulk Image Optimizer - Compress and resize images
Sell as a service on Fiverr: $20-50 per batch
Usage: python bulk_image_optimizer.py input_folder output_folder
"""

import os
import sys
from PIL import Image
from concurrent.futures import ProcessPoolExecutor

def optimize_image(args):
    input_path, output_path, max_size, quality = args
    try:
        img = Image.open(input_path)
        img = img.convert("RGB")

        original_size = os.path.getsize(input_path)

        if max(img.size) > max_size:
            ratio = max_size / max(img.size)
            new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
            img = img.resize(new_size, Image.Resampling.LANCZOS)

        output_path = os.path.splitext(output_path)[0] + ".jpg"
        img.save(output_path, "JPEG", quality=quality, optimize=True)
        new_size = os.path.getsize(output_path)

        savings = (1 - new_size / original_size) * 100
        return (input_path, original_size, new_size, savings)
    except Exception as e:
        return (input_path, 0, 0, 0)

def main():
    if len(sys.argv) < 3:
        print("Usage: python bulk_image_optimizer.py <input_dir> <output_dir> [max_size=1920] [quality=80]")
        sys.exit(1)

    input_dir = sys.argv[1]
    output_dir = sys.argv[2]
    max_size = int(sys.argv[3]) if len(sys.argv) > 3 else 1920
    quality = int(sys.argv[4]) if len(sys.argv) > 4 else 80

    os.makedirs(output_dir, exist_ok=True)

    extensions = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"}
    tasks = []
    for file in os.listdir(input_dir):
        if os.path.splitext(file)[1].lower() in extensions:
            tasks.append((
                os.path.join(input_dir, file),
                os.path.join(output_dir, file),
                max_size, quality
            ))

    if not tasks:
        print("No image files found!")
        sys.exit(1)

    print(f"Optimizing {len(tasks)} images...")

    with ProcessPoolExecutor() as executor:
        results = list(executor.map(optimize_image, tasks))

    total_original = 0
    total_new = 0
    for path, orig, new, savings in results:
        if orig > 0:
            total_original += orig
            total_new += new
            print(f"  {os.path.basename(path)}: {orig/1024:.1f}KB -> {new/1024:.1f}KB ({savings:.0f}% savings)")

    overall = (1 - total_new / total_original) * 100
    print(f"\nTotal: {total_original/1024:.1f}KB -> {total_new/1024:.1f}KB")
    print(f"Overall savings: {overall:.0f}%")
    print(f"\n💡 Sell this service on Fiverr for $20-50 per batch!")

if __name__ == "__main__":
    main()
