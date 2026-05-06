"""
Compresses all PNG/JPEG images in the assets folder in-place.
Keeps original file paths unchanged so no HTML needs to be edited.
"""
from PIL import Image
import os
import sys

ASSETS_DIR = os.path.join(os.path.dirname(__file__), "assets")
JPEG_QUALITY = 78
PNG_MAX_SIZE = (2000, 2000)  # Resize if larger than this
SKIP_BELOW_KB = 100  # Skip files already under 100KB

total_before = 0
total_after = 0
count = 0

for root, dirs, files in os.walk(ASSETS_DIR):
    for fname in files:
        ext = os.path.splitext(fname)[1].lower()
        if ext not in (".png", ".jpg", ".jpeg"):
            continue

        fpath = os.path.join(root, fname)
        size_before = os.path.getsize(fpath)
        total_before += size_before

        if size_before < SKIP_BELOW_KB * 1024:
            total_after += size_before
            continue

        try:
            img = Image.open(fpath)

            # Downscale if drastically oversized
            if img.width > PNG_MAX_SIZE[0] or img.height > PNG_MAX_SIZE[1]:
                img.thumbnail(PNG_MAX_SIZE, Image.LANCZOS)

            if ext == ".png":
                # Convert RGBA/P with transparency to PNG, RGB without to JPEG
                if img.mode in ("RGBA", "P") and img.info.get("transparency") is not None:
                    img.save(fpath, "PNG", optimize=True, compress_level=9)
                elif img.mode in ("RGBA",):
                    img.save(fpath, "PNG", optimize=True, compress_level=9)
                else:
                    # No transparency — save as optimized PNG
                    if img.mode != "RGB":
                        img = img.convert("RGB")
                    img.save(fpath, "PNG", optimize=True, compress_level=9)
            elif ext in (".jpg", ".jpeg"):
                if img.mode != "RGB":
                    img = img.convert("RGB")
                img.save(fpath, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)

            size_after = os.path.getsize(fpath)
            total_after += size_after
            saved = size_before - size_after
            count += 1
            print(f"  {fname}: {size_before//1024}KB → {size_after//1024}KB (saved {saved//1024}KB)")

        except Exception as e:
            print(f"  SKIP {fname}: {e}")
            total_after += size_before

print(f"\n{'='*50}")
print(f"Compressed {count} images")
print(f"Total before: {total_before/1024/1024:.1f} MB")
print(f"Total after:  {total_after/1024/1024:.1f} MB")
print(f"Saved:        {(total_before-total_after)/1024/1024:.1f} MB ({100*(total_before-total_after)/total_before:.0f}%)")
