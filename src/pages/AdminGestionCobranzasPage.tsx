import { SectionHeader } from '../components/ui/SectionHeader'
import { useAuth } from '../hooks/useAuth'
import { CobranzasEnvioPanel } from '../features/gestion-cobranzas/components/CobranzasEnvioPanel'
import { CobranzasPreviewSection } from '../features/gestion-cobranzas/components/CobranzasPreviewSection'
import { CobranzasTemplateSelect } from '../features/gestion-cobranzas/components/CobranzasTemplateSelect'
import { CobranzasValidarEnvioPanel } from '../features/gestion-cobranzas/components/CobranzasValidarEnvioPanel'
import { GestionCobranzasHistorialSection } from '../features/gestion-cobranzas/components/GestionCobranzasHistorialSection'
import { GestionCobranzasResumenCards } from '../features/gestion-cobranzas/components/GestionCobranzasResumenCards'
import { GestionCobranzasSociosTable } from '../features/gestion-cobranzas/components/GestionCobranzasSociosTable'
import { GestionCobranzasWhatsAppTemplates } from '../features/gestion-cobranzas/components/GestionCobranzasWhatsAppTemplates'
import { useGestionCobranzasEnvio } from '../features/gestion-cobranzas/hooks/useGestionCobranzasEnvio'

export function AdminGestionCobranzasPage() {
  const { user } = useAuth()
  const admin = {
    nombre: user?.name ?? 'Administrador',
    email: user?.email ?? 'admin@crabb.local',
  }

  const envio = useGestionCobranzasEnvio(admin)
  const uiLocked = envio.isSending

  return (
    <div className="space-y-4 md:space-y-6">
      <SectionHeader
        title="Cobranzas por WhatsApp"
        subtitle="Elegí un template, seleccioná socios con deuda y enviá recordatorios por WhatsApp."
      />

      {envio.loadError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{envio.loadError}</div>
      ) : null}

      {envio.isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-md">
          Cargando…
        </div>
      ) : null}

      {!envio.isLoading && envio.fase === 'historial' ? (
        <GestionCobranzasHistorialSection historial={envio.historial} onVolver={envio.volverDesdeHistorial} />
      ) : null}

      {!envio.isLoading && envio.fase !== 'historial' ? (
        <>
          <GestionCobranzasResumenCards
            totalActivos={envio.totalActivos}
            sociosConDeuda={envio.sociosConDeuda}
            seleccionados={envio.seleccionStats.seleccionados}
            ultimoEnvio={envio.historial[0] ?? null}
          />

          <CobranzasTemplateSelect
            campanias={envio.campanias}
            selectedId={envio.campaniaSeleccionada.id}
            disabled={uiLocked}
            onSelect={envio.setCampaniaSeleccionada}
          />

          <GestionCobranzasSociosTable
            members={envio.members}
            selectedIds={envio.selectedIds}
            busqueda={envio.busqueda}
            filtroDeuda={envio.filtroDeuda}
            filtroDestinatarios={envio.filtroDestinatarios}
            disabled={uiLocked}
            isSearching={envio.isSearching}
            searchError={envio.searchError}
            onBusquedaChange={envio.setBusqueda}
            onFiltroDeudaChange={envio.setFiltroDeuda}
            onFiltroDestinatariosChange={envio.setFiltroDestinatarios}
            onToggle={envio.toggleSeleccion}
            onSeleccionarPagina={envio.seleccionarPagina}
            onDeseleccionarPagina={envio.deseleccionarPagina}
            onSeleccionarTodosFiltrados={envio.seleccionarMiembros}
            onDeseleccionarTodos={envio.deseleccionarTodos}
          />

          <CobranzasPreviewSection
            campania={envio.campaniaSeleccionada}
            socio={envio.socioParaPreview}
            socioFueraDeFiltro={envio.socioParaPreviewFueraDeFiltro}
            previewText={envio.previewText}
            messagePreview={envio.messagePreview}
            isLoading={envio.isPreviewLoading}
            error={envio.previewError}
            esSimulacion={envio.previewEsSimulacion}
          />

          <CobranzasValidarEnvioPanel
            campania={envio.campaniaSeleccionada}
            socio={envio.socioParaPreview}
            realSendEnabled={envio.realSendEnabled}
            isLoading={envio.isSendTestLoading}
            error={envio.sendTestError}
            result={envio.sendTestResult}
            testPhoneOverride={envio.testPhoneOverride}
            onTestPhoneOverrideChange={envio.setTestPhoneOverride}
            disabled={uiLocked}
            onValidar={() => void envio.validarEnvio()}
          />

          <CobranzasEnvioPanel
            campania={envio.campaniaSeleccionada}
            seleccionados={envio.seleccionStats.seleccionados}
            validos={envio.seleccionStats.validos}
            invalidos={envio.seleccionStats.invalidos}
            realSendEnabled={envio.realSendEnabled}
            isSending={envio.isSending}
            sendError={envio.sendError}
            resumen={envio.resumenFinal}
            onEnviar={() => void envio.enviarASeleccionados()}
            onNuevoEnvio={envio.reiniciarEnvio}
          />

          <details className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4 shadow-sm">
            <summary className="cursor-pointer text-sm font-semibold text-slate-600">
              Opciones avanzadas · Editor de plantillas de simulación
            </summary>
            <p className="mt-2 text-xs text-slate-500">
              No modifica templates aprobados en Zavu. Solo sirve para borradores locales de simulación.
            </p>
            <div className="mt-4">
              <GestionCobranzasWhatsAppTemplates />
            </div>
          </details>

          {envio.historial.length > 0 ? (
            <button
              type="button"
              onClick={envio.verHistorial}
              className="text-sm font-semibold text-blue-700 hover:underline"
            >
              Ver historial de envíos
            </button>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
