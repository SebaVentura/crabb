import type { CollectionSendSelectedResult } from '../../../types/collectionsMessages'
import { Card } from '../../../components/ui/Card'

type Props = {
  result: CollectionSendSelectedResult | null
  isLoading: boolean
  error: string | null
  realSendEnabled: boolean
  disabled?: boolean
  onValidar: () => void
}

export function GestionCobranzasDryRunPanel({
  result,
  isLoading,
  error,
  realSendEnabled,
  disabled,
  onValidar,
}: Props) {
  const canValidate = realSendEnabled

  return (
    <Card className="border-slate-200 shadow-md" title="Validar envío a seleccionados (dry run)">
      <p className="mb-3 text-sm text-slate-600">
        Prepara la integración con el envío real sin enviar mensajes. Siempre usa{' '}
        <code className="rounded bg-slate-100 px-1">dry_run=true</code>.
      </p>

      {!canValidate ? (
        <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Esta campaña todavía no tiene template aprobada para envío real.
        </p>
      ) : null}

      <button
        type="button"
        disabled={disabled || isLoading || !canValidate}
        onClick={onValidar}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Validando…' : 'Validar envío seleccionado'}
      </button>

      {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}

      {result && result.results.length > 0 ? (
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Socio</th>
                <th className="px-3 py-2">OK</th>
                <th className="px-3 py-2">Estado</th>
                <th className="px-3 py-2">Provider</th>
                <th className="px-3 py-2">Teléfono</th>
                <th className="px-3 py-2">Error</th>
              </tr>
            </thead>
            <tbody>
              {result.results.map((row) => (
                <tr key={row.socioId} className="border-t border-slate-100">
                  <td className="px-3 py-2">{row.socioId}</td>
                  <td className="px-3 py-2">{row.ok ? 'Sí' : 'No'}</td>
                  <td className="px-3 py-2">{row.status}</td>
                  <td className="px-3 py-2">{row.provider ?? '—'}</td>
                  <td className="px-3 py-2">{row.phoneMasked ?? '—'}</td>
                  <td className="px-3 py-2 text-rose-700">{row.error ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Card>
  )
}
