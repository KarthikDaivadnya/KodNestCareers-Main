import { NavLink, Link } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/builder', label: 'Builder' },
  { to: '/preview', label: 'Preview' },
  { to: '/proof',   label: 'Proof'   },
]

export default function TopNav() {
  return (
    <header className="h-14 px-8 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 sticky top-0 z-50">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
          <span className="text-xs font-bold text-white tracking-tight">AI</span>
        </div>
        <span className="text-sm font-semibold text-gray-900 tracking-tight">
          Resume Builder
        </span>
      </Link>

      {/* Nav links */}
      <nav className="flex items-center gap-1">
        {NAV_LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
