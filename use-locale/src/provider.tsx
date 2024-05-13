import React from "react"
import { ProviderParams, ProviderProps } from './types.js'
import { routedProvider } from "./routed.js"
import { localStorageProvider } from "./local.js"

export type Params<Locale extends string> = ProviderParams<Locale> & {
  DefaultProvider(props: ProviderProps<Locale>): JSX.Element
}
export function provider<Locale extends string>({ DefaultProvider, ...params }: Params<Locale>) {

  const RoutedProvider = routedProvider(params)
  const LocalStorageProvider = localStorageProvider(params)

  function Provider({ defaultLocale, children }: ProviderProps<Locale>) {
    return (
      <DefaultProvider defaultLocale={defaultLocale}>
        <LocalStorageProvider>
          <RoutedProvider>
            {children}
          </RoutedProvider>
        </LocalStorageProvider>
      </DefaultProvider>
    )
  }

  return Provider
}
