import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

export function useParam(name: string): string | null {
  const [params] = useSearchParams()
  const [value] = useState(params.get(name) ?? localStorage.getItem(name))
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.has(name)) {
      params.delete(name)
      window.location.search = params.toString()
    }
  }, [name])
  useEffect(() => {
    if (value !== null)
      localStorage.setItem(name, value)
  }, [name, value])
  return value
}