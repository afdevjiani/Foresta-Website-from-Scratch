// Product Configurator - Interactive Design & Color Selection
class ProductConfigurator {
    constructor() {
        this.selectedCategory = null;
        this.selectedDesign = null;
        this.selectedColor = null;
        
        // Product data structure
        this.categories = {
            kitchen: {
                name: 'Kitchen',
                icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>',
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
                icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/></svg>',
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
                icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="2" width="18" height="20" rx="2"/><path d="M12 2v20"/><path d="M12 6h.01"/><path d="M12 18h.01"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/></svg>',
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
                        description: 'Traditional hinged door wardrobe with ample storage',
                        baseImage: 'assets/product images/Product Catalogs/Lami Matt Catalog.png',
                        colors: [
                            { id: 'matt-walnut', name: 'Matt Walnut', hex: '#5C4033', sample: 'assets/product images/Color Palettes/Lami Matt Color Range .png' },
                            { id: 'matt-teak', name: 'Matt Teak', hex: '#B5651D' },
                            { id: 'matt-wenge', name: 'Matt Wenge', hex: '#3D3635' }
                        ]
                    },
                    'walk-in-wardrobe': {
                        name: 'Walk-in Wardrobe',
                        description: 'Luxury walk-in closet system',
                        baseImage: 'assets/product images/Product Catalogs/Marble And Acrylic Catalog.png',
                        colors: [
                            { id: 'white-marble', name: 'White Marble', hex: '#F8F8FF', sample: 'assets/product images/Color Palettes/Marble And Acrylic Color Range.png' },
                            { id: 'black-marble', name: 'Black Marble', hex: '#2C2C2C' },
                            { id: 'wood-marble-combo', name: 'Wood & Marble', hex: '#8B7355' }
                        ]
                    }
                }
            }
        };
    }

    init() {
        this.renderCategories();
        this.attachEventListeners();
    }

    renderCategories() {
        const categoriesGrid = document.getElementById('categoriesGrid');
        if (!categoriesGrid) return;

        categoriesGrid.innerHTML = Object.keys(this.categories).map(categoryId => {
            const category = this.categories[categoryId];
            return `
                <div class="category-card" data-category="${categoryId}">
                    <div class="category-icon-wrapper">
                        <div class="category-icon">${category.icon}</div>
                    </div>
                    <h3 class="category-name">${category.name}</h3>
                    <div class="category-overlay">
                        <span>Explore Designs</span>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderDesigns(categoryId) {
        const category = this.categories[categoryId];
        const designsGrid = document.getElementById('designsGrid');
        if (!designsGrid) return;

        designsGrid.innerHTML = Object.keys(category.designs).map(designId => {
            const design = category.designs[designId];
            return `
                <div class="design-card" data-design="${designId}">
                    <div class="design-image">
                        <img src="${design.baseImage}" alt="${design.name}" loading="lazy">
                    </div>
                    <div class="design-info">
                        <h4 class="design-name">${design.name}</h4>
                        <p class="design-description">${design.description}</p>
                        <button class="select-design-btn"><span>Select This Design</span></button>
                    </div>
                </div>
            `;
        }).join('');

        // Show designs section
        document.getElementById('designsSection').classList.add('active');
        
        // Scroll to designs section with better positioning
        setTimeout(() => {
            const designsSection = document.getElementById('designsSection');
            if (designsSection) {
                const yOffset = -100; // Offset from top
                const y = designsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }, 300);
    }

    renderColors(categoryId, designId) {
        const design = this.categories[categoryId].designs[designId];
        const colorsGrid = document.getElementById('colorsGrid');
        if (!colorsGrid) return;

        colorsGrid.innerHTML = design.colors.map(color => {
            return `
                <div class="color-option" data-color="${color.id}" title="${color.name}">
                    <div class="color-swatch" style="background-color: ${color.hex}">
                        ${color.sample ? `<img src="${color.sample}" alt="${color.name}" class="color-sample">` : ''}
                    </div>
                    <span class="color-name">${color.name}</span>
                </div>
            `;
        }).join('');

        // Update preview image
        this.updatePreview(design.baseImage, design.name);

        // Show colors section
        document.getElementById('colorsSection').classList.add('active');
        
        // Scroll to colors section with better positioning
        setTimeout(() => {
            const colorsSection = document.getElementById('colorsSection');
            if (colorsSection) {
                const yOffset = -100; // Offset from top
                const y = colorsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }, 300);
    }

    updatePreview(imageSrc, designName) {
        const previewImage = document.getElementById('previewImage');
        const previewTitle = document.getElementById('previewTitle');
        const canvas = document.getElementById('previewCanvas');
        
        if (previewImage) {
            previewImage.src = imageSrc;
            previewImage.alt = designName;
            
            // Store original image for color transformation
            previewImage.onload = () => {
                if (canvas) {
                    this.originalImage = previewImage;
                    this.resetCanvas();
                }
            };
        }
        
        if (previewTitle) {
            previewTitle.textContent = designName;
        }
    }

    updatePreviewWithFade(imageSrc, designName) {
        const previewImage = document.getElementById('previewImage');
        const previewTitle = document.getElementById('previewTitle');
        const canvas = document.getElementById('previewCanvas');
        
        if (previewImage) {
            // Preload the new image first
            const newImage = new Image();
            newImage.src = imageSrc;
            
            newImage.onload = () => {
                // Once loaded, do instant crossfade
                previewImage.style.opacity = '0';
                
                // Change source immediately after fade starts
                setTimeout(() => {
                    previewImage.src = imageSrc;
                    previewImage.alt = designName;
                    previewImage.style.opacity = '1';
                    
                    if (canvas) {
                        this.originalImage = previewImage;
                        this.resetCanvas();
                    }
                }, 50);
            };
        }
        
        if (previewTitle) {
            previewTitle.textContent = designName;
        }
    }

    resetCanvas() {
        const canvas = document.getElementById('previewCanvas');
        const previewImage = document.getElementById('previewImage');
        
        if (!canvas || !previewImage) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = previewImage.naturalWidth;
        canvas.height = previewImage.naturalHeight;
        
        ctx.drawImage(previewImage, 0, 0);
        
        // Hide canvas, show original image when no color selected
        canvas.style.display = 'none';
        previewImage.style.display = 'block';
    }

    applyColorToCanvas(hexColor) {
        const canvas = document.getElementById('previewCanvas');
        const previewImage = document.getElementById('previewImage');
        
        if (!canvas || !previewImage || !this.originalImage) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = this.originalImage.naturalWidth;
        canvas.height = this.originalImage.naturalHeight;
        
        // Draw original image
        ctx.drawImage(this.originalImage, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Convert hex to RGB
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        
        // Apply color tinting
        for (let i = 0; i < data.length; i += 4) {
            // Get original pixel brightness
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const factor = brightness / 255;
            
            // Apply color with brightness preservation
            data[i] = r * factor * 0.7 + data[i] * 0.3;     // Red
            data[i + 1] = g * factor * 0.7 + data[i + 1] * 0.3; // Green
            data[i + 2] = b * factor * 0.7 + data[i + 2] * 0.3; // Blue
            // Alpha channel (data[i + 3]) remains unchanged
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // Show canvas, hide original image
        canvas.style.display = 'block';
        previewImage.style.display = 'none';
    }

    selectCategory(categoryId) {
        this.selectedCategory = categoryId;
        this.selectedDesign = null;
        this.selectedColor = null;

        // Update UI - mark selected category
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-category="${categoryId}"]`).classList.add('selected');

        // Hide colors section
        document.getElementById('colorsSection').classList.remove('active');

        // Render designs for selected category
        this.renderDesigns(categoryId);
    }

    selectDesign(designId) {
        this.selectedDesign = designId;
        this.selectedColor = null;

        // Update UI - mark selected design
        document.querySelectorAll('.design-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-design="${designId}"]`).classList.add('selected');

        // Render colors for selected design
        this.renderColors(this.selectedCategory, designId);
    }

    selectColor(colorId) {
        this.selectedColor = colorId;

        // Update UI - mark selected color
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelector(`[data-color="${colorId}"]`).classList.add('selected');

        // Get color details
        const design = this.categories[this.selectedCategory].designs[this.selectedDesign];
        const color = design.colors.find(c => c.id === colorId);

        // Use previewImage for kitchen/design view, or sample if no previewImage exists
        const imageToShow = color.previewImage || color.sample;
        if (imageToShow) {
            this.updatePreviewWithFade(imageToShow, `${design.name} - ${color.name}`);
        } else {
            // Apply real-time color transformation to canvas
            this.applyColorToCanvas(color.hex);
        }

        // Show selection summary
        this.showSelectionSummary();
    }

    showSelectionSummary() {
        const category = this.categories[this.selectedCategory];
        const design = category.designs[this.selectedDesign];
        const color = design.colors.find(c => c.id === this.selectedColor);

        const summaryEl = document.getElementById('selectionSummary');
        if (summaryEl) {
            summaryEl.innerHTML = `
                <div class="summary-content">
                    <h4>Your Selection:</h4>
                    <p><strong>Category:</strong> ${category.name}</p>
                    <p><strong>Design:</strong> ${design.name}</p>
                    <p><strong>Color:</strong> ${color.name}</p>
                    <div class="summary-actions">
                        <button class="btn-primary" onclick="productConfigurator.requestQuote()"><span>Request Quote</span></button>
                        <button class="btn-secondary" onclick="productConfigurator.reset()"><span>Start Over</span></button>
                    </div>
                </div>
            `;
            summaryEl.classList.add('active');
        }
    }

    requestQuote() {
        const category = this.categories[this.selectedCategory];
        const design = category.designs[this.selectedDesign];
        const color = design.colors.find(c => c.id === this.selectedColor);

        alert(`Quote Request:\n\nCategory: ${category.name}\nDesign: ${design.name}\nColor: ${color.name}\n\nWe'll contact you shortly!`);
        
        // In a real application, this would send data to a server
        console.log('Quote requested:', {
            category: this.selectedCategory,
            design: this.selectedDesign,
            color: this.selectedColor
        });
    }

    reset() {
        this.selectedCategory = null;
        this.selectedDesign = null;
        this.selectedColor = null;

        // Reset UI
        document.querySelectorAll('.category-card, .design-card, .color-option').forEach(el => {
            el.classList.remove('selected');
        });

        document.getElementById('designsSection').classList.remove('active');
        document.getElementById('colorsSection').classList.remove('active');
        document.getElementById('selectionSummary').classList.remove('active');

        // Reset canvas to original image
        this.resetCanvas();

        // Scroll to top of configurator
        document.getElementById('productConfigurator').scrollIntoView({ behavior: 'smooth' });
    }

    attachEventListeners() {
        // Category selection
        document.addEventListener('click', (e) => {
            const categoryCard = e.target.closest('.category-card');
            if (categoryCard) {
                const categoryId = categoryCard.dataset.category;
                this.selectCategory(categoryId);
            }

            // Design selection
            const designBtn = e.target.closest('.select-design-btn');
            if (designBtn) {
                const designCard = designBtn.closest('.design-card');
                const designId = designCard.dataset.design;
                this.selectDesign(designId);
            }

            // Color selection
            const colorOption = e.target.closest('.color-option');
            if (colorOption) {
                const colorId = colorOption.dataset.color;
                this.selectColor(colorId);
            }
        });
    }
}

// Initialize configurator when DOM is ready
let productConfigurator;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        productConfigurator = new ProductConfigurator();
        productConfigurator.init();
    });
} else {
    productConfigurator = new ProductConfigurator();
    productConfigurator.init();
}
