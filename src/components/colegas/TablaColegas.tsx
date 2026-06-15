import { useState, type ReactNode } from 'react'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import type { Colega } from '../../types/colegas'
import { enlaceWhatsAppColega } from '../../utils/whatsappColega'

type Props = {
  resultados: Colega[]
  cargando?: boolean
}

function localidadBreve(colega: Colega) {
  const partes = [colega.localidad, colega.direccion].filter(Boolean)
  return partes.join(' · ') || '—'
}

function ModalDetalleColega({ colega, onClose }: { colega: Colega; onClose: () => void }) {
  const rows: [string, string][] = [
    ['Nombre / Razón social', colega.nombreRazonSocial],
    ['Rubro', colega.rubro],
    ...(colega.responsable ? [['Responsable', colega.responsable] as [string, string]] : []),
    ...(colega.telefono ? [['Teléfono', colega.telefono] as [string, string]] : []),
    ...(colega.direccion ? [['Dirección', colega.direccion] as [string, string]] : []),
    ...(colega.localidad ? [['Localidad', colega.localidad] as [string, string]] : []),
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4">
      <div
        className="flex max-h-[92vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-xl sm:max-h-[90vh] sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detalle-colega-title"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
          <h2 id="detalle-colega-title" className="text-lg font-semibold text-slate-900">
            Detalle del colega
          </h2>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-sm font-medium text-slate-600 transition duration-150 hover:bg-slate-100"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
        <dl className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          {rows.map(([label, valor]) => (
            <div key={label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
              <dd className="mt-0.5 text-sm text-slate-900">{valor}</dd>
            </div>
          ))}
        </dl>
        <div className="border-t border-slate-100 px-4 py-3 sm:px-5">
          <button
            type="button"
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition duration-150 hover:bg-slate-50 sm:w-auto"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

function AccionesFila({
  colega,
  onVer,
}: {
  colega: Colega
  onVer: () => void
}) {
  const waUrl = colega.telefono
    ? enlaceWhatsAppColega(
        colega.telefono,
        `Hola, te contacto desde CRABB. Te recomiendo ${colega.nombreRazonSocial}.`,
      )
    : null

  return (
    <div className="flex flex-wrap gap-1">
      <button
        type="button"
        className="rounded-md px-2 py-1 text-xs font-semibold text-blue-700 transition duration-150 hover:bg-blue-50"
        onClick={onVer}
      >
        Ver
      </button>
      {waUrl ? (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md px-2 py-1 text-xs font-semibold text-emerald-700 transition duration-150 hover:bg-emerald-50"
        >
          WhatsApp
        </a>
      ) : null}
    </div>
  )
}

export function TablaColegas({ resultados, cargando = false }: Props) {
  const [detalle, setDetalle] = useState<Colega | null>(null)

  let contenido: ReactNode

  if (cargando) {
    contenido = (
      <p className="py-8 text-center text-sm text-slate-600">Buscando colegas…</p>
    )
  } else if (resultados.length === 0) {
    contenido = (
      <p className="py-8 text-center text-sm text-slate-600">
        No hay colegas que coincidan. Probá ampliar la búsqueda o activar &quot;Incluir mi rubro&quot;.
      </p>
    )
  } else {
    contenido = (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th className="pb-2 pr-3 font-medium">Socio</th>
              <th className="pb-2 pr-3 font-medium">Rubro</th>
              <th className="pb-2 pr-3 font-medium">Responsable</th>
              <th className="pb-2 pr-3 font-medium">Teléfono</th>
              <th className="pb-2 pr-3 font-medium">Localidad</th>
              <th className="pb-2 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((colega) => (
              <tr key={colega.id} className="border-b border-slate-100 last:border-0 even:bg-slate-50">
                <td className="max-w-[200px] py-3 pr-3 font-medium text-slate-900">
                  <span className="line-clamp-2">{colega.nombreRazonSocial}</span>
                </td>
                <td className="py-3 pr-3">
                  <Badge tone="blue">{colega.rubro}</Badge>
                </td>
                <td className="max-w-[140px] py-3 pr-3 text-slate-700">
                  <span className="line-clamp-2">{colega.responsable ?? '—'}</span>
                </td>
                <td className="whitespace-nowrap py-3 pr-3 text-slate-700">{colega.telefono ?? '—'}</td>
                <td className="max-w-[180px] py-3 pr-3 text-slate-700">
                  <span className="line-clamp-2">{localidadBreve(colega)}</span>
                </td>
                <td className="py-3">
                  <AccionesFila colega={colega} onVer={() => setDetalle(colega)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <>
      <Card className="border-slate-200 shadow-md" title={`Colegas (${cargando ? '…' : resultados.length})`}>
        {contenido}
      </Card>
      {detalle ? <ModalDetalleColega colega={detalle} onClose={() => setDetalle(null)} /> : null}
    </>
  )
}
