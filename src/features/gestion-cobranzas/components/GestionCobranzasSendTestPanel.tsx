import { Card } from '../../../components/ui/Card'
import type { CollectionSendTestResult } from '../../../types/collectionsMessages'
import type { SocioCobranza } from '../types'

type Props = {
  testPhone: string
  onTestPhoneChange: (value: string) => void
  socioReferencia: SocioCobranza | null
  realSendEnabled: boolean
  isLoading: boolean
  error: string | null
  result: CollectionSendTestResult | null
  disabled?: boolean
  onEnviarPrueba: () => void
}

export function GestionCobranzasSendTestPanel({
  testPhone,
  onTestPhoneChange,
  socioReferencia,
  realSendEnabled,
  isLoading,
  error,
  result,
  disabled,
  onEnviarPrueba,
}: Props) {
  const canSendTest = realSendEnabled

  return (
    <Card className="border-slate-200 shadow-md" title="Enviar prueba (dry run)">
      <p className="mb-3 text-sm text-slate-600">
        Valida el envío contra la API sin disparar mensajes reales. Siempre se ejecuta con{' '}
        <code className="rounded bg-slate-100 px-1">dry_run=true</code>.
      </p>

      {!canSendTest ? (
        <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Esta campaña todavía no tiene template aprobada para envío real.
        </p>
      ) : null}

      <div className="space-y-3">
        <label className="block text-sm text-slate-700">
          <span className="mb-1 block font-medium">Teléfono de prueba</span>
          <input
            type="tel"
            value={testPhone}
            disabled={disabled || isLoading}
            onChange={(event) => onTestPhoneChange(event.target.value)}
            placeholder={socioReferencia?.telefono || '5492914238010'}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
          />
        </label>

        {socioReferencia && !socioReferencia.telefono ? (
          <p className="text-sm text-amber-800">El socio de referencia no tiene teléfono cargado. Ingresá uno manualmente.</p>
        ) : null}

        <button
          type="button"
          disabled={disabled || isLoading || !canSendTest}
          onClick={onEnviarPrueba}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Validando…' : 'Enviar prueba'}
        </button>

        {error ? <p className="text-sm text-rose-700">{error}</p> : null}

        {result ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            <p className="font-medium text-slate-900">Respuesta dry run</p>
            <ul className="mt-2 space-y-1">
              <li>
                <span className="font-medium">OK:</span> {result.ok ? 'Sí' : 'No'}
              </li>
              <li>
                <span className="font-medium">Dry run:</span> {result.dryRun ? 'Sí' : 'No'}
              </li>
              {result.provider ? (
                <li>
                  <span className="font-medium">Provider:</span> {result.provider}
                </li>
              ) : null}
              {result.templateId ? (
                <li>
                  <span className="font-medium">Template ID:</span> {result.templateId}
                </li>
              ) : null}
              {result.phoneMasked ? (
                <li>
                  <span className="font-medium">Teléfono:</span> {result.phoneMasked}
                </li>
              ) : null}
              {result.message ? (
                <li>
                  <span className="font-medium">Mensaje:</span> {result.message}
                </li>
              ) : null}
              {result.error ? (
                <li className="text-rose-700">
                  <span className="font-medium">Error:</span> {result.error}
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </div>
    </Card>
  )
}
