import { Context, ReactNode } from "react"

export type Translations<Locale extends string> = Record<Locale, string>

export type BaseContext<Locale extends string = string> = {
  locale: Locale
  setLocale(locale: Locale): void
}
export type LocaleContext<Locale extends string> = BaseContext<Locale> & {
  translate(translations: Translations<Locale>): string
}
export type FallbackedLocaleContext<Locale extends string, Fallback extends Locale> = BaseContext<Locale> & {
  fallback: Fallback
  translate(translations: Partial<Translations<Locale>> & Translations<Fallback>): string
}

export type ProviderParams<Locale extends string> = {
  LocaleCtx: Context<LocaleContext<Locale>>
  useLocale(): LocaleContext<Locale>
  locales: Locale[]
}

export type ProviderProps<Locale> = {
  defaultLocale: Locale
  children?: ReactNode
}