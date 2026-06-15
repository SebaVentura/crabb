import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { collectionsService } from '../../../services/collectionsService'
import { CAMPANIA_DEFAULT_ID, CAMPANIAS_COBRANZA, getCampaniaById, INTERVALO_ENVIO_MS, COUNTDOWN_TICK_MS } from '../constants'
import { gestionCobranzasService } from '../services/gestionCobranzasService'
import type {
  CampaniaCobranzaId,
  CampanaHistorial,
  EstadoEnvioFila,
  FaseCobranzas,
  LogEntry,
  ResumenCampana,
  SendProgress,
  SocioCobranza,
} from '../types'
import { formatReminderMessage } from '../utils/formatReminderMessage'
import { validatePhone } from '../utils/validatePhone'

type AdminInfo = {
  nombre: string
  email: string
}

function crearLog(mensaje: string): LogEntry {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    mensaje,
  }
}

function estadoEnvioInicial(seleccionado: boolean, telefono: string): EstadoEnvioFila {
  if (!seleccionado) return 'no_seleccionado'
  if (!validatePhone(telefono).valido) return 'numero_invalido'
  return 'pendiente_envio'
}

export function useGestionCobranzasEnvio(admin: AdminInfo) {
  const [members, setMembers] = useState<SocioCobranza[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [fase, setFase] = useState<FaseCobranzas>('inicial')
  const [isPreparing, setIsPreparing] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false)
  const [currentMember, setCurrentMember] = useState<SocioCobranza | null>(null)
  const [sendProgress, setSendProgress] = useState<SendProgress>({
    total: 0,
    enviados: 0,
    pendientes: 0,
    errores: 0,
    cancelados: 0,
    invalidos: 0,
  })
  const [nextSendInMs, setNextSendInMs] = useState(0)
  const [sendLog, setSendLog] = useState<LogEntry[]>([])
  const [resumenFinal, setResumenFinal] = useState<ResumenCampana | null>(null)
  const [historial, setHistorial] = useState<CampanaHistorial[]>([])
  const [ultimoEnvio, setUltimoEnvio] = useState<CampanaHistorial | null>(null)
  const [filtroDeuda, setFiltroDeuda] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [campaniaId, setCampaniaId] = useState<CampaniaCobranzaId>(CAMPANIA_DEFAULT_ID)
  const [campanias, setCampanias] = useState(CAMPANIAS_COBRANZA)
  const [totalActivosCount, setTotalActivosCount] = useState(0)
  const [sociosConDeudaCount, setSociosConDeudaCount] = useState(0)
  const [backendPreview, setBackendPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [selectedMembersById, setSelectedMembersById] = useState<Map<string, SocioCobranza>>(() => new Map())

  const isSendingRef = useRef(false)
  const cancelledRef = useRef(false)
  const countdownTimerRef = useRef<number | null>(null)
  const skipSearchEffectRef = useRef(true)

  const appendLog = useCallback((mensaje: string) => {
    setSendLog((prev) => [...prev, crearLog(mensaje)])
  }, [])

  const applyMembersFromApi = useCallback(
    (candidatos: SocioCobranza[], selectedIdsSnapshot: Set<string>) => {
      setMembers(
        candidatos.map((member) => ({
          ...member,
          estadoEnvio: selectedIdsSnapshot.has(member.id)
            ? estadoEnvioInicial(true, member.telefono)
            : 'no_seleccionado',
        })),
      )

      setSelectedMembersById((prev) => {
        const next = new Map(prev)
        for (const member of candidatos) {
          if (selectedIdsSnapshot.has(member.id)) {
            next.set(member.id, {
              ...member,
              estadoEnvio: estadoEnvioInicial(true, member.telefono),
            })
          }
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

        setSelectedIds((currentSelectedIds) => {
          applyMembersFromApi(candidatos, currentSelectedIds)
          return currentSelectedIds
        })
      } catch {
        if (options?.showTableLoading) {
          setSearchError('No se pudieron buscar socios del padrón.')
        } else {
          setLoadError('No se pudieron cargar los socios del padrón.')
          setMembers([])
        }
      } finally {
        if (options?.showTableLoading) {
          setIsSearching(false)
        }
      }
    },
    [applyMembersFromApi, busqueda, filtroDeuda],
  )

  const loadInitial = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)

    try {
      const [summary, hist] = await Promise.all([
        collectionsService.getSummary(),
        gestionCobranzasService.obtenerHistorial(),
      ])

      setTotalActivosCount(summary.totalActivos)
      setSociosConDeudaCount(summary.sociosConDeuda)

      if (summary.campaigns.length > 0) {
        setCampanias(
          summary.campaigns.map((campaign) => ({
            id: campaign.id as CampaniaCobranzaId,
            label: campaign.label,
            descripcion: campaign.descripcion,
            tono: campaign.tono,
            template: campaign.template,
          })),
        )
      }

      setHistorial(hist)
      setUltimoEnvio(hist[0] ?? null)
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

    const timeoutId = window.setTimeout(() => {
      void loadCandidatos({ showTableLoading: true })
    }, 400)

    return () => window.clearTimeout(timeoutId)
  }, [busqueda, filtroDeuda, loadCandidatos])

  const sociosConDeuda = useMemo(
    () => (sociosConDeudaCount > 0 ? sociosConDeudaCount : members.length),
    [members.length, sociosConDeudaCount],
  )

  const totalActivos = useMemo(
    () => (totalActivosCount > 0 ? totalActivosCount : members.length),
    [members.length, totalActivosCount],
  )

  const campaniaSeleccionada = useMemo(
    () => campanias.find((item) => item.id === campaniaId) ?? getCampaniaById(campaniaId),
    [campaniaId, campanias],
  )

  const seleccionados = useMemo(
    () =>
      Array.from(selectedIds)
        .map((id) => selectedMembersById.get(id))
        .filter((item): item is SocioCobranza => item !== undefined),
    [selectedIds, selectedMembersById],
  )

  useEffect(() => {
    let active = true

    const socio = seleccionados.find((member) => validatePhone(member.telefono).valido)
      ?? members.find((member) => validatePhone(member.telefono).valido)

    collectionsService
      .previewMessage(campaniaId, socio?.id)
      .then((result) => {
        if (active) setBackendPreview(result.renderedMessage || null)
      })
      .catch(() => {
        if (!active) return
        const fallbackSocio = socio ?? members[0]
        setBackendPreview(
          fallbackSocio
            ? formatReminderMessage(fallbackSocio, campaniaSeleccionada.template)
            : null,
        )
      })

    return () => {
      active = false
    }
  }, [campaniaId, campaniaSeleccionada.template, members, seleccionados])

  const ejemploPreview = useMemo(() => {
    if (backendPreview) return backendPreview

    const elegible = seleccionados.find((member) => validatePhone(member.telefono).valido)
    const socio = elegible ?? members.find((member) => validatePhone(member.telefono).valido)
    return socio ? formatReminderMessage(socio, campaniaSeleccionada.template) : null
  }, [backendPreview, members, seleccionados, campaniaSeleccionada.template])

  const seleccionStats = useMemo(() => {
    let validos = 0
    let invalidos = 0
    for (const member of seleccionados) {
      if (validatePhone(member.telefono).valido) validos += 1
      else invalidos += 1
    }
    return { seleccionados: seleccionados.length, validos, invalidos }
  }, [seleccionados])

  const setCampaniaSeleccionada = useCallback(
    (id: CampaniaCobranzaId) => {
      if (isSending || isPreparing || fase !== 'inicial') return
      setCampaniaId(id)
    },
    [fase, isPreparing, isSending],
  )

  const syncEstadosEnvio = useCallback((ids: Set<string>) => {
    setMembers((prev) =>
      prev.map((member) => ({
        ...member,
        estadoEnvio: estadoEnvioInicial(ids.has(member.id), member.telefono),
      })),
    )

    setSelectedMembersById((prev) => {
      const next = new Map(prev)

      for (const id of Array.from(next.keys())) {
        if (!ids.has(id)) {
          next.delete(id)
        }
      }

      for (const id of ids) {
        const current = next.get(id)
        if (!current) continue
        next.set(id, {
          ...current,
          estadoEnvio: estadoEnvioInicial(true, current.telefono),
        })
      }

      return next
    })
  }, [])

  const toggleSeleccion = useCallback(
    (id: string) => {
      if (isSending || isPreparing) return
      const member = members.find((item) => item.id === id)

      setSelectedIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
          if (member) {
            setSelectedMembersById((current) => {
              const updated = new Map(current)
              updated.set(id, {
                ...member,
                estadoEnvio: estadoEnvioInicial(true, member.telefono),
              })
              return updated
            })
          }
        }
        syncEstadosEnvio(next)
        return next
      })
    },
    [isSending, isPreparing, members, syncEstadosEnvio],
  )

  const seleccionarTodos = useCallback(() => {
    if (isSending || isPreparing) return
    const ids = new Set(members.map((member) => member.id))

    setSelectedMembersById((prev) => {
      const next = new Map(prev)
      for (const member of members) {
        next.set(member.id, {
          ...member,
          estadoEnvio: estadoEnvioInicial(true, member.telefono),
        })
      }
      return next
    })

    setSelectedIds(ids)
    syncEstadosEnvio(ids)
  }, [isSending, isPreparing, members, syncEstadosEnvio])

  const deseleccionarTodos = useCallback(() => {
    if (isSending || isPreparing) return
    setSelectedIds(new Set())
    setSelectedMembersById(new Map())
    syncEstadosEnvio(new Set())
  }, [isSending, isPreparing, syncEstadosEnvio])

  const prepararEnvio = useCallback(() => {
    if (isSendingRef.current || isSending || isPreparing) return
    if (fase === 'enviando') return
    if (selectedIds.size === 0) return

    setIsPreparing(true)
    syncEstadosEnvio(selectedIds)
    setFase('confirmacion')
    setIsPreparing(false)
  }, [fase, isPreparing, isSending, selectedIds, syncEstadosEnvio])

  const cancelarCountdown = useCallback(() => {
    if (countdownTimerRef.current !== null) {
      window.clearInterval(countdownTimerRef.current)
      countdownTimerRef.current = null
    }
    setNextSendInMs(0)
  }, [])

  const runCountdown = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        cancelarCountdown()
        setNextSendInMs(ms)
        const started = Date.now()
        countdownTimerRef.current = window.setInterval(() => {
          const remaining = Math.max(0, ms - (Date.now() - started))
          setNextSendInMs(remaining)
          if (remaining <= 0) {
            cancelarCountdown()
            resolve()
          }
        }, COUNTDOWN_TICK_MS)
      }),
    [cancelarCountdown],
  )

  const finalizarCampana = useCallback(
    (params: {
      cancelado: boolean
      progreso: SendProgress
      fechaInicio: string
    }) => {
      const { cancelado, progreso, fechaInicio } = params
      const fechaFin = new Date().toISOString()

      let estadoFinal: CampanaHistorial['estadoFinal'] = 'Finalizado'
      if (cancelado) estadoFinal = 'Cancelado'
      else if (progreso.errores > 0) estadoFinal = 'Con errores'

      const entry: CampanaHistorial = {
        id: crypto.randomUUID(),
        fechaInicio,
        fechaFin,
        tipoRecordatorio: campaniaSeleccionada.label,
        adminNombre: admin.nombre,
        adminEmail: admin.email,
        seleccionados: progreso.total,
        enviados: progreso.enviados,
        errores: progreso.errores,
        cancelados: progreso.cancelados,
        invalidos: progreso.invalidos,
        estadoFinal,
      }

      const updated = gestionCobranzasService.guardarEntradaHistorial(entry)
      setHistorial(updated)
      setUltimoEnvio(entry)
      setResumenFinal({
        campaniaLabel: campaniaSeleccionada.label,
        seleccionados: progreso.total,
        enviados: progreso.enviados,
        errores: progreso.errores,
        cancelados: progreso.cancelados,
        invalidos: progreso.invalidos,
        fechaFin,
      })
      setFase('finalizado')
      setIsSending(false)
      isSendingRef.current = false
      setCurrentMember(null)
      appendLog('Campaña finalizada')
    },
    [admin.email, admin.nombre, appendLog, campaniaSeleccionada.label],
  )

  const confirmarYComenzarEnvio = useCallback(async () => {
    if (isSendingRef.current || isSending) return
    if (fase !== 'confirmacion') return
    if (seleccionStats.validos === 0) return

    isSendingRef.current = true
    cancelledRef.current = false
    setIsCancelled(false)
    setIsSending(true)
    setFase('enviando')
    setSendLog([])
    setResumenFinal(null)

    const cola = seleccionados.filter(
      (member) => validatePhone(member.telefono).valido && member.estadoEnvio === 'pendiente_envio',
    )
    const invalidosCount = seleccionados.filter((member) => !validatePhone(member.telefono).valido).length

    const progreso: SendProgress = {
      total: selectedIds.size,
      enviados: 0,
      pendientes: cola.length,
      errores: 0,
      cancelados: 0,
      invalidos: invalidosCount,
    }
    setSendProgress(progreso)
    appendLog(`Campaña seleccionada: ${campaniaSeleccionada.label}`)
    appendLog(`Inicio de envío simulado · ${cola.length} socios en cola`)

    const fechaInicio = new Date().toISOString()

    for (let i = 0; i < cola.length; i += 1) {
      if (cancelledRef.current) {
        const restantes = cola.slice(i)
        setMembers((prev) =>
          prev.map((m) =>
            restantes.some((r) => r.id === m.id) ? { ...m, estadoEnvio: 'cancelado' as const } : m,
          ),
        )
        progreso.cancelados += restantes.length
        progreso.pendientes = 0
        setSendProgress({ ...progreso })
        appendLog('Envío cancelado por el administrador')
        finalizarCampana({ cancelado: true, progreso: { ...progreso }, fechaInicio })
        return
      }

      const member = cola[i]
      setCurrentMember(member)
      appendLog(`Enviando mensaje a: ${member.nombre}`)

      const texto = formatReminderMessage(member, campaniaSeleccionada.template)
      const result = await gestionCobranzasService.enviarRecordatorio(member, texto)

      if (cancelledRef.current) {
        setMembers((prev) =>
          prev.map((m) => (m.id === member.id ? { ...m, estadoEnvio: 'cancelado' } : m)),
        )
        const restantes = cola.slice(i + 1)
        setMembers((prev) =>
          prev.map((m) =>
            restantes.some((r) => r.id === m.id) ? { ...m, estadoEnvio: 'cancelado' as const } : m,
          ),
        )
        progreso.cancelados += restantes.length + (result.ok ? 0 : 0)
        if (!result.ok) {
          progreso.errores += 1
          setMembers((prev) =>
            prev.map((m) => (m.id === member.id ? { ...m, estadoEnvio: 'error' } : m)),
          )
        } else {
          progreso.enviados += 1
          setMembers((prev) =>
            prev.map((m) => (m.id === member.id ? { ...m, estadoEnvio: 'enviado' } : m)),
          )
        }
        progreso.pendientes = 0
        setSendProgress({ ...progreso })
        appendLog('Envío cancelado por el administrador')
        finalizarCampana({ cancelado: true, progreso: { ...progreso }, fechaInicio })
        return
      }

      if (result.ok) {
        progreso.enviados += 1
        appendLog(`Mensaje enviado a ${member.nombre}`)
        setMembers((prev) =>
          prev.map((m) => (m.id === member.id ? { ...m, estadoEnvio: 'enviado' } : m)),
        )
      } else {
        progreso.errores += 1
        appendLog(`Error al enviar a ${member.nombre}: ${result.error ?? 'Error desconocido'}`)
        setMembers((prev) =>
          prev.map((m) =>
            m.id === member.id
              ? { ...m, estadoEnvio: result.error?.includes('inválido') || result.error?.includes('faltante') ? 'numero_invalido' : 'error' }
              : m,
          ),
        )
      }

      progreso.pendientes = Math.max(0, cola.length - (i + 1))
      setSendProgress({ ...progreso })

      if (i < cola.length - 1) {
        appendLog('Esperando 1,5 segundos para el próximo envío')
        await runCountdown(INTERVALO_ENVIO_MS)
        if (cancelledRef.current) {
          const restantes = cola.slice(i + 1)
          setMembers((prev) =>
            prev.map((m) =>
              restantes.some((r) => r.id === m.id) ? { ...m, estadoEnvio: 'cancelado' as const } : m,
            ),
          )
          progreso.cancelados += restantes.length
          progreso.pendientes = 0
          setSendProgress({ ...progreso })
          appendLog('Envío cancelado por el administrador')
          finalizarCampana({ cancelado: true, progreso: { ...progreso }, fechaInicio })
          return
        }
      }
    }

    setCurrentMember(null)
    finalizarCampana({ cancelado: false, progreso: { ...progreso }, fechaInicio })
  }, [
    appendLog,
    fase,
    finalizarCampana,
    isSending,
    runCountdown,
    selectedIds,
    seleccionados,
    seleccionStats.validos,
    campaniaSeleccionada.template,
    campaniaSeleccionada.label,
  ])

  const cancelarEnvio = useCallback(() => {
    if (!isSendingRef.current) return
    cancelledRef.current = true
    setIsCancelled(true)
    appendLog('Solicitud de cancelación recibida…')
  }, [appendLog])

  const reiniciarParaNuevoEnvio = useCallback(() => {
    if (isSendingRef.current) return
    setSelectedIds(new Set())
    setSelectedMembersById(new Map())
    setFase('inicial')
    setSendLog([])
    setResumenFinal(null)
    setCurrentMember(null)
    setIsCancelled(false)
    cancelledRef.current = false
    setSendProgress({ total: 0, enviados: 0, pendientes: 0, errores: 0, cancelados: 0, invalidos: 0 })
    setCampaniaId(CAMPANIA_DEFAULT_ID)
    void loadInitial()
  }, [loadInitial])

  const verHistorial = useCallback(() => {
    if (isSendingRef.current) return
    setFase('historial')
  }, [])

  const volverDesdeHistorial = useCallback(() => {
    if (isSendingRef.current) return
    setFase('inicial')
  }, [])

  const volverDesdeConfirmacion = useCallback(() => {
    if (isSendingRef.current) return
    setFase('inicial')
  }, [])

  useEffect(() => {
    return () => cancelarCountdown()
  }, [cancelarCountdown])

  return {
    members,
    allMembers: members,
    selectedIds,
    fase,
    isPreparing,
    isSending,
    isCancelled,
    currentMember,
    sendProgress,
    nextSendInMs,
    sendLog,
    resumenFinal,
    historial,
    ultimoEnvio,
    filtroDeuda,
    setFiltroDeuda,
    busqueda,
    setBusqueda,
    isLoading,
    isSearching,
    searchError,
    loadError,
    totalActivos,
    sociosConDeuda,
    seleccionStats,
    ejemploPreview,
    campaniaSeleccionada,
    campanias,
    setCampaniaSeleccionada,
    intervalMs: INTERVALO_ENVIO_MS,
    toggleSeleccion,
    seleccionarTodos,
    deseleccionarTodos,
    prepararEnvio,
    confirmarYComenzarEnvio,
    cancelarEnvio,
    reiniciarParaNuevoEnvio,
    verHistorial,
    volverDesdeHistorial,
    volverDesdeConfirmacion,
  }
}
