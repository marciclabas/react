import React, { PropsWithChildren, useCallback, useState } from "react"
import { ProviderParams } from './types.js'
import { PreferredLocaleOptions, preferredLocale } from 'preferred-locale'

export type Props = PreferredLocaleOptions & PropsWithChildren

export function preferredProvider<Locale extends string>({ locales, LocaleCtx, useLocale, makeT }: ProviderParams<Locale>) {

  function PreferredProvider({ children, ...options }: Props) {
    const { locale: defaultLocale, setLocale: setLocaleOuter } = useLocale()
    const [locale, _setLocale] = useState(() => preferredLocale(defaultLocale, locales, { languageOnly: true, ...options }) as Locale)

    const setLocale = useCallback((locale: Locale) => {
      _setLocale(locale)
      setLocaleOuter(locale)
    }, [setLocaleOuter])

    return (
      <LocaleCtx.Provider value={{ locale, setLocale, t: makeT(locale) }}>
        {children}
      </LocaleCtx.Provider>
    )
  }

  return PreferredProvider
}