import { useEffect, useRef } from 'react'

/**
 * useAutoRefresh — automatically triggers a callback every intervalMs milliseconds.
 * Prevents overlapping concurrent calls and safely cleans up timers.
 *
 * @param {Function} callback - Async or sync function to run
 * @param {number} [intervalMs=60000] - Refresh interval in milliseconds (default 60s)
 */
export function useAutoRefresh(callback, intervalMs = 60000) {
  const isFetchingRef = useRef(false)
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (!intervalMs || intervalMs <= 0) return

    const tick = async () => {
      if (isFetchingRef.current) return
      isFetchingRef.current = true
      try {
        await savedCallback.current()
      } catch {
        // ignore auto-refresh errors silently
      } finally {
        isFetchingRef.current = false
      }
    }

    const timer = setInterval(tick, intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])
}
