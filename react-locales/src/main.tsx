import React, { Context, ReactNode, createContext, useContext, useEffect, useState } from "react"
import { FallbackedLocaleContext, LocaleContext, ProviderProps, Translations } from "./types.js"

export type Config<Locale extends string> = {
  fallback: Locale
}

export function make<Locale extends string>(
  locales: [Locale, ...Locale[]],
): {
  locales: Locale[]
  useLocale(): LocaleContext<Locale>
  LocaleCtx: Context<LocaleContext<Locale>>
  DefaultProvider(props: ProviderProps<Locale>): JSX.Element
  t(translations: Translations<Locale>): Translations<Locale>
  makeT(locale: Locale): (translations: Translations<Locale>) => string
};

export function make<Locale extends string, Fallback extends Locale>(
  locales: [Locale, ...Locale[]],
  { fallback }: Config<Fallback>
): {
  locales: Locale[]
  useLocale(): FallbackedLocaleContext<Locale, Fallback>
  LocaleCtx: Context<FallbackedLocaleContext<Locale, Fallback> | LocaleContext<Locale>>
  DefaultProvider(props: ProviderProps<Locale>): JSX.Element
  t(translations: Partial<Translations<Locale>> & Translations<Fallback>): Partial<Translations<Locale>> & Translations<Fallback>
  makeT(locale: Locale): (translations: Partial<Translations<Locale>> & Translations<Fallback>) => string
};

export function make<Locale extends string, Fallback extends Locale>(locales: [Locale, ...Locale[]], config?: Config<Fallback>) {
  
  const fallback = config?.fallback
  const LocaleCtx = createContext<FallbackedLocaleContext<Locale, Fallback>>({} as any)
  const useLocale = () => useContext(LocaleCtx)

  const makeT = (locale: Locale) => (translations: Partial<Translations<Locale>> & Translations<Fallback>) => translations[locale] ?? translations[fallback ?? locale]

  function DefaultProvider({ defaultLocale, children }: ProviderProps<Locale>) {
    const [locale, setLocale] = useState<Locale>(defaultLocale)
    useEffect(() => console.log('Locale', locale), [locale])
    const ctx: FallbackedLocaleContext<Locale, Fallback> = {
      locale, setLocale, fallback: fallback as any,
      t: makeT(locale)
  }

    return (
      <LocaleCtx.Provider value={ctx}>
        {children}
      </LocaleCtx.Provider>
    )
  }

  return {
    LocaleCtx: LocaleCtx as any, useLocale, locales, DefaultProvider,
    t: t => t, makeT
  }
}
