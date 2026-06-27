import type { CampaniaCobranza, ResumenCampana } from '../types'

type Props = {
  campania: CampaniaCobranza
  seleccionados: number
  validos: number
  invalidos: number
  realSendEnabled: boolean
  isSending: boolean
  sendError: string | null
  resumen: ResumenCampana | null
  onEnviar: () => void
  onNuevoEnvio: () => void
}

export function CobranzasEnvioPanel({
  campania,
  seleccionados,
  validos,
  invalidos,
  realSendEnabled,
  isSending,
  sendError,
  resumen,
  onEnviar,
  onNuevoEnvio,
}: Props) {
  const puedeEnviar =
    realSendEnabled && seleccionados > 0 && validos > 0 && invalidos === 0 && !isSending

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">5. Envío a socios seleccionados</h2>

      <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
        <p className="font-medium text-slate-900">Resumen antes de enviar</p>
        <ul className="mt-2 space-y-1">
          <li>Template: {campania.label}</li>
          <li>Socios seleccionados: {seleccionados}</li>
          <li>Con teléfono válido: {validos}</li>
          <li>Excluidos por teléfono inválido: {invalidos}</li>
        </ul>
      </div>

      {!realSendEnabled ? (
        <p className="mt-3 text-sm text-amber-800">El envío por WhatsApp no está disponible para esta campaña.</p>
      ) : invalidos > 0 ? (
        <p className="mt-3 text-sm text-amber-800">
          Hay socios seleccionados sin teléfono válido. Deseleccionalos para continuar.
        </p>
      ) : seleccionados === 0 ? (
        <p className="mt-3 text-sm text-slate-500">Seleccioná al menos un socio con teléfono válido.</p>
      ) : null}

      <button
        type="button"
        disabled={!puedeEnviar}
        onClick={onEnviar}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isSending ? 'Enviando…' : 'Enviar a socios seleccionados'}
      </button>

      {sendError ? <p className="mt-3 text-sm text-rose-700">{sendError}</p> : null}

      {resumen ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-sm text-slate-800">
          <p className="font-semibold text-slate-900">Resultado del envío</p>
          <ul className="mt-2 space-y-1">
            <li>Enviados: {resumen.enviados}</li>
            <li>Con error: {resumen.errores}</li>
            <li>Omitidos: {resumen.omitidos}</li>
          </ul>
          <button
            type="button"
            onClick={onNuevoEnvio}
            className="mt-3 text-sm font-semibold text-blue-700 hover:underline"
          >
            Preparar nuevo envío
          </button>
        </div>
      ) : null}
    </section>
  )
}
