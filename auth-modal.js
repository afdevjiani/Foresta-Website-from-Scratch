/**
 * Foresta Auth Modal
 * ------------------
 * Provides a login / sign-up / Google-sign-in modal.
 * When the user is NOT authenticated, add-to-cart actions are intercepted;
 * the modal appears, and once the user signs in the pending cart action
 * is automatically completed.
 *
 * Requires: firebase-init.js (loaded as ES module before this script).
 * Exposes:  window.forestaAuthModal  (open / close / isLoggedIn helpers)
 */

(function () {
  'use strict';

  // ─── Pending cart action ───────────────────────────
  let pendingCartAction = null; // { fn, args }

  // ─── Inject modal HTML ─────────────────────────────
  function injectModalHTML() {
    if (document.getElementById('forestaAuthOverlay')) return;

    const html = `
    <div class="foresta-auth-overlay" id="forestaAuthOverlay">
      <div class="foresta-auth-modal" role="dialog" aria-modal="true" aria-label="Authentication">
        <!-- Close -->
        <button class="foresta-auth-close" id="authCloseBtn" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <!-- Header -->
        <div class="foresta-auth-header">
          <img src="assets/logo.png" alt="Foresta" class="foresta-auth-logo">
          <h2 class="foresta-auth-title">Continue to Add Product to Cart</h2>
          <p class="foresta-auth-subtitle">Please login or sign up to continue.</p>
        </div>

        <!-- Tabs (pill-style) -->
        <div class="foresta-auth-tabs">
          <button class="foresta-auth-tab active" data-tab="login">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:5px;vertical-align:-2px"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>Login
          </button>
          <button class="foresta-auth-tab" data-tab="signup">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:5px;vertical-align:-2px"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>Sign Up
          </button>
        </div>

        <!-- Body -->
        <div class="foresta-auth-body">
          <!-- Error banner -->
          <div class="foresta-auth-error" id="authError">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            <span id="authErrorMsg"></span>
          </div>

          <!-- LOGIN FORM -->
          <form class="foresta-auth-form active" id="loginForm" autocomplete="on">
            <div class="foresta-auth-field">
              <label class="foresta-auth-label" for="loginEmail">Email</label>
              <div class="foresta-auth-input-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>
                <input class="foresta-auth-input" type="email" id="loginEmail" name="email" placeholder="you@example.com" required autocomplete="email">
              </div>
            </div>
            <div class="foresta-auth-field">
              <label class="foresta-auth-label" for="loginPassword">Password</label>
              <div class="foresta-auth-input-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input class="foresta-auth-input" type="password" id="loginPassword" name="password" placeholder="Enter your password" required autocomplete="current-password">
                <button type="button" class="foresta-auth-pw-toggle" data-target="loginPassword" aria-label="Show password">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>
            <button type="submit" class="foresta-auth-btn" id="loginBtn">
              <span class="spinner"></span>
              <span class="btn-label">Login</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:4px"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </form>

          <!-- SIGN-UP FORM -->
          <form class="foresta-auth-form" id="signupForm" autocomplete="on">
            <div class="foresta-auth-field">
              <label class="foresta-auth-label" for="signupName">Full Name <span style="font-weight:400;text-transform:none;color:#b0b0b0;font-size:0.62rem;background:#f3f4f5;padding:1px 6px;border-radius:4px;margin-left:2px">optional</span></label>
              <div class="foresta-auth-input-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input class="foresta-auth-input" type="text" id="signupName" name="name" placeholder="Enter your full name" autocomplete="name">
              </div>
            </div>
            <div class="foresta-auth-field">
              <label class="foresta-auth-label" for="signupEmail">Email</label>
              <div class="foresta-auth-input-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>
                <input class="foresta-auth-input" type="email" id="signupEmail" name="email" placeholder="you@example.com" required autocomplete="email">
              </div>
            </div>
            <div class="foresta-auth-field">
              <label class="foresta-auth-label" for="signupPassword">Password</label>
              <div class="foresta-auth-input-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input class="foresta-auth-input" type="password" id="signupPassword" name="password" placeholder="Min 6 chars, mix letters & numbers" required minlength="6" autocomplete="new-password">
                <button type="button" class="foresta-auth-pw-toggle" data-target="signupPassword" aria-label="Show password">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
              <div class="foresta-pw-strength" id="pwStrength">
                <div class="foresta-pw-strength-bar" id="pwBar1"></div>
                <div class="foresta-pw-strength-bar" id="pwBar2"></div>
                <div class="foresta-pw-strength-bar" id="pwBar3"></div>
                <span class="foresta-pw-strength-label" id="pwLabel"></span>
              </div>
            </div>
            <div class="foresta-auth-field">
              <label class="foresta-auth-label" for="signupConfirm">Confirm Password</label>
              <div class="foresta-auth-input-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <input class="foresta-auth-input" type="password" id="signupConfirm" name="confirmPassword" placeholder="Re-enter password" required minlength="6" autocomplete="new-password">
                <button type="button" class="foresta-auth-pw-toggle" data-target="signupConfirm" aria-label="Show password">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>
            <button type="submit" class="foresta-auth-btn" id="signupBtn">
              <span class="spinner"></span>
              <span class="btn-label">Create Account</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:4px"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </form>

          <!-- Divider -->
          <div class="foresta-auth-divider"><span>or continue with</span></div>

          <!-- Google -->
          <button type="button" class="foresta-auth-google" id="googleSignInBtn">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <!-- Footer -->
        <div class="foresta-auth-footer">
          <p>Your data is protected with industry-standard encryption.<br>By continuing you agree to Foresta's <a href="#">Terms</a> & <a href="#">Privacy Policy</a>.</p>
        </div>
      </div>
    </div>

    <!-- User bar (shown when logged in) -->
    <div class="foresta-user-bar" id="forestaUserBar">
      <div class="foresta-user-bar-left">
        <div class="user-avatar" id="userAvatar"></div>
        <div class="user-greeting">
          <span class="user-greeting-label">Welcome back</span>
          <span class="user-name" id="userName"></span>
        </div>
      </div>
      <div class="foresta-user-bar-right">
        <button class="user-logout" id="userLogoutBtn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
  }

  // ─── Wire up event handlers ────────────────────────
  function attachEvents() {
    const overlay = document.getElementById('forestaAuthOverlay');
    const closeBtn = document.getElementById('authCloseBtn');
    const tabs = document.querySelectorAll('.foresta-auth-tab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const googleBtn = document.getElementById('googleSignInBtn');
    const logoutBtn = document.getElementById('userLogoutBtn');

    // Close modal
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Tab switching
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        document.querySelectorAll('.foresta-auth-form').forEach(f => f.classList.remove('active'));
        document.getElementById(target === 'login' ? 'loginForm' : 'signupForm').classList.add('active');
        hideError();
      });
    });

    // Password toggles
    document.querySelectorAll('.foresta-auth-pw-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        if (!input) return;
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.innerHTML = show
          ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
          : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
      });
    });

    // Password strength indicator for sign-up
    const signupPwInput = document.getElementById('signupPassword');
    if (signupPwInput) {
      signupPwInput.addEventListener('input', () => {
        updatePasswordStrength(signupPwInput.value);
      });
    }

    // Login submit
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      if (!email || !password) { showError('Please fill in all fields.'); return; }
      if (!isValidEmail(email)) { showError('Please enter a valid email address.'); return; }

      setLoading('loginBtn', true);
      try {
        await waitForAuth();
        await window.forestaAuth.loginWithEmail(email, password);
        onAuthSuccess();
      } catch (err) {
        showError(friendlyError(err));
      } finally {
        setLoading('loginBtn', false);
      }
    });

    // Sign-up submit
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError();
      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;
      const confirm = document.getElementById('signupConfirm').value;

      if (!email || !password || !confirm) { showError('Please fill in all required fields.'); return; }
      if (!isValidEmail(email)) { showError('Please enter a valid email address.'); return; }
      if (password.length < 6) { showError('Password must be at least 6 characters.'); return; }
      if (password !== confirm) { showError('Passwords do not match.'); return; }

      setLoading('signupBtn', true);
      try {
        await waitForAuth();
        await window.forestaAuth.signUpWithEmail(email, password, name);
        onAuthSuccess();
      } catch (err) {
        showError(friendlyError(err));
      } finally {
        setLoading('signupBtn', false);
      }
    });

    // Google sign-in
    googleBtn.addEventListener('click', async () => {
      hideError();
      googleBtn.disabled = true;
      try {
        await waitForAuth();
        await window.forestaAuth.loginWithGoogle();
        onAuthSuccess();
      } catch (err) {
        if (err.code === 'auth/popup-closed-by-user') {
          // User closed popup, no error needed
        } else if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.includes('not authorized'))) {
          // Show subtle inline note instead of scary red banner
          let note = googleBtn.parentElement.querySelector('.foresta-google-note');
          if (!note) {
            note = document.createElement('p');
            note.className = 'foresta-google-note';
            note.textContent = 'Google sign-in unavailable on this domain. Use email & password above.';
            googleBtn.insertAdjacentElement('afterend', note);
          }
        } else {
          showError(friendlyError(err));
        }
      } finally {
        googleBtn.disabled = false;
      }
    });

    // Logout
    logoutBtn.addEventListener('click', async () => {
      if (window.forestaAuth) {
        await window.forestaAuth.logout();
      }
    });

    // Listen to auth state changes to update user bar
    window.addEventListener('forestaAuthChanged', (e) => {
      updateUserBar(e.detail.user);
    });

    // Check initial state (session might already exist from module load)
    const savedSession = localStorage.getItem('foresta_auth_session');
    if (savedSession) {
      try {
        const s = JSON.parse(savedSession);
        updateUserBar(s); // show bar immediately from cache
      } catch (_) {}
    }
  }

  // ─── Helpers ───────────────────────────────────────

  function waitForAuth() {
    // forestaAuth is set by the ES module. If not ready yet, poll briefly.
    return new Promise((resolve, reject) => {
      if (window.forestaAuth) return resolve();
      let tries = 0;
      const iv = setInterval(() => {
        tries++;
        if (window.forestaAuth) { clearInterval(iv); resolve(); }
        if (tries > 30) { clearInterval(iv); reject(new Error('Auth service unavailable. Please refresh.')); }
      }, 100);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function updatePasswordStrength(pw) {
    const bar1 = document.getElementById('pwBar1');
    const bar2 = document.getElementById('pwBar2');
    const bar3 = document.getElementById('pwBar3');
    const label = document.getElementById('pwLabel');
    if (!bar1 || !bar2 || !bar3 || !label) return;

    // Reset
    [bar1, bar2, bar3].forEach(b => { b.className = 'foresta-pw-strength-bar'; });
    label.className = 'foresta-pw-strength-label';
    label.textContent = '';

    if (!pw || pw.length === 0) return;

    // Calculate strength
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    let level, text;
    if (score <= 2) { level = 'weak'; text = 'Weak'; }
    else if (score <= 3) { level = 'medium'; text = 'Fair'; }
    else { level = 'strong'; text = 'Strong'; }

    bar1.classList.add('active', level);
    if (score >= 3) bar2.classList.add('active', level);
    if (score >= 4) bar3.classList.add('active', level);
    label.classList.add(level);
    label.textContent = text;
  }

  function friendlyError(err) {
    const map = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-credential': 'Invalid email or password. Please try again.',
      'auth/email-already-in-use': 'This email is already registered. Try logging in.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Check your connection.',
      'auth/popup-blocked': 'Popup blocked by browser. Allow popups and try again.',
      'auth/internal-error': 'A temporary error occurred. Please try again.'
    };
    return map[err.code] || err.message || 'An unexpected error occurred.';
  }

  function showError(msg) {
    const el = document.getElementById('authError');
    const msgEl = document.getElementById('authErrorMsg');
    if (el && msgEl) { msgEl.textContent = msg; el.classList.add('show'); }
  }

  function hideError() {
    const el = document.getElementById('authError');
    if (el) el.classList.remove('show');
  }

  function setLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    if (loading) { btn.classList.add('loading'); btn.disabled = true; }
    else { btn.classList.remove('loading'); btn.disabled = false; }
  }

  function closeModal() {
    const overlay = document.getElementById('forestaAuthOverlay');
    if (overlay) overlay.classList.remove('active');
    // Remove any success flash
    const flash = document.querySelector('.foresta-auth-success-flash');
    if (flash) flash.remove();
    pendingCartAction = null;
  }

  function openModal() {
    const overlay = document.getElementById('forestaAuthOverlay');
    if (!overlay) return;
    hideError();
    // Reset forms
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    if (loginForm) loginForm.reset();
    if (signupForm) signupForm.reset();
    // Reset password strength indicator
    updatePasswordStrength('');
    // Show login tab by default
    document.querySelectorAll('.foresta-auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.foresta-auth-form').forEach(f => f.classList.remove('active'));
    const loginTab = document.querySelector('.foresta-auth-tab[data-tab="login"]');
    if (loginTab) loginTab.classList.add('active');
    if (loginForm) loginForm.classList.add('active');
    overlay.classList.add('active');
    // Focus first input
    setTimeout(() => {
      const firstInput = overlay.querySelector('input');
      if (firstInput) firstInput.focus();
    }, 400);
  }

  // ─── After successful auth ─────────────────────────
  function onAuthSuccess() {
    // Show success flash
    const modal = document.querySelector('.foresta-auth-modal');
    if (modal) {
      const flash = document.createElement('div');
      flash.className = 'foresta-auth-success-flash';
      flash.innerHTML = `
        <div class="success-check">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="foresta-auth-success-text">Welcome! Adding to cart...</span>
      `;
      modal.appendChild(flash);
    }

    // Delay close to show flash animation
    setTimeout(() => {
      const overlay = document.getElementById('forestaAuthOverlay');
      if (overlay) overlay.classList.remove('active');
      // Remove flash after transition
      setTimeout(() => {
        const flash = document.querySelector('.foresta-auth-success-flash');
        if (flash) flash.remove();
      }, 400);

      // Execute the pending cart action
      if (pendingCartAction) {
        try {
          pendingCartAction.fn.apply(null, pendingCartAction.args);
        } catch (e) {
          console.error('[Auth] Error executing pending cart action:', e);
        }
        pendingCartAction = null;
      }

      // Fetch user profile + order history for personalization
      fetchUserDataAfterLogin();
    }, 1200);
  }

  async function fetchUserDataAfterLogin() {
    const user = window._forestaUser || (window.forestaAuth && window.forestaAuth.getCurrentUser());
    if (!user || !user.email) return;

    // 1. Load profile from Firestore
    if (window.firebaseGetProfile) {
      try {
        const profile = await window.firebaseGetProfile(user.email);
        if (profile) {
          // Merge into local customer data
          const existing = JSON.parse(localStorage.getItem('foresta_customer') || '{}');
          Object.assign(existing, {
            email: user.email,
            name: profile.name || user.displayName || existing.name || '',
            phone: profile.phone || existing.phone || '',
            phoneRaw: profile.phoneRaw || existing.phoneRaw || '',
            countryCode: profile.countryCode || existing.countryCode || '+971',
            company: profile.company || existing.company || ''
          });
          localStorage.setItem('foresta_customer', JSON.stringify(existing));
        }
      } catch (_) {}
    }

    // 2. Cache order history from Firestore (user-scoped by UID)
    if (window.firebaseGetOrders) {
      try {
        const orders = await window.firebaseGetOrders(user.email, 20);
        if (orders.length > 0) {
          const localKey = 'foresta_orders_' + user.uid;
          const local = JSON.parse(localStorage.getItem(localKey) || '[]');
          const localRefs = new Set(local.map(o => o.ref));
          const newOnes = orders.filter(o => !localRefs.has(o.ref));
          if (newOnes.length > 0) {
            const merged = [...newOnes, ...local].sort((a, b) =>
              new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
            );
            if (merged.length > 50) merged.length = 50;
            localStorage.setItem(localKey, JSON.stringify(merged));
          }
        }
      } catch (_) {}
    }

    // Log analytics event
    if (window.firebaseLogEvent) {
      window.firebaseLogEvent('login_success', { method: user.providerData?.[0]?.providerId || 'email' });
    }
  }

  // ─── Update user bar ──────────────────────────────
  function updateUserBar(user) {
    const bar = document.getElementById('forestaUserBar');
    if (!bar) return;

    if (user && user.email) {
      const avatar = document.getElementById('userAvatar');
      const nameEl = document.getElementById('userName');

      const displayName = user.displayName || user.email.split('@')[0];
      nameEl.textContent = displayName;

      if (user.photoURL) {
        avatar.innerHTML = '<img src="' + user.photoURL + '" alt="' + displayName + '">';
      } else {
        avatar.textContent = displayName.charAt(0).toUpperCase();
      }

      // Only show user bar on checkout page
      const isCheckout = window.location.pathname.includes('checkout');
      if (isCheckout) {
        bar.classList.add('visible');
        document.body.classList.add('foresta-logged-in');
      }
    } else {
      bar.classList.remove('visible');
      document.body.classList.remove('foresta-logged-in');
    }
  }

  // ─── Public API ────────────────────────────────────
  window.forestaAuthModal = {
    /** Open the auth modal (optionally with a pending action) */
    open(actionFn, actionArgs) {
      if (actionFn) { pendingCartAction = { fn: actionFn, args: actionArgs || [] }; }
      openModal();
    },

    /** Close the modal without acting */
    close() { closeModal(); },

    /** @returns {boolean} true if user is signed in */
    isLoggedIn() {
      return !!(window._forestaUser || localStorage.getItem('foresta_auth_session'));
    },

    /**
     * Gate-keep an add-to-cart action.
     * If logged in → execute immediately.
     * If not → show modal, execute after successful auth.
     */
    requireAuth(actionFn, actionArgs) {
      if (this.isLoggedIn()) {
        actionFn.apply(null, actionArgs || []);
      } else {
        this.open(actionFn, actionArgs);
      }
    }
  };

  // ─── Initialise on DOM ready ───────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    injectModalHTML();
    attachEvents();
  }

})();
