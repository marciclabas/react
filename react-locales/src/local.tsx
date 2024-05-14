import React, { PropsWithChildren, useCallback, useState } from "react"
import { ProviderParams } from './types.js'

export function localStorageProvider<Locale extends string>({ locales, LocaleCtx, useLocale, makeT }: ProviderParams<Locale>) {
  
  function ensureLocale(defaultLocale: Locale) {
    const stored = localStorage.getItem('locale')
    if (!stored || !locales.includes(stored as Locale)) {
      localStorage.setItem('locale', defaultLocale)
      return defaultLocale
    }
    return stored as Locale
  }

  function LocalStorageProvider({ children }: PropsWithChildren) {
    
    const { locale: defaultLocale, setLocale: setLocaleOuter } = useLocale()
    const [locale, _setLocale] = useState(() => ensureLocale(defaultLocale))
    
    const setLocale = useCallback((locale: Locale) => {
      localStorage.setItem('locale', locale)
      setLocaleOuter(locale)
      _setLocale(locale)
    }, [])

    return (
      <LocaleCtx.Provider value={{ locale, setLocale, t: makeT(locale) }}>
        {children}
      </LocaleCtx.Provider>
    )
  }


  return LocalStorageProvider
}
