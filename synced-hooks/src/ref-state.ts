import { Dispatch, MutableRefObject, SetStateAction, useCallback, useRef, useState } from "react"

export const applyAction = <T>(action: SetStateAction<T>, curr: T): T =>
  typeof action === 'function' ? (action as (x: T) => T)(curr) : action

export const initialValue = <T>(initialState: T | (() => T)): T =>
  typeof initialState === 'function' ? (initialState as () => T)() : initialState

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

/** Wrap a `useState` into a `useRef`
 * ```
 * const [state, _setState] = useState(...)
 * const [setState, ref] = useStateRef(state, _setState)
 * ```
 */
export function useStateRef<T>(
  initialState: T | (() => T),
  setter: Dispatch<SetStateAction<T>>
): [Dispatch<SetStateAction<T>>, MutableRefObject<T>] {
  const ref = useRef(initialValue(initialState))
  const setState = useCallback((action: SetStateAction<T>) => setter(curr => {
    const next = applyAction(action, curr)
    ref.current = next
    return next
  }), [setter])

  return [setState, ref]
}