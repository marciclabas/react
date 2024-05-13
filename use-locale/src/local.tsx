import React, { PropsWithChildren, useCallback, useState } from "react"
import { ProviderParams } from './types.js'

export function localStorageProvider<Locale extends string>({ locales, LocaleCtx, useLocale }: ProviderParams<Locale>) {
  
  function ensureLocale(defaultLocale: Locale) {
    const stored = localStorage.getItem('locale')
    if (!stored || !locales.includes(stored as Locale)) {
      localStorage.setItem('locale', defaultLocale)
      return defaultLocale
    }
    return stored as Locale
  }

  function LocalStorageProvider({ children }: PropsWithChildren) {
    
    const { locale: defaultLocale, setLocale: setLocaleOuter, ...ctx } = useLocale()
    const [locale, setLocaleState] = useState(() => ensureLocale(defaultLocale))
    
    const setLocale = useCallback((locale: Locale) => {
      localStorage.setItem('locale', locale)
      setLocaleOuter(locale)
      setLocaleState(locale)
    }, [])

    return (
      <LocaleCtx.Provider value={{ ...ctx, locale, setLocale }}>
        {children}
      </LocaleCtx.Provider>
    )
  }


  return LocalStorageProvider
}
