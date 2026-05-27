type PublicSectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  centered?: boolean
}

export function PublicSectionHeader({
  eyebrow,
  title,
  description,
  centered = false,
}: PublicSectionHeaderProps) {
  return (
    <header className={centered ? 'mx-auto max-w-3xl text-center' : ''}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold leading-tight text-slate-100 md:text-3xl">{title}</h2>
      {description ? <p className="mt-3 text-sm text-slate-300 md:text-base">{description}</p> : null}
    </header>
  )
}
