import { useEffect } from 'react'

export function useKeys(keys: string[], handler: (e: KeyboardEvent) => void) {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => keys.includes(e.key) && !e.ctrlKey && handler(e)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [keys, handler])
}