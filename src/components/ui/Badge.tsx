type BadgeProps = {
  tone?: 'blue' | 'red' | 'gray' | 'green' | 'yellow'
  children: string
}

export function Badge({ tone = 'gray', children }: BadgeProps) {
  const toneClass =
    tone === 'blue'
      ? 'bg-blue-100 text-blue-700'
      : tone === 'red'
        ? 'bg-rose-100 text-rose-700'
        : tone === 'green'
          ? 'bg-emerald-100 text-emerald-800'
          : tone === 'yellow'
            ? 'bg-amber-100 text-amber-900'
            : 'bg-slate-100 text-slate-700'

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${toneClass}`}>{children}</span>
}
