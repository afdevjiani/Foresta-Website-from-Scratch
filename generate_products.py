import os
import re
import urllib.parse

def extract_code_and_name(filename):
    """Extract color name and code from filename"""
    name = filename.replace('.png', '').replace('.webp', '')
    
    # Match FWI code pattern with various formats
    code_match = re.search(r'FWI\s*[-]?\s*(\d+)\s*[-]?\s*(\d+)', name)
    if code_match:
        code = f"FWI-{code_match.group(1).zfill(2)}-{code_match.group(2)}"
        # Get color name - everything before the FWI part
        color_name = re.sub(r'\s*[-]?\s*FWI.*', '', name).strip().strip('-').strip().upper()
        return color_name, code, filename
    return None, None, filename

def generate_product_html(category, space, color_name, code, front_image, preview_text="Preview"):
    """Generate HTML for a single product"""
    encoded_name = urllib.parse.quote(color_name)
    encoded_file = urllib.parse.quote(front_image)
    
    if category == "lami-gloss":
        folder = "Lami%20gloss%20front%20images"
        type_name = "Lami%20Gloss"
    elif category == "lami-matt":
        folder = "Lami%20matt%20front%20images"
        type_name = "Lami%20Matt"
    else:
        return ""
    
    # Use front image as the preview fallback (shows on hover/swipe)
    preview_alt = space.rstrip('s').title() + " Preview"

    return f'''            <div class="color-item" data-category="{category}" data-space="{space}" onclick="window.location.href='color-detail.html?name={encoded_name}&code={code}&image=assets/{folder}/{encoded_file}&type={type_name}&space={space}'">
              <div class="color-item-image-wrapper">
                <picture>
                  <img class="color-swatch" src="assets/{folder}/{encoded_file}" alt="{color_name}" loading="lazy">
                </picture>
                <picture>
                  <img class="kitchen-preview" src="assets/{folder}/{encoded_file}" alt="{preview_alt}" loading="lazy">
                </picture>
              </div>
              <p class="color-code">{code}</p><p class="color-name">{color_name}</p>
            </div>
'''

# Get all Lami Gloss files
gloss_folder = "assets/Lami gloss front images"
gloss_files = [f for f in os.listdir(gloss_folder) if f.endswith('.png')]

# Get all Lami Matt files
matt_folder = "assets/Lami matt front images"
matt_files = [f for f in os.listdir(matt_folder) if f.endswith('.png')]

print(f"Found {len(gloss_files)} Lami Gloss files")
print(f"Found {len(matt_files)} Lami Matt files")

# Generate HTML for all products
all_html = ""

# Kitchen section
all_html += "            <!-- ========== KITCHEN PRODUCTS ========== -->\n"
all_html += "            <!-- Lami Gloss Colors - Kitchen -->\n"
for f in sorted(gloss_files):
    color_name, code, filename = extract_code_and_name(f)
    if color_name and code:
        all_html += generate_product_html("lami-gloss", "kitchens", color_name, code, f)

all_html += "\n            <!-- Lami Matt Colors - Kitchen -->\n"
for f in sorted(matt_files):
    color_name, code, filename = extract_code_and_name(f)
    if color_name and code:
        all_html += generate_product_html("lami-matt", "kitchens", color_name, code, f)

# Wardrobes section
all_html += "\n            <!-- ========== WARDROBE PRODUCTS ========== -->\n"
all_html += "            <!-- Lami Gloss Colors - Wardrobe -->\n"
for f in sorted(gloss_files):
    color_name, code, filename = extract_code_and_name(f)
    if color_name and code:
        all_html += generate_product_html("lami-gloss", "wardrobes", color_name, code, f)

all_html += "\n            <!-- Lami Matt Colors - Wardrobe -->\n"
for f in sorted(matt_files):
    color_name, code, filename = extract_code_and_name(f)
    if color_name and code:
        all_html += generate_product_html("lami-matt", "wardrobes", color_name, code, f)

# Bedrooms section
all_html += "\n            <!-- ========== BEDROOM PRODUCTS ========== -->\n"
all_html += "            <!-- Lami Gloss Colors - Bedroom -->\n"
for f in sorted(gloss_files):
    color_name, code, filename = extract_code_and_name(f)
    if color_name and code:
        all_html += generate_product_html("lami-gloss", "bedrooms", color_name, code, f)

all_html += "\n            <!-- Lami Matt Colors - Bedroom -->\n"
for f in sorted(matt_files):
    color_name, code, filename = extract_code_and_name(f)
    if color_name and code:
        all_html += generate_product_html("lami-matt", "bedrooms", color_name, code, f)

# Get all Marble & Acrylic files
marble_folder = "assets/Marble and acrylic images"
marble_files = [f for f in os.listdir(marble_folder) if f.endswith('.png')]

def generate_marble_html(space, code, preview_folder):
    """Generate HTML for marble/acrylic product"""
    encoded_code = urllib.parse.quote(code)
    preview_alt = space.rstrip('s').title() + " Preview"
    
    return f'''            <div class="color-item" data-category="marble-acrylic" data-space="{space}" onclick="window.location.href='color-detail.html?name=Marble%20Pattern%20{code}&code={code}&image=assets/Marble%20and%20acrylic%20images/{code}.png&type=Marble%20%26%20Acrylic&space={space}'">
              <div class="color-item-image-wrapper">
                <picture>
                  <img class="color-swatch" src="assets/Marble%20and%20acrylic%20images/{code}.png" alt="Marble Pattern {code}" loading="lazy">
                </picture>
                <picture>
                  <img class="kitchen-preview" src="assets/Marble%20and%20acrylic%20images/{code}.png" alt="{preview_alt}" loading="lazy">
                </picture>
              </div>
              <p class="color-code">{code}</p><p class="color-name">Marble Pattern {code}</p>
            </div>
'''

# Add Marble & Acrylic for each space
for space in ["kitchens", "wardrobes", "bedrooms"]:
    all_html += f"\n            <!-- Marble & Acrylic Colors - {space.title()} -->\n"
    for f in sorted(marble_files):
        code = f.replace('.png', '')
        all_html += generate_marble_html(space, code, f"assets/Marble and acrylic {space} images")

# Save to file
with open('generated_products.html', 'w', encoding='utf-8') as f:
    f.write(all_html)

print(f"Found {len(marble_files)} Marble & Acrylic files")
print(f"\nGenerated HTML saved to generated_products.html")
print(f"Total lines: {len(all_html.splitlines())}")
