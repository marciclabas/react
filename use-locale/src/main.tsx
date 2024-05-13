import React, { Context, createContext, useContext } from "react"
import { FallbackedLocaleContext, LocaleContext } from "./types.js"

export type Config<Locale extends string> = {
  fallback: Locale
}

export function make<Locale extends string>(
  locales: [Locale, ...Locale[]],
): {
  locales: Locale[]
  useLocale(): LocaleContext<Locale>
  LocaleCtx: Context<LocaleContext<Locale>>
  context(locale: Locale, setLocale: (locale: Locale) => void): LocaleContext<Locale>
};
export function make<Locale extends string, Fallback extends Locale>(
  locales: [Locale, ...Locale[]],
  { fallback }: Config<Fallback>
): {
  locales: Locale[]
  useLocale(): FallbackedLocaleContext<Locale, Fallback>
  LocaleCtx: Context<FallbackedLocaleContext<Locale, Fallback> | LocaleContext<Locale>>
  context(locale: Locale, setLocale: (locale: Locale) => void): FallbackedLocaleContext<Locale, Fallback>
};

export function make<Locale extends string, Fallback extends Locale>(locales: [Locale, ...Locale[]], config?: Config<Fallback>) {
  
  const fallback = config?.fallback
  const LocaleCtx = createContext<FallbackedLocaleContext<Locale, Fallback>>({} as any)
  const useLocale = () => useContext(LocaleCtx)

  function context(locale: Locale, setLocale: (locale: Locale) => void): FallbackedLocaleContext<Locale, Fallback> {
    return {
      locale, setLocale, fallback: fallback as any,
      translate: (translations) => translations[locale] ?? translations[fallback ?? locale]
    }
  }

  return { LocaleCtx: LocaleCtx as any, context, useLocale, locales }
}
