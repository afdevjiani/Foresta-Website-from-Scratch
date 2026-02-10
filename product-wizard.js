/* ========================================
   PRODUCT SELECTION WIZARD - JAVASCRIPT
   Step-by-step guided product selection
   ======================================== */

class ProductWizard {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 3;
    this.state = {
      selectedDesign: 'kitchen',
      selectedFinish: 'lami-matt',
      cart: [],
      userDetails: {}
    };
    
    // Design options
    this.designs = [
      {
        id: 'kitchen',
        name: 'Kitchen Designs',
        icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v7"/></svg>',
        description: 'Modern and classic kitchen cabinet designs'
      },
      {
        id: 'bedroom',
        name: 'Bedroom Furniture',
        icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/></svg>',
        description: 'Elegant bedroom sets and wardrobes'
      },
      {
        id: 'living',
        name: 'Living Room',
        icon: '<svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3M2 11v5c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-5M4 18v3M20 18v3M12 11v7"/></svg>',
        description: 'Contemporary living room furniture'
      }
    ];
    
    // Finish types
    this.finishes = [
      {
        id: 'lami-matt',
        name: 'Lami Matt',
        description: 'Sophisticated matte laminated panels',
        image: 'assets/Lami matt front images/ICEBERG WHITE - FWI-03-101.webp'
      },
      {
        id: 'lami-gloss',
        name: 'Lami Gloss',
        description: 'Premium high-gloss laminated panels',
        image: 'assets/Lami gloss front images/ACACIA GRAY - FWI-03-113.webp'
      },
      {
        id: 'marble-acrylic',
        name: 'Marble / Acrylic',
        description: 'Luxury marble and acrylic patterns',
        image: 'assets/Marble and acrylic images/FMA02.webp'
      }
    ];
    
    this.init();
  }
  
  init() {
    this.createWizardHTML();
    this.attachEventListeners();
    this.loadStateFromStorage();
  }
  
  createWizardHTML() {
    const wizardHTML = `
      <div class="wizard-overlay" id="productWizard">
        <div class="wizard-container">
          <!-- Header -->
          <div class="wizard-header">
            <h2 class="wizard-title">Product Selection Wizard</h2>
            <button class="wizard-close" id="wizardClose">✕</button>
          </div>
          
          <!-- Progress Bar -->
          <div class="wizard-progress">
            <div class="progress-steps">
              <div class="progress-line">
                <div class="progress-line-fill" id="progressFill"></div>
              </div>
              <div class="progress-step" data-step="1">
                <div class="progress-circle">1</div>
                <span class="progress-label">Cart</span>
              </div>
              <div class="progress-step" data-step="2">
                <div class="progress-circle">2</div>
                <span class="progress-label">Details</span>
              </div>
              <div class="progress-step" data-step="3">
                <div class="progress-circle">3</div>
                <span class="progress-label">Complete</span>
              </div>
            </div>
          </div>
          
          <!-- Body -->
          <div class="wizard-body" id="wizardBody">
            <!-- Steps will be dynamically inserted here -->
          </div>
          
          <!-- Footer -->
          <div class="wizard-footer">
            <div class="cart-info" id="cartInfo" style="display: none;">
              <span class="cart-badge" id="cartCount">0</span>
              <span>Items in cart</span>
            </div>
            <div class="wizard-nav-buttons">
              <button class="wizard-btn wizard-btn-secondary" id="wizardBack" style="display: none;">
                ← Back
              </button>
              <button class="wizard-btn wizard-btn-primary" id="wizardNext" disabled>
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', wizardHTML);
  }
  
  attachEventListeners() {
    // Close wizard
    document.getElementById('wizardClose').addEventListener('click', () => this.close());
    
    // Navigation
    document.getElementById('wizardBack').addEventListener('click', () => this.previousStep());
    document.getElementById('wizardNext').addEventListener('click', () => this.nextStep());
    
    // Close on overlay click
    document.getElementById('productWizard').addEventListener('click', (e) => {
      if (e.target.id === 'productWizard') {
        this.close();
      }
    });
  }
  
  open() {
    document.getElementById('productWizard').classList.add('active');
    this.renderStep();
    document.body.style.overflow = 'hidden';
  }
  
  close() {
    document.getElementById('productWizard').classList.remove('active');
    document.body.style.overflow = '';
    this.saveStateToStorage();
  }
  
  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.renderStep();
      this.updateProgress();
    }
  }
  
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.renderStep();
      this.updateProgress();
    }
  }
  
  renderStep() {
    const body = document.getElementById('wizardBody');
    
    switch (this.currentStep) {
      case 1:
        body.innerHTML = this.renderCart();
        break;
      case 2:
        body.innerHTML = this.renderAppointmentForm();
        break;
      case 3:
        body.innerHTML = this.renderSuccess();
        break;
    }
    
    this.updateNavigationButtons();
    this.updateProgress();
    this.attachStepEventListeners();
  }
  
  renderDesignSelection() {
    return `
      <div class="wizard-step active">
        <h3 class="step-title">Select Your Design Category</h3>
        <p class="step-description">Choose the type of furniture you're looking for</p>
        <div class="design-grid">
          ${this.designs.map(design => `
            <div class="design-card ${this.state.selectedDesign === design.id ? 'selected' : ''}" 
                 data-design="${design.id}">
              <div class="design-icon">${design.icon}</div>
              <h4 class="design-name">${design.name}</h4>
              <p class="design-description">${design.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  renderFinishSelection() {
    return `
      <div class="wizard-step active">
        <h3 class="step-title">Choose Your Finish Type</h3>
        <p class="step-description">Select the finish that matches your style</p>
        <div class="finish-grid">
          ${this.finishes.map(finish => `
            <div class="finish-card ${this.state.selectedFinish === finish.id ? 'selected' : ''}" 
                 data-finish="${finish.id}">
              <img src="${finish.image}" alt="${finish.name}" class="finish-image" loading="lazy">
              <div class="finish-info">
                <h4 class="finish-name">${finish.name}</h4>
                <p class="finish-description">${finish.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  renderProductGallery() {
    const products = this.getProductsForSelection();
    
    return `
      <div class="wizard-step active">
        <h3 class="step-title">Select Your Products</h3>
        <p class="step-description">Click on products to view details and add to cart</p>
        <div class="wizard-gallery-grid">
          ${products.map(product => {
            const inCart = this.state.cart.some(item => item.id === product.id);
            return `
              <div class="wizard-product-card" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="wizard-product-image" loading="lazy">
                <div class="wizard-product-info">
                  <h5 class="wizard-product-name">${product.name}</h5>
                  <p class="wizard-product-code">${product.code}</p>
                  <button class="add-to-cart-btn ${inCart ? 'added' : ''}" 
                          data-product-id="${product.id}">
                    ${inCart ? 'Added to Cart' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
  
  renderCart() {
    if (this.state.cart.length === 0) {
      return `
        <div class="wizard-step active">
          <div class="cart-empty">
            <div class="cart-empty-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <h3 class="step-title">Your cart is empty</h3>
            <p class="step-description">Go back and add some products to continue</p>
          </div>
        </div>
      `;
    }
    
    return `
      <div class="wizard-step active">
        <h3 class="step-title">Review Your Cart</h3>
        <p class="step-description">Adjust quantities or proceed to book appointment</p>
        <div class="cart-container">
          <div class="cart-items">
            ${this.state.cart.map(item => `
              <div class="cart-item" data-cart-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                  <h5 class="cart-item-name">${item.name}</h5>
                  <p class="cart-item-meta">${item.code} • ${this.state.selectedFinish}</p>
                  <div class="quantity-controls">
                    <button class="quantity-btn" data-action="decrease" data-id="${item.id}">−</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                  </div>
                </div>
                <button class="cart-item-remove" data-remove-id="${item.id}">×</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
  
  renderAppointmentForm() {
    return `
      <div class="wizard-step active">
        <h3 class="step-title">Book Your Appointment</h3>
        <p class="step-description">Fill in your details to complete the booking</p>
        
        <div class="appointment-form">
          <!-- Selected Items Summary -->
          <div class="form-section">
            <h4 class="form-section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              Selected Products
            </h4>
            <div class="selected-items-summary">
              ${this.state.cart.map(item => `
                <div class="summary-item">
                  <img src="${item.image}" alt="${item.name}" class="summary-item-image">
                  <div class="summary-item-info">
                    <div class="summary-item-name">${item.name}</div>
                    <div class="summary-item-meta">${item.code} • Quantity: ${item.quantity}</div>
                  </div>
                </div>
              `).join('')}
              <div class="summary-item">
                <div class="summary-item-info">
                  <div class="summary-item-name">Design: ${this.state.selectedDesign}</div>
                  <div class="summary-item-name">Finish: ${this.state.selectedFinish}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- User Details Form -->
          <div class="form-section">
            <h4 class="form-section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Your Information
            </h4>
            <form id="appointmentDetailsForm">
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" for="userName">Name *</label>
                  <input type="text" id="userName" class="form-input" required 
                         placeholder="Enter your full name" value="${this.state.userDetails.name || ''}">
                  <span class="error-message" id="nameError"></span>
                </div>
                
                <div class="form-group">
                  <label class="form-label" for="userPhone">Contact Number *</label>
                  <input type="tel" id="userPhone" class="form-input" required 
                         placeholder="+971 XX XXX XXXX" value="${this.state.userDetails.phone || ''}">
                  <span class="error-message" id="phoneError"></span>
                </div>
                
                <div class="form-group">
                  <label class="form-label" for="userEmail">Email Address *</label>
                  <input type="email" id="userEmail" class="form-input" required 
                         placeholder="your.email@example.com" value="${this.state.userDetails.email || ''}">
                  <span class="error-message" id="emailError"></span>
                </div>
                
                <div class="form-group">
                  <label class="form-label" for="userCompany">Company Name *</label>
                  <input type="text" id="userCompany" class="form-input" required 
                         placeholder="Your company name" value="${this.state.userDetails.company || ''}">
                  <span class="error-message" id="companyError"></span>
                </div>
                
                <div class="form-group full-width">
                  <label class="form-label" for="userNotes">Additional Notes (Optional)</label>
                  <textarea id="userNotes" class="form-textarea" 
                            placeholder="Any special requirements or questions...">${this.state.userDetails.notes || ''}</textarea>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }
  
  renderSuccess() {
    return `
      <div class="wizard-step active">
        <div class="success-message">
          <div class="success-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h3 class="success-title">Appointment Booked Successfully!</h3>
          <p class="success-text">
            Thank you for your interest. We have received your appointment request and 
            will contact you shortly to confirm the details.
          </p>
          <button class="wizard-btn wizard-btn-primary" onclick="productWizard.close(); productWizard.reset();">
            Return to Home
          </button>
        </div>
      </div>
    `;
  }
  
  attachStepEventListeners() {
    // Step 1: Design selection
    document.querySelectorAll('[data-design]').forEach(card => {
      card.addEventListener('click', (e) => {
        const design = e.currentTarget.dataset.design;
        this.selectDesign(design);
      });
    });
    
    // Step 2: Finish selection
    document.querySelectorAll('[data-finish]').forEach(card => {
      card.addEventListener('click', (e) => {
        const finish = e.currentTarget.dataset.finish;
        this.selectFinish(finish);
      });
    });
    
    // Step 3: Add to cart
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const productId = e.target.dataset.productId;
        this.toggleCartItem(productId);
        this.renderStep(); // Re-render to update button states
      });
    });
    
    // Step 4: Quantity controls
    document.querySelectorAll('.quantity-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const id = e.target.dataset.id;
        this.updateQuantity(id, action);
      });
    });
    
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.removeId;
        this.removeFromCart(id);
      });
    });
    
    // Step 5: Form validation
    const form = document.getElementById('appointmentDetailsForm');
    if (form) {
      form.addEventListener('input', () => {
        this.validateForm();
      });
    }
  }
  
  selectDesign(designId) {
    this.state.selectedDesign = designId;
    document.querySelectorAll('[data-design]').forEach(card => {
      card.classList.toggle('selected', card.dataset.design === designId);
    });
    this.updateNavigationButtons();
    this.saveStateToStorage();
  }
  
  selectFinish(finishId) {
    this.state.selectedFinish = finishId;
    document.querySelectorAll('[data-finish]').forEach(card => {
      card.classList.toggle('selected', card.dataset.finish === finishId);
    });
    this.updateNavigationButtons();
    this.saveStateToStorage();
  }
  
  toggleCartItem(productId) {
    const products = this.getProductsForSelection();
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingIndex = this.state.cart.findIndex(item => item.id === productId);
    
    if (existingIndex >= 0) {
      this.state.cart.splice(existingIndex, 1);
    } else {
      this.state.cart.push({
        ...product,
        quantity: 1
      });
    }
    
    this.updateCartInfo();
    this.saveStateToStorage();
  }
  
  updateQuantity(productId, action) {
    const item = this.state.cart.find(i => i.id === productId);
    if (!item) return;
    
    if (action === 'increase') {
      item.quantity++;
    } else if (action === 'decrease' && item.quantity > 1) {
      item.quantity--;
    }
    
    this.renderStep();
    this.saveStateToStorage();
  }
  
  removeFromCart(productId) {
    this.state.cart = this.state.cart.filter(item => item.id !== productId);
    this.renderStep();
    this.updateCartInfo();
    this.saveStateToStorage();
  }
  
  getProductsForSelection() {
    // Map finish types to asset folders
    const finishFolders = {
      'lami-matt': {
        front: 'Lami matt front images',
        kitchen: 'Lami Matt kitchen images',
        products: [
          { id: 'lm-acacia', name: 'ACACIA GRAY', code: 'FWI-04-113', file: 'ACACIA GRAY - FWI-04-113.webp' },
          { id: 'lm-almond', name: 'ALMOND YELLOW', code: 'FWI-04-138', file: 'ALMOND YELLOW - FWI - 04-138.webp' },
          { id: 'lm-iceberg', name: 'ICEBERG WHITE', code: 'FWI-03-101', file: 'ICEBERG WHITE - FWI-03-101.webp' },
          { id: 'lm-bronze', name: 'BRONZE GOLD MATT', code: 'FWI-10-142', file: 'Bronze Gold Matt - FWI-10-142.webp' }
        ]
      },
      'lami-gloss': {
        front: 'Lami gloss front images',
        kitchen: 'Lami Gloss kitchen images',
        products: [
          { id: 'lg-acacia', name: 'ACACIA GRAY', code: 'FWI-03-113', file: 'ACACIA GRAY - FWI-03-113.webp' },
          { id: 'lg-bronze', name: 'BRONZE GOLD GLOSS', code: 'FWI-09-142', file: 'Bronze Gold Gloss - FWI-09-142.webp' },
          { id: 'lg-cardamom', name: 'CARDAMOM GREEN', code: 'FWI-03-116', file: 'CARDAMOM GREEN - FWI-03-116.webp' },
          { id: 'lg-carmine', name: 'CARMINE RED', code: 'FWI-03-118', file: 'Carmine Red FWI- 03-118.webp' }
        ]
      },
      'marble-acrylic': {
        front: 'Marble and acrylic images',
        kitchen: 'Marble and acrylic kitchen images',
        products: [
          { id: 'ma-fma02', name: 'Marble Pattern FMA02', code: 'FMA02', file: 'FMA02.webp' },
          { id: 'ma-fma03', name: 'Marble Pattern FMA03', code: 'FMA03', file: 'FMA03.webp' },
          { id: 'ma-fma05', name: 'Marble Pattern FMA05', code: 'FMA05', file: 'FMA05.webp' },
          { id: 'ma-fma07', name: 'Marble Pattern FMA07', code: 'FMA07', file: 'FMA07.webp' }
        ]
      }
    };
    
    const finish = finishFolders[this.state.selectedFinish];
    if (!finish) return [];
    
    return finish.products.map(p => ({
      ...p,
      image: `assets/${finish.front}/${p.file}`
    }));
  }
  
  validateForm() {
    const name = document.getElementById('userName').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const company = document.getElementById('userCompany').value.trim();
    
    let isValid = true;
    
    // Name validation
    if (!name) {
      document.getElementById('nameError').textContent = 'Name is required';
      document.getElementById('userName').classList.add('error');
      isValid = false;
    } else {
      document.getElementById('nameError').textContent = '';
      document.getElementById('userName').classList.remove('error');
    }
    
    // Phone validation
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phone) {
      document.getElementById('phoneError').textContent = 'Phone number is required';
      document.getElementById('userPhone').classList.add('error');
      isValid = false;
    } else if (!phoneRegex.test(phone)) {
      document.getElementById('phoneError').textContent = 'Invalid phone number';
      document.getElementById('userPhone').classList.add('error');
      isValid = false;
    } else {
      document.getElementById('phoneError').textContent = '';
      document.getElementById('userPhone').classList.remove('error');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      document.getElementById('emailError').textContent = 'Email is required';
      document.getElementById('userEmail').classList.add('error');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      document.getElementById('emailError').textContent = 'Invalid email address';
      document.getElementById('userEmail').classList.add('error');
      isValid = false;
    } else {
      document.getElementById('emailError').textContent = '';
      document.getElementById('userEmail').classList.remove('error');
    }
    
    // Company validation
    if (!company) {
      document.getElementById('companyError').textContent = 'Company name is required';
      document.getElementById('userCompany').classList.add('error');
      isValid = false;
    } else {
      document.getElementById('companyError').textContent = '';
      document.getElementById('userCompany').classList.remove('error');
    }
    
    // Store values
    this.state.userDetails = {
      name,
      phone,
      email,
      company,
      notes: document.getElementById('userNotes').value.trim()
    };
    
    this.updateNavigationButtons();
    return isValid;
  }
  
  async submitAppointment() {
    if (!this.validateForm()) {
      alert('Please fill in all required fields correctly.');
      return;
    }
    
    const appointmentData = {
      design: this.state.selectedDesign,
      finish: this.state.selectedFinish,
      products: this.state.cart,
      userDetails: this.state.userDetails,
      timestamp: new Date().toISOString()
    };
    
    // Send via WhatsApp
    const whatsappMessage = this.formatWhatsAppMessage(appointmentData);
    const whatsappNumber = '971547862986';
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(whatsappMessage)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Send via Email (if EmailJS is configured)
    try {
      if (typeof emailjs !== 'undefined') {
        await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
          to_email: 'reachus@foresta.ae',
          subject: 'New Appointment Request',
          message: this.formatEmailMessage(appointmentData)
        });
      }
    } catch (error) {
      console.error('Email send error:', error);
    }
    
    // Move to success step
    this.nextStep();
  }
  
  formatWhatsAppMessage(data) {
    let message = `*Foresta - New Appointment Request*\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${data.userDetails.name}\n`;
    message += `Phone: ${data.userDetails.phone}\n`;
    message += `Email: ${data.userDetails.email}\n`;
    message += `Company: ${data.userDetails.company}\n\n`;
    
    message += `*Selection:*\n`;
    message += `Design: ${data.design}\n`;
    message += `Finish: ${data.finish}\n\n`;
    
    message += `*Products:*\n`;
    data.products.forEach((product, index) => {
      message += `${index + 1}. ${product.name} (${product.code}) - Qty: ${product.quantity}\n`;
    });
    
    if (data.userDetails.notes) {
      message += `\n*Notes:*\n${data.userDetails.notes}`;
    }
    
    return message;
  }
  
  formatEmailMessage(data) {
    // Similar to WhatsApp but in HTML format for email
    return this.formatWhatsAppMessage(data);
  }
  
  updateNavigationButtons() {
    const backBtn = document.getElementById('wizardBack');
    const nextBtn = document.getElementById('wizardNext');
    
    // Show/hide back button
    backBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
    
    // Update next button state
    let canProceed = false;
    
    switch (this.currentStep) {
      case 1:
        canProceed = this.state.cart.length > 0;
        nextBtn.textContent = 'Book Appointment →';
        break;
      case 2:
        canProceed = this.validateForm();
        nextBtn.textContent = 'Submit Appointment →';
        nextBtn.onclick = () => this.submitAppointment();
        return; // Don't set default onclick
      case 3:
        nextBtn.style.display = 'none';
        return;
      default:
        nextBtn.textContent = 'Next →';
    }
    
    nextBtn.disabled = !canProceed;
    nextBtn.onclick = null; // Remove custom onclick for normal steps
  }
  
  updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    const percentage = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
    progressFill.style.width = `${percentage}%`;
    
    progressSteps.forEach((step, index) => {
      const stepNumber = index + 1;
      if (stepNumber < this.currentStep) {
        step.classList.add('completed');
        step.classList.remove('active');
      } else if (stepNumber === this.currentStep) {
        step.classList.add('active');
        step.classList.remove('completed');
      } else {
        step.classList.remove('active', 'completed');
      }
    });
  }
  
  updateCartInfo() {
    const cartInfo = document.getElementById('cartInfo');
    const cartCount = document.getElementById('cartCount');
    
    if (this.state.cart.length > 0) {
      cartInfo.style.display = 'flex';
      cartCount.textContent = this.state.cart.length;
    } else {
      cartInfo.style.display = 'none';
    }
  }
  
  saveStateToStorage() {
    try {
      localStorage.setItem('forestaWizardState', JSON.stringify(this.state));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }
  
  loadStateFromStorage() {
    try {
      const saved = localStorage.getItem('forestaWizardState');
      if (saved) {
        this.state = JSON.parse(saved);
        this.updateCartInfo();
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
  }
  
  reset() {
    this.currentStep = 1;
    this.state = {
      selectedDesign: null,
      selectedFinish: null,
      cart: [],
      userDetails: {}
    };
    localStorage.removeItem('forestaWizardState');
    this.updateCartInfo();
  }
}

// Initialize wizard when DOM is ready
let productWizard;
document.addEventListener('DOMContentLoaded', () => {
  productWizard = new ProductWizard();
  
  // Make it globally accessible
  window.productWizard = productWizard;
  
  // Check if we should open wizard from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('openWizard') === 'true') {
    productWizard.open();
    const step = parseInt(urlParams.get('step'));
    // Map old step 4 to new step 1 (Cart)
    if (step === 4 || step === 1) {
      productWizard.currentStep = 1;
      productWizard.renderStep();
    }
    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});

// Global function to open wizard
window.openProductWizard = function() {
  if (window.productWizard) {
    window.productWizard.open();
  }
};
