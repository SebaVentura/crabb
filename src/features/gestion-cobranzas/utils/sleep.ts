export function sleep(ms: number, isCancelled?: () => boolean): Promise<void> {
  return new Promise((resolve) => {
    const started = Date.now()

    const tick = () => {
      if (isCancelled?.()) {
        resolve()
        return
      }
      if (Date.now() - started >= ms) {
        resolve()
        return
      }
      setTimeout(tick, Math.min(50, ms))
    }

    setTimeout(tick, Math.min(50, ms))
  })
}
