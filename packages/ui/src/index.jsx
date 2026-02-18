/**
 * @kodnest/ui — Shared UI component library
 * 
 * Usage in any app:
 *   import { Button, Card, Badge } from '@kodnest/ui'
 * 
 * These components are intentionally minimal/headless.
 * Each app applies its own Tailwind classes or design tokens.
 */

/* ── Button ─────────────────────────────────────────────── */
export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  const sizes = {
    sm:  'px-3 py-1.5 text-xs',
    md:  'px-4 py-2 text-sm',
    lg:  'px-6 py-3 text-base',
  }
  const variants = {
    primary:   'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-200',
    danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
    ghost:     'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-200',
  }
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

/* ── Card ────────────────────────────────────────────────── */
export function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>{children}</div>
}

export function CardContent({ children, className = '' }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`text-sm font-semibold text-gray-900 ${className}`}>{children}</h3>
}

/* ── Badge ───────────────────────────────────────────────── */
export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    error:   'bg-red-100 text-red-600',
    info:    'bg-blue-100 text-blue-700',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

/* ── Input ───────────────────────────────────────────────── */
export function Input({ className = '', error, ...props }) {
  return (
    <input
      className={`w-full border rounded-lg px-3 py-2 text-sm placeholder-gray-400
        focus:outline-none focus:ring-2 transition-all
        ${error
          ? 'border-red-300 focus:ring-red-200'
          : 'border-gray-200 focus:ring-gray-200 focus:border-gray-400'
        } ${className}`}
      {...props}
    />
  )
}

/* ── Textarea ────────────────────────────────────────────── */
export function Textarea({ className = '', error, ...props }) {
  return (
    <textarea
      className={`w-full border rounded-lg px-3 py-2 text-sm placeholder-gray-400 resize-none
        focus:outline-none focus:ring-2 transition-all
        ${error
          ? 'border-red-300 focus:ring-red-200'
          : 'border-gray-200 focus:ring-gray-200 focus:border-gray-400'
        } ${className}`}
      {...props}
    />
  )
}

/* ── Spinner ─────────────────────────────────────────────── */
export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-3 h-3', md: 'w-5 h-5', lg: 'w-8 h-8' }
  return (
    <svg className={`animate-spin text-current ${sizes[size]} ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  )
}

/* ── EmptyState ──────────────────────────────────────────── */
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && <Icon className="w-10 h-10 text-gray-300 mb-4" />}
      <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
      {description && <p className="text-xs text-gray-400 mb-4 max-w-xs">{description}</p>}
      {action}
    </div>
  )
}
