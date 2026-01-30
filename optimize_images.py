"""
Image Optimization Script for Foresta Website
Converts PNG images to WebP format for faster loading
Maintains original quality while reducing file size by 60-80%
"""

import os
from pathlib import Path
from PIL import Image
import shutil

def get_file_size_mb(filepath):
    """Get file size in MB"""
    return os.path.getsize(filepath) / (1024 * 1024)

def convert_png_to_webp(png_path, quality=85):
    """
    Convert PNG to WebP format
    Args:
        png_path: Path to PNG file
        quality: WebP quality (1-100, default 85 for good balance)
    """
    try:
        # Open PNG image
        img = Image.open(png_path)
        
        # Convert RGBA to RGB if necessary
        if img.mode == 'RGBA':
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])
            img = background
        
        # Create WebP path
        webp_path = png_path.rsplit('.', 1)[0] + '.webp'
        
        # Save as WebP
        img.save(webp_path, 'WebP', quality=quality, method=6)
        
        # Get file sizes
        png_size = get_file_size_mb(png_path)
        webp_size = get_file_size_mb(webp_path)
        reduction = ((png_size - webp_size) / png_size) * 100
        
        print(f"✓ {Path(png_path).name}")
        print(f"  PNG: {png_size:.2f}MB → WebP: {webp_size:.2f}MB (Reduced {reduction:.1f}%)")
        
        return webp_path, png_size, webp_size
        
    except Exception as e:
        print(f"✗ Error converting {png_path}: {str(e)}")
        return None, 0, 0

def backup_originals(base_path, folders):
    """Create backup of original PNG files"""
    backup_dir = os.path.join(base_path, '_original_pngs_backup')
    
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
        print(f"\n📦 Created backup directory: {backup_dir}")
    
    for folder in folders:
        folder_path = os.path.join(base_path, folder)
        if os.path.exists(folder_path):
            backup_folder = os.path.join(backup_dir, folder)
            if not os.path.exists(backup_folder):
                print(f"   Backing up: {folder}")
                shutil.copytree(folder_path, backup_folder)
    
    print("✓ Backup completed\n")

def optimize_folder(folder_path):
    """Optimize all PNG images in a folder"""
    print(f"\n{'='*60}")
    print(f"Processing: {Path(folder_path).name}")
    print(f"{'='*60}")
    
    png_files = list(Path(folder_path).glob('*.png'))
    
    if not png_files:
        print("  No PNG files found")
        return 0, 0
    
    total_png_size = 0
    total_webp_size = 0
    converted_count = 0
    
    for png_file in png_files:
        webp_path, png_size, webp_size = convert_png_to_webp(str(png_file))
        if webp_path:
            total_png_size += png_size
            total_webp_size += webp_size
            converted_count += 1
    
    print(f"\n📊 Folder Summary:")
    print(f"   Converted: {converted_count} images")
    print(f"   Total PNG size: {total_png_size:.2f}MB")
    print(f"   Total WebP size: {total_webp_size:.2f}MB")
    print(f"   Saved: {(total_png_size - total_webp_size):.2f}MB ({((total_png_size - total_webp_size)/total_png_size*100):.1f}%)")
    
    return total_png_size, total_webp_size

def main():
    """Main optimization function"""
    print("\n" + "="*60)
    print("  FORESTA WEBSITE - IMAGE OPTIMIZATION")
    print("  Converting PNG → WebP for faster loading")
    print("="*60)
    
    # Base path
    base_path = r"d:\Foresta Website from Scratch\assets"
    
    # Folders to process
    folders = [
        "Lami gloss front images",
        "Lami Gloss kitchen images",
        "Lami matt front images",
        "Lami Matt kitchen images",
        "Marble and acrylic images",
        "Marble and acrylic kitchen images"
    ]
    
    # Create backup first
    print("\n🔄 Step 1: Creating backup of original files...")
    backup_originals(base_path, folders)
    
    # Process each folder
    print("🔄 Step 2: Converting images to WebP...")
    
    grand_total_png = 0
    grand_total_webp = 0
    
    for folder in folders:
        folder_path = os.path.join(base_path, folder)
        if os.path.exists(folder_path):
            png_size, webp_size = optimize_folder(folder_path)
            grand_total_png += png_size
            grand_total_webp += webp_size
    
    # Final summary
    print("\n" + "="*60)
    print("  OPTIMIZATION COMPLETE!")
    print("="*60)
    print(f"\n📊 Overall Results:")
    print(f"   Original PNG size: {grand_total_png:.2f}MB")
    print(f"   New WebP size: {grand_total_webp:.2f}MB")
    print(f"   Total saved: {(grand_total_png - grand_total_webp):.2f}MB")
    print(f"   Reduction: {((grand_total_png - grand_total_webp)/grand_total_png*100):.1f}%")
    
    print(f"\n✓ Original PNG files backed up to: assets/_original_pngs_backup/")
    print(f"✓ WebP files created alongside PNG files")
    print(f"\n⚠️  Next step: Update HTML to use WebP images")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
