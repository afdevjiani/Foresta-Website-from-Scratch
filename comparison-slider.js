// ===== FORESTA COMPARISON SLIDER =====
// Mobile-first before/after product comparison

class ComparisonSlider {
  constructor(container) {
    this.container = container;
    this.imageWrapper = container.querySelector('.color-item-image-wrapper');
    this.afterImage = container.querySelector('.kitchen-preview');
    this.handle = null;
    this.infoOverlay = null;
    this.isDragging = false;
    this.currentPosition = 50; // Start at 50%
    
    if (this.imageWrapper && this.afterImage) {
      this.init();
    }
  }
  
  init() {
    // Create slider handle
    this.createHandle();
    
    // Add event listeners
    this.addEventListeners();
  }
  
  createHandle() {
    this.handle = document.createElement('div');
    this.handle.className = 'comparison-slider-handle';
    this.imageWrapper.appendChild(this.handle);
  }
  
  addEventListeners() {
    // Mouse events
    this.imageWrapper.addEventListener('mousedown', this.startDrag.bind(this));
    document.addEventListener('mousemove', this.drag.bind(this));
    document.addEventListener('mouseup', this.stopDrag.bind(this));
    
    // Touch events - optimized for performance
    this.imageWrapper.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    // Use passive: false only when necessary for preventDefault
    this.boundTouchMove = this.handleTouchMove.bind(this);
    this.imageWrapper.addEventListener('touchmove', this.boundTouchMove, { passive: false });
    this.imageWrapper.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    
    // Click to jump (desktop only)
    this.imageWrapper.addEventListener('click', (e) => {
      // Only handle click for slider interaction if there was a drag
      if (this.wasDragging) {
        e.stopPropagation();
        e.preventDefault();
        this.wasDragging = false;
      }
    }, true);
  }
  
  startDrag(e) {
    e.preventDefault();
    this.isDragging = true;
    this.wasDragging = false;
    this.startX = e.clientX;
    this.imageWrapper.style.cursor = 'grabbing';
    
    // Haptic feedback (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }
  
  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.touchStartTime = Date.now();
    this.isDragging = false;
    this.wasDragging = false;
    this.scrollIntentDetermined = false;
    this.isHorizontalDrag = false;
  }
  
  handleTouchMove(e) {
    if (!this.touchStartX) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const deltaX = Math.abs(touchX - this.touchStartX);
    const deltaY = Math.abs(touchY - this.touchStartY);
    
    // Determine scroll intent with priority to vertical scrolling
    if (!this.scrollIntentDetermined) {
      // If user moves vertically first or moves vertically more, it's a scroll
      if (deltaY > 8 || (deltaY > 5 && deltaY >= deltaX)) {
        this.scrollIntentDetermined = true;
        this.isHorizontalDrag = false;
        return; // Let native scroll happen
      }
      
      // Only consider horizontal drag if clear horizontal intent
      if (deltaX > 20 && deltaX > deltaY * 2.5) {
        this.scrollIntentDetermined = true;
        this.isHorizontalDrag = true;
      }
    }
    
    // Only handle horizontal drag if clear intent was established
    if (this.isHorizontalDrag) {
      e.preventDefault(); // Prevent scrolling only for confirmed horizontal drag
      this.isDragging = true;
      this.wasDragging = true;
      
      const rect = this.imageWrapper.getBoundingClientRect();
      const x = touchX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      this.updateSlider(percentage);
    }
  }
  
  handleTouchEnd(e) {
    const touchDuration = Date.now() - this.touchStartTime;
    const wasTap = touchDuration < 200 && !this.wasDragging;
    
    // If it was a quick tap and no dragging occurred, allow navigation
    if (wasTap) {
      // Do nothing - let the click event propagate to trigger navigation
      this.isDragging = false;
      this.wasDragging = false;
      return;
    }
    
    this.isDragging = false;
    this.touchStartX = null;
    this.touchStartY = null;
  }
  
  drag(e) {
    if (!this.isDragging) return;
    
    e.preventDefault();
    this.wasDragging = true;
    
    const rect = this.imageWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    this.updateSlider(percentage);
  }
  
  stopDrag() {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.imageWrapper.style.cursor = 'ew-resize';
  }
  
  updateSlider(percentage, animated = false) {
    this.currentPosition = percentage;
    
    // Use transform for better performance on mobile
    const isMobile = window.innerWidth <= 1024;
    
    if (isMobile) {
      // Use transform instead of clip-path
      const translateValue = (percentage - 100);
      if (animated) {
        this.afterImage.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      } else {
        this.afterImage.style.transition = 'transform 0.05s ease-out';
      }
      this.afterImage.style.transform = `translateX(${translateValue}%)`;
    } else {
      // Desktop: use clip-path for fade effect
      const clipValue = `inset(0 ${100 - percentage}% 0 0)`;
      if (animated) {
        this.afterImage.style.transition = 'clip-path 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      } else {
        this.afterImage.style.transition = 'clip-path 0.05s ease-out';
      }
      this.afterImage.style.clipPath = clipValue;
    }
    
    // Update handle position with transform for GPU acceleration
    this.handle.style.transform = `translateX(-50%)`;
    this.handle.style.left = `${percentage}%`;
  }
  
  playInitialDemo() {
    // Auto-demo animation when first visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.demoPlayed) {
          this.demoPlayed = true;
          setTimeout(() => {
            this.animateDemo();
          }, 300);
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(this.container);
  }
  
  animateDemo() {
    // Quick demo: slide from 50% to 80% to 20% to 50%
    const steps = [
      { pos: 50, delay: 0 },
      { pos: 80, delay: 600 },
      { pos: 20, delay: 1200 },
      { pos: 50, delay: 1800 }
    ];
    
    steps.forEach(step => {
      setTimeout(() => {
        this.updateSlider(step.pos, true);
      }, step.delay);
    });
  }
}

// Initialize all comparison sliders on page load
function initComparisonSliders() {
  // Only enable comparison slider on mobile/tablet devices
  const isMobile = window.innerWidth <= 1024 || 'ontouchstart' in window;
  
  if (!isMobile) {
    console.log('✨ Desktop detected - comparison slider disabled');
    return; // Don't initialize sliders on desktop
  }
  
  const colorItems = document.querySelectorAll('.color-item');
  
  colorItems.forEach(item => {
    new ComparisonSlider(item);
  });
  
  console.log(`✨ Initialized ${colorItems.length} comparison sliders for mobile`);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initComparisonSliders);
} else {
  initComparisonSliders();
}
