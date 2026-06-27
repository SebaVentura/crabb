import type { CollectionSendTestResult } from '../../../types/collectionsMessages'
import type { CampaniaCobranza, SocioCobranza } from '../types'
import { hasValidWhatsappPhone } from '../utils/phoneUtils'

type Props = {
  campania: CampaniaCobranza
  socio: SocioCobranza | null
  realSendEnabled: boolean
  isLoading: boolean
  error: string | null
  result: CollectionSendTestResult | null
  testPhoneOverride: string
  onTestPhoneOverrideChange: (value: string) => void
  disabled?: boolean
  onValidar: () => void
}

export function CobranzasValidarEnvioPanel({
  campania,
  socio,
  realSendEnabled,
  isLoading,
  error,
  result,
  testPhoneOverride,
  onTestPhoneOverrideChange,
  disabled,
  onValidar,
}: Props) {
  const phoneInfo = socio ? hasValidWhatsappPhone(testPhoneOverride || socio.telefono) : null
  const canValidate = realSendEnabled && socio && phoneInfo?.valido

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        4. Validar envío con socio seleccionado
      </h2>

      {!realSendEnabled ? (
        <p className="mt-3 text-sm text-amber-800">
          Esta campaña no tiene template aprobado. Podés ver la vista previa simulada, pero no validar ni enviar por
          WhatsApp.
        </p>
      ) : !socio ? (
        <p className="mt-3 text-sm text-slate-500">Seleccioná un socio para validar el envío.</p>
      ) : (
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <ul className="space-y-1">
            <li>
              <span className="font-medium">Socio:</span> {socio.nombre}
            </li>
            <li>
              <span className="font-medium">Teléfono:</span>{' '}
              {phoneInfo?.valido ? phoneInfo.display : 'Sin teléfono válido'}
              {phoneInfo?.ambiguo ? (
                <span className="ml-1 text-amber-700">(se usará el primer número detectado)</span>
              ) : null}
            </li>
            <li>
              <span className="font-medium">Template:</span> {campania.label}
              {campania.templateId ? ` (${campania.templateId})` : ''}
            </li>
          </ul>

          <button
            type="button"
            disabled={disabled || isLoading || !canValidate}
            onClick={onValidar}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Validando…' : 'Validar envío'}
          </button>

          <details className="text-sm text-slate-600">
            <summary className="cursor-pointer font-medium text-slate-700">Probar con otro teléfono</summary>
            <input
              type="tel"
              value={testPhoneOverride}
              disabled={disabled || isLoading}
              onChange={(e) => onTestPhoneOverrideChange(e.target.value)}
              placeholder="5492914238010"
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </details>

          {error ? <p className="text-rose-700">{error}</p> : null}

          {result ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="font-medium text-slate-900">
                {result.ok ? 'Validación correcta' : 'La validación reportó un problema'}
              </p>
              {result.message ? <p className="mt-1">{result.message}</p> : null}
              {result.error ? <p className="mt-1 text-rose-700">{result.error}</p> : null}
            </div>
          ) : null}
        </div>
      )}
    </section>
  )
}
