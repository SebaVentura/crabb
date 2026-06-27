import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ApiError } from '../../../lib/apiClient'
import { collectionsMessagesService } from '../../../services/collectionsMessagesService'
import { collectionsService } from '../../../services/collectionsService'
import type {
  CollectionMessagePreviewResult,
  CollectionSendTestResult,
} from '../../../types/collectionsMessages'
import { CAMPANIA_DEFAULT_ID, CAMPANIAS_COBRANZA } from '../constants'
import type { FiltroDestinatarios } from '../components/GestionCobranzasSociosTable'
import { gestionCobranzasService } from '../services/gestionCobranzasService'
import type {
  CampaniaCobranzaId,
  CampanaHistorial,
  EstadoEnvioFila,
  FaseCobranzas,
  ResumenCampana,
  SocioCobranza,
} from '../types'
import { formatReminderMessage } from '../utils/formatReminderMessage'
import { mergeApiCampaignsWithLocal, pickDefaultCampaignId } from '../utils/mergeApiCampaignsWithLocal'
import { hasValidWhatsappPhone } from '../utils/phoneUtils'
import { findCampaniaById, resolveCampaniaById } from '../utils/resolveCampaniaById'

type AdminInfo = { nombre: string; email: string }

const TERMINAL: EstadoEnvioFila[] = ['enviado', 'error', 'enviando']

function toSocioId(value: string): number | string {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : value
}

function resolveEstado(member: SocioCobranza, selected: boolean): EstadoEnvioFila {
  if (TERMINAL.includes(member.estadoEnvio) && member.estadoEnvio !== 'seleccionado') {
    return member.estadoEnvio
  }
  if (!hasValidWhatsappPhone(member.telefono).valido) return 'sin_telefono_valido'
  if (selected) return 'seleccionado'
  return 'sin_enviar'
}

export function useGestionCobranzasEnvio(admin: AdminInfo) {
  const [members, setMembers] = useState<SocioCobranza[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [fase, setFase] = useState<FaseCobranzas>('inicial')
  const [isSending, setIsSending] = useState(false)
  const [resumenFinal, setResumenFinal] = useState<ResumenCampana | null>(null)
  const [historial, setHistorial] = useState<CampanaHistorial[]>([])
  const [filtroDeuda, setFiltroDeuda] = useState('')
  const [filtroDestinatarios, setFiltroDestinatarios] = useState<FiltroDestinatarios>('todos')
  const [busqueda, setBusqueda] = useState('')
  const [campaniaId, setCampaniaId] = useState<CampaniaCobranzaId>(CAMPANIA_DEFAULT_ID)
  const [campanias, setCampanias] = useState(CAMPANIAS_COBRANZA)
  const [totalActivosCount, setTotalActivosCount] = useState(0)
  const [messagePreview, setMessagePreview] = useState<CollectionMessagePreviewResult | null>(null)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [testPhoneOverride, setTestPhoneOverride] = useState('')
  const [sendTestResult, setSendTestResult] = useState<CollectionSendTestResult | null>(null)
  const [isSendTestLoading, setIsSendTestLoading] = useState(false)
  const [sendTestError, setSendTestError] = useState<string | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [selectedMembersById, setSelectedMembersById] = useState<Map<string, SocioCobranza>>(() => new Map())
  const skipSearchEffectRef = useRef(true)

  const syncMemberStates = useCallback((ids: Set<string>, source?: SocioCobranza[]) => {
    setMembers((prev) => {
      const base = source ?? prev
      return base.map((member) => ({
        ...member,
        estadoEnvio: resolveEstado(member, ids.has(member.id)),
        errorEnvio: ids.has(member.id) ? member.errorEnvio : null,
      }))
    })
  }, [])

  const applyMembersFromApi = useCallback(
    (candidatos: SocioCobranza[], selectedIdsSnapshot: Set<string>) => {
      const merged = candidatos.map((member) => ({
        ...member,
        estadoEnvio: resolveEstado(member, selectedIdsSnapshot.has(member.id)),
      }))
      setMembers(merged)
      setSelectedMembersById((prev) => {
        const next = new Map(prev)
        for (const member of merged) {
          if (selectedIdsSnapshot.has(member.id)) next.set(member.id, member)
        }
        return next
      })
    },
    [],
  )

  const loadCandidatos = useCallback(
    async (options?: { showTableLoading?: boolean }) => {
      if (options?.showTableLoading) {
        setIsSearching(true)
        setSearchError(null)
      } else {
        setLoadError(null)
      }

      try {
        const candidatos = await gestionCobranzasService.listarCandidatos({
          search: busqueda,
          estado_cuota: filtroDeuda || undefined,
        })
        setSelectedIds((current) => {
          applyMembersFromApi(candidatos, current)
          return current
        })
      } catch {
        if (options?.showTableLoading) {
          setSearchError('No se pudieron buscar socios con deuda.')
        } else {
          setLoadError('No se pudieron cargar los socios con deuda.')
          setMembers([])
        }
      } finally {
        if (options?.showTableLoading) setIsSearching(false)
      }
    },
    [applyMembersFromApi, busqueda, filtroDeuda],
  )

  const loadInitial = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const [summary, hist, apiCampaigns] = await Promise.all([
        collectionsService.getSummary(),
        gestionCobranzasService.obtenerHistorial(),
        collectionsMessagesService.getCampaigns().catch(() => []),
      ])
      setTotalActivosCount(summary.totalActivos)
      if (apiCampaigns.length > 0) {
        const mapped = mergeApiCampaignsWithLocal(apiCampaigns)
        setCampanias(mapped)
        setCampaniaId((c) => pickDefaultCampaignId(mapped, c))
      }
      setHistorial(hist)
      await loadCandidatos()
    } catch {
      setLoadError('No se pudieron cargar los datos de cobranzas.')
    } finally {
      setIsLoading(false)
      skipSearchEffectRef.current = false
    }
  }, [loadCandidatos])

  useEffect(() => {
    void loadInitial()
  }, [loadInitial])

  useEffect(() => {
    if (skipSearchEffectRef.current) return
    const t = window.setTimeout(() => void loadCandidatos({ showTableLoading: true }), 400)
    return () => window.clearTimeout(t)
  }, [busqueda, filtroDeuda, loadCandidatos])

  const campaniaSeleccionada = useMemo(
    () => resolveCampaniaById(campanias, campaniaId),
    [campaniaId, campanias],
  )

  const realSendEnabled = campaniaSeleccionada.realSendEnabled === true

  const seleccionados = useMemo(
    () =>
      Array.from(selectedIds)
        .map((id) => selectedMembersById.get(id) ?? members.find((m) => m.id === id))
        .filter((item): item is SocioCobranza => item !== undefined),
    [members, selectedIds, selectedMembersById],
  )

  const socioParaPreview = seleccionados[0] ?? null

  const seleccionStats = useMemo(() => {
    let validos = 0
    let invalidos = 0
    for (const member of seleccionados) {
      if (hasValidWhatsappPhone(member.telefono).valido) validos += 1
      else invalidos += 1
    }
    return { seleccionados: seleccionados.length, validos, invalidos }
  }, [seleccionados])

  useEffect(() => {
    let active = true
    if (!socioParaPreview) {
      setMessagePreview(null)
      setPreviewError(null)
      return () => {
        active = false
      }
    }

    if (!realSendEnabled) {
      setMessagePreview(null)
      setPreviewError(null)
      setIsPreviewLoading(false)
      return () => {
        active = false
      }
    }

    setIsPreviewLoading(true)
    setPreviewError(null)
    collectionsMessagesService
      .previewMessage({
        campaign_key: campaniaSeleccionada.id,
        socio_id: toSocioId(socioParaPreview.id),
      })
      .then((result) => {
        if (active) setMessagePreview(result)
      })
      .catch((error: unknown) => {
        if (!active) return
        setMessagePreview(null)
        if (error instanceof ApiError) {
          setPreviewError(`No se pudo cargar la vista previa (${error.status}): ${error.message}`)
        } else {
          setPreviewError('No se pudo cargar la vista previa.')
        }
      })
      .finally(() => {
        if (active) setIsPreviewLoading(false)
      })

    return () => {
      active = false
    }
  }, [campaniaSeleccionada.id, realSendEnabled, socioParaPreview])

  const previewText = useMemo(() => {
    if (messagePreview?.simulationMessage) return messagePreview.simulationMessage
    if (!socioParaPreview) return null
    return formatReminderMessage(socioParaPreview, campaniaSeleccionada.template)
  }, [messagePreview, socioParaPreview, campaniaSeleccionada.template])

  const setCampaniaSeleccionada = useCallback(
    (id: CampaniaCobranzaId) => {
      if (isSending) return
      const resolved = findCampaniaById(campanias, id)
      setCampaniaId(resolved?.id ?? id)
      setSendTestResult(null)
      setSendTestError(null)
    },
    [campanias, isSending],
  )

  const toggleSeleccion = useCallback(
    (id: string) => {
      if (isSending) return
      const member = members.find((m) => m.id === id)
      if (!member || !hasValidWhatsappPhone(member.telefono).valido) return

      setSelectedIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else {
          next.add(id)
          setSelectedMembersById((m) => new Map(m).set(id, member))
        }
        syncMemberStates(next)
        return next
      })
    },
    [isSending, members, syncMemberStates],
  )

  const seleccionarPagina = useCallback(
    (pageMembers: SocioCobranza[]) => {
      if (isSending) return
      const valid = pageMembers.filter((m) => hasValidWhatsappPhone(m.telefono).valido)
      setSelectedIds((prev) => {
        const next = new Set(prev)
        for (const m of valid) {
          next.add(m.id)
          setSelectedMembersById((map) => new Map(map).set(m.id, m))
        }
        syncMemberStates(next)
        return next
      })
    },
    [isSending, syncMemberStates],
  )

  const deseleccionarPagina = useCallback(
    (pageMembers: SocioCobranza[]) => {
      if (isSending) return
      const pageIds = new Set(pageMembers.map((m) => m.id))
      setSelectedIds((prev) => {
        const next = new Set(prev)
        for (const id of pageIds) next.delete(id)
        syncMemberStates(next)
        return next
      })
      setSelectedMembersById((prev) => {
        const next = new Map(prev)
        for (const id of pageIds) next.delete(id)
        return next
      })
    },
    [isSending, syncMemberStates],
  )

  const seleccionarMiembros = useCallback(
    (list: SocioCobranza[]) => {
      if (isSending) return
      const valid = list.filter((m) => hasValidWhatsappPhone(m.telefono).valido)
      const ids = new Set(valid.map((m) => m.id))
      setSelectedMembersById((prev) => {
        const next = new Map(prev)
        for (const m of valid) next.set(m.id, m)
        return next
      })
      setSelectedIds(ids)
      syncMemberStates(ids)
    },
    [isSending, syncMemberStates],
  )

  const seleccionarTodos = useCallback(() => {
    seleccionarMiembros(members)
  }, [members, seleccionarMiembros])

  const deseleccionarTodos = useCallback(() => {
    if (isSending) return
    setSelectedIds(new Set())
    setSelectedMembersById(new Map())
    syncMemberStates(new Set())
  }, [isSending, syncMemberStates])

  const validarEnvio = useCallback(async () => {
    if (!realSendEnabled || !socioParaPreview) return
    const phoneRaw = testPhoneOverride.trim() || socioParaPreview.telefono
    const phoneInfo = hasValidWhatsappPhone(phoneRaw)
    if (!phoneInfo.valido) {
      setSendTestError('El socio seleccionado no tiene un teléfono válido.')
      return
    }

    setIsSendTestLoading(true)
    setSendTestError(null)
    setSendTestResult(null)
    try {
      const nombre = socioParaPreview.nombre.split(' ')[0] ?? 'Socio'
      const result = await collectionsMessagesService.sendTest({
        phone: phoneInfo.normalizado,
        campaign_key: campaniaSeleccionada.id,
        params: { nombre },
        dry_run: true,
      })
      setSendTestResult(result)
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        setSendTestError(error.message)
      } else {
        setSendTestError('No se pudo validar el envío.')
      }
    } finally {
      setIsSendTestLoading(false)
    }
  }, [campaniaSeleccionada.id, realSendEnabled, socioParaPreview, testPhoneOverride])

  const enviarASeleccionados = useCallback(async () => {
    if (!realSendEnabled || isSending) return
    if (seleccionStats.validos === 0 || seleccionStats.invalidos > 0) return

    setIsSending(true)
    setSendError(null)
    setResumenFinal(null)
    setFase('enviando')

    const cola = seleccionados.filter((m) => hasValidWhatsappPhone(m.telefono).valido)
    const ids = new Set(cola.map((m) => m.id))

    setMembers((prev) =>
      prev.map((m) => (ids.has(m.id) ? { ...m, estadoEnvio: 'enviando' as const, errorEnvio: null } : m)),
    )

    try {
      const result = await collectionsMessagesService.sendSelected({
        campaign_key: campaniaSeleccionada.id,
        socio_ids: cola.map((m) => toSocioId(m.id)),
      })

      let enviados = 0
      let errores = 0
      const resultBySocio = new Map(result.results.map((r) => [String(r.socioId), r]))

      setMembers((prev) =>
        prev.map((m) => {
          if (!ids.has(m.id)) return m
          const row = resultBySocio.get(m.id)
          if (!row) return { ...m, estadoEnvio: 'error' as const, errorEnvio: 'Sin respuesta del servidor' }
          if (row.ok) {
            enviados += 1
            return { ...m, estadoEnvio: 'enviado' as const, errorEnvio: null }
          }
          errores += 1
          return { ...m, estadoEnvio: 'error' as const, errorEnvio: row.error ?? row.status }
        }),
      )

      const resumen: ResumenCampana = {
        campaniaLabel: campaniaSeleccionada.label,
        seleccionados: cola.length,
        enviados,
        errores,
        omitidos: 0,
        fechaFin: new Date().toISOString(),
      }
      setResumenFinal(resumen)
      setFase('resumen')

      gestionCobranzasService.guardarEntradaHistorial({
        id: crypto.randomUUID(),
        fechaInicio: new Date().toISOString(),
        fechaFin: resumen.fechaFin,
        tipoRecordatorio: campaniaSeleccionada.label,
        adminNombre: admin.nombre,
        adminEmail: admin.email,
        seleccionados: cola.length,
        enviados,
        errores,
        cancelados: 0,
        invalidos: 0,
        estadoFinal: errores > 0 ? 'Con errores' : 'Finalizado',
      })
    } catch (error: unknown) {
      setSendError(error instanceof ApiError ? error.message : 'No se pudo completar el envío.')
      setMembers((prev) =>
        prev.map((m) =>
          ids.has(m.id) ? { ...m, estadoEnvio: 'error' as const, errorEnvio: 'Error de envío' } : m,
        ),
      )
      setFase('inicial')
    } finally {
      setIsSending(false)
    }
  }, [
    admin.email,
    admin.nombre,
    campaniaSeleccionada.id,
    campaniaSeleccionada.label,
    isSending,
    realSendEnabled,
    seleccionados,
    seleccionStats.invalidos,
    seleccionStats.validos,
  ])

  const reiniciarEnvio = useCallback(() => {
    setSelectedIds(new Set())
    setSelectedMembersById(new Map())
    setResumenFinal(null)
    setSendError(null)
    setSendTestResult(null)
    setFase('inicial')
    setMembers((prev) =>
      prev.map((m) => ({ ...m, estadoEnvio: 'sin_enviar' as const, errorEnvio: null })),
    )
  }, [])

  const verHistorial = useCallback(() => setFase('historial'), [])
  const volverDesdeHistorial = useCallback(() => setFase('inicial'), [])

  return {
    members,
    selectedIds,
    fase,
    isSending,
    isLoading,
    isSearching,
    loadError,
    searchError,
    busqueda,
    setBusqueda,
    filtroDeuda,
    setFiltroDeuda,
    filtroDestinatarios,
    setFiltroDestinatarios,
    sociosConDeuda: members.length,
    totalActivos: totalActivosCount > 0 ? totalActivosCount : members.length,
    campanias,
    campaniaSeleccionada,
    setCampaniaSeleccionada,
    realSendEnabled,
    socioParaPreview,
    previewText,
    messagePreview,
    isPreviewLoading,
    previewError,
    previewEsSimulacion: !realSendEnabled,
    seleccionStats,
    testPhoneOverride,
    setTestPhoneOverride,
    sendTestResult,
    isSendTestLoading,
    sendTestError,
    validarEnvio,
    sendError,
    resumenFinal,
    enviarASeleccionados,
    reiniciarEnvio,
    historial,
    verHistorial,
    volverDesdeHistorial,
    toggleSeleccion,
    seleccionarPagina,
    deseleccionarPagina,
    seleccionarTodos,
    seleccionarMiembros,
    deseleccionarTodos,
  }
}
