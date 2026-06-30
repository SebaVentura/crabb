import type { ApproveSocioSolicitudResult, InitialFeePreview } from '../../../types/socioSolicitudes'
import { formatMoneyArs } from '../../gestion-cobranzas/utils/formatMoney'

export function buildApproveSuccessMessage(result: ApproveSocioSolicitudResult): string {
  if (result.initialFeesAlreadyExisted) {
    return 'Solicitud aprobada. Las cuotas iniciales ya estaban generadas.'
  }

  const generated = result.initialFeesGenerated
  if (generated !== null && generated > 0) {
    return `Solicitud aprobada. Se generaron ${generated} cuotas iniciales para el socio.`
  }

  return 'Solicitud aprobada correctamente.'
}

export function formatInitialFeePreviewLines(preview: InitialFeePreview | null): string[] {
  if (!preview) return []

  const lines: string[] = []
  const count = preview.initialFeesCount ?? 8

  if (preview.initialFeeAmount !== null) {
    lines.push(`Valor de cada cuota inicial: ${formatMoneyArs(preview.initialFeeAmount)}`)
  }

  if (count > 0) {
    lines.push(`Cantidad de cuotas: ${count}`)
  }

  if (preview.initialFeesTotal !== null) {
    lines.push(`Total inicial a cobrar: ${formatMoneyArs(preview.initialFeesTotal)}`)
  } else if (preview.initialFeeAmount !== null && count > 0) {
    lines.push(`Total inicial a cobrar: ${formatMoneyArs(preview.initialFeeAmount * count)}`)
  }

  if (lines.length > 0) {
    lines.push('Las cuotas se generan automáticamente en el servidor al confirmar la aprobación.')
  }

  return lines
}
