import type { ReactNode } from 'react'

type CardProps = {
  title?: string
  children: ReactNode
  className?: string
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <section className={`rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-6 ${className}`}>
      {title ? <h3 className="mb-3 text-base font-semibold text-slate-900">{title}</h3> : null}
      {children}
    </section>
  )
}
