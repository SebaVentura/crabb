import { NavLink } from 'react-router-dom'
import { DateTimeWidget } from '../layout/DateTimeWidget'
import { navItems } from './nav-items'

export function Sidebar() {
  const logoCrabbUrl = `${import.meta.env.BASE_URL}logo-crabb.jpg`

  return (
    <aside className="hidden w-72 border-r border-slate-200 bg-white p-4 md:block">
      <div className="mb-6 flex items-center gap-3">
        <img src={logoCrabbUrl} alt="CRABB" className="h-10 w-10 rounded-md object-contain" />
        <div>
          <p className="text-xs text-slate-500">Cámara de Reparación</p>
          <p className="text-sm font-semibold text-slate-900">CRABB</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-xl px-3 py-2 text-sm font-medium ${
                isActive ? 'bg-blue-100 text-blue-700' : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <DateTimeWidget className="hidden lg:block" />
    </aside>
  )
}
