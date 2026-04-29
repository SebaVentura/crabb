import { useEffect, useMemo, useState } from 'react'

const DIAS_CORTOS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

function formatFechaEsAr(d: Date): string {
  const raw = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
  const sinComas = raw.replace(/,/g, '').replace(/\s+/g, ' ').trim()
  return sinComas.charAt(0).toUpperCase() + sinComas.slice(1)
}

function formatHora24(d: Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(d)
}

function formatMesAnio(d: Date): string {
  const raw = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(d)
  return raw.charAt(0).toUpperCase() + raw.slice(1)
}

function buildCalendarDays(reference: Date): Date[] {
  const year = reference.getFullYear()
  const month = reference.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const mondayIndex = (firstDay.getDay() + 6) % 7
  const start = new Date(year, month, 1 - mondayIndex)

  const sundayIndex = (lastDay.getDay() + 6) % 7
  const end = new Date(year, month, lastDay.getDate() + (6 - sundayIndex))

  const days: Date[] = []
  const cursor = new Date(start)
  while (cursor <= end) {
    days.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

type DateTimeWidgetProps = {
  className?: string
}

export function DateTimeWidget({ className = '' }: DateTimeWidgetProps) {
  const [ahora, setAhora] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setAhora(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const fecha = formatFechaEsAr(ahora)
  const hora = formatHora24(ahora)
  const mesAnio = formatMesAnio(ahora)
  const days = useMemo(() => buildCalendarDays(ahora), [ahora])
  const todayKey = `${ahora.getFullYear()}-${ahora.getMonth()}-${ahora.getDate()}`

  return (
    <section className={`mt-6 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">HORA ACTUAL</p>
      <p className="mt-2 text-center font-mono text-3xl font-semibold tabular-nums text-slate-900">{hora}</p>
      <p className="mt-1 text-center text-sm text-slate-600">{fecha}</p>

      <div className="my-4 border-t border-slate-200/70" />

      <p className="text-center text-sm font-semibold text-slate-800">{mesAnio}</p>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] text-slate-500">
        {DIAS_CORTOS.map((d) => (
          <span key={d} className="font-medium">
            {d}
          </span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1 text-center text-xs">
        {days.map((day) => {
          const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`
          const sameMonth = day.getMonth() === ahora.getMonth()
          const isToday = key === todayKey

          return (
            <span
              key={key}
              className={`flex h-7 items-center justify-center rounded-md ${
                isToday
                  ? 'bg-blue-600 font-semibold text-white'
                  : sameMonth
                    ? 'text-slate-700'
                    : 'text-slate-300'
              }`}
            >
              {day.getDate()}
            </span>
          )
        })}
      </div>
    </section>
  )
}
