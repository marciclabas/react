import { PropsWithChildren, ReactNode, useCallback } from "react"
import { Navigate, RouteObject, useLocation, useNavigate, useRoutes } from "react-router-dom"
import { ProviderParams } from 'react-locales'

export type Props<Locale extends string> = {
  defaultLocale?: Locale
  children?: ReactNode
}

export function localeRouter<Locale extends string>({ locales, context, LocaleCtx }: ProviderParams<Locale>) {
  
  type ProviderProps = PropsWithChildren & {
    locale: Locale
  }
  function LocaleProvider({ locale, children }: ProviderProps) {
    const goto = useNavigate()
    const location = useLocation()

    const setLocale = useCallback((newLocale: Locale) => {
      console.log('Location', location)
      const newPath = location.pathname.replace(
        new RegExp(`/${locale}`),
        `/${newLocale}`
      ) + location.search + location.hash;
      goto(newPath)
    }, [goto, location, locale])

    return (
      <LocaleCtx.Provider value={context(locale, setLocale)}>
        {children}
      </LocaleCtx.Provider>
    )
  }

  function LocaleRouter({ children, defaultLocale }: Props<Locale>) {
    const localeRoutes: RouteObject[] = locales.map(locale => ({
      path: `${locale}/*`,
      element: (
        <LocaleProvider locale={locale}>
          {children}
        </LocaleProvider>
      )
    }))

    return useRoutes([...localeRoutes, {
      path: '*',
      element: <Navigate to={`./${defaultLocale ?? locales[0]}`} />
    }])
  }

  return LocaleRouter
}
