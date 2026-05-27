import { useState } from 'react'
import { Link } from 'react-router-dom'

export type PublicNavItem = {
  label: string
  href: string
}

type PublicHeaderProps = {
  navItems: PublicNavItem[]
}

export function PublicHeader({ navItems }: PublicHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-700/60 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <a href="#inicio" className="inline-flex items-center gap-3 text-slate-100">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-sky-300/50 bg-slate-900 text-xs font-semibold tracking-[0.2em]">
            CR
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-100">CRABB</span>
            <span className="text-[11px] text-slate-400">Camara Regional Automotor</span>
          </span>
        </a>

        <nav className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="text-sm text-slate-300 transition hover:text-sky-200">
              {item.label}
            </a>
          ))}
          <Link
            to="/login"
            className="rounded-md border border-slate-600 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-slate-300 transition hover:border-slate-400 hover:text-white"
          >
            Admin
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-md border border-slate-600 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200 md:hidden"
          onClick={() => setMenuOpen((value) => !value)}
        >
          Menu
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-slate-700/70 bg-slate-950 px-4 py-3 md:hidden">
          <nav className="grid gap-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-slate-300"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/login"
              className="mt-1 inline-flex w-fit rounded-md border border-slate-600 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200"
              onClick={() => setMenuOpen(false)}
            >
              Acceso admin
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
