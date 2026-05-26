import { useState } from 'react'
import { Card } from '../components/ui/Card'
import faatraLogo from '../assets/faatra-logo.png'

const FAATRA_SNIT_URL = 'https://faatrainfotecnica.com/login.php'

function LogoCrabbTarjeta() {
  const [logoMissing, setLogoMissing] = useState(false)
  const logoCrabbUrl = `${import.meta.env.BASE_URL}logo-crabb.jpg`

  if (logoMissing) return null

  return (
    <div className="flex shrink-0 items-center justify-center md:self-center md:justify-end">
      <img
        src={logoCrabbUrl}
        alt="CRABB"
        width={150}
        height={150}
        decoding="async"
        className="h-auto max-h-20 w-auto max-w-[130px] object-contain sm:max-w-[140px] md:max-h-24 md:max-w-[150px]"
        onError={() => setLogoMissing(true)}
      />
    </div>
  )
}

function FaatraAccesoExterno() {
  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-3">
      <img
        src={faatraLogo}
        alt="FAATRA"
        width={120}
        height={48}
        decoding="async"
        className="h-auto max-h-12 w-auto max-w-[120px] object-contain object-left"
      />
      <p className="text-left text-xs text-slate-500">Acceso externo para consulta técnica SNIT.</p>
      <a
        href={FAATRA_SNIT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 md:w-auto"
      >
        Acceder a FAATRA / SNIT
        <span className="sr-only"> (sitio externo, nueva pestaña)</span>
      </a>
      <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Enlace externo</span>
    </div>
  )
}

export function DataTecnicaPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Data Técnica</h1>
            <p className="mt-1 text-sm text-slate-600 md:text-base">Módulo en actualización.</p>
            <p className="mt-2 text-xs text-slate-500">La consulta interna se encuentra en construcción.</p>
            <div className="mt-4 border-t border-slate-100 pt-4">
              <FaatraAccesoExterno />
            </div>
          </div>
          <LogoCrabbTarjeta />
        </div>
      </header>

      <Card className="border-slate-200 shadow-md" title="Estado de sección">
        <p className="text-sm text-slate-700">
          La búsqueda técnica interna se habilitará cuando esté conectada a datos reales.
        </p>
      </Card>
    </div>
  )
}
