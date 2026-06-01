import { Card } from '../../../components/ui/Card'
import type { LogEntry } from '../types'

type Props = {
  entries: LogEntry[]
}

export function GestionCobranzasLogPanel({ entries }: Props) {
  return (
    <Card className="border-slate-200 shadow-md" title="Historial de recordatorios (actividad en vivo)">
      <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-slate-950 p-3 font-mono text-xs text-emerald-300">
        {entries.length === 0 ? (
          <p className="text-slate-400">Sin actividad todavía.</p>
        ) : (
          <ul className="space-y-1">
            {entries.map((entry) => (
              <li key={entry.id}>
                <span className="text-slate-500">[{entry.timestamp}]</span> {entry.mensaje}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}
