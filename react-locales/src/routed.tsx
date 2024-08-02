import React, { ReactNode, useCallback, useEffect, useMemo } from "react"
import { Navigate, RouteObject, useLocation, useNavigate, useRoutes, Location } from "react-router-dom"
import { reroute, useSplitPath } from '@moveread/router-tools'
import { ProviderParams } from './types.js'

function rerouteLocale(location: Location, currLocale: string, newLocale: string) {
  const newPath = location.pathname.replace(
    new RegExp(`/${currLocale}`),
    `/${newLocale}`
  )
  return reroute(location, newPath) 
}

export type Props = {
  children?: ReactNode
  replace?: boolean
}

export function routedProvider<Locale extends string>({ locales, LocaleCtx, useLocale, makeT }: ProviderParams<Locale>) {
  
  type ProviderProps = Props & {
    locale: Locale
  }
  function LocaleProvider({ locale, children, replace }: ProviderProps) {
    
    const goto = useNavigate()
    const location = useLocation()

    const { setLocale: setLocaleOuter } = useLocale()

    const setLocale = useCallback((newLocale: Locale) => {
      setLocaleOuter(newLocale)
      goto(rerouteLocale(location, locale, newLocale), { replace })
    }, [goto, location, locale])

    useEffect(() => {
      setLocaleOuter(locale)
    }, [locale])

    return (
      <LocaleCtx.Provider value={{ locale, setLocale, t: makeT(locale) }}>
        {children}
      </LocaleCtx.Provider>
    )
  }

  function RoutedProvider({ children, replace }: Props) {
    const localeRoutes: RouteObject[] = useMemo(() => locales.map(locale => ({
      path: `${locale}/*`,
      element: (
        <LocaleProvider replace={replace} locale={locale}>
          {children}
        </LocaleProvider>
      )
    })), [replace, children])

    const { locale } = useLocale()
    const location = useLocation()
    const [pre, post] = useSplitPath()
    const defaultLocale = locale
    const defaultPath = reroute(location, `${pre}/${defaultLocale}${post}`)
    const allRoutes = useMemo(() => [...localeRoutes, {
      path: '*',
      element: <Navigate to={defaultPath} replace />
    }], [localeRoutes, defaultPath])
    return useRoutes(allRoutes)
  }

  return RoutedProvider
}
