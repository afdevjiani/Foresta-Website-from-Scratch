/* ========================================
   FORESTA LUXURY WEBSITE - JAVASCRIPT
   Smooth scroll animations & interactions
   ======================================== */

// Add page transition class
document.body.classList.add('page-transition');

// ===== PRODUCT DETAIL NAVIGATION =====
// Function to navigate to color detail page
window.openProductDetail = function(colorName, colorCode, imagePath, category) {
  // Map category names to design and category IDs
  const categoryMap = {
    'Lami Gloss': { category: 'kitchen', design: 'modern-modular' },
    'Lami Matt': { category: 'kitchen', design: 'classic-wood' },
    'Marble & Acrylic': { category: 'kitchen', design: 'luxury-marble' }
  };
  
  // Create color ID from color code or name
  const colorId = colorCode ? colorCode.toLowerCase().replace(/[^a-z0-9]/g, '-') : colorName.toLowerCase().replace(/\s+/g, '-');
  
  // Get the mapping or use defaults
  const mapping = categoryMap[category] || { category: 'kitchen', design: 'modern-modular' };
  
  // Navigate to color detail page
  const url = `color-detail.html?category=${mapping.category}&design=${mapping.design}&color=${colorId}&name=${encodeURIComponent(colorName)}&code=${encodeURIComponent(colorCode)}&image=${encodeURIComponent(imagePath)}&type=${encodeURIComponent(category)}`;
  window.location.href = url;
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Remove transition class after load
  setTimeout(() => {
    document.body.classList.remove('page-transition');
    document.body.classList.add('page-loaded');
  }, 100);

  initSmoothScroll();
  initScrollAnimations();
  initNavigation();
  initHamburgerMenu();
  initContactForm();
  initCollectionModals();
  initMouseEffects();
  initProductTabs();
});

// ===== SMOOTH SCROLL FOR NAVIGATION LINKS =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });
}

// ===== SCROLL ANIMATIONS WITH INTERSECTION OBSERVER =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Trigger number animation for stats
        if (entry.target.classList.contains('stat-box')) {
          const numberEl = entry.target.querySelector('.stat-number-large');
          if (numberEl && !numberEl.classList.contains('counted')) {
            numberEl.classList.add('counted');
            animateNumber(numberEl);
          }
        }
      }
    });
  }, observerOptions);

  // Observe all existing animation elements
  const animatedElements = document.querySelectorAll(
    '.fade-up, .fade-in, .fade-left, .fade-right, .scale-in, .slide-up, .reveal-section'
  );
  animatedElements.forEach(el => observer.observe(el));

  // Observe cards with stagger effect
  const craftCards = document.querySelectorAll('.craft-card');
  craftCards.forEach((card, index) => {
    if (!card.classList.contains('fade-up')) {
      card.classList.add('fade-up', `stagger-${(index % 4) + 1}`);
    }
    observer.observe(card);
  });

  const collectionCards = document.querySelectorAll('.collection-card');
  collectionCards.forEach((card, index) => {
    if (!card.classList.contains('scale-in')) {
      card.classList.add('scale-in', `stagger-${(index % 3) + 1}`);
    }
    observer.observe(card);
  });

  const appCards = document.querySelectorAll('.app-card');
  appCards.forEach((card, index) => {
    if (!card.classList.contains('fade-up')) {
      card.classList.add('fade-up', `stagger-${(index % 3) + 1}`);
    }
    observer.observe(card);
  });

  const catalogCards = document.querySelectorAll('.catalog-card-luxury');
  catalogCards.forEach((card, index) => {
    if (!card.classList.contains('slide-up')) {
      card.classList.add('slide-up', `stagger-${(index % 3) + 1}`);
    }
    observer.observe(card);
  });

  // Observe stat boxes
  const statBoxes = document.querySelectorAll('.stat-box');
  statBoxes.forEach((box, index) => {
    if (!box.classList.contains('fade-up')) {
      box.classList.add('fade-up', `stagger-${(index % 3) + 1}`);
    }
    observer.observe(box);
  });

  // Observe section labels
  const sectionLabels = document.querySelectorAll('.section-label');
  sectionLabels.forEach(label => {
    if (!label.classList.contains('fade-in')) {
      label.classList.add('fade-in');
    }
    observer.observe(label);
  });

  // Observe section headings
  const sectionHeadings = document.querySelectorAll('.section-heading');
  sectionHeadings.forEach(heading => {
    if (!heading.classList.contains('fade-up')) {
      heading.classList.add('fade-up');
    }
    observer.observe(heading);
  });

  // Observe section descriptions
  const sectionDescriptions = document.querySelectorAll('.section-description');
  sectionDescriptions.forEach(desc => {
    if (!desc.classList.contains('fade-up')) {
      desc.classList.add('fade-up');
    }
    observer.observe(desc);
  });

  // Observe heritage text paragraphs
  const heritageParagraphs = document.querySelectorAll('.heritage-text p');
  heritageParagraphs.forEach((p, index) => {
    if (!p.classList.contains('fade-up')) {
      p.classList.add('fade-up', `stagger-${Math.min(index + 1, 3)}`);
    }
    observer.observe(p);
  });

  // Observe large text
  const largeTexts = document.querySelectorAll('.large-text');
  largeTexts.forEach(text => {
    if (!text.classList.contains('fade-up')) {
      text.classList.add('fade-up');
    }
    observer.observe(text);
  });

  // Observe trust items
  const trustItems = document.querySelectorAll('.trust-item');
  trustItems.forEach((item, index) => {
    if (!item.classList.contains('fade-left')) {
      item.classList.add('fade-left', `stagger-${(index % 3) + 1}`);
    }
    observer.observe(item);
  });

  // Observe contact details
  const contactDetails = document.querySelectorAll('.contact-detail-item');
  contactDetails.forEach((item, index) => {
    if (!item.classList.contains('fade-up')) {
      item.classList.add('fade-up', `stagger-${(index % 3) + 1}`);
    }
    observer.observe(item);
  });

  // Observe form groups
  const formGroups = document.querySelectorAll('.form-group');
  formGroups.forEach((group, index) => {
    if (!group.classList.contains('fade-up')) {
      group.classList.add('fade-up', `stagger-${Math.min(index + 1, 6)}`);
    }
    observer.observe(group);
  });

  // Observe philosophy quote elements
  const philosophyQuote = document.querySelector('.philosophy-quote blockquote');
  const philosophyCite = document.querySelector('.philosophy-quote cite');
  if (philosophyQuote) {
    if (!philosophyQuote.classList.contains('fade-up')) {
      philosophyQuote.classList.add('fade-up');
    }
    observer.observe(philosophyQuote);
  }
  if (philosophyCite) {
    if (!philosophyCite.classList.contains('fade-up')) {
      philosophyCite.classList.add('fade-up');
    }
    observer.observe(philosophyCite);
  }

  // Observe heritage image
  const heritageImage = document.querySelector('.heritage-image');
  if (heritageImage && !heritageImage.classList.contains('fade-left')) {
    observer.observe(heritageImage);
  }

  // Observe contact form
  const contactForm = document.querySelector('.contact-form-side');
  if (contactForm && !contactForm.classList.contains('fade-left')) {
    observer.observe(contactForm);
  }
}

// ===== ANIMATE NUMBERS =====
function animateNumber(element) {
  const text = element.textContent.trim();
  const hasPlus = text.includes('+');
  const hasPercent = text.includes('%');
  const isMENA = text === 'MENA';
  
  if (isMENA) {
    // Just fade in MENA text
    element.style.opacity = '0';
    setTimeout(() => {
      element.style.transition = 'opacity 1s ease';
      element.style.opacity = '1';
    }, 100);
    return;
  }
  
  const number = parseInt(text.replace(/\D/g, ''));
  
  if (isNaN(number)) return;
  
  const duration = 2000;
  const steps = 50;
  const increment = number / steps;
  let current = 0;
  let stepCount = 0;
  
  const timer = setInterval(() => {
    stepCount++;
    current += increment;
    
    if (stepCount >= steps || current >= number) {
      element.textContent = number + (hasPlus ? '+' : hasPercent ? '%' : '');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + (hasPlus ? '+' : hasPercent ? '%' : '');
    }
  }, duration / steps);
}

// ===== NAVIGATION ACTIVE STATE ON SCROLL =====
function initNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const header = document.querySelector('.luxury-header');

  window.addEventListener('scroll', () => {
    // Update active navigation
    let current = '';
    const scrollPosition = window.pageYOffset + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    // Header background on scroll
    if (window.scrollY > 100) {
      header.style.background = 'rgba(12, 67, 38, 0.98)';
      header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.background = 'linear-gradient(180deg, rgba(12, 67, 38, 0.95) 0%, rgba(12, 67, 38, 0.8) 100%)';
      header.style.boxShadow = 'none';
    }
    
    // Update reading progress bar
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    header.style.setProperty('--scroll-progress', `${scrolled}%`);
    
    // Apply progress width to ::after pseudo-element
    document.documentElement.style.setProperty('--scroll-width', `${scrolled}%`);
  });
}

// Add CSS variable support for progress bar
if (!document.getElementById('progress-bar-styles')) {
  const progressStyle = document.createElement('style');
  progressStyle.id = 'progress-bar-styles';
  progressStyle.textContent = `
    :root {
      --scroll-width: 0%;
    }
    .luxury-header::after {
      width: var(--scroll-width) !important;
    }
  `;
  document.head.appendChild(progressStyle);
}

// ===== HAMBURGER MENU & SIDEBAR =====
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburgerMenu');
  const sidebar = document.getElementById('sidebarOverlay');
  const decorativeXClose = document.getElementById('decorativeXClose');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  
  if (!hamburger || !sidebar) return;

  // Open sidebar
  hamburger.addEventListener('click', () => {
    sidebar.classList.add('active');
    hamburger.classList.add('active');
    document.body.classList.add('no-scroll');
  });

  // Close sidebar
  const closeSidebar = () => {
    sidebar.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.classList.remove('no-scroll');
  };

  // Animated X button closes sidebar
  if (decorativeXClose) {
    decorativeXClose.addEventListener('click', closeSidebar);
  }

  // Close sidebar when clicking on a link
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Only close if it's an anchor link (not external)
      if (link.getAttribute('href').startsWith('#')) {
        setTimeout(closeSidebar, 300);
      }
    });
  });

  // Close sidebar when clicking outside
  sidebar.addEventListener('click', (e) => {
    if (e.target === sidebar) {
      closeSidebar();
    }
  });

  // Close sidebar on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
      closeSidebar();
    }
  });
}

// ===== MOBILE MENU TOGGLE (Legacy - kept for compatibility) =====
function initMobileMenu() {
  // This function is now replaced by initHamburgerMenu
  // Kept for backward compatibility
}

// ===== CONTACT FORM SUBMISSION (EmailJS) =====
function initContactForm() {
  const form = document.getElementById('luxuryContactForm');
  
  if (!form) return;

  // Initialize EmailJS (Replace with your public key)
  // emailjs.init("YOUR_PUBLIC_KEY");
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.submit-luxury-btn');
    const originalText = submitBtn.textContent;
    
    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    submitBtn.style.opacity = '0.6';
    
    // Get form data
    const formData = {
      name: form.querySelector('#name').value,
      email: form.querySelector('#email').value,
      phone: form.querySelector('#phone').value,
      interest: form.querySelector('#interest').value,
      message: form.querySelector('#message').value
    };

    try {
      // Replace with your EmailJS service
      // await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData);
      
      // Simulate successful submission for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success feedback
      submitBtn.textContent = 'Message Sent Successfully!';
      submitBtn.style.background = 'var(--color-forest-green)';
      
      // Reset form
      form.reset();
      
      // Show success message
      showNotification('Thank you for your inquiry. We will contact you shortly.', 'success');
      
      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.opacity = '1';
        submitBtn.style.background = 'var(--color-deep-green)';
      }, 3000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Error feedback
      submitBtn.textContent = 'Failed to Send';
      submitBtn.style.background = '#c41e3a';
      
      showNotification('There was an error sending your message. Please try again or contact us directly.', 'error');
      
      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.opacity = '1';
        submitBtn.style.background = 'var(--color-deep-green)';
      }, 3000);
    }
  });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Style notification
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 30px;
    padding: 1.5rem 2rem;
    background: ${type === 'success' ? 'var(--color-deep-green)' : '#c41e3a'};
    color: var(--color-off-white);
    border-radius: 4px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    opacity: 0;
    transform: translateX(100px);
    transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    max-width: 400px;
    font-size: 0.95rem;
    line-height: 1.6;
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100px)';
    
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 5000);
}

// ===== COLLECTION MODAL/GALLERY =====
function initCollectionModals() {
  // This function can be expanded to show detailed collection galleries
  // For now, it's a placeholder for future enhancement
  
  window.showCollection = function(collectionName) {
    console.log(`Opening collection: ${collectionName}`);
    
    // You can implement a modal or navigate to a detailed page
    // For now, show a notification
    showNotification(`Explore our ${formatCollectionName(collectionName)} collection in our showroom or download the catalog below.`, 'success');
    
    // Smooth scroll to catalog section
    const catalogSection = document.getElementById('catalog');
    if (catalogSection) {
      const headerOffset = 80;
      const elementPosition = catalogSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
}

function formatCollectionName(name) {
  return name.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// ===== PARALLAX EFFECT (SUBTLE) =====
function initParallax() {
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        
        // Parallax for hero video
        const heroVideo = document.querySelector('.hero-video');
        if (heroVideo) {
          const speed = 0.3;
          const yPos = scrolled * speed;
          heroVideo.style.transform = `translateY(${yPos}px)`;
        }
        
        // Parallax for images
        const parallaxElements = document.querySelectorAll('.parallax-element');
        parallaxElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
          
          if (scrollPercent > 0 && scrollPercent < 1.5) {
            const movement = (scrollPercent - 0.5) * 30;
            el.style.transform = `translateY(${movement}px)`;
          }
        });
        
        // Parallax for heritage image
        const heritageImage = document.querySelector('.heritage-image img');
        if (heritageImage) {
          const rect = heritageImage.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            const movement = scrollPercent * 40 - 20;
            heritageImage.style.transform = `translateY(${movement}px) scale(1.1)`;
          }
        }
        
        ticking = false;
      });
      
      ticking = true;
    }
  });
}

// Initialize parallax (enabled for better visual experience)
if (window.innerWidth > 768) {
  initParallax();
}

// ===== VIDEO OPTIMIZATION FOR MOBILE =====
function optimizeVideoForMobile() {
  if (window.innerWidth <= 768) {
    const heroVideo = document.querySelector('.hero-video');
    
    if (heroVideo) {
      // Pause video on mobile to save bandwidth
      heroVideo.pause();
      
      // Optionally, replace with poster image
      const videoPoster = heroVideo.getAttribute('poster');
      if (videoPoster) {
        heroVideo.style.backgroundImage = `url(${videoPoster})`;
        heroVideo.style.backgroundSize = 'cover';
        heroVideo.style.backgroundPosition = 'center';
      }
    }
  }
}

// Run video optimization
optimizeVideoForMobile();

// ===== LAZY LOADING IMAGES =====
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });

  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach(img => imageObserver.observe(img));
}

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', () => {
  // Log page load time (for development)
  const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
  console.log(`Page loaded in ${loadTime}ms`);
  
  // Check for Cumulative Layout Shift (CLS)
  if ('PerformanceObserver' in window) {
    let cls = 0;
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      }
    });
    
    observer.observe({ type: 'layout-shift', buffered: true });
    
    // Log CLS after 5 seconds
    setTimeout(() => {
      console.log(`Cumulative Layout Shift: ${cls.toFixed(3)}`);
    }, 5000);
  }
});

// ===== CURSOR EFFECT (OPTIONAL LUXURY FEATURE) =====
function initCustomCursor() {
  if (window.innerWidth <= 768) return; // Skip on mobile
  
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-deep-green);
    border-radius: 50%;
    pointer-events: none;
    z-index: 10000;
    transition: transform 0.2s ease, opacity 0.2s ease;
    opacity: 0;
  `;
  document.body.appendChild(cursor);
  
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
    cursor.style.opacity = '1';
  });
  
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });
  
  // Scale cursor on clickable elements
  const clickables = document.querySelectorAll('a, button, .collection-card, .craft-card');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(1.5)';
      cursor.style.borderColor = 'var(--color-forest-green)';
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursor.style.borderColor = 'var(--color-deep-green)';
    });
  });
}

// Optional: Initialize custom cursor (commented out for simplicity)
// initCustomCursor();

// ===== MOUSE MOVEMENT EFFECTS =====
function initMouseEffects() {
  if (window.innerWidth <= 768) return; // Skip on mobile
  
  // Subtle parallax on mouse move for cards
  const cards = document.querySelectorAll('.craft-card, .collection-card, .catalog-card-luxury');
  
  cards.forEach(card => {
    let isHovering = false;
    
    card.addEventListener('mouseenter', () => {
      isHovering = true;
    });
    
    card.addEventListener('mousemove', (e) => {
      if (!isHovering) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 30;
      const rotateY = (centerX - x) / 30;
      
      card.style.transition = 'transform 0.1s ease';
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      isHovering = false;
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = '';
    });
  });
  
  // Magnetic effect for buttons
  const buttons = document.querySelectorAll('.cta-button, .hero-cta, .explore-btn, .download-btn');
  
  buttons.forEach(button => {
    let isHovering = false;
    
    button.addEventListener('mouseenter', () => {
      isHovering = true;
    });
    
    button.addEventListener('mousemove', (e) => {
      if (!isHovering) return;
      
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    button.addEventListener('mouseleave', () => {
      isHovering = false;
      button.style.transform = '';
    });
  });
}

// ===== SMOOTH SECTION REVEAL ON SCROLL =====
function initSectionReveal() {
  const sections = document.querySelectorAll('section');
  
  sections.forEach(section => {
    section.classList.add('reveal-section');
  });
}

// ===== SMOOTH SECTION REVEAL ON SCROLL =====
function initSectionReveal() {
  const sections = document.querySelectorAll('section');
  
  sections.forEach(section => {
    if (!section.classList.contains('reveal-section') && !section.classList.contains('hero-luxury')) {
      section.classList.add('reveal-section');
    }
  });
}

// Initialize section reveal
initSectionReveal();

// ===== RIPPLE EFFECT ON CLICKS =====
function initRippleEffect() {
  function createRipple(event) {
    const button = event.currentTarget;
    
    // Don't create ripple if it's a form submission
    if (button.type === 'submit' && event.defaultPrevented) {
      return;
    }
    
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - radius}px`;
    ripple.style.top = `${event.clientY - rect.top - radius}px`;
    ripple.classList.add('ripple-effect');
    
    const existingRipple = button.querySelector('.ripple-effect');
    if (existingRipple) {
      existingRipple.remove();
    }
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Add ripple to all buttons
  const buttonSelectors = 'button, .cta-button, .hero-cta, .explore-btn, .download-btn';
  document.querySelectorAll(buttonSelectors).forEach(button => {
    // Only add if not already added
    if (!button.dataset.rippleAdded) {
      button.style.position = 'relative';
      button.style.overflow = 'hidden';
      button.addEventListener('click', createRipple);
      button.dataset.rippleAdded = 'true';
    }
  });
}

// Initialize ripple effect
initRippleEffect();

// Add ripple CSS
if (!document.getElementById('ripple-styles')) {
  const style = document.createElement('style');
  style.id = 'ripple-styles';
  style.textContent = `
    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
    }
    
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// ===== PRODUCT TABS =====
function initProductTabs() {
  const tabs = document.querySelectorAll('.product-tab');
  const categories = document.querySelectorAll('.products-category');
  
  if (!tabs.length) return;
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;
      
      // Remove active from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      // Add active to clicked tab
      tab.classList.add('active');
      
      // Hide all categories
      categories.forEach(cat => {
        cat.classList.remove('active');
      });
      
      // Show selected category with animation
      const selectedCategory = document.getElementById(`${category}-products`);
      if (selectedCategory) {
        setTimeout(() => {
          selectedCategory.classList.add('active');
        }, 100);
      }
    });
  });
}

// ===== EXPORT FOR USE IN OTHER SCRIPTS =====
window.ForestaLuxury = {
  showNotification,
  showCollection
};

console.log('🌲 Foresta Luxury Website Initialized');
