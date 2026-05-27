type PublicSectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  centered?: boolean
  tone?: 'light' | 'dark'
  className?: string
}

export function PublicSectionHeader({
  eyebrow,
  title,
  description,
  centered = false,
  tone = 'light',
  className = '',
}: PublicSectionHeaderProps) {
  const eyebrowColor = tone === 'dark' ? 'text-slate-500' : 'text-slate-400'
  const titleColor = tone === 'dark' ? 'text-slate-900' : 'text-slate-100'
  const descriptionColor = tone === 'dark' ? 'text-slate-600' : 'text-slate-300'

  return (
    <header className={`${centered ? 'mx-auto max-w-3xl text-center' : ''} ${className}`.trim()}>
      {eyebrow ? (
        <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${eyebrowColor}`}>{eyebrow}</p>
      ) : null}
      <h2 className={`mt-2 text-3xl font-semibold leading-tight md:text-4xl ${titleColor}`}>{title}</h2>
      {description ? <p className={`mt-4 text-sm md:text-base ${descriptionColor}`}>{description}</p> : null}
    </header>
  )
}
