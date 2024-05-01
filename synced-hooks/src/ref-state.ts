import { Dispatch, MutableRefObject, SetStateAction, useCallback, useRef, useState } from "react"

export const applyAction = <T>(action: SetStateAction<T>, curr: T): T =>
  typeof action === 'function' ? (action as (x: T) => T)(curr) : action

/** Like `useState` but returns `[state, setState, ref]`. `ref` is synchronously updated when calling `setState` */
export function useRefState<T>(initialState: T | (() => T)): [T, Dispatch<SetStateAction<T>>, MutableRefObject<T>] {
  const [state, _setState] = useState<T>(initialState)
  const ref = useRef(state)

  const setState = useCallback((action: SetStateAction<T>) => _setState(x => {
    const newState = applyAction(action, x)
    ref.current = newState
    return newState
  }), [])

  return [state, setState, ref]
}