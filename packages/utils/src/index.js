/**
 * @kodnest/utils — Shared utility functions
 * 
 * Usage in any app:
 *   import { formatDate, truncate, cn } from '@kodnest/utils'
 */

/* ── Date helpers ─────────────────────────────────────────── */
export function formatDate(dateStr, options = {}) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', ...options,
  })
}

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours   = Math.floor(diff / 3600000)
  const days    = Math.floor(diff / 86400000)
  if (minutes < 1)  return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours   < 24) return `${hours}h ago`
  if (days    < 30) return `${days}d ago`
  return formatDate(dateStr)
}

/* ── String helpers ───────────────────────────────────────── */
export function truncate(str, max = 100) {
  if (!str || str.length <= max) return str
  return str.slice(0, max).trimEnd() + '…'
}

export function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function capitalise(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/* ── URL helpers ──────────────────────────────────────────── */
export function isValidUrl(str) {
  if (!str?.trim()) return false
  try {
    const u = new URL(str.trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch { return false }
}

/* ── Storage helpers ──────────────────────────────────────── */
export function localGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

export function localSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) }
  catch (e) { console.warn('localStorage.setItem failed:', e) }
}

export function localRemove(key) {
  try { localStorage.removeItem(key) } catch { /* noop */ }
}

/* ── Class name merge (like clsx) ─────────────────────────── */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/* ── Array helpers ────────────────────────────────────────── */
export function unique(arr) {
  return [...new Set(arr)]
}

export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = typeof key === 'function' ? key(item) : item[key]
    ;(acc[k] = acc[k] || []).push(item)
    return acc
  }, {})
}

/* ── Debounce ─────────────────────────────────────────────── */
export function debounce(fn, ms = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}
