import { make } from 'react-locales'
import { routedProvider } from 'react-locales/routed'
export const { LocaleCtx, context, useLocale, locales } = make(['en', 'es', 'ca'], { fallback: 'en' })
export const LocaleProvider = routedProvider({ LocaleCtx, context, locales })
