export function formatMoneyArs(amount: number): string {
  return amount.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  })
}
