import { useMemo, useState } from 'react'
import { ApiError } from '../../lib/apiClient'
import type { ImportSociosResult } from '../../services/sociosService'

type Props = {
  onImport: (file: File) => Promise<ImportSociosResult>
}

function isXlsxFile(file: File) {
  return /\.xlsx$/i.test(file.name)
}

export function ImportPadronExcelPanel({ onImport }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ImportSociosResult | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const visibleErrors = useMemo(() => {
    if (!result) return []
    const merged = [...(result.summary?.errores ?? []), ...(result.errors ?? [])]
    return merged
      .filter((item) => {
        const lowered = item.toLowerCase()
        return !(
          lowered.includes(' at ') ||
          lowered.includes('stack') ||
          lowered.includes('.php:') ||
          lowered.includes('.ts:') ||
          lowered.includes('.js:')
        )
      })
        .filter((item, index, arr) => arr.indexOf(item) === index)
      .slice(0, 20)
  }, [result])

  const disableImport = useMemo(() => isImporting || !selectedFile, [isImporting, selectedFile])

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setResult(null)
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
      setResult(result)
      if (result.message) {
        setSuccessMessage(result.message)
      } else {
        setSuccessMessage('Importación procesada.')
      }
    } catch (importError) {
      if (importError instanceof ApiError) {
        if (importError.status === 401) {
          setError('Tu sesión expiró. Iniciá sesión nuevamente.')
        } else if (importError.status === 422) {
          setError(importError.message || 'El archivo no cumple el formato esperado.')
        } else {
          setError(importError.message || 'No se pudo importar el padrón.')
        }
      } else {
        const message = importError instanceof Error ? importError.message : 'No se pudo importar el padrón.'
        setError(message)
      }
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

      {result ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Resultado de importación</p>
          {result.code ? <p className="mt-2 text-sm text-slate-700">Código: {result.code}</p> : null}
          {result.debug_id ? <p className="mt-1 text-sm text-slate-700">Debug ID: {result.debug_id}</p> : null}

          {result.summary ? (
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-700 md:grid-cols-5">
              <div>Leídos: {result.summary.leidos}</div>
              <div>Creados: {result.summary.creados}</div>
              <div>Actualizados: {result.summary.actualizados}</div>
              <div>Omitidos: {result.summary.omitidos}</div>
              <div>Errores: {visibleErrors.length}</div>
            </div>
          ) : null}

          {visibleErrors.length > 0 ? (
            <details className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <summary className="cursor-pointer font-semibold">Ver errores parciales</summary>
              <ul className="mt-2 list-disc pl-4">
                {visibleErrors.map((item, index) => (
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
