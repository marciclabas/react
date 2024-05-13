import React, { ReactNode, useState } from "react"
import { ProviderParams } from "./types.js"

export type Props<Locale> = {
  defaultLocale: Locale
  children?: ReactNode
}

export function defaultProvider<Locale extends string>({ LocaleCtx, context }: ProviderParams<Locale>) {
  function DefaultProvider({ defaultLocale, children }: Props<Locale>) {
    const [locale, setLocale] = useState<Locale>(defaultLocale)
    return (
      <LocaleCtx.Provider value={context(locale, setLocale)}>
        {children}
      </LocaleCtx.Provider>
    )
  }
  return DefaultProvider
}