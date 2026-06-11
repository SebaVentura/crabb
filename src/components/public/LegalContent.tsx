import type { ReactNode } from 'react'

type LegalSectionProps = {
  title: string
  children: ReactNode
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-blue-100/88 sm:text-[0.95rem]">
        {children}
      </div>
    </section>
  )
}

type LegalPageHeaderProps = {
  title: string
  subtitle: string
  lastUpdated: string
}

export function LegalPageHeader({ title, subtitle, lastUpdated }: LegalPageHeaderProps) {
  return (
    <header className="border-b border-white/10 pb-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200/80">
        CRABB · Bahía Blanca
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
      <p className="mt-4 text-base leading-7 text-blue-100/85">{subtitle}</p>
      <p className="mt-6 text-xs text-blue-100/60">Última actualización: {lastUpdated}</p>
    </header>
  )
}
