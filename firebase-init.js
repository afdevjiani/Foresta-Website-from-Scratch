/**
 * Foresta Firebase Initialization
 * Shared across all pages - provides Firestore helpers for
 * customer profiles, order history, analytics, and authentication.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

// ── Firebase config ──
const firebaseConfig = {
  apiKey: "AIzaSyDZoTowWjGPtZnr8YCS6dIVRzQVIsiFjeM",
  authDomain: "forestawebsite.firebaseapp.com",
  projectId: "forestawebsite",
  storageBucket: "forestawebsite.firebasestorage.app",
  messagingSenderId: "581228606308",
  appId: "1:581228606308:web:13a7802aaa3bd3e7108071",
  measurementId: "G-KMC988WV41"
};

// ── Initialize ──
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Export for use by other scripts
window._forestaFirebase = { app, analytics, db, auth };

// ═══════════════════════════════════════════════════
// AUTHENTICATION
// ═══════════════════════════════════════════════════

// Current user state
window._forestaUser = null;

try {
  onAuthStateChanged(auth, (user) => {
    window._forestaUser = user || null;
    // Persist minimal session info
    if (user) {
      localStorage.setItem('foresta_auth_session', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || ''
      }));
      // Also update customer profile key so checkout.js can pick it up
      const existing = JSON.parse(localStorage.getItem('foresta_customer') || '{}');
      if (!existing.email || existing.email !== user.email) {
        existing.email = user.email;
        existing.name = existing.name || user.displayName || '';
        localStorage.setItem('foresta_customer', JSON.stringify(existing));
      }
    } else {
      localStorage.removeItem('foresta_auth_session');
    }
    // Dispatch custom event so other scripts can react
    window.dispatchEvent(new CustomEvent('forestaAuthChanged', { detail: { user } }));
  }, (error) => {
    // Silently handle unauthorized-domain – auth still works for email/password
    if (error.code === 'auth/unauthorized-domain') {
      console.warn('Firebase Auth: current domain not authorized. Add it at Firebase Console > Authentication > Settings > Authorized domains.');
    } else {
      console.error('Firebase Auth listener error:', error);
    }
  });
} catch (e) {
  console.warn('Firebase Auth init warning:', e.message);
}

window.forestaAuth = {
  /** @returns {object|null} current Firebase user */
  getCurrentUser() { return auth.currentUser; },

  /** @returns {boolean} */
  isLoggedIn() { return !!auth.currentUser; },

  /** Email/password login */
  async loginWithEmail(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  },

  /** Email/password sign-up */
  async signUpWithEmail(email, password, displayName) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    // Save profile to Firestore
    if (window.firebaseSaveProfile) {
      await window.firebaseSaveProfile({
        email: cred.user.email,
        name: displayName || ''
      });
    }
    return cred.user;
  },

  /** Google sign-in */
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Save/update profile in Firestore
      if (window.firebaseSaveProfile) {
        await window.firebaseSaveProfile({
          email: user.email,
          name: user.displayName || ''
        });
      }
      return user;
    } catch (err) {
      if (err.code === 'auth/unauthorized-domain') {
        throw new Error('This domain is not authorized for Google sign-in. Please use email/password login, or ask the site admin to add this domain in Firebase Console > Authentication > Settings > Authorized domains.');
      }
      throw err;
    }
  },

  /** Sign out */
  async logout() {
    await signOut(auth);
    window._forestaUser = null;
  }
};

// ═══════════════════════════════════════════════════
// CUSTOMER PROFILES  (collection: "customers")
// Document ID = email (lowercase, trimmed)
// ═══════════════════════════════════════════════════

window.firebaseSaveProfile = async function (profileData) {
  if (!profileData.email) return;
  const key = profileData.email.toLowerCase().trim();
  try {
    const ref = doc(db, "customers", key);
    const snap = await getDoc(ref);
    const payload = {
      name: profileData.name || "",
      phone: profileData.phone || "",
      phoneRaw: profileData.phoneRaw || "",
      countryCode: profileData.countryCode || "+971",
      email: profileData.email || "",
      company: profileData.company || "",
      updatedAt: new Date().toISOString()
    };
    if (snap.exists()) {
      await updateDoc(ref, payload);
    } else {
      payload.createdAt = new Date().toISOString();
      await setDoc(ref, payload);
    }
    console.log("[Firebase] Profile saved:", key);
  } catch (err) {
    console.error("[Firebase] Error saving profile:", err);
  }
};

window.firebaseGetProfile = async function (email) {
  if (!email) return null;
  const key = email.toLowerCase().trim();
  try {
    const ref = doc(db, "customers", key);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error("[Firebase] Error getting profile:", err);
    return null;
  }
};

// ═══════════════════════════════════════════════════
// ORDER HISTORY  (collection: "orders")
// ═══════════════════════════════════════════════════

window.firebaseSaveOrder = async function (orderData) {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      createdAt: new Date().toISOString()
    });
    console.log("[Firebase] Order saved:", docRef.id);
    return docRef.id;
  } catch (err) {
    console.error("[Firebase] Error saving order:", err);
    return null;
  }
};

window.firebaseGetOrders = async function (email, maxResults = 20) {
  if (!email) return [];
  const key = email.toLowerCase().trim();
  try {
    const q = query(
      collection(db, "orders"),
      where("email", "==", key),
      orderBy("createdAt", "desc"),
      limit(maxResults)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("[Firebase] Error getting orders:", err);
    return [];
  }
};

// ═══════════════════════════════════════════════════
// CONTACT INQUIRIES  (collection: "contact_inquiries")
// ═══════════════════════════════════════════════════

window.firebaseSaveInquiry = async function (inquiryData) {
  try {
    // 1) Save inquiry record for dashboard / history
    const docRef = await addDoc(collection(db, "contact_inquiries"), {
      name: inquiryData.name || "",
      email: (inquiryData.email || "").toLowerCase().trim(),
      phone: inquiryData.phone || "",
      interest: inquiryData.interest || "",
      message: inquiryData.message || "",
      source: inquiryData.source || "contact_form",
      status: "new",
      createdAt: new Date().toISOString()
    });
    console.log("[Firebase] Inquiry saved:", docRef.id);

    // 2) Trigger email via Firebase "Trigger Email" extension
    //    Writes to the "mail" collection — the extension picks it up and sends
    const NOTIFY_EMAIL = "afdevjiani@gmail.com";
    const interestLabel = inquiryData.interest
      ? inquiryData.interest.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      : 'Not specified';

    await addDoc(collection(db, "mail"), {
      to: NOTIFY_EMAIL,
      message: {
        subject: `New Inquiry — Foresta Website [${inquiryData.name || 'Anonymous'}]`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
            <div style="background:#1a3c2a;padding:20px 24px;">
              <h2 style="margin:0;color:#c8a84e;font-size:18px;">🌿 New Contact Inquiry</h2>
              <p style="margin:4px 0 0;color:#ffffff;font-size:13px;">Foresta Wood Industries Website</p>
            </div>
            <div style="padding:24px;">
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr>
                  <td style="padding:8px 12px;font-weight:bold;color:#1a3c2a;width:140px;vertical-align:top;">Full Name</td>
                  <td style="padding:8px 12px;color:#333;">${inquiryData.name || '—'}</td>
                </tr>
                <tr style="background:#f9f9f6;">
                  <td style="padding:8px 12px;font-weight:bold;color:#1a3c2a;vertical-align:top;">Email</td>
                  <td style="padding:8px 12px;color:#333;"><a href="mailto:${inquiryData.email}" style="color:#1a3c2a;">${inquiryData.email || '—'}</a></td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;font-weight:bold;color:#1a3c2a;vertical-align:top;">Phone</td>
                  <td style="padding:8px 12px;color:#333;">${inquiryData.phone || '—'}</td>
                </tr>
                <tr style="background:#f9f9f6;">
                  <td style="padding:8px 12px;font-weight:bold;color:#1a3c2a;vertical-align:top;">Interest</td>
                  <td style="padding:8px 12px;color:#333;">${interestLabel}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;font-weight:bold;color:#1a3c2a;vertical-align:top;">Message</td>
                  <td style="padding:8px 12px;color:#333;white-space:pre-wrap;">${inquiryData.message || '—'}</td>
                </tr>
              </table>
            </div>
            <div style="background:#f4f4f0;padding:14px 24px;text-align:center;font-size:11px;color:#888;">
              Submitted on ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} at ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        `
      }
    });
    console.log("[Firebase] Email trigger queued for:", NOTIFY_EMAIL);

    return docRef.id;
  } catch (err) {
    console.error("[Firebase] Error saving inquiry:", err);
    return null;
  }
};

// ═══════════════════════════════════════════════════
// ANALYTICS HELPERS
// ═══════════════════════════════════════════════════
import { logEvent } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";

window.firebaseLogEvent = function (eventName, params = {}) {
  try {
    logEvent(analytics, eventName, params);
  } catch (_) { /* silent */ }
};

console.log("[Firebase] Initialized ✓");
