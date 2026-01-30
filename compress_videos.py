"""
Video Compression Script for Foresta Website
Compresses MP4 videos to reduce file size while maintaining quality
Requires ffmpeg to be installed: https://ffmpeg.org/download.html
"""

import os
import subprocess
from pathlib import Path

def check_ffmpeg():
    """Check if ffmpeg is installed"""
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def get_file_size_mb(filepath):
    """Get file size in MB"""
    return os.path.getsize(filepath) / (1024 * 1024)

def compress_video(input_path, output_path, crf=28):
    """
    Compress video using H.264 codec
    Args:
        input_path: Path to input video
        output_path: Path to output video
        crf: Constant Rate Factor (18-28, lower = better quality, larger file)
    """
    try:
        # FFmpeg command for web-optimized video
        command = [
            'ffmpeg',
            '-i', input_path,
            '-c:v', 'libx264',           # H.264 codec
            '-crf', str(crf),            # Quality level
            '-preset', 'slow',           # Better compression
            '-c:a', 'aac',               # Audio codec
            '-b:a', '128k',              # Audio bitrate
            '-movflags', '+faststart',   # Enable streaming
            '-vf', 'scale=1920:1080',    # Max resolution 1080p
            '-y',                        # Overwrite output
            output_path
        ]
        
        print(f"   Compressing video...")
        result = subprocess.run(command, capture_output=True, text=True)
        
        if result.returncode == 0:
            return True
        else:
            print(f"   Error: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"   Error: {str(e)}")
        return False

def main():
    print("\n" + "="*60)
    print("  FORESTA WEBSITE - VIDEO COMPRESSION")
    print("  Optimizing videos for faster web loading")
    print("="*60 + "\n")
    
    # Check if ffmpeg is installed
    if not check_ffmpeg():
        print("❌ ERROR: ffmpeg is not installed or not in PATH")
        print("\n📥 Please install ffmpeg:")
        print("   1. Download from: https://ffmpeg.org/download.html")
        print("   2. Or install via: winget install ffmpeg")
        print("   3. Or use: choco install ffmpeg")
        print("\n" + "="*60 + "\n")
        return
    
    print("✓ ffmpeg found\n")
    
    # Videos to compress
    videos = [
        {
            'input': r'd:\Foresta Website from Scratch\assets\Foresta_video.mp4',
            'output': r'd:\Foresta Website from Scratch\assets\Foresta_video_compressed.mp4',
            'crf': 28  # Good balance for hero video
        },
        {
            'input': r'd:\Foresta Website from Scratch\assets\about us video.mp4',
            'output': r'd:\Foresta Website from Scratch\assets\about us video_compressed.mp4',
            'crf': 26  # Slightly better quality for shorter video
        }
    ]
    
    total_original = 0
    total_compressed = 0
    
    for video in videos:
        input_path = video['input']
        output_path = video['output']
        
        if not os.path.exists(input_path):
            print(f"⚠️  Skipping {Path(input_path).name} - file not found\n")
            continue
        
        print(f"{'='*60}")
        print(f"Processing: {Path(input_path).name}")
        print(f"{'='*60}")
        
        original_size = get_file_size_mb(input_path)
        print(f"   Original size: {original_size:.2f}MB")
        
        success = compress_video(input_path, output_path, video['crf'])
        
        if success and os.path.exists(output_path):
            compressed_size = get_file_size_mb(output_path)
            reduction = ((original_size - compressed_size) / original_size) * 100
            
            print(f"   ✓ Compressed size: {compressed_size:.2f}MB")
            print(f"   ✓ Reduced by: {reduction:.1f}%\n")
            
            total_original += original_size
            total_compressed += compressed_size
        else:
            print(f"   ✗ Compression failed\n")
    
    if total_compressed > 0:
        print("="*60)
        print("  COMPRESSION COMPLETE!")
        print("="*60)
        print(f"\n📊 Overall Results:")
        print(f"   Original: {total_original:.2f}MB")
        print(f"   Compressed: {total_compressed:.2f}MB")
        print(f"   Saved: {(total_original - total_compressed):.2f}MB ({((total_original - total_compressed)/total_original*100):.1f}%)")
        print(f"\n⚠️  Next steps:")
        print(f"   1. Test the compressed videos")
        print(f"   2. If quality is good, replace original files")
        print(f"   3. Or use compressed versions in HTML directly")
        print("="*60 + "\n")

if __name__ == "__main__":
    main()
