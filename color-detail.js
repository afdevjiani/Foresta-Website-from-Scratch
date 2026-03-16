// Color Detail Page JavaScript
class ColorDetailPage {
    constructor() {
        this.urlParams = new URLSearchParams(window.location.search);
        this.categoryId = this.urlParams.get('category');
        this.designId = this.urlParams.get('design');
        this.colorId = this.urlParams.get('color');
        
        // Get additional params passed from gallery
        this.colorName = this.urlParams.get('name');
        this.colorCode = this.urlParams.get('code');
        this.colorImage = this.urlParams.get('image');
        this.colorType = this.urlParams.get('type');
        
        // Product data structure (same as configurator)
        this.categories = {
            kitchen: {
                name: 'Kitchen',
                designs: {
                    'modern-modular': {
                        name: 'Modern Modular Kitchen',
                        description: 'Sleek contemporary design with smart storage',
                        baseImage: 'assets/product images/Product Catalogs/Lami Gloss Catalog.jpg',
                        colors: [
                            { id: 'glossy-white', name: 'Glossy White', hex: '#FFFFFF', sample: 'assets/product images/Color Palettes/Lami Gloss Color Range.png' },
                            { id: 'glossy-black', name: 'Glossy Black', hex: '#1a1a1a', sample: 'assets/product images/Color Palettes/Lami Gloss Color Range1.png' },
                            { id: 'glossy-grey', name: 'Glossy Grey', hex: '#808080' },
                            { id: 'glossy-beige', name: 'Glossy Beige', hex: '#D4C5B9' }
                        ]
                    },
                    'classic-wood': {
                        name: 'Classic Wood Kitchen',
                        description: 'Timeless wooden finish with elegant details',
                        baseImage: 'assets/Lami matt 2.0/FWI-10-101 ICEBERG WHITE MATT.png',
                        colors: [
                            { id: 'fwi-10-101', name: 'Iceberg White Matt', code: 'FWI-10-101', hex: '#E8E4DD', sample: 'assets/lami Matt Color Range/ICEBERG WHITE MATT FWI-10-101.png', previewImage: 'assets/Lami matt 2.0/FWI-10-101 ICEBERG WHITE MATT.png' },
                            { id: 'fwi-04-113', name: 'Acacia Gray', code: 'FWI-04-113', hex: '#9B9B9B', sample: 'assets/lami Matt Color Range/ACACIA GRAY FWI-04-113.png', previewImage: 'assets/Lami matt 2.0/FWI-04-113 ACACIA GRAY (2).png' },
                            { id: 'fwi-04-138', name: 'Almond Yellow', code: 'FWI-04-138', hex: '#D9A75A', sample: 'assets/lami Matt Color Range/ALMOND YELLOW FWI-04-138.png', previewImage: 'assets/Lami matt 2.0/FWI-04-138 ALMOND YELLOW.png' },
                            { id: 'fwi-04-121', name: 'Sapphire Blue', code: 'FWI-04-121', hex: '#3A5A7C', sample: 'assets/lami Matt Color Range/SAPPHIRE BLUE FWI-04-121.png', previewImage: 'assets/Lami matt 2.0/Sapphire Blue FWI-04-121.png' }
                        ]
                    },
                    'luxury-marble': {
                        name: 'Luxury Marble Kitchen',
                        description: 'Premium marble finish for sophisticated spaces',
                        baseImage: 'assets/product images/Product Catalogs/Marble And Acrylic Catalog.png',
                        colors: [
                            { id: 'white-marble', name: 'White Marble', hex: '#F8F8FF', sample: 'assets/product images/Color Palettes/Marble And Acrylic Color Range.png' },
                            { id: 'black-marble', name: 'Black Marble', hex: '#2C2C2C', sample: 'assets/product images/Color Palettes/Marble And Acrylic Color Range1.png' },
                            { id: 'grey-marble', name: 'Grey Marble', hex: '#A9A9A9' },
                            { id: 'gold-marble', name: 'Gold Marble', hex: '#D4AF37' }
                        ]
                    }
                }
            },
            bedroom: {
                name: 'Bedroom',
                designs: {
                    'modern-bedroom': {
                        name: 'Modern Bedroom Set',
                        description: 'Contemporary bedroom furniture with clean lines',
                        baseImage: 'assets/product images/Product Catalogs/Lami Gloss Catalog1.png',
                        colors: [
                            { id: 'glossy-white', name: 'Glossy White', hex: '#FFFFFF', sample: 'assets/product images/Color Palettes/Lami Gloss Color Range.png' },
                            { id: 'glossy-cream', name: 'Glossy Cream', hex: '#FFFDD0' },
                            { id: 'glossy-grey', name: 'Glossy Grey', hex: '#808080' }
                        ]
                    },
                    'classic-bedroom': {
                        name: 'Classic Wooden Bedroom',
                        description: 'Traditional wooden bedroom with timeless appeal',
                        baseImage: 'assets/product images/Product Catalogs/Lami Matt catalog1.png',
                        colors: [
                            { id: 'matt-walnut', name: 'Matt Walnut', hex: '#5C4033', sample: 'assets/product images/Color Palettes/Lami Matt Color Range .png' },
                            { id: 'matt-mahogany', name: 'Matt Mahogany', hex: '#C04000' },
                            { id: 'matt-oak', name: 'Matt Oak', hex: '#C19A6B' }
                        ]
                    },
                    'luxury-bedroom': {
                        name: 'Luxury Premium Bedroom',
                        description: 'High-end bedroom with premium finishes',
                        baseImage: 'assets/product images/Product Catalogs/Marble And Acrylic Catalog1.png',
                        colors: [
                            { id: 'white-marble', name: 'White Marble', hex: '#F8F8FF', sample: 'assets/product images/Color Palettes/Marble And Acrylic Color Range.png' },
                            { id: 'champagne', name: 'Champagne', hex: '#F7E7CE' },
                            { id: 'pearl', name: 'Pearl White', hex: '#EAE6CA' }
                        ]
                    }
                }
            },
            wardrobe: {
                name: 'Wardrobe',
                designs: {
                    'sliding-wardrobe': {
                        name: 'Modern Sliding Wardrobe',
                        description: 'Space-saving sliding door wardrobe',
                        baseImage: 'assets/product images/Product Catalogs/Lami Gloss Catalog.jpg',
                        colors: [
                            { id: 'glossy-white', name: 'Glossy White', hex: '#FFFFFF', sample: 'assets/product images/Color Palettes/Lami Gloss Color Range.png' },
                            { id: 'glossy-black', name: 'Glossy Black', hex: '#1a1a1a' },
                            { id: 'glossy-mirror', name: 'Mirror Finish', hex: '#E8E8E8' }
                        ]
                    },
                    'hinged-wardrobe': {
                        name: 'Classic Hinged Wardrobe',
                        description: 'Traditional hinged door wardrobe',
                        baseImage: 'assets/product images/Product Catalogs/Lami Matt catalog1.png',
                        colors: [
                            { id: 'matt-walnut', name: 'Matt Walnut', hex: '#5C4033', sample: 'assets/product images/Color Palettes/Lami Matt Color Range .png' },
                            { id: 'matt-oak', name: 'Matt Oak', hex: '#C19A6B' },
                            { id: 'matt-cherry', name: 'Matt Cherry', hex: '#722F37' }
                        ]
                    },
                    'walk-in-wardrobe': {
                        name: 'Luxury Walk-in Wardrobe',
                        description: 'Premium walk-in closet system',
                        baseImage: 'assets/product images/Product Catalogs/Marble And Acrylic Catalog1.png',
                        colors: [
                            { id: 'white-marble', name: 'White Marble', hex: '#F8F8FF', sample: 'assets/product images/Color Palettes/Marble And Acrylic Color Range.png' },
                            { id: 'gold-accent', name: 'Gold Accent', hex: '#D4AF37' },
                            { id: 'champagne', name: 'Champagne', hex: '#F7E7CE' }
                        ]
                    }
                }
            }
        };
    }

    init() {
        // Check if we have direct gallery parameters
        if (this.colorName && this.colorImage) {
            this.loadDirectColorDetails();
            this.setupEventListeners();
            return;
        }
        
        // Otherwise, check for configurator parameters
        if (!this.categoryId || !this.designId || !this.colorId) {
            this.showError();
            return;
        }

        this.loadColorDetails();
        this.setupEventListeners();
    }

    loadColorDetails() {
        // If we have direct parameters from gallery, use those
        if (this.colorName && this.colorImage) {
            this.loadDirectColorDetails();
            return;
        }
        
        // Otherwise, use configurator data structure
        const category = this.categories[this.categoryId];
        if (!category) {
            this.showError();
            return;
        }

        const design = category.designs[this.designId];
        if (!design) {
            this.showError();
            return;
        }

        const color = design.colors.find(c => c.id === this.colorId);
        if (!color) {
            this.showError();
            return;
        }

        // Update page content
        this.updateBreadcrumb(category, design);
        this.updateTitle(color);
        this.updateMainImage(color);
        this.updateColorSwatch(color);
        this.updateInfo(category, design, color);
        this.updateSpecifications(design);
        this.loadRelatedColors(design, color);
    }

    loadDirectColorDetails() {
        // Load color details from URL parameters (from gallery)
        const colorData = {
            name: decodeURIComponent(this.colorName),
            code: decodeURIComponent(this.colorCode),
            image: decodeURIComponent(this.colorImage),
            type: decodeURIComponent(this.colorType),
            hex: '#808080' // Default hex
        };
        
        // Update breadcrumb
        const breadcrumb = document.getElementById('colorBreadcrumb');
        if (breadcrumb) {
            breadcrumb.innerHTML = `<span>${colorData.type}</span> / <span>Color Range</span>`;
        }
        
        // Update title
        this.updateTitleDirect(colorData);
        this.updateMainImageDirect(colorData);
        this.updateColorSwatchDirect(colorData);
        this.updateInfoDirect(colorData);
        this.updateSpecificationsDirect(colorData);
        // No related colors for gallery view
    }

    updateBreadcrumb(category, design) {
        const breadcrumb = document.getElementById('colorBreadcrumb');
        if (breadcrumb) {
            breadcrumb.innerHTML = `<span>${category.name}</span> / <span>${design.name}</span>`;
        }
    }

    updateTitle(color) {
        const title = document.getElementById('colorTitle');
        const code = document.getElementById('colorCode');
        
        if (title) {
            title.textContent = color.name;
        }
        
        if (code && color.code) {
            code.textContent = `Code: ${color.code}`;
        }

        // Update page title
        document.title = `${color.name} - Foresta Wood Industries`;
    }

    updateMainImage(color) {
        const mainImage = document.getElementById('mainColorImage');
        if (mainImage) {
            const imageSrc = color.previewImage || color.sample || color.hex;
            if (imageSrc.startsWith('#')) {
                // If hex color, use as background
                mainImage.style.display = 'none';
                mainImage.parentElement.style.background = imageSrc;
            } else {
                mainImage.src = imageSrc;
                mainImage.alt = color.name;
            }
        }
    }

    updateColorSwatch(color) {
        const swatch = document.getElementById('colorSwatch');
        if (swatch) {
            swatch.style.background = color.hex;
        }
    }

    updateInfo(category, design, color) {
        document.getElementById('categoryInfo').textContent = category.name;
        document.getElementById('colorInfo').textContent = color.name;
        document.getElementById('codeInfo').textContent = color.code || color.id.toUpperCase();
        
        // Determine finish type based on color name
        let finish = 'Premium Finish';
        if (color.name.toLowerCase().includes('gloss')) {
            finish = 'Glossy';
        } else if (color.name.toLowerCase().includes('matt') || color.name.toLowerCase().includes('matte')) {
            finish = 'Matte';
        } else if (color.name.toLowerCase().includes('marble')) {
            finish = 'Marble';
        }
        
        document.getElementById('finishInfo').textContent = finish;
        
        // Update surface spec
        document.getElementById('surfaceSpec').textContent = `${finish} Laminate`;
    }

    updateSpecifications(design) {
        // Specifications are mostly static, but can be customized per design if needed
        // Currently using default values from HTML
    }

    // Direct update methods for gallery-sourced colors
    updateTitleDirect(colorData) {
        const title = document.getElementById('colorTitle');
        const code = document.getElementById('colorCode');
        
        if (title) {
            title.textContent = colorData.name;
        }
        
        if (code && colorData.code) {
            code.textContent = `Code: ${colorData.code}`;
        }

        // Update page title
        document.title = `${colorData.name} - Foresta Wood Industries`;
    }

    updateMainImageDirect(colorData) {
        const mainImage = document.getElementById('mainColorImage');
        const kitchenImage = document.getElementById('kitchenPreviewImage');
        
        if (mainImage && colorData.image) {
            mainImage.src = colorData.image;
            mainImage.alt = colorData.name;
        }
        
        // Load kitchen preview image
        if (kitchenImage && colorData.image) {
            const kitchenPath = this.getKitchenImagePath(colorData.image, colorData.type);
            if (kitchenPath) {
                kitchenImage.src = kitchenPath;
                kitchenImage.alt = `${colorData.name} Kitchen Preview`;
            }
        }
    }
    
    getKitchenImagePath(colorImagePath, type) {
        // Extract filename from color image path
        const filename = colorImagePath.split('/').pop();
        
        // Determine kitchen images folder based on type
        if (type && type.toLowerCase().includes('gloss')) {
            // Lami Gloss has different naming convention for some images
            const codeMatch = filename.match(/FWI[-\s]*(\d{2})[-\s]*(\d{3})/i);
            
            if (codeMatch) {
                const code = `FWI-${codeMatch[1]}-${codeMatch[2]}`;
                
                // Map to known kitchen image filenames
                const glossKitchenMap = {
                    'FWI-03-103': 'CREAM -  FWI-03-103.png',
                    'FWI-03-108': 'FANTASY BLUE FWI-03-108.png',
                    'FWI-03-113': 'ACACIA GRAY - FWI-03-113.png',
                    'FWI-03-116': 'CARDAMOM GREEN FWI-03-116.png',
                    'FWI-03-117': 'PUMPKIN RED - FWI-03-117.png',
                    'FWI-03-118': 'carmine red FWI-03-118.webp',
                    'FWI-03-130': 'CRYSTAL GRAY FWI-03-130.png',
                    'FWI-07-107': 'PURE GRAY GLITTER  - FWI-07-107.png',
                    'FWI-07-116': 'CARDAMOM GREEN GLITTER FWI-07-116.png',
                    'FWI-09-142': 'BRONZE GOLD GLOSS  FWI-09-142.png'
                };
                
                const kitchenFilename = glossKitchenMap[code];
                if (kitchenFilename) {
                    return `assets/Lami Gloss kitchen images/${kitchenFilename}`;
                }
            }
            // Fallback to same filename
            return `assets/Lami Gloss kitchen images/${filename}`;
        } else if (type && type.toLowerCase().includes('matt')) {
            // Lami Matt has different naming convention
            // Front: "ALMOND YELLOW - FWI - 04-138.png"
            // Kitchen: "FWI-04-138 ALMOND YELLOW.png"
            const codeMatch = filename.match(/FWI[-\s]*(\d{2})[-\s]*(\d{3})/i);
            const nameMatch = filename.match(/^([^-]+)/);
            
            if (codeMatch && nameMatch) {
                const code = `FWI-${codeMatch[1]}-${codeMatch[2]}`;
                const colorName = nameMatch[1].trim();
                
                // Map to known kitchen image filenames
                const mattKitchenMap = {
                    'FWI-04-113': 'FWI-04-113 ACACIA GRAY (2).png',
                    'FWI-04-138': 'FWI-04-138 ALMOND YELLOW.png',
                    'FWI-03-101': 'FWI-10-101 ICEBERG WHITE MATT.png',
                    'FWI-10-101': 'FWI-10-101 ICEBERG WHITE MATT.png',
                    'FWI-10-142': 'Bronze Gold Matt -  FWI-10-142.png',
                    'FWI-04-121': 'Sapphire Blue FWI-04-121.png'
                };
                
                const kitchenFilename = mattKitchenMap[code];
                if (kitchenFilename) {
                    return `assets/Lami Matt kitchen images/${kitchenFilename}`;
                }
            }
            return null;
        } else if (type && type.toLowerCase().includes('marble') || type && type.toLowerCase().includes('acrylic')) {
            // For marble, extract just the FMA number
            const match = filename.match(/FMA[-]?(\d+)/i);
            if (match) {
                return `assets/Marble and acrylic kitchen images/FMA-${match[1].padStart(2, '0')}.png`;
            }
        }
        return null;
    }

    updateColorSwatchDirect(colorData) {
        const swatch = document.getElementById('colorSwatch');
        if (swatch) {
            swatch.style.background = colorData.hex;
        }
    }

    updateInfoDirect(colorData) {
        document.getElementById('categoryInfo').textContent = colorData.type || 'Premium Collection';
        document.getElementById('colorInfo').textContent = colorData.name;
        document.getElementById('codeInfo').textContent = colorData.code || '-';
        
        // Determine finish type based on color type
        let finish = 'Premium Finish';
        if (colorData.type && colorData.type.toLowerCase().includes('gloss')) {
            finish = 'Glossy';
        } else if (colorData.type && colorData.type.toLowerCase().includes('matt')) {
            finish = 'Matte';
        } else if (colorData.type && colorData.type.toLowerCase().includes('marble')) {
            finish = 'Marble';
        }
        
        document.getElementById('finishInfo').textContent = finish;
        
        // Update surface spec
        document.getElementById('surfaceSpec').textContent = `${finish} Laminate`;
    }

    updateSpecificationsDirect(colorData) {
        // Use default specifications from HTML
    }

    loadRelatedColors(design, currentColor) {
        const relatedGrid = document.getElementById('relatedColorsGrid');
        if (!relatedGrid) return;

        relatedGrid.innerHTML = '';

        // Get other colors from the same design (exclude current)
        const relatedColors = design.colors.filter(c => c.id !== currentColor.id);

        relatedColors.forEach(color => {
            const card = this.createRelatedColorCard(color);
            relatedGrid.appendChild(card);
        });
    }

    createRelatedColorCard(color) {
        const card = document.createElement('div');
        card.className = 'related-color-card';
        
        const imageSrc = color.sample || color.previewImage || '';
        const imageHTML = imageSrc ? 
            `<div class="related-color-image"><img src="${imageSrc}" alt="${color.name}"></div>` :
            `<div class="related-color-image" style="background: ${color.hex}; aspect-ratio: 1;"></div>`;

        card.innerHTML = `
            ${imageHTML}
            <div class="related-color-info">
                <p class="related-color-name">${color.name}</p>
                ${color.code ? `<p class="related-color-code">${color.code}</p>` : ''}
            </div>
        `;

        card.addEventListener('click', () => {
            // Navigate to this color's detail page
            const url = `color-detail.html?category=${this.categoryId}&design=${this.designId}&color=${color.id}`;
            window.location.href = url;
        });

        return card;
    }

    showError() {
        document.getElementById('colorTitle').textContent = 'Color Not Found';
        document.querySelector('.color-content-grid').innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <p style="font-size: 1.2rem; color: #666;">The requested color could not be found.</p>
                <button class="btn-primary" onclick="window.location.href='index-luxury.html#catalog'" style="margin-top: 2rem;">
                    <span>Back to Catalog</span>
                </button>
            </div>
        `;
    }

    setupEventListeners() {
        // Image gallery click to change main image
        const galleryImages = document.querySelectorAll('.gallery-image');
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                const mainImage = document.getElementById('mainColorImage');
                if (mainImage) {
                    mainImage.src = img.querySelector('img').src;
                }
            });
        });
    }
}

// Global functions for button actions
function requestColorQuote() {
    const colorTitle = document.getElementById('colorTitle').textContent;
    const colorCode = document.getElementById('codeInfo').textContent;
    
    // Open quote modal
    const modal = document.getElementById('quoteModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Pre-fill product details
    document.getElementById('quoteColor').value = colorTitle;
    document.getElementById('quoteCode').value = colorCode;
}

function closeQuoteModal() {
    const modal = document.getElementById('quoteModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    document.getElementById('quoteForm').reset();
}

// Contact Modal Functions
function openContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    document.getElementById('contactForm').reset();
}

function bookAppointment() {
    const colorTitle = document.getElementById('colorTitle').textContent;
    const colorCode = document.getElementById('codeInfo').textContent;
    
    // Redirect to contact section or booking page
    window.location.href = 'index-luxury.html#contact';
}

// ─── Detail page comparison slider (mobile only) ───
function initDetailComparisonSlider() {
  if (window.innerWidth > 1024) return;

  var container = document.querySelector('.main-image-container');
  var wrapper = container && container.querySelector('.image-wrapper-detail');
  var afterImg = container && container.querySelector('.kitchen-preview-detail');
  if (!wrapper || !afterImg) return;

  var retryCount = 0;
  var maxRetries = 30; // 30 * 300ms = 9 seconds max wait

  function tryInit() {
    retryCount++;
    // Check if kitchen image src has been set by the page init
    var src = afterImg.getAttribute('src');
    if (!src || src === '') {
      if (retryCount < maxRetries) {
        setTimeout(tryInit, 300);
      }
      return;
    }
    // Wait for image to actually load
    if (afterImg.complete && afterImg.naturalWidth > 0) {
      buildSlider();
    } else {
      afterImg.addEventListener('load', function onLoad() {
        afterImg.removeEventListener('load', onLoad);
        buildSlider();
      });
      afterImg.addEventListener('error', function onErr() {
        afterImg.removeEventListener('error', onErr);
        // Kitchen image failed to load, don't show slider
      });
    }
  }

  function buildSlider() {
    // Mark kitchen image as ready for display
    afterImg.classList.add('slider-ready');

    // Create handle
    var handle = document.createElement('div');
    handle.className = 'detail-slider-handle';
    wrapper.appendChild(handle);

    let isDragging = false, touchStartX = null, touchStartY = null;
    let scrollIntentDetermined = false, isHorizontalDrag = false;

    function update(pct) {
      pct = Math.max(2, Math.min(98, pct));
      afterImg.style.transform = `translate3d(${pct - 100}%, 0, 0)`;
      handle.style.left = pct + '%';
    }

    // Set initial position
    update(50);

    // Touch
    wrapper.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      scrollIntentDetermined = false;
      isHorizontalDrag = false;
    }, { passive: true });

    wrapper.addEventListener('touchmove', function(e) {
      if (!touchStartX) return;
      const tx = e.touches[0].clientX, ty = e.touches[0].clientY;
      const dx = Math.abs(tx - touchStartX), dy = Math.abs(ty - touchStartY);
      if (!scrollIntentDetermined) {
        if (dx < 6 && dy < 6) return;
        if (dy > dx || dy > 10) { scrollIntentDetermined = true; isHorizontalDrag = false; return; }
        if (dx > 15 && dx > dy * 3) { scrollIntentDetermined = true; isHorizontalDrag = true; }
        else return;
      }
      if (isHorizontalDrag) {
        e.preventDefault();
        isDragging = true;
        const rect = wrapper.getBoundingClientRect();
        update((tx - rect.left) / rect.width * 100);
      }
    }, { passive: false });

    wrapper.addEventListener('touchend', function() {
      isDragging = false; touchStartX = null; touchStartY = null;
    }, { passive: true });

    // Mouse
    wrapper.addEventListener('mousedown', function(e) { e.preventDefault(); isDragging = true; });
    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      const rect = wrapper.getBoundingClientRect();
      update((e.clientX - rect.left) / rect.width * 100);
    });
    document.addEventListener('mouseup', function() { isDragging = false; });

    // Auto-demo
    const obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        obs.disconnect();
        setTimeout(function() {
          afterImg.style.transition = 'transform 0.4s cubic-bezier(.4,0,.2,1)';
          handle.style.transition = 'left 0.4s cubic-bezier(.4,0,.2,1)';
          update(75);
          setTimeout(function() { update(25); }, 500);
          setTimeout(function() {
            update(50);
            setTimeout(function() {
              afterImg.style.transition = 'none';
              handle.style.transition = 'none';
            }, 450);
          }, 1000);
        }, 300);
      }
    }, { threshold: 0.5 });
    obs.observe(container);
  }

  tryInit();
}

// Initialize page when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const colorDetailPage = new ColorDetailPage();
        colorDetailPage.init();
        initQuoteForm();
        initContactForm();
        setTimeout(initDetailComparisonSlider, 500);
    });
} else {
    const colorDetailPage = new ColorDetailPage();
    colorDetailPage.init();
    initQuoteForm();
    initContactForm();
    setTimeout(initDetailComparisonSlider, 500);
}

// Handle quote form submission
function initQuoteForm() {
    const form = document.getElementById('quoteForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('quoteName').value;
        const phone = document.getElementById('quotePhone').value;
        const company = document.getElementById('quoteCompany').value;
        const color = document.getElementById('quoteColor').value;
        const code = document.getElementById('quoteCode').value;
        const size = document.getElementById('quoteSize').value;
        const quantity = document.getElementById('quoteQuantity').value;
        
        // Get current date
        const currentDate = new Date().toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        });
        
        // Create WhatsApp message with improved formatting
        const messageText = `🏢 *FORESTA WOOD INDUSTRIES*\n` +
                           `📋 Quote Request from Website\n\n` +
                           `━━━━━━━━━━━━━━━━━━\n` +
                           `👤 *Customer Details*\n` +
                           `• Name: ${name}\n` +
                           `• Phone: ${phone}\n` +
                           `• Company: ${company || 'N/A'}\n\n` +
                           `🎨 *Product Information*\n` +
                           `• Color: ${color}\n` +
                           `• Code: ${code}\n` +
                           `• Size: ${size}\n` +
                           `• Quantity: ${quantity} panels\n\n` +
                           `━━━━━━━━━━━━━━━━━━\n` +
                           `⏰ Request Date: ${currentDate}\n\n` +
                           `💬 Please provide quotation and delivery timeline.`;
        
        // Encode the entire message properly
        const encodedMessage = encodeURIComponent(messageText);
        
        // Foresta WhatsApp Business number (with country code)
        const whatsappNumber = '923282216497';
        
        // Use WhatsApp API link - proper format
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp in new window
        const whatsappWindow = window.open(whatsappLink, '_blank');
        
        // Check if popup was blocked
        if (!whatsappWindow || whatsappWindow.closed || typeof whatsappWindow.closed === 'undefined') {
            // Popup blocked, try direct navigation
            window.location.href = whatsappLink;
        }
        
        // Close modal
        setTimeout(() => {
            closeQuoteModal();
            // Show success message
            alert('Redirecting to WhatsApp. Our team will respond to your quote request shortly!');
        }, 500);
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeQuoteModal();
            closeContactModal();
        }
    });
}

// Handle contact form submission
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const phone = document.getElementById('contactPhone').value;
        const company = document.getElementById('contactCompany').value;
        const message = document.getElementById('contactMessage').value;
        
        // Get current date
        const currentDate = new Date().toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        });
        
        // Create WhatsApp message with improved formatting
        const messageText = `🏭 *FORESTA WOOD INDUSTRIES*\n` +
                           `📬 Contact Form Submission\n\n` +
                           `──────────────────\n` +
                           `👤 *Contact Details*\n` +
                           `• Name: ${name}\n` +
                           `• Email: ${email}\n` +
                           `• Phone: ${phone}\n` +
                           `• Company: ${company || 'N/A'}\n\n` +
                           `💬 *Message*\n${message}\n\n` +
                           `──────────────────\n` +
                           `⏰ Received: ${currentDate}`;
        
        // Encode the entire message properly
        const encodedMessage = encodeURIComponent(messageText);
        
        // Foresta WhatsApp Business number (with country code)
        const whatsappNumber = '923282216497';
        
        // Use WhatsApp API link - proper format
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp in new window
        const whatsappWindow = window.open(whatsappLink, '_blank');
        
        // Check if popup was blocked
        if (!whatsappWindow || whatsappWindow.closed || typeof whatsappWindow.closed === 'undefined') {
            // Popup blocked, try direct navigation
            window.location.href = whatsappLink;
        }
        
        // Close modal
        setTimeout(() => {
            closeContactModal();
            // Show success message
            alert('Redirecting to WhatsApp. We\'ll get back to you shortly!');
        }, 500);
    });
}

// Sidebar Menu Functionality
const hamburgerMenu = document.getElementById('hamburgerMenu');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const decorativeXClose = document.getElementById('decorativeXClose');

// Open sidebar
if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', function() {
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Close sidebar with X button
if (decorativeXClose) {
    decorativeXClose.addEventListener('click', function() {
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Close sidebar when clicking outside
if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', function(e) {
        if (e.target === sidebarOverlay) {
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Close sidebar when clicking on any link
const sidebarLinks = document.querySelectorAll('.sidebar-link');
sidebarLinks.forEach(link => {
    link.addEventListener('click', function() {
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close sidebar with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebarOverlay.classList.contains('active')) {
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== CART FUNCTIONALITY =====
// Uses the same 'foresta_cart' key and product schema as the main product grid

const CART_STORAGE_KEY = 'foresta_cart';

// Get cart array from localStorage
function getCart() {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading cart:', error);
        return [];
    }
}

// Save cart array to localStorage
function saveCart(cart) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        updateCartBadge();
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}

// Update cart badge count
function updateCartBadge() {
    const cart = getCart();
    const cartBadge = document.getElementById('cartBadge');
    const cartIconBtn = document.getElementById('cartIconBtn');

    const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);

    if (cartBadge) cartBadge.textContent = count;
    if (cartIconBtn) cartIconBtn.style.display = count > 0 ? 'inline-flex' : 'none';
}

// Check if current product is in cart
function isProductInCart() {
    const cart = getCart();
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code') || '';
    const space = urlParams.get('space') || '';
    const id = `${code}_${space}`;
    return cart.some(item => item.id === id);
}

// Update Add to Cart button state
function updateCartButtonState() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    const cartBtnText = document.getElementById('cartBtnText');

    if (isProductInCart()) {
        addToCartBtn.classList.add('added');
        cartBtnText.textContent = 'Added to Cart';
    } else {
        addToCartBtn.classList.remove('added');
        cartBtnText.textContent = 'Add to Cart';
    }
}

// Auth-gated Add to Cart wrapper
function addToCartWithAuth() {
    if (window.forestaAuthModal) {
        window.forestaAuthModal.requireAuth(addToCart, []);
    } else {
        addToCart();
    }
}

// Add current product to cart (same structure as main page grid)
function addToCart() {
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('name') || '';
    const productCode = urlParams.get('code') || '';
    const productImage = urlParams.get('image') || '';
    const productType = urlParams.get('type') || '';
    const productSpace = urlParams.get('space') || '';

    if (!productName || !productCode) {
        alert('Product information is missing.');
        return;
    }

    const id = `${productCode}_${productSpace}`;

    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === id);

    if (existingIndex !== -1) {
        // Same behaviour as the main grid: increment quantity
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
        cart.push({
            id,
            name: productName,
            code: productCode,
            type: productType,
            category: productSpace,
            frontImage: productImage,
            quantity: 1,
            width: '',
            height: '',
            depth: ''
        });
    }

    saveCart(cart);
    updateCartButtonState();
    showCartNotification(productName);
}

// View cart → go to checkout
function viewCart() {
    window.location.href = 'checkout.html';
}

// Show notification (same style as main page)
function showCartNotification(productName) {
    const existing = document.querySelector('.cart-add-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'cart-add-notification';
    notification.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>${productName} added to cart!</span>
        <a href="checkout.html">View Cart</a>
    `;

    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'linear-gradient(135deg, #0c4326, #2d8f5f)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        boxShadow: '0 10px 30px rgba(12, 67, 38, 0.3)',
        zIndex: '10000',
        fontFamily: 'inherit',
        fontSize: '0.9rem',
        animation: 'slideInRight 0.4s ease, fadeOut 0.4s ease 2.6s forwards'
    });
    const link = notification.querySelector('a');
    if (link) Object.assign(link.style, { color: '#fff', textDecoration: 'underline', marginLeft: '0.5rem', whiteSpace: 'nowrap' });

    // Inject keyframes if not already present
    if (!document.getElementById('cart-notif-keyframes')) {
        const style = document.createElement('style');
        style.id = 'cart-notif-keyframes';
        style.textContent = `
            @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes fadeOut { to { opacity: 0; transform: translateX(100%); } }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3200);
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge();
    updateCartButtonState();
});

// Navigate back to the gallery at the correct step (space + finish)
function goBackToGallery() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type') || '';
    const space = params.get('space') || 'kitchens';

    const categoryMap = {
        'Lami Gloss': 'lami-gloss',
        'Lami Matt': 'lami-matt',
        'Marble & Acrylic': 'marble-acrylic'
    };
    const category = categoryMap[type] || 'all';

    window.location.href = 'index-luxury.html?restoreSpace=' + space + '&restoreCategory=' + category + '#products';
}
