/**
 * AI Club OIST — Visitor Identity Service
 * Lightweight, privacy-conscious visitor identity mechanism for tracking
 * genuine article views, unique likes, and comment authors without tracking PII.
 */

const STORAGE_KEY_VISITOR_ID = 'aic_blog_visitor_id';
const STORAGE_KEY_VISITOR_HASH = 'aic_blog_visitor_hash';

/**
 * Generates an RFC 4122 v4 UUID
 */
function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Converts a string to a fast SHA-256 hex string using Web Crypto
 * @param {string} message
 * @returns {Promise<string>}
 */
async function sha256(message) {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {
    // Fallback if subtle crypto is restricted
  }
  // Simple fallback hash
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'fallback_' + Math.abs(hash).toString(16);
}

/**
 * Retrieves or initializes the persistent visitor UUID.
 * @returns {string} The visitor identifier.
 */
export function getVisitorId() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 'server_visitor';
  }

  let visitorId = localStorage.getItem(STORAGE_KEY_VISITOR_ID);
  if (!visitorId) {
    visitorId = generateUUID();
    try {
      localStorage.setItem(STORAGE_KEY_VISITOR_ID, visitorId);
    } catch {
      // Storage unavailable (e.g. private mode quota)
    }
  }
  return visitorId;
}

/**
 * Retrieves or generates an irreversible privacy-preserving hash of the visitor identity.
 * @returns {Promise<string>}
 */
export async function getVisitorHash() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 'anonymous_view';
  }

  let hash = localStorage.getItem(STORAGE_KEY_VISITOR_HASH);
  if (!hash) {
    const id = getVisitorId();
    // Salt with domain context
    hash = await sha256(`aic_salt_${id}`);
    try {
      localStorage.setItem(STORAGE_KEY_VISITOR_HASH, hash);
    } catch {
      // Storage unavailable
    }
  }
  return hash;
}
