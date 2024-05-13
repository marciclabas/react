import React, { Context, ReactNode, createContext, useContext, useState } from "react"
import { FallbackedLocaleContext, LocaleContext, ProviderProps } from "./types.js"

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
};

export function make<Locale extends string, Fallback extends Locale>(
  locales: [Locale, ...Locale[]],
  { fallback }: Config<Fallback>
): {
  locales: Locale[]
  useLocale(): FallbackedLocaleContext<Locale, Fallback>
  LocaleCtx: Context<FallbackedLocaleContext<Locale, Fallback> | LocaleContext<Locale>>
  DefaultProvider(props: ProviderProps<Locale>): JSX.Element
};

export function make<Locale extends string, Fallback extends Locale>(locales: [Locale, ...Locale[]], config?: Config<Fallback>) {
  
  const fallback = config?.fallback
  const LocaleCtx = createContext<FallbackedLocaleContext<Locale, Fallback>>({} as any)
  const useLocale = () => useContext(LocaleCtx)

  function DefaultProvider({ defaultLocale, children }: ProviderProps<Locale>) {
    const [locale, setLocale] = useState<Locale>(defaultLocale)
    const ctx: FallbackedLocaleContext<Locale, Fallback> = {
      locale, setLocale, fallback: fallback as any,
      translate: (translations) => translations[locale] ?? translations[fallback ?? locale]
  }

    return (
      <LocaleCtx.Provider value={ctx}>
        {children}
      </LocaleCtx.Provider>
    )
  }

  return { LocaleCtx: LocaleCtx as any, useLocale, locales, DefaultProvider }
}
