import { make } from 'react-locales'
import { provider } from 'react-locales/provider'
export const framework = make(['en', 'es', 'ca'], { fallback: 'en' }) // eslint-disable-line
export const { LocaleCtx, useLocale, locales, DefaultProvider } = framework // eslint-disable-line
export const LocaleProvider = provider(framework)
