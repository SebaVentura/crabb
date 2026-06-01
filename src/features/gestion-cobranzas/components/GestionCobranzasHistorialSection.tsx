import { Card } from '../../../components/ui/Card'
import type { CampanaHistorial } from '../types'

type Props = {
  historial: CampanaHistorial[]
  onVolver: () => void
}

function formatFecha(iso: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
}

export function GestionCobranzasHistorialSection({ historial, onVolver }: Props) {
  return (
    <div className="space-y-4">
      <Card className="border-slate-200 shadow-md" title="Historial de recordatorios">
        {historial.length === 0 ? (
          <p className="text-sm text-slate-600">Todavía no hay envíos simulados registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-2 pr-3 font-medium">Fecha</th>
                  <th className="pb-2 pr-3 font-medium">Tipo</th>
                  <th className="pb-2 pr-3 font-medium">Seleccionados</th>
                  <th className="pb-2 pr-3 font-medium">Enviados</th>
                  <th className="pb-2 pr-3 font-medium">Errores</th>
                  <th className="pb-2 pr-3 font-medium">Cancelados</th>
                  <th className="pb-2 pr-3 font-medium">Administrador</th>
                  <th className="pb-2 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((h) => (
                  <tr key={h.id} className="border-b border-slate-100 last:border-0 even:bg-slate-50">
                    <td className="whitespace-nowrap py-3 pr-3 text-slate-700">{formatFecha(h.fechaFin)}</td>
                    <td className="py-3 pr-3 text-slate-700">{h.tipoRecordatorio}</td>
                    <td className="py-3 pr-3 text-slate-700">{h.seleccionados}</td>
                    <td className="py-3 pr-3 text-slate-700">{h.enviados}</td>
                    <td className="py-3 pr-3 text-slate-700">{h.errores}</td>
                    <td className="py-3 pr-3 text-slate-700">{h.cancelados}</td>
                    <td className="py-3 pr-3 text-slate-700">{h.adminNombre}</td>
                    <td className="py-3 text-slate-700">{h.estadoFinal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <button
        type="button"
        onClick={onVolver}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition duration-150 hover:bg-blue-50"
      >
        Volver al módulo
      </button>
    </div>
  )
}
