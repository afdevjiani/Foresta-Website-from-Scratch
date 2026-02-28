/**
 * Foresta Checkout Flow
 * Multi-step checkout with cart management, form validation, and booking integration
 */

// ===== Configuration =====
const CONFIG = {
  whatsappNumber: '971547862986',
  email: 'reachus@foresta.ae',
  storageKey: 'foresta_cart',
  customerKey: 'foresta_customer',
  ordersKey: 'foresta_orders',
  profilesKey: 'foresta_profiles'
};

// ===== State Management =====
let currentStep = 1;
let cart = [];
let customerData = {};

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', async () => {
  loadCartFromStorage();
  loadCustomerFromStorage();
  initializeCheckout();
  updateCartDisplay();
  updateProgressIndicator();
  await renderPreviousOrders();
  await showWelcomeBack();

  // Listen for auth state changes to auto-fill customer data
  window.addEventListener('forestaAuthChanged', async (e) => {
    const user = e.detail.user;
    if (user && user.email) {
      // Auto-fill customer stored data from auth
      if (!customerData.email || customerData.email !== user.email) {
        customerData.email = user.email;
        customerData.name = customerData.name || user.displayName || '';
        saveCustomerToStorage();
      }
      // Re-fill form if on step 2
      const emailInput = document.getElementById('customerEmail');
      if (emailInput && !emailInput.value) emailInput.value = user.email;
      const nameInput = document.getElementById('customerName');
      if (nameInput && !nameInput.value) nameInput.value = user.displayName || '';

      // Refresh previous orders
      await renderPreviousOrders();
      await showWelcomeBack();
    }
  });
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
    if (customerData.phoneRaw) {
      const phoneInput = document.getElementById('customerPhone');
      if (phoneInput) phoneInput.value = customerData.phoneRaw;
      const codeSelect = document.getElementById('countryCode');
      if (codeSelect && customerData.countryCode) codeSelect.value = customerData.countryCode;
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
    // Also save/update the email-keyed profile locally + Firestore
    if (customerData.email) {
      saveCustomerProfile(customerData.email, customerData);
    }
  } catch (e) {
    console.error('Error saving customer data:', e);
  }
}

// ===== Customer Profile (keyed by email) =====
function getAllProfiles() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG.profilesKey) || '{}');
  } catch (_) { return {}; }
}

function saveCustomerProfile(email, data) {
  // Save locally
  const profiles = getAllProfiles();
  const key = email.toLowerCase().trim();
  profiles[key] = {
    name: data.name || '',
    phone: data.phone || '',
    phoneRaw: data.phoneRaw || '',
    countryCode: data.countryCode || '+971',
    email: data.email || '',
    company: data.company || '',
    lastVisit: new Date().toISOString()
  };
  localStorage.setItem(CONFIG.profilesKey, JSON.stringify(profiles));

  // Sync to Firestore (fire-and-forget)
  if (window.firebaseSaveProfile) {
    window.firebaseSaveProfile(profiles[key]).catch(() => {});
  }
}

async function getProfileByEmail(email) {
  if (!email) return null;
  const key = email.toLowerCase().trim();

  // Try local first
  const local = getAllProfiles()[key];
  if (local) return local;

  // Fallback to Firestore
  if (window.firebaseGetProfile) {
    try {
      const remote = await window.firebaseGetProfile(email);
      if (remote) {
        // Cache locally
        const profiles = getAllProfiles();
        profiles[key] = remote;
        localStorage.setItem(CONFIG.profilesKey, JSON.stringify(profiles));
        return remote;
      }
    } catch (_) {}
  }
  return null;
}

// ===== Order History =====
function getOrderHistory() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG.ordersKey) || '[]');
  } catch (_) { return []; }
}

function saveOrder(orderData) {
  // Save locally
  const orders = getOrderHistory();
  orders.unshift(orderData);
  if (orders.length > 50) orders.length = 50;
  localStorage.setItem(CONFIG.ordersKey, JSON.stringify(orders));

  // Sync to Firestore (fire-and-forget)
  if (window.firebaseSaveOrder) {
    window.firebaseSaveOrder({
      ...orderData,
      email: (orderData.email || '').toLowerCase().trim()
    }).catch(() => {});
  }

  // Log analytics event
  if (window.firebaseLogEvent) {
    window.firebaseLogEvent('purchase', {
      ref: orderData.ref,
      items_count: (orderData.items || []).length
    });
  }
}

function getOrdersForEmail(email) {
  if (!email) return [];
  const key = email.toLowerCase().trim();
  return getOrderHistory().filter(o => (o.email || '').toLowerCase().trim() === key);
}

// Async version that also checks Firestore
async function getOrdersForEmailAsync(email) {
  if (!email) return [];
  const key = email.toLowerCase().trim();

  // Get local orders
  let orders = getOrdersForEmail(email);

  // Try fetching from Firestore for any orders not stored locally
  if (window.firebaseGetOrders) {
    try {
      const remote = await window.firebaseGetOrders(email, 20);
      if (remote.length > 0) {
        // Merge: add remote orders not already in local
        const localRefs = new Set(orders.map(o => o.ref));
        const newOrders = remote.filter(o => !localRefs.has(o.ref));
        if (newOrders.length > 0) {
          orders = [...newOrders, ...orders].sort((a, b) =>
            new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
          );
          // Update local cache
          const allLocal = getOrderHistory();
          newOrders.forEach(o => allLocal.unshift(o));
          if (allLocal.length > 50) allLocal.length = 50;
          localStorage.setItem(CONFIG.ordersKey, JSON.stringify(allLocal));
        }
      }
    } catch (_) {}
  }
  return orders;
}

// Show a welcome-back message if returning customer
async function showWelcomeBack() {
  const stored = customerData;
  if (!stored || !stored.email) return;
  const profile = await getProfileByEmail(stored.email);
  if (!profile) return;
  const orders = await getOrdersForEmailAsync(stored.email);
  if (orders.length === 0) return;

  const banner = document.createElement('div');
  banner.className = 'welcome-back-banner';
  banner.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
    <span>Welcome back, <strong>${profile.name || stored.email}</strong>! You have <strong>${orders.length}</strong> previous order${orders.length !== 1 ? 's' : ''}.</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;margin-left:auto;padding:4px;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;
  const stepContent = document.querySelector('.checkout-content');
  if (stepContent) stepContent.parentElement.insertBefore(banner, stepContent);
}

// Render previous orders section
async function renderPreviousOrders() {
  const container = document.getElementById('previousOrders');
  if (!container) return;

  const email = customerData.email;
  const orders = await getOrdersForEmailAsync(email);

  if (orders.length === 0) {
    container.closest('.previous-orders-section').style.display = 'none';
    return;
  }

  container.closest('.previous-orders-section').style.display = 'block';
  container.innerHTML = orders.slice(0, 10).map((order, i) => {
    const date = new Date(order.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const items = (order.items || []).map(it => it.name).join(', ');
    const totalQty = (order.items || []).reduce((s, it) => s + (it.quantity || 1), 0);
    return `
      <div class="prev-order-card">
        <div class="prev-order-header">
          <span class="prev-order-ref">#${order.ref || (i + 1)}</span>
          <span class="prev-order-date">${date}</span>
        </div>
        <div class="prev-order-body">
          <p class="prev-order-items">${items || 'No items'}</p>
          <span class="prev-order-qty">${totalQty} panel${totalQty !== 1 ? 's' : ''}</span>
        </div>
        <button class="prev-order-reorder" onclick="reorderFromHistory(${i})">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Reorder
        </button>
      </div>
    `;
  }).join('');
}

// Reorder: load items from a previous order back into the cart
window.reorderFromHistory = async function(index) {
  const email = customerData.email;
  const orders = await getOrdersForEmailAsync(email);
  if (!orders[index]) return;

  const order = orders[index];
  (order.items || []).forEach(item => {
    const exists = cart.findIndex(c => c.id === item.id);
    if (exists !== -1) {
      cart[exists].quantity += item.quantity || 1;
    } else {
      cart.push({ ...item });
    }
  });
  saveCartToStorage();
  updateCartDisplay();
  updateCartBadge();

  // Show confirmation
  const note = document.createElement('div');
  note.className = 'cart-add-notification';
  note.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>${order.items.length} item(s) added to cart from order #${order.ref || (index+1)}</span>`;
  Object.assign(note.style, { position:'fixed', bottom:'20px', right:'20px', background:'linear-gradient(135deg,#0c4326,#2d8f5f)', color:'white', padding:'1rem 1.5rem', borderRadius:'12px', display:'flex', alignItems:'center', gap:'0.75rem', boxShadow:'0 10px 30px rgba(12,67,38,0.3)', zIndex:'10000', fontSize:'0.9rem' });
  document.body.appendChild(note);
  setTimeout(() => note.remove(), 3000);
};

// Auto-fill from profile when email is entered
function setupEmailAutoFill() {
  const emailInput = document.getElementById('customerEmail');
  if (!emailInput) return;
  emailInput.addEventListener('blur', async () => {
    const email = emailInput.value.trim();
    if (!email) return;
    const profile = await getProfileByEmail(email);
    if (!profile) return;
    // Auto-fill only empty fields
    const nameInput = document.getElementById('customerName');
    if (nameInput && !nameInput.value) nameInput.value = profile.name || '';
    const phoneInput = document.getElementById('customerPhone');
    if (phoneInput && !phoneInput.value) phoneInput.value = profile.phoneRaw || '';
    const codeSelect = document.getElementById('countryCode');
    if (codeSelect && profile.countryCode) codeSelect.value = profile.countryCode;
    const companyInput = document.getElementById('customerCompany');
    if (companyInput && !companyInput.value) companyInput.value = profile.company || '';
  });
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
  
  // Setup email auto-fill from saved profiles
  setupEmailAutoFill();
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
  const countryCode = document.getElementById('countryCode')?.value || '+971';
  const phoneNum = document.getElementById('customerPhone')?.value || '';
  customerData = {
    name: document.getElementById('customerName')?.value || '',
    phone: phoneNum ? `${countryCode} ${phoneNum}` : '',
    phoneRaw: phoneNum,
    countryCode: countryCode,
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

  // Show/hide Download PDF button (only on step 3)
  const pdfBtn = document.getElementById('downloadPdfBtn');
  if (pdfBtn) {
    pdfBtn.style.display = currentStep === 3 ? '' : 'none';
  }
}

// ===== PDF Generation =====

// Global download PDF handler
window.downloadPDF = async function() {
  const btn = document.getElementById('downloadPdfBtn');
  if (btn) {
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Generating...';
  }
  try {
    await generateAndDownloadPDF();
  } catch (err) {
    console.error('PDF generation failed:', err);
    alert('Failed to generate PDF. Please try again.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Download PDF';
    }
  }
};

// Helper: convert image URL to base64 data URL for embedding in PDF
function _imgToBase64(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      resolve(c.toDataURL('image/png'));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/**
 * Generate the quotation PDF and return { blob, fileName, refNum }.
 * Does NOT trigger a download – callers decide what to do with the blob.
 */
async function generatePDFBlob() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    console.error('jsPDF not loaded');
    return null;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 18;
  const CONTENT_W = PAGE_W - MARGIN * 2;

  // Brand palette
  const forestGreen   = [12, 67, 38];
  const darkGreen     = [8, 48, 28];
  const accentGold    = [183, 150, 88];
  const lightGold     = [245, 238, 220];
  const lightBg       = [247, 249, 247];
  const white         = [255, 255, 255];
  const black         = [33, 33, 33];
  const mediumGray    = [120, 120, 120];
  const lightGray     = [220, 225, 220];
  const tableStripe   = [245, 248, 245];

  let y = 0;

  // ─── Try to load logo (white version for dark header) ───
  let logoData = null;
  try {
    const origB64 = await _imgToBase64('assets/logo.png');
    // Convert logo to all-white via canvas
    const tmpImg = new Image();
    tmpImg.src = origB64;
    await new Promise((res, rej) => { tmpImg.onload = res; tmpImg.onerror = rej; });
    const cvs = document.createElement('canvas');
    cvs.width = tmpImg.naturalWidth;
    cvs.height = tmpImg.naturalHeight;
    const ctx = cvs.getContext('2d');
    ctx.drawImage(tmpImg, 0, 0);
    const imgD = ctx.getImageData(0, 0, cvs.width, cvs.height);
    const px = imgD.data;
    for (let i = 0; i < px.length; i += 4) {
      if (px[i + 3] > 0) { px[i] = 255; px[i + 1] = 255; px[i + 2] = 255; }
    }
    ctx.putImageData(imgD, 0, 0);
    logoData = cvs.toDataURL('image/png');
  } catch (_) { /* skip */ }

  // ═══════════════════════════════════════════════════
  // FULL-WIDTH DARK GREEN HEADER BAND
  // ═══════════════════════════════════════════════════
  const headerH = 42;
  doc.setFillColor(...darkGreen);
  doc.rect(0, 0, PAGE_W, headerH, 'F');

  // Gold accent stripe at bottom of header
  doc.setFillColor(...accentGold);
  doc.rect(0, headerH, PAGE_W, 1.2, 'F');

  // Logo (left side, white version)
  if (logoData) {
    try { doc.addImage(logoData, 'PNG', MARGIN - 4, 12, 40, 14); } catch (_) {}
  }

  // "Quotation Request" — centered title
  doc.setTextColor(...white);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Quotation Request', PAGE_W / 2, 20, { align: 'center' });

  // Thin white separator under title
  doc.setDrawColor(...white);
  doc.setLineWidth(0.3);
  doc.line(PAGE_W / 2 - 30, 24, PAGE_W / 2 + 30, 24);

  // Date & Ref (right-aligned)
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const refNum = Date.now().toString().slice(-6);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(dateStr, PAGE_W - MARGIN, 28, { align: 'right' });
  doc.setTextColor(...accentGold);
  doc.setFont('helvetica', 'bold');
  doc.text(`REF: ${refNum}`, PAGE_W - MARGIN, 34, { align: 'right' });

  y = headerH + 1.2 + 10;

  // ═══════════════════════════════════════════════════
  // CUSTOMER DETAILS
  // ═══════════════════════════════════════════════════
  // Section heading — gold left accent + green text
  doc.setFillColor(...accentGold);
  doc.rect(MARGIN, y, 1.5, 6, 'F');
  doc.setTextColor(...darkGreen);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('CUSTOMER DETAILS', MARGIN + 5, y + 4.5);

  // Thin line under heading
  y += 8;
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 4;

  // Two-column card with light bg
  const cardH = 28;
  doc.setFillColor(...lightBg);
  doc.roundedRect(MARGIN, y, CONTENT_W, cardH, 3, 3, 'F');

  // Left border accent
  doc.setFillColor(...forestGreen);
  doc.roundedRect(MARGIN, y, 1.5, cardH, 1, 1, 'F');

  const col1X = MARGIN + 8;
  const col2X = MARGIN + CONTENT_W / 2 + 4;
  const valOffset = 22;

  // Row 1
  let ry = y + 7;
  doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(...mediumGray);
  doc.text('FULL NAME', col1X, ry);
  doc.setFontSize(9.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(...black);
  doc.text(customerData.name || '—', col1X + valOffset, ry);

  doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(...mediumGray);
  doc.text('PHONE', col2X, ry);
  doc.setFontSize(9.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(...black);
  doc.text(customerData.phone || '—', col2X + valOffset - 4, ry);

  // Divider
  ry += 4;
  doc.setDrawColor(230, 233, 230);
  doc.setLineWidth(0.2);
  doc.line(col1X, ry, PAGE_W - MARGIN - 6, ry);

  // Row 2
  ry += 5.5;
  doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(...mediumGray);
  doc.text('EMAIL', col1X, ry);
  doc.setFontSize(9.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(...black);
  doc.text((customerData.email || '—').substring(0, 38), col1X + valOffset, ry);

  doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(...mediumGray);
  doc.text('COMPANY', col2X, ry);
  doc.setFontSize(9.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(...black);
  doc.text(customerData.company || '—', col2X + valOffset - 4, ry);

  y += cardH + 8;

  // ═══════════════════════════════════════════════════
  // PRODUCT DETAILS TABLE
  // ═══════════════════════════════════════════════════
  doc.setFillColor(...accentGold);
  doc.rect(MARGIN, y, 1.5, 6, 'F');
  doc.setTextColor(...darkGreen);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('PRODUCT DETAILS', MARGIN + 5, y + 4.5);

  y += 8;
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 3;

  const tableHead = [['#', 'Product Name', 'Code', 'Category', 'Panel Size', 'Qty']];
  const tableBody = cart.map((item, i) => [
    String(i + 1),
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
    theme: 'plain',
    tableWidth: CONTENT_W,
    headStyles: {
      fillColor: darkGreen,
      textColor: white,
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: { top: 3.5, bottom: 3.5, left: 4, right: 4 },
      halign: 'left',
      lineWidth: 0,
      minCellHeight: 8
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: black,
      cellPadding: { top: 3.5, bottom: 3.5, left: 4, right: 4 },
      lineWidth: 0,
      overflow: 'linebreak',
      minCellHeight: 9
    },
    alternateRowStyles: { fillColor: [245, 248, 245] },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center', fontStyle: 'bold', textColor: mediumGray },
      1: { cellWidth: 'auto', halign: 'left', fontStyle: 'bold' },
      2: { cellWidth: 26, halign: 'left' },
      3: { cellWidth: 28, halign: 'left' },
      4: { cellWidth: 30, halign: 'center' },
      5: { cellWidth: 14, halign: 'center', fontStyle: 'bold', textColor: forestGreen }
    },
    didDrawPage: (data) => {
      // Redraw header band on new pages
      if (data.pageNumber > 1) {
        doc.setFillColor(...darkGreen);
        doc.rect(0, 0, PAGE_W, 10, 'F');
        doc.setFillColor(...accentGold);
        doc.rect(0, 10, PAGE_W, 0.8, 'F');
        doc.setTextColor(...white);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('FORESTA WOOD INDUSTRIES — QUOTATION', MARGIN, 7);
        doc.setTextColor(...accentGold);
        doc.text(`REF: ${refNum}`, PAGE_W - MARGIN, 7, { align: 'right' });
      }
    },
    didDrawCell: (data) => {
      // Bottom border on each body row (subtle)
      if (data.section === 'body') {
        doc.setDrawColor(225, 228, 225);
        doc.setLineWidth(0.15);
        doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
      }
      // Gold accent on last row bottom
      if (data.row.index === tableBody.length - 1 && data.section === 'body') {
        doc.setDrawColor(...accentGold);
        doc.setLineWidth(0.5);
        doc.line(MARGIN, data.cell.y + data.cell.height, PAGE_W - MARGIN, data.cell.y + data.cell.height);
      }
    }
  });

  y = doc.lastAutoTable.finalY + 10;

  // ═══════════════════════════════════════════════════
  // QUOTATION SUMMARY
  // ═══════════════════════════════════════════════════
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalProducts = cart.length;

  // Section heading
  doc.setFillColor(...accentGold);
  doc.rect(MARGIN, y, 1.5, 6, 'F');
  doc.setTextColor(...darkGreen);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('QUOTATION SUMMARY', MARGIN + 5, y + 4.5);
  y += 8;
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 6;

  // Summary — three-column layout
  const cardGap = 6;
  const cardW = (CONTENT_W - cardGap * 2) / 3;

  // Card 1 – Total Products
  doc.setFillColor(...lightBg);
  doc.roundedRect(MARGIN, y, cardW, 20, 3, 3, 'F');
  doc.setFillColor(...forestGreen);
  doc.roundedRect(MARGIN, y, cardW, 1.2, 1, 1, 'F'); // top accent
  doc.setFontSize(7); doc.setFont('helvetica', 'bold'); doc.setTextColor(...mediumGray);
  doc.text('TOTAL PRODUCTS', MARGIN + cardW / 2, y + 7, { align: 'center' });
  doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.setTextColor(...forestGreen);
  doc.text(String(totalProducts), MARGIN + cardW / 2, y + 16, { align: 'center' });

  // Card 2 – Total Panels
  const card2X = MARGIN + cardW + cardGap;
  doc.setFillColor(...lightBg);
  doc.roundedRect(card2X, y, cardW, 20, 3, 3, 'F');
  doc.setFillColor(...forestGreen);
  doc.roundedRect(card2X, y, cardW, 1.2, 1, 1, 'F');
  doc.setFontSize(7); doc.setFont('helvetica', 'bold'); doc.setTextColor(...mediumGray);
  doc.text('TOTAL PANELS', card2X + cardW / 2, y + 7, { align: 'center' });
  doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.setTextColor(...forestGreen);
  doc.text(String(totalItems), card2X + cardW / 2, y + 16, { align: 'center' });

  // Card 3 – Reference
  const card3X = MARGIN + (cardW + cardGap) * 2;
  doc.setFillColor(...lightBg);
  doc.roundedRect(card3X, y, cardW, 20, 3, 3, 'F');
  doc.setFillColor(...accentGold);
  doc.roundedRect(card3X, y, cardW, 1.2, 1, 1, 'F');
  doc.setFontSize(7); doc.setFont('helvetica', 'bold'); doc.setTextColor(...mediumGray);
  doc.text('REFERENCE', card3X + cardW / 2, y + 7, { align: 'center' });
  doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(...accentGold);
  doc.text(`#${refNum}`, card3X + cardW / 2, y + 16, { align: 'center' });

  y += 28;

  // Notes section (if present)
  if (customerData.notes) {
    doc.setFillColor(...lightBg);
    doc.roundedRect(MARGIN, y, CONTENT_W, 22, 3, 3, 'F');
    doc.setFillColor(...accentGold);
    doc.roundedRect(MARGIN, y, 1.5, 22, 1, 1, 'F'); // gold left accent
    doc.setFontSize(7); doc.setFont('helvetica', 'bold'); doc.setTextColor(...mediumGray);
    doc.text('ADDITIONAL NOTES', MARGIN + 6, y + 5);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(...black);
    const lines = doc.splitTextToSize(customerData.notes, CONTENT_W - 12);
    doc.text(lines.slice(0, 3), MARGIN + 6, y + 11);
    y += 26;
  }

  // ═══════════════════════════════════════════════════
  // FOOTER — Professional full-width band
  // ═══════════════════════════════════════════════════
  const footerBandH = 28;
  const footerY = PAGE_H - footerBandH;

  // Dark green footer band
  doc.setFillColor(...darkGreen);
  doc.rect(0, footerY, PAGE_W, footerBandH, 'F');

  // Gold accent line at top of footer
  doc.setFillColor(...accentGold);
  doc.rect(0, footerY, PAGE_W, 0.8, 'F');

  // Thank you message
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...white);
  doc.text('Thank you for choosing Foresta Wood Industries', PAGE_W / 2, footerY + 8, { align: 'center' });

  // Contact details
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...white);
  doc.text('reachus@foresta.ae', PAGE_W / 2 - 42, footerY + 14);
  doc.text('|', PAGE_W / 2 - 14, footerY + 14);
  doc.text('+971 54 786 2986', PAGE_W / 2 - 10, footerY + 14);
  doc.text('|', PAGE_W / 2 + 16, footerY + 14);
  doc.text('www.foresta.ae', PAGE_W / 2 + 20, footerY + 14);

  // Disclaimer
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...white);
  doc.text('This quotation is for reference purposes only. Prices and availability are subject to confirmation.', PAGE_W / 2, footerY + 21, { align: 'center' });

  // Bottom gold accent stripe
  doc.setFillColor(...accentGold);
  doc.rect(0, PAGE_H - 1.5, PAGE_W, 1.5, 'F');

  // ═══════════════════════════════════════════════════
  // RETURN BLOB
  // ═══════════════════════════════════════════════════
  const fileName = `Foresta-Quotation-${refNum}.pdf`;
  const blob = doc.output('blob');

  return { blob, fileName, refNum };
}

/**
 * Backward-compatible wrapper: generates and downloads the PDF, returns refNum.
 */
async function generateAndDownloadPDF() {
  const result = await generatePDFBlob();
  if (!result) return null;

  // Trigger browser download
  const url = URL.createObjectURL(result.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = result.fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 200);

  return result.refNum;
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

window.bookViaWhatsApp = async function() {
  // 1. Generate the PDF blob
  const result = await generatePDFBlob();
  if (!result) return;

  const { blob, fileName, refNum } = result;
  const pdfFile = new File([blob], fileName, { type: 'application/pdf' });

  // 2. Try native Web Share API (supports file attachment on mobile)
  if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
    try {
      await navigator.share({
        title: 'Foresta Quotation',
        text: `Quotation Request – Foresta Wood Industries (Ref: ${refNum})`,
        files: [pdfFile]
      });
      closeBookingModal();
      showSuccessStep('WhatsApp', refNum);
      return;
    } catch (err) {
      if (err.name === 'AbortError') { return; } // user cancelled
      // Fall through to WhatsApp link method
    }
  }

  // 3. Fallback: download PDF + open WhatsApp with text prompt
  triggerDownload(blob, fileName);
  const message = generateBookingMessage(refNum);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
  setTimeout(() => { window.open(whatsappUrl, '_blank'); }, 600);

  closeBookingModal();
  showSuccessStep('WhatsApp', refNum);
};

window.bookViaEmail = async function() {
  // 1. Generate the PDF blob
  const result = await generatePDFBlob();
  if (!result) return;

  const { blob, fileName, refNum } = result;
  const pdfFile = new File([blob], fileName, { type: 'application/pdf' });

  // 2. Try native Web Share API (supports file attachment on some devices)
  if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
    try {
      await navigator.share({
        title: 'Foresta Quotation',
        text: `Quotation Request – Foresta Wood Industries (Ref: ${refNum})`,
        files: [pdfFile]
      });
      closeBookingModal();
      showSuccessStep('Email', refNum);
      return;
    } catch (err) {
      if (err.name === 'AbortError') { return; }
      // Fall through to mailto method
    }
  }

  // 3. Fallback: download PDF + open email client
  triggerDownload(blob, fileName);
  const subject = 'Quotation Request - Foresta Wood Industries [' + refNum + ']';
  const body    = generateBookingMessage(refNum);
  const mailtoUrl = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  setTimeout(() => { window.location.href = mailtoUrl; }, 600);

  closeBookingModal();
  showSuccessStep('Email', refNum);
};

// Helper to trigger a file download from a Blob
function triggerDownload(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 200);
}

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

function showSuccessStep(method, refNum) {
  // Save order to history before clearing cart
  saveOrder({
    ref: refNum || Date.now().toString().slice(-6),
    date: new Date().toISOString(),
    email: customerData.email || '',
    customer: customerData.name || '',
    method: method,
    items: cart.map(item => ({
      id: item.id,
      name: item.name,
      code: item.code,
      type: item.type,
      category: item.category,
      frontImage: item.frontImage,
      size: item.size || '',
      quantity: item.quantity || 1
    }))
  });

  // Update success message based on method
  const successContainer = document.getElementById('step-4');
  if (successContainer) {
    const methodText = method === 'WhatsApp' ? 
      'Your appointment request has been sent via WhatsApp!' :
      'Your email client has been opened with the appointment details.';
    
    const p = successContainer.querySelector('p:first-of-type');
    if (p) p.textContent = methodText;
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
