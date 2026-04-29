import { NavLink } from 'react-router-dom'
import { navItems } from './nav-items'

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white px-2 py-2 md:hidden">
      <ul className="grid grid-cols-5 gap-1">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex min-h-12 items-center justify-center rounded-lg px-1 text-center text-[11px] ${
                  isActive ? 'bg-blue-100 font-semibold text-blue-700' : 'text-slate-600'
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
