import { useState } from 'react'
import { Link } from 'react-router-dom'

export type PublicNavItem = {
  label: string
  href: string
}

type PublicHeaderProps = {
  navItems: PublicNavItem[]
}

const CRABB_LOGO_SRC = '/logo-crabb.jpg'

export function PublicHeader({ navItems }: PublicHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const displayLabel = (label: string) => {
    if (label.toLowerCase() === 'data tecnica') return 'Data Técnica'
    return label
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#06111f]/95 backdrop-blur">
      <div className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
        <a href="#inicio" className="inline-flex items-center gap-4">
          <img src={CRABB_LOGO_SRC} alt="CRABB" className="h-14 w-auto md:h-16" loading="eager" />
          <div className="hidden border-l border-white/15 pl-4 md:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-200/90">Camara Regional</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-100">Automotor de Bahia Blanca</p>
          </div>
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-200 transition duration-200 hover:text-white"
            >
              {displayLabel(item.label)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            to="/login"
            className="rounded-full border border-white/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200 transition hover:border-sky-300/60 hover:text-white"
          >
            Admin
          </Link>
        </div>

        <button
          type="button"
          className="rounded-md border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-100 lg:hidden"
          onClick={() => setMenuOpen((value) => !value)}
        >
          Menu
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-white/10 bg-[#071528] px-6 py-4 lg:hidden">
          <nav className="grid gap-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-slate-200"
                onClick={() => setMenuOpen(false)}
              >
                {displayLabel(item.label)}
              </a>
            ))}
            <Link
              to="/login"
              className="mt-2 inline-flex w-fit rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-100"
              onClick={() => setMenuOpen(false)}
            >
              Admin
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
