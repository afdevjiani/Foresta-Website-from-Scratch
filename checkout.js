/**
 * Foresta Checkout Flow
 * Multi-step checkout with cart management, form validation, and booking integration
 */

// ===== Configuration =====
const CONFIG = {
  whatsappNumber: '971547862986',
  email: 'reachus@foresta.ae',
  storageKey: 'foresta_cart',
  customerKey: 'foresta_customer'
};

// ===== State Management =====
let currentStep = 1;
let cart = [];
let customerData = {};

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
  loadCartFromStorage();
  loadCustomerFromStorage();
  initializeCheckout();
  updateCartDisplay();
  updateProgressIndicator();
});

// ===== Cart Storage Functions =====
function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(CONFIG.storageKey);
    cart = stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading cart:', e);
    cart = [];
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(cart));
  } catch (e) {
    console.error('Error saving cart:', e);
  }
}

function loadCustomerFromStorage() {
  try {
    const stored = localStorage.getItem(CONFIG.customerKey);
    customerData = stored ? JSON.parse(stored) : {};
    
    // Pre-fill form if data exists
    if (customerData.name) {
      const nameInput = document.getElementById('customerName');
      if (nameInput) nameInput.value = customerData.name;
    }
    if (customerData.phone) {
      const phoneInput = document.getElementById('customerPhone');
      if (phoneInput) phoneInput.value = customerData.phone;
    }
    if (customerData.email) {
      const emailInput = document.getElementById('customerEmail');
      if (emailInput) emailInput.value = customerData.email;
    }
    if (customerData.company) {
      const companyInput = document.getElementById('customerCompany');
      if (companyInput) companyInput.value = customerData.company;
    }
    if (customerData.notes) {
      const notesInput = document.getElementById('customerNotes');
      if (notesInput) notesInput.value = customerData.notes;
    }
  } catch (e) {
    console.error('Error loading customer data:', e);
    customerData = {};
  }
}

function saveCustomerToStorage() {
  try {
    localStorage.setItem(CONFIG.customerKey, JSON.stringify(customerData));
  } catch (e) {
    console.error('Error saving customer data:', e);
  }
}

// ===== Cart Management Functions =====
// These functions are called from the product page
window.addToCart = function(product) {
  // Product object should contain: id, name, category, type, frontImage, previewImage
  const existingIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
      width: '',
      height: '',
      depth: ''
    });
  }
  
  saveCartToStorage();
  updateCartBadge();
  showAddedToCartNotification(product.name);
};

window.removeFromCart = function(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCartToStorage();
  updateCartDisplay();
  updateCartBadge();
};

window.updateQuantity = function(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = Math.max(1, item.quantity + change);
    saveCartToStorage();
    updateCartDisplay();
  }
};

window.getCartCount = function() {
  return cart.reduce((total, item) => total + item.quantity, 0);
};

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    const count = window.getCartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function showAddedToCartNotification(productName) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${productName} added to cart!</span>
  `;
  
  // Style the notification
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
    animation: 'slideInRight 0.4s ease, fadeOut 0.4s ease 2.6s forwards'
  });
  
  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
      to { opacity: 0; transform: translateX(100%); }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Remove after animation
  setTimeout(() => {
    notification.remove();
    style.remove();
  }, 3000);
}

// ===== Checkout Display Functions =====
function initializeCheckout() {
  // Set up navigation buttons
  const backBtn = document.getElementById('backBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (backBtn) backBtn.addEventListener('click', goToPreviousStep);
  if (nextBtn) nextBtn.addEventListener('click', goToNextStep);
  
  // Set up edit buttons
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetStep = parseInt(btn.dataset.step);
      if (targetStep) goToStep(targetStep);
    });
  });
  
  // Set up form inputs
  setupFormValidation();
}

function updateCartDisplay() {
  const cartContainer = document.getElementById('cartContainer');
  const emptyCart = document.getElementById('emptyCart');
  const nextBtn = document.getElementById('nextBtn');
  
  console.log('Cart items:', cart.length); // Debug log
  
  if (!cartContainer) {
    console.log('Cart container not found');
    return;
  }
  
  if (cart.length === 0) {
    cartContainer.innerHTML = '';
    if (emptyCart) emptyCart.style.display = 'block';
    if (nextBtn) nextBtn.disabled = true;
    return;
  }
  
  // Hide empty cart message when there are items
  if (emptyCart) emptyCart.style.display = 'none';
  if (nextBtn) nextBtn.disabled = false;
  
  cartContainer.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-image">
        <img src="${item.frontImage}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <h3 class="cart-item-name">${item.name}</h3>
        <p class="cart-item-meta">
          <span>${item.code || ''}</span>
          <span>${item.type}</span>
        </p>
        <div class="cart-item-quantity">
          <span class="quantity-label">Quantity:</span>
          <div class="quantity-controls">
            <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
          </div>
        </div>
      </div>
      <div class="cart-item-actions">
        <button class="remove-btn" onclick="removeFromCart('${item.id}')" title="Remove item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
}

function updateProductDetailsList() {
  const productList = document.getElementById('productDetailsList');
  if (!productList) return;
  
  productList.innerHTML = cart.map(item => `
    <div class="product-detail-card" data-id="${item.id}">
      <div class="product-detail-header">
        <div class="product-detail-image">
          <img src="${item.frontImage}" alt="${item.name}">
        </div>
        <div class="product-detail-info">
          <h4>${item.name}</h4>
          <p>${item.code || ''} • ${item.type} • Qty: ${item.quantity}</p>
        </div>
      </div>
      <div class="product-detail-fields">
        <div class="form-group full-width">
          <label>Panel Size <span class="required">*</span></label>
          <select class="size-select" data-id="${item.id}">
            <option value="">Select Size</option>
            <option value="1220 × 3050 × 18mm" ${item.size === '1220 × 3050 × 18mm' ? 'selected' : ''}>1220 × 3050 × 18mm</option>
            <option value="1220 × 2800 × 18mm" ${item.size === '1220 × 2800 × 18mm' ? 'selected' : ''}>1220 × 2800 × 18mm</option>
            <option value="1220 × 2440 × 18mm" ${item.size === '1220 × 2440 × 18mm' ? 'selected' : ''}>1220 × 2440 × 18mm</option>
          </select>
        </div>
      </div>
    </div>
  `).join('');
  
  // Add event listeners for size select
  productList.querySelectorAll('.size-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      const item = cart.find(i => i.id === id);
      if (item) {
        item.size = e.target.value;
        saveCartToStorage();
      }
    });
  });
}

function updateSummary() {
  // Update customer summary
  const customerSummary = document.getElementById('customerSummary');
  if (customerSummary) {
    customerSummary.innerHTML = `
      <div class="summary-row">
        <span class="label">Name</span>
        <span class="value">${customerData.name || '-'}</span>
      </div>
      <div class="summary-row">
        <span class="label">Phone</span>
        <span class="value">${customerData.phone || '-'}</span>
      </div>
      <div class="summary-row">
        <span class="label">Email</span>
        <span class="value">${customerData.email || '-'}</span>
      </div>
      ${customerData.company ? `
        <div class="summary-row">
          <span class="label">Company</span>
          <span class="value">${customerData.company}</span>
        </div>
      ` : ''}
      ${customerData.notes ? `
        <div class="summary-row">
          <span class="label">Notes</span>
          <span class="value">${customerData.notes}</span>
        </div>
      ` : ''}
    `;
  }
  
  // Update products summary
  const productsSummary = document.getElementById('productsSummary');
  if (productsSummary) {
    productsSummary.innerHTML = cart.map(item => `
      <div class="summary-product">
        <div class="summary-product-image">
          <img src="${item.frontImage}" alt="${item.name}">
        </div>
        <div class="summary-product-details">
          <h4 class="summary-product-name">${item.name}</h4>
          <p class="summary-product-meta">
            ${item.code || ''} • ${item.type}<br>
            Quantity: ${item.quantity}<br>
            Size: ${item.size || 'Not selected'}
          </p>
        </div>
      </div>
    `).join('');
  }
}

// ===== Form Validation =====
function setupFormValidation() {
  const form = document.getElementById('detailsForm');
  if (!form) return;
  
  // Real-time validation
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });
}

function validateField(input) {
  const errorEl = input.parentElement.querySelector('.error-message');
  let isValid = true;
  let message = '';
  
  // Required validation
  if (input.required && !input.value.trim()) {
    isValid = false;
    message = 'This field is required';
  }
  
  // Email validation
  if (input.type === 'email' && input.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value)) {
      isValid = false;
      message = 'Please enter a valid email';
    }
  }
  
  // Phone validation
  if (input.type === 'tel' && input.value) {
    const phoneRegex = /^[+]?[\d\s\-()]{8,}$/;
    if (!phoneRegex.test(input.value)) {
      isValid = false;
      message = 'Please enter a valid phone number';
    }
  }
  
  // Update UI
  if (isValid) {
    input.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
  } else {
    input.classList.add('error');
    if (errorEl) errorEl.textContent = message;
  }
  
  return isValid;
}

function validateStep2() {
  let isValid = true;
  
  // Validate customer info
  const requiredFields = ['customerName', 'customerPhone', 'customerEmail'];
  requiredFields.forEach(id => {
    const input = document.getElementById(id);
    if (input && !validateField(input)) {
      isValid = false;
    }
  });
  
  // Validate product sizes
  cart.forEach(item => {
    const sizeSelect = document.querySelector(`.size-select[data-id="${item.id}"]`);
    
    if (sizeSelect && !sizeSelect.value) {
      sizeSelect.style.borderColor = 'var(--checkout-error)';
      isValid = false;
    } else if (sizeSelect) {
      sizeSelect.style.borderColor = '';
    }
  });
  
  return isValid;
}

function collectFormData() {
  customerData = {
    name: document.getElementById('customerName')?.value || '',
    phone: document.getElementById('customerPhone')?.value || '',
    email: document.getElementById('customerEmail')?.value || '',
    company: document.getElementById('customerCompany')?.value || '',
    notes: document.getElementById('customerNotes')?.value || ''
  };
  
  // Collect size data
  cart.forEach(item => {
    const sizeSelect = document.querySelector(`.size-select[data-id="${item.id}"]`);
    if (sizeSelect) item.size = sizeSelect.value;
  });
  
  saveCustomerToStorage();
  saveCartToStorage();
}

// ===== Navigation =====
function goToStep(step) {
  if (step < 1 || step > 4) return;
  
  // Hide all steps
  document.querySelectorAll('.checkout-step').forEach(el => {
    el.style.display = 'none';
  });
  
  // Show target step
  const targetStep = document.getElementById(`step${step}`);
  if (targetStep) {
    targetStep.style.display = 'block';
  }
  
  // Update current step
  currentStep = step;
  
  // Update progress indicator
  updateProgressIndicator();
  
  // Update navigation buttons
  updateNavigationButtons();
  
  // Perform step-specific actions
  if (step === 2) {
    updateProductDetailsList();
  } else if (step === 3) {
    updateSummary();
  }
}

function goToNextStep() {
  if (currentStep === 1) {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add some products first.');
      return;
    }
    goToStep(2);
  } else if (currentStep === 2) {
    collectFormData();
    if (!validateStep2()) {
      alert('Please fill in all required fields and provide sizes for all products.');
      return;
    }
    goToStep(3);
  } else if (currentStep === 3) {
    // Show booking options
    showBookingOptions();
  }
}

function goToPreviousStep() {
  if (currentStep > 1) {
    goToStep(currentStep - 1);
  }
}

// Global functions for HTML onclick handlers
window.nextStep = goToNextStep;
window.previousStep = goToPreviousStep;

function updateProgressIndicator() {
  const steps = document.querySelectorAll('.progress-step');
  const progressFill = document.querySelector('.progress-fill');
  
  steps.forEach((step, index) => {
    const stepNum = index + 1;
    step.classList.remove('active', 'completed');
    
    if (stepNum < currentStep) {
      step.classList.add('completed');
    } else if (stepNum === currentStep) {
      step.classList.add('active');
    }
  });
  
  // Update progress bar
  if (progressFill) {
    const progress = ((currentStep - 1) / 2) * 100;
    progressFill.style.width = `${progress}%`;
  }
}

function updateNavigationButtons() {
  const backBtn = document.getElementById('backBtn');
  const nextBtn = document.getElementById('nextBtn');
  const navContainer = document.querySelector('.checkout-navigation');
  
  if (!navContainer) return;
  
  // Hide navigation on success step
  if (currentStep === 4) {
    navContainer.style.display = 'none';
    return;
  }
  
  navContainer.style.display = 'flex';
  
  if (backBtn) {
    backBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
  }

  // Hide "Continue Shopping" bottom link when Back button is visible
  const continueBottom = document.getElementById('continueShoppingBottom');
  if (continueBottom) {
    continueBottom.style.display = currentStep > 1 ? 'none' : '';
  }
  
  if (nextBtn) {
    if (currentStep === 1) {
      nextBtn.innerHTML = `
        <span>Next</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14"></path>
          <path d="M12 5l7 7-7 7"></path>
        </svg>
      `;
    } else if (currentStep === 3) {
      nextBtn.innerHTML = `
        <span>Book an Appointment</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14"></path>
          <path d="M12 5l7 7-7 7"></path>
        </svg>
      `;
    } else {
      nextBtn.innerHTML = `
        <span>Next</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14"></path>
          <path d="M12 5l7 7-7 7"></path>
        </svg>
      `;
    }
    
    nextBtn.disabled = currentStep === 1 && cart.length === 0;
  }
}

// ===== PDF Generation =====
function generateAndDownloadPDF() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    console.error('jsPDF not loaded');
    return null;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 20;
  const CONTENT_W = PAGE_W - MARGIN * 2;

  // Professional brand colors
  const deepGreen = [12, 67, 38];
  const headerGreen = [25, 82, 52];
  const white = [255, 255, 255];
  const black = [0, 0, 0];
  const tableGray = [249, 250, 251];
  const borderGray = [229, 231, 235];

  let y = MARGIN;

  // ═══════════════════════════════════════════════════
  // HEADER - Clean and Corporate
  // ═══════════════════════════════════════════════════
  doc.setTextColor(...deepGreen);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('FORESTA WOOD INDUSTRIES', MARGIN, y);

  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('QUOTATION REQUEST', MARGIN, y);

  // Date on top right
  const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.setTextColor(...black);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('DATE:', PAGE_W - MARGIN - 40, MARGIN);
  doc.setFont('helvetica', 'normal');
  doc.text(date, PAGE_W - MARGIN, MARGIN, { align: 'right' });

  y += 10;

  // Horizontal line separator
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);

  y += 10;

  // ═══════════════════════════════════════════════════
  // CUSTOMER DETAILS
  // ═══════════════════════════════════════════════════
  doc.setFillColor(...headerGreen);
  doc.rect(MARGIN, y, CONTENT_W, 7, 'F');
  
  doc.setTextColor(...white);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('CUSTOMER DETAILS', MARGIN + 3, y + 4.5);

  y += 10;

  // Two-column layout
  const col1X = MARGIN + 3;
  const col2X = MARGIN + CONTENT_W / 2 + 3;
  const labelWidth = 22;
  const rowH = 7;

  doc.setFontSize(9);
  doc.setTextColor(...black);

  // Row 1: Full Name | Phone
  doc.setFont('helvetica', 'bold');
  doc.text('Full Name:', col1X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(customerData.name || '-', col1X + labelWidth, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Phone:', col2X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(customerData.phone || '-', col2X + labelWidth, y);

  y += rowH;

  // Row 2: Email | Company
  doc.setFont('helvetica', 'bold');
  doc.text('Email:', col1X, y);
  doc.setFont('helvetica', 'normal');
  const emailText = (customerData.email || '-').substring(0, 40);
  doc.text(emailText, col1X + labelWidth, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Company:', col2X, y);
  doc.setFont('helvetica', 'normal');
  doc.text(customerData.company || '-', col2X + labelWidth, y);

  y += rowH + 8;

  // ═══════════════════════════════════════════════════
  // PRODUCT DETAILS - Clean Professional Table
  // ═══════════════════════════════════════════════════
  doc.setFillColor(...headerGreen);
  doc.rect(MARGIN, y, CONTENT_W, 7, 'F');
  
  doc.setTextColor(...white);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('PRODUCT DETAILS', MARGIN + 3, y + 4.5);

  y += 10;

  const tableHead = [['Product Name', 'Code', 'Category', 'Panel Size', 'Qty']];
  const tableBody = cart.map((item) => [
    item.name || '-',
    item.code || '-',
    item.type || '-',
    item.size || 'Not selected',
    String(item.quantity)
  ]);

  doc.autoTable({
    startY: y,
    head: tableHead,
    body: tableBody,
    margin: { left: MARGIN, right: MARGIN },
    theme: 'grid',
    headStyles: {
      fillColor: deepGreen,
      textColor: white,
      fontStyle: 'bold',
      fontSize: 9,
      cellPadding: { top: 4, bottom: 4, left: 4, right: 4 },
      halign: 'left',
      lineWidth: 0.1,
      lineColor: white
    },
    bodyStyles: {
      fontSize: 9,
      textColor: black,
      cellPadding: { top: 4, bottom: 4, left: 4, right: 4 },
      lineWidth: 0.1,
      lineColor: borderGray,
      overflow: 'linebreak',
      cellWidth: 'wrap'
    },
    alternateRowStyles: {
      fillColor: tableGray
    },
    columnStyles: {
      0: { cellWidth: 55, halign: 'left', fontStyle: 'bold' },
      1: { cellWidth: 30, halign: 'left', overflow: 'visible', cellWidth: 'auto' },
      2: { cellWidth: 35, halign: 'left' },
      3: { cellWidth: 40, halign: 'left' },
      4: { cellWidth: 10, halign: 'center', fontStyle: 'bold' }
    }
  });

  y = doc.lastAutoTable.finalY + 10;

  // ═══════════════════════════════════════════════════
  // QUOTATION SUMMARY - Clean Bar
  // ═══════════════════════════════════════════════════
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalProducts = cart.length;

  doc.setFillColor(...headerGreen);
  doc.rect(MARGIN, y, CONTENT_W, 7, 'F');

  doc.setTextColor(...white);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('QUOTATION SUMMARY', MARGIN + 3, y + 4.5);

  y += 10;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...black);
  doc.text(`Total Products: ${totalProducts}  |  Total Quantity: ${totalItems} panel(s)`, MARGIN + 3, y);

  // ═══════════════════════════════════════════════════
  // FOOTER - Minimal Professional
  // ═══════════════════════════════════════════════════
  const footerY = PAGE_H - 20;
  
  doc.setDrawColor(...borderGray);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, footerY, PAGE_W - MARGIN, footerY);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Thank you for choosing Foresta Wood Industries', PAGE_W / 2, footerY + 5, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('reachus@foresta.ae  |  +971 54 786 2986  |  foresta.ae', PAGE_W / 2, footerY + 10, { align: 'center' });

  // ═══════════════════════════════════════════════════
  // SAVE PDF
  // ═══════════════════════════════════════════════════
  const timestamp = Date.now().toString().slice(-5);
  const fileName = `Foresta-Quotation-${timestamp}.pdf`;
  doc.save(fileName);

  return timestamp;
}

// ===== Booking Functions =====
function showBookingOptions() {
  // Create modal for booking options
  const modal = document.createElement('div');
  modal.className = 'booking-modal';
  modal.innerHTML = `
    <div class="booking-modal-backdrop"></div>
    <div class="booking-modal-content">
      <h3>Send Your Quotation</h3>
      <p>How would you like to receive your quotation?</p>
      <div class="booking-options">
        <button class="booking-option whatsapp" onclick="bookViaWhatsApp()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span>WhatsApp</span>
          <small>Instant response</small>
        </button>
        <button class="booking-option email" onclick="bookViaEmail()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <span>Email</span>
          <small>Detailed quotation</small>
        </button>
      </div>
      <button class="close-modal" onclick="closeBookingModal()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `;
  
  // Add modal styles
  const modalStyle = document.createElement('style');
  modalStyle.textContent = `
    .booking-modal {
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .booking-modal-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
    }
    .booking-modal-content {
      position: relative;
      background: white;
      border-radius: 20px;
      padding: 2.5rem;
      max-width: 400px;
      width: 100%;
      text-align: center;
      animation: modalSlideIn 0.3s ease;
    }
    @keyframes modalSlideIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .booking-modal-content h3 {
      font-size: 1.5rem;
      color: #1a1a1a;
      margin: 0 0 0.5rem;
    }
    .booking-modal-content > p {
      font-size: 1rem;
      color: #64748b;
      margin: 0 0 2rem;
    }
    .booking-options {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    .booking-option {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1.5rem;
      border: 2px solid rgba(26, 69, 46, 0.12);
      border-radius: 16px;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .booking-option:hover {
      border-color: #0c4326;
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(12, 67, 38, 0.15);
    }
    .booking-option.whatsapp:hover {
      border-color: #25D366;
    }
    .booking-option.whatsapp svg {
      color: #25D366;
    }
    .booking-option.email svg {
      color: #0c4326;
    }
    .booking-option span {
      font-size: 1rem;
      font-weight: 600;
      color: #1a1a1a;
    }
    .booking-option small {
      font-size: 0.75rem;
      color: #64748b;
    }
    .close-modal {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 36px;
      height: 36px;
      border: none;
      background: #f1f5f9;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      transition: all 0.2s ease;
    }
    .close-modal:hover {
      background: #e2e8f0;
      color: #1a1a1a;
    }
  `;
  
  document.head.appendChild(modalStyle);
  document.body.appendChild(modal);
  
  // Store reference for cleanup
  modal._style = modalStyle;
}

window.closeBookingModal = function() {
  const modal = document.querySelector('.booking-modal');
  if (modal) {
    if (modal._style) modal._style.remove();
    modal.remove();
  }
};

window.bookViaWhatsApp = function() {
  // 1. Generate & download the PDF first
  const refNum = generateAndDownloadPDF();

  // 2. Build the WhatsApp text message (PDF already saved locally)
  const message = generateBookingMessage(refNum);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;

  // 3. Short delay so browser triggers the PDF download before opening WhatsApp
  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
  }, 600);

  closeBookingModal();
  showSuccessStep('WhatsApp');
};

window.bookViaEmail = function() {
  // 1. Generate & download the PDF first
  const refNum = generateAndDownloadPDF();

  // 2. Open email client with pre-filled subject + body
  //    (Customer can attach the downloaded PDF manually)
  const subject = 'Appointment Request - Foresta Wood Industries [' + (refNum || '') + ']';
  const body    = generateBookingMessage(refNum);
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody    = encodeURIComponent(body);
  const mailtoUrl = `mailto:${CONFIG.email}?subject=${encodedSubject}&body=${encodedBody}`;

  // 3. Short delay so browser triggers the PDF download before switching to email client
  setTimeout(() => {
    window.location.href = mailtoUrl;
  }, 600);

  closeBookingModal();
  showSuccessStep('Email');
};

function generateBookingMessage(refNum) {
  const ref  = refNum || '';
  const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

  let message = `*Appointment Request – Foresta Wood Industries*\n`;
  if (ref) message += `Ref: ${ref}  |  Date: ${date}\n`;
  message += `\n`;

  // ── Customer Information ──
  message += `*Customer Information*\n`;
  message += `Name:    ${customerData.name  || '-'}\n`;
  message += `Phone:   ${customerData.phone || '-'}\n`;
  message += `Email:   ${customerData.email || '-'}\n`;
  if (customerData.company) message += `Company: ${customerData.company}\n`;
  message += `\n`;

  // ── Selected Products ──
  message += `*Selected Products*\n`;
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `   Code:     ${item.code || '-'}\n`;
    message += `   Category: ${item.type}\n`;
    message += `   Panel Size: ${item.size || 'Not selected'}\n`;
    message += `   Quantity: ${item.quantity}\n`;
    message += `\n`;
  });

  if (customerData.notes) {
    message += `*Additional Notes*\n${customerData.notes}\n\n`;
  }

  message += `📎 A detailed PDF quotation (${ref ? ref + '.pdf' : 'Foresta-Quotation.pdf'}) has been downloaded to your device – please attach it to this message.\n`;
  message += `\n---\nSent from Foresta Website`;

  return message;
}

function showSuccessStep(method) {
  // Update success message based on method
  const successContainer = document.getElementById('step-4');
  if (successContainer) {
    const methodText = method === 'WhatsApp' ? 
      'Your appointment request has been sent via WhatsApp!' :
      'Your email client has been opened with the appointment details.';
    
    successContainer.querySelector('p:first-of-type').textContent = methodText;
  }
  
  goToStep(4);
  
  // Clear cart after successful booking
  setTimeout(() => {
    cart = [];
    saveCartToStorage();
  }, 1000);
}

// ===== Helper Functions =====
function formatProductsList() {
  return cart.map(item => 
    `${item.name} (${item.category}, ${item.type}) - Qty: ${item.quantity}, Size: ${item.width}×${item.height}${item.depth ? '×' + item.depth : ''} mm`
  ).join('\n');
}
