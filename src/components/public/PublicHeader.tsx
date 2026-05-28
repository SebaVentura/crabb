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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#06111f]/95 backdrop-blur">
      <div className="mx-auto flex min-h-[76px] w-full max-w-7xl items-center justify-between px-4 md:min-h-[82px] md:px-8">
        <a href="#inicio" className="inline-flex items-center">
          <span className="inline-flex rounded-md bg-white/95 p-1 shadow-sm ring-1 ring-slate-300/70">
            <img src={CRABB_LOGO_SRC} alt="CRABB" className="h-10 w-auto md:h-[56px]" loading="eager" />
          </span>
        </a>

        <nav className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition hover:text-sky-200"
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/login"
            className="rounded-md border border-slate-600/80 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-slate-200 transition hover:border-slate-400 hover:text-white"
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
        <div className="border-t border-slate-700/70 bg-[#06111f] px-4 py-3 md:hidden">
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
              Admin
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
