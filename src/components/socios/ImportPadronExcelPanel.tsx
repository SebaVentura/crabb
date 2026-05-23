import { useMemo, useState } from 'react'
import type { ImportSociosSummary } from '../../services/sociosService'

type Props = {
  onImport: (file: File) => Promise<ImportSociosSummary>
}

function isXlsxFile(file: File) {
  return /\.xlsx$/i.test(file.name)
}

export function ImportPadronExcelPanel({ onImport }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<ImportSociosSummary | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const disableImport = useMemo(() => isImporting || !selectedFile, [isImporting, selectedFile])

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setSummary(null)
    setSuccessMessage(null)

    if (!file) {
      setSelectedFile(null)
      setError(null)
      return
    }

    if (!isXlsxFile(file)) {
      setSelectedFile(null)
      setError('Archivo inválido. Seleccioná un .xlsx.')
      return
    }

    setSelectedFile(file)
    setError(null)
  }

  const handleImport = async () => {
    if (!selectedFile || isImporting) return

    setError(null)
    setSuccessMessage(null)
    setIsImporting(true)

    try {
      const result = await onImport(selectedFile)
      setSummary(result)
      setSuccessMessage('Importación completada. Se actualizó el padrón de socios.')
    } catch (importError) {
      const message = importError instanceof Error ? importError.message : 'No se pudo importar el padrón.'
      setError(message)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md md:p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Importar padrón Excel</h2>
      <p className="mt-1 text-sm text-slate-600">
        Subí un archivo .xlsx para importar socios desde el endpoint protegido.
      </p>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
        <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-150 hover:bg-slate-50">
          Seleccionar archivo
          <input
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="hidden"
            onChange={onFileChange}
            disabled={isImporting}
          />
        </label>

        <button
          type="button"
          onClick={handleImport}
          disabled={disableImport}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition duration-150 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isImporting ? 'Importando...' : 'Importar'}
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        {selectedFile ? `Archivo: ${selectedFile.name}` : 'No hay archivo seleccionado.'}
      </p>

      {error ? <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      {successMessage ? (
        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p>
      ) : null}

      {summary ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Resultado de importación</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-700 md:grid-cols-5">
            <div>Leídos: {summary.leidos}</div>
            <div>Creados: {summary.creados}</div>
            <div>Actualizados: {summary.actualizados}</div>
            <div>Omitidos: {summary.omitidos}</div>
            <div>Errores: {summary.errores.length}</div>
          </div>

          {summary.errores.length > 0 ? (
            <details className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <summary className="cursor-pointer font-semibold">Ver errores parciales</summary>
              <ul className="mt-2 list-disc pl-4">
                {summary.errores.slice(0, 20).map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            </details>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
