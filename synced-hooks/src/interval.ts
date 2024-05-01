import { SetStateAction, useEffect, useMemo } from 'react'
import { useRefState } from './ref-state.js'

export type IntervalConfig = {
  autoplay?: boolean
  delaySecs?: number
}

export type IntervalHook = {
  setPlaying(action: SetStateAction<boolean>): void
  playing: boolean
}

/** Controllable `setInterval`
 * - Returns `{ playing, setPlaying }` to control whether the interval is active
 * - `callback(stop)`: called at every interval. Can call `stop` to prevent the next interval (exactly the same as `setInterval(false)`)
 * - `config.autoplay`: whether to start the interval on mount
 * - `config.delaySecs`: duh! The interval
 */
export function useInterval(
  callback: (stop: () => void) => void,
  config: IntervalConfig
): IntervalHook {
  const [playing, setPlaying, playingRef] = useRefState<boolean>(config.autoplay ?? false)
  const delayMs = useMemo(() => 1e3*(config.delaySecs ?? 1), [config.delaySecs])

  useEffect(() => {
    const id = setInterval(() => {
      if (playingRef.current)
        callback(() => setPlaying(false))
    }, delayMs)
    return () => clearInterval(id)
  }, [playing, delayMs, playingRef, setPlaying, callback])

  return { playing, setPlaying }
}
