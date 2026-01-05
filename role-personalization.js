/*
 * Role-Based Website Personalization for Foresta
 * Powered by Google Gemini AI
 * Professional & Intelligent User Experience
 * Updated: Bottom Slide-In Card Design
 */

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyAuONT5-aL_iXMSHWaKCpF3Jje7EJQk-Ec';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

// Role Definitions with AI Context
const ROLE_PROFILES = {
  developers: {
    title: 'Developers',
    subtitle: 'Real Estate & Construction',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4"/></svg>`,
    image: 'assets/thumbnail 1.jpg',
    description: 'Access bulk solutions for large-scale construction projects with competitive pricing and reliable timelines.',
    fullDescription: 'Access bulk solutions for large-scale construction projects with competitive pricing and reliable timelines.',
    features: ['Bulk Orders', 'Project Support', 'Certifications'],
    aiContext: `The user is a Real Estate Developer looking for:
      - Bulk wood panel solutions for large projects
      - Technical specifications and certifications
      - Project timeline support and logistics
      - Competitive bulk pricing and quotations
      - Quality assurance for high-rise buildings
      Focus on: scale, reliability, certifications, timelines, B2B pricing.`,
    priorities: ['specifications', 'bulk-orders', 'certifications', 'timelines'],
    ctas: [
      { text: 'Request Bulk Quote', action: 'quote' },
      { text: 'Technical Specifications', action: 'specs' },
      { text: 'View Certifications', action: 'certifications' }
    ],
    hideSections: ['homeowner-tips', 'diy-guides'],
    highlightSections: ['products', 'quality', 'certifications']
  },
  joineries: {
    title: 'Joineries',
    subtitle: 'Workshops & Manufacturing',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    image: 'assets/thumbnail 2.jpg',
    description: 'Get raw materials, various dimensions, and wholesale pricing tailored for your workshop needs.',
    fullDescription: 'Get raw materials, various dimensions, and wholesale pricing tailored for your workshop needs.',
    features: ['All Dimensions', 'Wholesale Rates', 'Quick Delivery'],
    aiContext: `The user is a Joinery/Workshop Owner looking for:
      - Raw MDF materials and wood panels
      - Various dimensions, thicknesses, and finishes
      - Machinery compatibility information
      - Wholesale pricing and repeat-order options
      - Quick delivery and consistent stock availability
      Focus on: materials, dimensions, pricing tiers, stock availability, B2B terms.`,
    priorities: ['materials', 'dimensions', 'pricing', 'stock'],
    ctas: [
      { text: 'View Material Catalog', action: 'catalogs' },
      { text: 'Check Stock Availability', action: 'stock' },
      { text: 'Wholesale Pricing', action: 'pricing' }
    ],
    hideSections: ['inspiration-gallery', 'homeowner-tips'],
    highlightSections: ['products', 'pricing', 'materials']
  },
  architects: {
    title: 'Architects',
    subtitle: 'Design & Interior Professionals',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 20h20M5 20V10l7-7 7 7v10M9 20v-6h6v6"/><path d="M9 10h6v4H9z"/></svg>`,
    image: 'assets/thumbnail 3.jpg',
    description: 'Explore design catalogs, request samples, and access sustainability certifications for your projects.',
    fullDescription: 'Explore design catalogs, request samples, and access sustainability certifications for your projects.',
    features: ['Free Samples', 'Design Catalogs', 'Eco Certified'],
    aiContext: `The user is an Architect or Interior Designer looking for:
      - Design catalogs with textures and finishes
      - Inspiration galleries and project showcases
      - BIM/CAD file compatibility
      - Sustainability and environmental certifications
      - Sample requests for client presentations
      Focus on: aesthetics, design options, sustainability, samples, CAD files.`,
    priorities: ['design', 'samples', 'sustainability', 'inspiration'],
    ctas: [
      { text: 'Request Samples', action: 'samples' },
      { text: 'Design Catalog', action: 'catalogs' },
      { text: 'Sustainability Info', action: 'sustainability' }
    ],
    hideSections: ['bulk-pricing', 'wholesale-terms'],
    highlightSections: ['gallery', 'collections', 'sustainability']
  },
  showrooms: {
    title: 'Showrooms',
    subtitle: 'Retail & Distribution Partners',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    image: 'assets/thumbnail 4.jpg',
    description: 'Join our dealer network with exclusive resale pricing, marketing support, and partnership benefits.',
    fullDescription: 'Join our dealer network with exclusive resale pricing, marketing support, and partnership benefits.',
    features: ['Dealer Pricing', 'Marketing Kit', 'Partnership'],
    aiContext: `The user is a Showroom Owner/Distributor looking for:
      - Display-ready products for showrooms
      - Resale and distributor pricing
      - Marketing and branding support materials
      - Partnership and dealership programs
      - Logistics and delivery options
      Focus on: retail products, margins, partnerships, display materials, branding.`,
    priorities: ['partnerships', 'resale', 'display', 'branding'],
    ctas: [
      { text: 'Partnership Program', action: 'partnership' },
      { text: 'Resale Catalog', action: 'catalogs' },
      { text: 'Dealer Application', action: 'dealer' }
    ],
    hideSections: ['diy-guides', 'technical-specs'],
    highlightSections: ['products', 'partnership', 'catalogs']
  },
  homeowners: {
    title: 'Home Owners',
    subtitle: 'Personal & Home Projects',
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/><circle cx="12" cy="8" r="2"/></svg>`,
    image: 'assets/thumbnail 5.jpg',
    description: 'Find inspiration, explore options, and get simple guidance for your home renovation projects.',
    fullDescription: 'Find inspiration, explore options, and get simple guidance for your home renovation projects.',
    features: ['Inspiration', 'Easy Guide', 'Budget Options'],
    aiContext: `The user is a Home Owner looking for:
      - Simple explanations of wood panel options
      - Visual galleries and use-case examples
      - Budget-friendly options and price ranges
      - Maintenance tips and care guides
      - Easy inquiry and contact options
      Focus on: simplicity, visuals, budget, care tips, easy contact.`,
    priorities: ['visuals', 'budget', 'maintenance', 'simplicity'],
    ctas: [
      { text: 'Get Inspired', action: 'gallery' },
      { text: 'Easy Inquiry', action: 'contact' },
      { text: 'Care & Maintenance', action: 'maintenance' }
    ],
    hideSections: ['technical-specs', 'bulk-pricing', 'wholesale'],
    highlightSections: ['gallery', 'about', 'contact']
  }
};

// Company Context for AI
const COMPANY_CONTEXT = `You are Foresta's intelligent assistant - a premium MDF and wood solutions company in UAE.

COMPANY FACTS:
- 45+ years of manufacturing excellence
- Products: Lami Gloss, Lami Matt, Marble & Acrylic MDF panels
- ISO 9001:2015 certified | E1 Grade emission standards
- 100% sustainable, eco-friendly materials
- Location: Umm Al Quwain, UAE
- Contact: +971 54 786 2986 | reachus@foresta.ae
- Hours: Sunday-Thursday, 9 AM - 6 PM GST

RESPONSE STYLE:
- Professional yet friendly
- Concise and helpful
- Role-aware personalization
- Maximum 100 words per response`;

class RolePersonalization {
  constructor() {
    this.currentRole = null;
    this.roleCardShown = false;
    this.init();
  }

  init() {
    // Check if role already selected in session
    const savedRole = sessionStorage.getItem('forestaUserRole');
    if (savedRole && ROLE_PROFILES[savedRole]) {
      this.currentRole = savedRole;
      this.applyPersonalization(savedRole);
    }
    
    // Always render the cards section
    this.renderRoleCards();
  }

  renderRoleCards() {
    const container = document.getElementById('roleCardsGrid');
    if (!container) return;
    
    // Generate card HTML with image-based design
    container.innerHTML = Object.entries(ROLE_PROFILES).map(([key, role]) => `
      <div class="role-card${this.currentRole === key ? ' selected' : ''}" data-role="${key}">
        <div class="role-card-image">
          <img src="${role.image}" alt="${role.title}" loading="lazy">
          <div class="role-card-overlay"></div>
          <div class="role-card-badge">
            <div class="role-icon">${role.icon}</div>
          </div>
        </div>
        <div class="role-card-body">
          <div class="role-card-header">
            <h3 class="role-title">${role.title}</h3>
            <span class="role-subtitle">${role.subtitle || ''}</span>
          </div>
          <p class="role-desc">${role.description}</p>
          <div class="role-features">
            ${(role.features || []).slice(0, 3).map(f => `
              <span class="role-feature">${f}</span>
            `).join('')}
          </div>
          <a href="#" class="role-learn-more" data-role="${key}">
            Learn More
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    `).join('');
    
    // Add event listeners
    this.attachCardListeners(container);
    
    // Animate cards in on scroll
    this.observeCardsForAnimation();
  }

  attachCardListeners(container) {
    // Card click to select
    container.querySelectorAll('.role-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Don't trigger if clicking the button
        if (e.target.closest('.role-learn-more')) return;
        
        // Remove selected from all cards
        container.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
        // Add selected to clicked card
        card.classList.add('selected');
      });
    });
    
    // Learn more button click
    container.querySelectorAll('.role-learn-more').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const role = btn.dataset.role;
        
        // Remove selected from all cards
        container.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
        // Add selected to parent card
        btn.closest('.role-card').classList.add('selected');
        
        this.selectRole(role);
        
        // Scroll to next section smoothly
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          setTimeout(() => {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
          }, 500);
        }
      });
    });
  }

  observeCardsForAnimation() {
    const cards = document.querySelectorAll('.role-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach(card => observer.observe(card));
  }

  selectRole(role) {
    this.currentRole = role;
    sessionStorage.setItem('forestaUserRole', role);
    this.applyPersonalization(role);
    this.showWelcomeNotification(role);
  }

  applyPersonalization(role) {
    const profile = ROLE_PROFILES[role];
    if (!profile) return;

    // Add role class to body for CSS targeting
    document.body.setAttribute('data-user-role', role);
    
    // Update CTAs based on role
    this.updateCTAs(profile);
    
    // Show/hide sections based on role
    this.updateSectionVisibility(profile);
    
    // Update chat context
    this.updateChatContext(role);
    
    console.log(`🎯 Personalization applied for: ${profile.title}`);
  }

  updateCTAs(profile) {
    // Update hero CTA if exists
    const heroCta = document.querySelector('.hero-cta');
    if (heroCta && profile.ctas[0]) {
      heroCta.textContent = profile.ctas[0].text;
      heroCta.setAttribute('data-action', profile.ctas[0].action);
    }
  }

  updateSectionVisibility(profile) {
    // Highlight priority sections
    profile.highlightSections.forEach(section => {
      const el = document.querySelector(`#${section}, .${section}-section`);
      if (el) el.classList.add('role-highlighted');
    });
  }

  updateChatContext(role) {
    // Store role context for chat widget
    window.forestaUserRole = role;
    window.forestaRoleContext = ROLE_PROFILES[role].aiContext;
  }

  showWelcomeNotification(role) {
    const profile = ROLE_PROFILES[role];
    const notification = document.createElement('div');
    notification.className = 'role-welcome-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">${profile.icon}</div>
        <div class="notification-text">
          <strong>Welcome, ${profile.title}!</strong>
          <p>We've personalized your experience</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
      notification.classList.add('show');
    });
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 500);
    }, 4000);
  }

  // Get AI response with role context
  async getPersonalizedAIResponse(userMessage) {
    const roleContext = this.currentRole ? ROLE_PROFILES[this.currentRole].aiContext : '';
    
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${COMPANY_CONTEXT}

USER ROLE CONTEXT:
${roleContext}

USER QUESTION: ${userMessage}

Provide a professional, role-appropriate response. Be helpful and concise (max 100 words). 
If relevant, suggest next steps aligned with the user's role.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          }
        })
      });
      
      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
      console.error('Gemini API Error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  getFallbackResponse(message) {
    const profile = ROLE_PROFILES[this.currentRole];
    return `Thank you for your inquiry! As a ${profile?.title || 'valued customer'}, we're here to help. Please contact our team at +971 54 786 2986 or email reachus@foresta.ae for personalized assistance.`;
  }

  // Get current role
  getCurrentRole() {
    return this.currentRole;
  }

  // Get role profile
  getRoleProfile() {
    return this.currentRole ? ROLE_PROFILES[this.currentRole] : null;
  }

  // Change role - scroll to section and clear selection
  changeRole() {
    sessionStorage.removeItem('forestaUserRole');
    this.currentRole = null;
    document.body.removeAttribute('data-user-role');
    
    // Clear selected state from cards
    const container = document.getElementById('roleCardsGrid');
    if (container) {
      container.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
    }
    
    // Scroll to role section
    const roleSection = document.getElementById('who-are-you');
    if (roleSection) {
      roleSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.forestaPersonalization = new RolePersonalization();
});

// Export for use in other scripts
window.RolePersonalization = RolePersonalization;
window.ROLE_PROFILES = ROLE_PROFILES;
