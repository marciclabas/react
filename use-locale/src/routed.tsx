import React, { PropsWithChildren, ReactNode, useCallback } from "react"
import { Navigate, RouteObject, useLocation, useNavigate, useRoutes, Location } from "react-router-dom"
import { reroute, useSplitPath } from '@moveread/router-tools'
import { ProviderParams } from './types.js'

export type Props<Locale extends string> = {
  defaultLocale?: Locale
  children?: ReactNode
}

function rerouteLocale(location: Location, currLocale: string, newLocale: string) {
  const newPath = location.pathname.replace(
    new RegExp(`/${currLocale}`),
    `/${newLocale}`
  )
  return reroute(location, newPath) 
}

export function routedProvider<Locale extends string>({ locales, context, LocaleCtx }: ProviderParams<Locale>) {
  
  type ProviderProps = PropsWithChildren & {
    locale: Locale
  }
  function LocaleProvider({ locale, children }: ProviderProps) {
    const goto = useNavigate()
    const location = useLocation()

    const setLocale = useCallback((newLocale: Locale) => {
      goto(rerouteLocale(location, locale, newLocale))
    }, [goto, location, locale])

    return (
      <LocaleCtx.Provider value={context(locale, setLocale)}>
        {children}
      </LocaleCtx.Provider>
    )
  }

  function routedProvider({ children, ...p }: Props<Locale>) {
    const localeRoutes: RouteObject[] = locales.map(locale => ({
      path: `${locale}/*`,
      element: (
        <LocaleProvider locale={locale}>
          {children}
        </LocaleProvider>
      )
    }))

    const location = useLocation()
    const [pre, post] = useSplitPath()
    const defaultLocale = p.defaultLocale ?? locales[0]
    const defaultPath = reroute(location, `${pre}/${defaultLocale}${post}`)

    return useRoutes([...localeRoutes, {
      path: '*',
      element: <Navigate to={defaultPath} replace />
    }])
  }

  return routedProvider
}
