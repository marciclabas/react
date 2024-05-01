import { SetStateAction, useCallback, useState } from "react"
import { clamp } from "@haskellian/clamp"

export const applyAction = <T>(action: SetStateAction<T>, curr: T): T =>
  typeof action === 'function' ? (action as (x: T) => T)(curr) : action

export type ClampSetter = {
  (action: SetStateAction<number>, ignoreClamp?: boolean): void
}

export type ClampConfig = {
  min?: number
  max?: number
}

/** Like `useState<number>`, a but the number is bounded to `[min, max]` (closed interval) */
export function useClamped(start: number, config?: ClampConfig): [number, ClampSetter] {
  const min = config?.min ?? -Infinity
  const max = config?.max ?? Infinity
  const [state, setState] = useState(start)
  const setClamped = useCallback((action: SetStateAction<number>, ignoreClamp?: boolean) => {
    if (ignoreClamp)
      setState(action)
    else
      setState(x => {
        const curr = clamp(min, x, max)
        return clamp(min, applyAction(action, curr), max)
      })
  }, [min, max])
  const clamped = clamp(min, state, max)
  return [clamped, setClamped]
}