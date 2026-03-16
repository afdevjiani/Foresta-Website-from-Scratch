/**
 * Foresta Order History Page
 * Fetches and displays user-scoped order history from Firebase Firestore.
 */
(function () {
  'use strict';

  var contentEl = document.getElementById('ohContent');
  var subtitleEl = document.getElementById('ohSubtitle');

  function getCurrentUser() {
    return window._forestaUser || (window.forestaAuth && window.forestaAuth.getCurrentUser()) || null;
  }

  function getAuthSession() {
    try { return JSON.parse(localStorage.getItem('foresta_auth_session') || 'null'); }
    catch (_) { return null; }
  }

  function escapeHtml(str) {
    var d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }

  function formatDate(dateStr) {
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
    } catch (_) { return dateStr || '—'; }
  }

  function showLogin() {
    contentEl.innerHTML =
      '<div class="oh-login-prompt">' +
        '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' +
        '<h3>Sign in to view your orders</h3>' +
        '<p>Log in with your account to see your order history.</p>' +
        '<button class="oh-login-btn" id="ohLoginBtn">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>' +
          'Sign In' +
        '</button>' +
      '</div>';
    var btn = document.getElementById('ohLoginBtn');
    if (btn) {
      btn.addEventListener('click', function () {
        if (window.forestaAuth && typeof window.forestaAuth.openModal === 'function') {
          window.forestaAuth.openModal();
        } else {
          // Trigger auth modal via custom event or direct DOM
          var trigger = document.querySelector('[data-auth-trigger]');
          if (trigger) trigger.click();
          else window.location.href = 'index-luxury.html';
        }
      });
    }
  }

  function showEmpty() {
    contentEl.innerHTML =
      '<div class="oh-empty">' +
        '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
        '<h3>No orders yet</h3>' +
        '<p>Once you place an order, it will appear here.</p>' +
        '<a href="index-luxury.html#products" class="oh-browse-btn">' +
          'Browse Products' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
        '</a>' +
      '</div>';
  }

  function renderOrders(orders) {
    if (!orders || orders.length === 0) { showEmpty(); return; }

    subtitleEl.textContent = orders.length + ' order' + (orders.length !== 1 ? 's' : '');

    var html = '<div class="oh-list">';
    orders.forEach(function (order, idx) {
      var date = formatDate(order.date || order.createdAt);
      var items = order.items || [];
      var totalQty = items.reduce(function (s, it) { return s + (it.quantity || 1); }, 0);

      html += '<div class="oh-card">';
      html += '<div class="oh-card-accent"></div>';
      html += '<div class="oh-card-inner">';
      html += '<div class="oh-card-top">';
      html += '<div><div class="oh-card-ref">#' + escapeHtml(order.ref || String(idx + 1)) + '</div><div class="oh-card-date">' + escapeHtml(date) + '</div></div>';
      if (order.method) html += '<span class="oh-card-method">' + escapeHtml(order.method) + '</span>';
      html += '</div>';

      if (items.length > 0) {
        html += '<div class="oh-card-items">';
        items.forEach(function (it) {
          html += '<div class="oh-item-row">';
          html += '<span class="oh-item-name">' + escapeHtml(it.name || it.code || 'Product') + '</span>';
          html += '<span class="oh-item-qty">' + (it.quantity || 1) + ' panel' + ((it.quantity || 1) !== 1 ? 's' : '') + '</span>';
          html += '</div>';
        });
        html += '</div>';
      }

      html += '<div class="oh-card-bottom">';
      html += '<span class="oh-card-total"><strong>' + totalQty + '</strong> total panel' + (totalQty !== 1 ? 's' : '') + '</span>';
      html += '<button class="oh-reorder-btn" data-order-index="' + idx + '">';
      html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>';
      html += 'Reorder</button>';
      html += '</div></div></div>';
    });
    html += '</div>';

    contentEl.innerHTML = html;

    // Bind reorder buttons
    contentEl.querySelectorAll('.oh-reorder-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-order-index'), 10);
        reorder(orders[idx]);
      });
    });
  }

  function reorder(order) {
    if (!order || !order.items) return;
    var cart = [];
    try { cart = JSON.parse(localStorage.getItem('foresta_cart') || '[]'); } catch (_) {}

    (order.items || []).forEach(function (item) {
      var exists = cart.findIndex(function (c) { return c.id === item.id; });
      if (exists !== -1) {
        cart[exists].quantity = (cart[exists].quantity || 1) + (item.quantity || 1);
      } else {
        cart.push(Object.assign({}, item));
      }
    });

    localStorage.setItem('foresta_cart', JSON.stringify(cart));

    // Show confirmation toast
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:linear-gradient(135deg,#0c4326,#2d8f5f);color:#fff;padding:1rem 1.5rem;border-radius:12px;display:flex;align-items:center;gap:0.75rem;box-shadow:0 10px 30px rgba(12,67,38,0.3);z-index:10000;font-size:0.9rem;';
    toast.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>' + order.items.length + ' item(s) added to cart from order #' + escapeHtml(order.ref || '') + '</span>';
    document.body.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 3000);
  }

  async function loadOrders() {
    var user = getCurrentUser();
    var session = getAuthSession();
    var email = (user && user.email) || (session && session.email) || '';

    if (!email) { showLogin(); return; }

    // Try Firestore first
    if (window.firebaseGetOrders) {
      try {
        var orders = await window.firebaseGetOrders(email, 50);
        if (orders && orders.length > 0) {
          renderOrders(orders);
          return;
        }
      } catch (_) {}
    }

    // Fallback: check localStorage (user-scoped key)
    var uid = (user && user.uid) || (session && session.uid) || '';
    var localKey = uid ? 'foresta_orders_' + uid : 'foresta_orders';
    var local = [];
    try { local = JSON.parse(localStorage.getItem(localKey) || '[]'); } catch (_) {}

    // Also check legacy non-scoped key
    if (local.length === 0) {
      try {
        var legacy = JSON.parse(localStorage.getItem('foresta_orders') || '[]');
        local = legacy.filter(function (o) { return (o.email || '').toLowerCase() === email.toLowerCase(); });
      } catch (_) {}
    }

    renderOrders(local);
  }

  // Wait for Firebase to be ready then load
  function init() {
    // If firebase is already available, load
    if (window.firebaseGetOrders) {
      loadOrders();
    } else {
      // Wait a short time for firebase-init.js module to load
      var attempts = 0;
      var interval = setInterval(function () {
        attempts++;
        if (window.firebaseGetOrders || attempts > 40) {
          clearInterval(interval);
          loadOrders();
        }
      }, 150);
    }

    // Re-load on auth changes (login/logout)
    window.addEventListener('forestaAuthChanged', function () {
      contentEl.innerHTML = '<div class="oh-loading"><div class="oh-loading-spinner"></div><p>Loading your orders...</p></div>';
      setTimeout(loadOrders, 500);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
