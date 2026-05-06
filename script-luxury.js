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
  // Prevent scroll restoration on page load
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  
  // Scroll to top on page load/refresh
  window.scrollTo(0, 0);
  
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
        // closeMobileMenu(); // Function not defined
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
  
  // Use requestAnimationFrame to batch DOM updates
  let pendingUpdates = [];
  let updateScheduled = false;
  
  const processPendingUpdates = () => {
    pendingUpdates.forEach(({ target, action }) => {
      if (action === 'visible') {
        target.classList.add('visible');
        
        // Trigger number animation for stats
        if (target.classList.contains('stat-box')) {
          const numberEl = target.querySelector('.stat-number-large');
          if (numberEl && !numberEl.classList.contains('counted')) {
            numberEl.classList.add('counted');
            animateNumber(numberEl);
          }
        }
      }
    });
    pendingUpdates = [];
    updateScheduled = false;
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        pendingUpdates.push({ target: entry.target, action: 'visible' });
        
        if (!updateScheduled) {
          updateScheduled = true;
          requestAnimationFrame(processPendingUpdates);
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
  
  let scrollTicking = false;
  
  const updateOnScroll = () => {
    scrollTicking = false;
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
  };
  
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(updateOnScroll);
      scrollTicking = true;
    }
  }, { passive: true });
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
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        closeSidebar();
        // Scroll to section after sidebar close animation
        setTimeout(() => {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 350);
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

// ===== CONTACT FORM SUBMISSION (EmailJS via Netlify Function + Firebase) =====
// Email sending is done server-side — API keys never exposed to browser
async function sendEmailViaFunction(templateId, params) {
  try {
    const res = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId, params })
    });
    if (!res.ok) throw new Error('Function responded ' + res.status);
    return true;
  } catch (err) {
    console.warn('[Email] Failed to send via function:', err);
    return false;
  }
}

function initContactForm() {
  const form = document.getElementById('luxuryContactForm');
  
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.submit-luxury-btn');
    const originalText = submitBtn.textContent;
    
    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.style.pointerEvents = 'none';
    submitBtn.innerHTML = `
      <svg class="btn-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      <span>Sending...</span>
    `;
    submitBtn.style.opacity = '0.85';
    submitBtn.style.background = 'linear-gradient(135deg, var(--color-forest-green), var(--color-deep-green))';
    
    // Get form data
    const formData = {
      name: form.querySelector('#name').value,
      email: form.querySelector('#email').value,
      phone: form.querySelector('#phone').value,
      interest: form.querySelector('#interest').value,
      message: form.querySelector('#message').value
    };

    try {
      // 1) Send email via Netlify Function (server-side — keys never exposed)
      await sendEmailViaFunction('owner', {
          to_email: 'reachus@foresta.ae',
          from_name: formData.name,
          from_email: formData.email,
          reply_to: formData.email,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          interest: formData.interest,
          message: formData.message,
          title: formData.interest || 'General Inquiry'
        });
        console.log('[Email] Email sent to owner successfully');

        // Send confirmation email to customer
        if (formData.email) {
          await sendEmailViaFunction('customer', {
            to_email: formData.email,
            from_name: 'Foresta Wood Industries',
            name: formData.name,
            email: 'reachus@foresta.ae',
            phone: '+971 54 786 2986',
            interest: formData.interest || 'General Inquiry',
            message: `Dear ${formData.name},\n\nThank you for reaching out to Foresta Wood Industries!\n\nWe have received your inquiry regarding: ${formData.interest || 'General Inquiry'}.\nOur team will review your message and get back to you shortly.\n\nIf you need immediate assistance, feel free to contact us at:\n📧 reachus@foresta.ae\n📱 +971 54 786 2986\n\nWarm regards,\nForesta Wood Industries`,
            title: 'Thank You for Contacting Foresta Wood Industries'
          });
          console.log('[Email] Confirmation email sent to customer');
        }

      // 2) Save inquiry to Firebase Firestore
      if (window.firebaseSaveInquiry) {
        await window.firebaseSaveInquiry(formData);
      }

      // 3) Also save/update the customer profile
      if (window.firebaseSaveProfile && formData.email) {
        await window.firebaseSaveProfile({
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        });
      }

      // Success feedback — checkmark animation
      submitBtn.style.opacity = '1';
      submitBtn.style.background = 'linear-gradient(135deg, #1a6b3c, #0e5a2a)';
      submitBtn.style.transform = 'scale(1.03)';
      submitBtn.innerHTML = `
        <svg class="btn-checkmark" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Message Sent!</span>
      `;
      
      // Reset form with field fade-out
      const fields = form.querySelectorAll('.form-group');
      fields.forEach((field, i) => {
        field.style.transition = `opacity 0.3s ease ${i * 0.05}s, transform 0.3s ease ${i * 0.05}s`;
        field.style.opacity = '0.4';
        field.style.transform = 'translateY(-4px)';
      });
      
      setTimeout(() => form.reset(), 400);
      
      // Show success notification
      showNotification('Thank you for your inquiry! Our team will get back to you within 1-2 business days.', 'success');
      
      // Restore form fields + button
      setTimeout(() => {
        fields.forEach((field) => {
          field.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          field.style.opacity = '1';
          field.style.transform = 'translateY(0)';
        });
        submitBtn.style.transform = 'scale(1)';
        submitBtn.disabled = false;
        submitBtn.style.pointerEvents = '';
        submitBtn.innerHTML = originalText;
        submitBtn.style.opacity = '1';
        submitBtn.style.background = 'linear-gradient(135deg, var(--color-forest-green), var(--color-deep-green))';
      }, 4000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Error feedback — shake animation
      submitBtn.style.opacity = '1';
      submitBtn.style.background = 'linear-gradient(135deg, #c41e3a, #a01830)';
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <span>Failed to Send</span>
      `;
      submitBtn.style.animation = 'btn-shake 0.5s ease';
      
      showNotification('There was an error sending your message. Please try again or contact us directly.', 'error');
      
      // Reset button after 4 seconds
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.style.pointerEvents = '';
        submitBtn.innerHTML = originalText;
        submitBtn.style.opacity = '1';
        submitBtn.style.background = 'linear-gradient(135deg, var(--color-forest-green), var(--color-deep-green))';
        submitBtn.style.animation = '';
      }, 4000);
    }
  });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
  // Remove any existing notification
  document.querySelectorAll('.foresta-notification').forEach(n => n.remove());

  const icon = type === 'success'
    ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="16 9 10.5 15 8 12.5"/></svg>'
    : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

  const notification = document.createElement('div');
  notification.className = 'foresta-notification';
  notification.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:14px;">
      <div style="flex-shrink:0;margin-top:1px;">${icon}</div>
      <div>
        <div style="font-weight:700;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">
          ${type === 'success' ? 'Inquiry Sent' : 'Something Went Wrong'}
        </div>
        <div style="font-size:0.88rem;line-height:1.5;opacity:0.92;">${message}</div>
      </div>
    </div>
    <div class="notif-progress" style="position:absolute;bottom:0;left:0;height:3px;background:rgba(255,255,255,0.4);border-radius:0 0 12px 12px;"></div>
  `;

  notification.style.cssText = `
    position: fixed;
    top: 24px;
    right: 24px;
    padding: 20px 24px;
    background: ${type === 'success'
      ? 'linear-gradient(135deg, #1a6b3c, #0e5a2a)'
      : 'linear-gradient(135deg, #c41e3a, #a01830)'};
    color: #fff;
    border-radius: 14px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    max-width: 420px;
    min-width: 300px;
    font-family: var(--font-body, system-ui, sans-serif);
    border: 1px solid rgba(255,255,255,0.15);
    backdrop-filter: blur(8px);
    cursor: pointer;
    overflow: hidden;
  `;

  document.body.appendChild(notification);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Progress bar animation
  const progress = notification.querySelector('.notif-progress');
  if (progress) {
    progress.style.width = '100%';
    progress.style.transition = 'width 5s linear';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { progress.style.width = '0%'; });
    });
  }

  // Click to dismiss
  notification.addEventListener('click', () => dismissNotification(notification));

  // Auto dismiss after 5 seconds
  setTimeout(() => dismissNotification(notification), 5200);
}

function dismissNotification(el) {
  if (!el || el._dismissed) return;
  el._dismissed = true;
  el.style.opacity = '0';
  el.style.transform = 'translateY(-10px) scale(0.95)';
  el.style.transition = 'all 0.35s ease';
  setTimeout(() => el.remove(), 400);
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
        const heroVideo = document.getElementById('heroVideo');
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
  const heroVideo = document.getElementById('heroVideo');

  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.setAttribute('muted', '');
    heroVideo.setAttribute('playsinline', '');

    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        document.addEventListener('touchstart', function() {
          heroVideo.play().catch(e => console.log('Play failed:', e));
        }, { once: true });
      });
    }
  }
}

// Run video optimization
optimizeVideoForMobile();

// ===== LAZY LOAD VIDEOS WITH data-src =====
if ('IntersectionObserver' in window) {
  const videoObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        if (video.dataset.src) {
          const source = document.createElement('source');
          source.src = video.dataset.src;
          source.type = 'video/mp4';
          video.appendChild(source);
          video.load();
          video.play().catch(function(){});
          delete video.dataset.src;
        }
        observer.unobserve(video);
      }
    });
  }, { rootMargin: '200px' });
  document.querySelectorAll('video[data-src]').forEach(v => videoObserver.observe(v));
}

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
  showNotification
};

console.log('🌲 Foresta Luxury Website Initialized');
