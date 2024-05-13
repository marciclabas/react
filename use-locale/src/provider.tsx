import React from "react"
import { ProviderParams, ProviderProps } from './types.js'
import { routedProvider } from "./routed.js"
import { localStorageProvider } from "./local.js"
import { preferredProvider } from "./preferred.js"
import { PreferredLocaleOptions } from "preferred-locale"

export type Params<Locale extends string> = ProviderParams<Locale> & {
  DefaultProvider(props: ProviderProps<Locale>): JSX.Element
}
export type Props<Locale extends string> = ProviderProps<Locale> & {
  preferredOptions?: PreferredLocaleOptions
  replaceRoute?: boolean
}

export function provider<Locale extends string>({ DefaultProvider, ...params }: Params<Locale>) {

  const RoutedProvider = routedProvider(params)
  const LocalStorageProvider = localStorageProvider(params)
  const PreferredProvider = preferredProvider(params)

  function Provider({ defaultLocale, children, preferredOptions, replaceRoute }: Props<Locale>) {
    console.log('Provider')
    return (
      <DefaultProvider defaultLocale={defaultLocale}>
        <PreferredProvider {...preferredOptions}>
          <LocalStorageProvider>
            <RoutedProvider replace={replaceRoute}>
              {children}
            </RoutedProvider>
          </LocalStorageProvider>
        </PreferredProvider>
      </DefaultProvider>
    )
  }

  return Provider
}
