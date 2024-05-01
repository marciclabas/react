import React, { ReactNode, createContext, useContext, useState } from "react"

export type Translations<Locale extends string> = Record<Locale, string>

export type LocaleContext<Locale extends string = string> = {
  locale: Locale
  setLocale(locale: Locale): void
  translate<Fallback extends Locale>(translations: Partial<Translations<Locale>> & Translations<Fallback>, p: { fallback: Fallback }): string
  translate(translations: Translations<Locale>): string
}

export type Props<Locale> = {
  defaultLocale: Locale
  children?: ReactNode
}
export function make<Locale extends string>(locale: Locale, ...locales: Locale[]) {
  
  const LocaleCtx = createContext<LocaleContext<Locale>>({ locale, setLocale() {}, translate: () => '' })
  const useLocale = () => useContext(LocaleCtx)


  function translate(translations: Record<Locale, string>): Translations<Locale> {
    return translations
  }

  function LocaleProvider({ defaultLocale, children }: Props<Locale>) {
    const [locale, setLocale] = useState<Locale>(defaultLocale)
    const t = (t: Translations<Locale>, cfg?) => t[locale] ?? t[cfg?.fallback]
    return (
      <LocaleCtx.Provider value={{ locale, setLocale, translate: t }}>
        {children}
      </LocaleCtx.Provider>
    )
  }

  return {
    LocaleProvider,
    useLocale,
    translate,
    LOCALES: [locale, ...locales]
  }
}
