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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-[74px] w-full max-w-7xl items-center justify-between px-4 md:min-h-[82px] md:px-8">
        <a href="#inicio" className="inline-flex items-center">
          <span className="inline-flex rounded-md bg-white p-1 shadow-sm ring-1 ring-slate-200">
            <img src={CRABB_LOGO_SRC} alt="CRABB" className="h-10 w-auto md:h-[56px]" loading="eager" />
          </span>
        </a>

        <nav className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
            >
              {displayLabel(item.label)}
            </a>
          ))}
          <Link
            to="/login"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            Admin
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 md:hidden"
          onClick={() => setMenuOpen((value) => !value)}
        >
          Menu
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <nav className="grid gap-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-slate-700"
                onClick={() => setMenuOpen(false)}
              >
                {displayLabel(item.label)}
              </a>
            ))}
            <Link
              to="/login"
              className="mt-1 inline-flex w-fit rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700"
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
