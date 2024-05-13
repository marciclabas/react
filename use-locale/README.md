# Use Locale

> Simple framework for translations. Statically typed.

## Usage

1. Define what locales you want

  ```jsx
  // locales.ts
  import { make, simpleProvider } from 'react-locales'
  export const { LocaleCtx, context, useLocale, LOCALES } = make(['en', 'es', 'ca'], { fallback: 'en' })
  
  export const LocaleProvider = simpleProvider({ LocaleCtx, context })
  
  // or install `@moveread/router-tools` and do
  import { routedProvider } from 'react-locales/routed'
  export const LocaleProvider = routedProvider({ LocaleCtx, context })
  ```


2. Wrap app in provider

  ```jsx
  // {main|index}.tsx
  import { LocaleProvider } from './locales.ts'

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <LocaleProvider defaultLocale='en'>
      <App />
    </LocaleProvider>
  )
  ```

3. Define translations where they're used

  ```jsx
  // MyComponent.tsx
  import { useLocale } from '.locales.ts'

  function MyComponent() {

    const { translate, setLocale } = useLocale()

    const title = translate({
      en: '...',
      ca: '...',
      es: '...',
      fr: '...',
      it: '...'
    })
    // OR provide a fallback language to allow partial translations
    const title = translate({
      en: '...',
      ca: '...',
      es: '...',
    }, { fallback: 'en' }) // the fallback language must be in the translations, ofc

    return (
      <div>
        <h1>{title}</h1>
        <button onClick={() => setLocale('en')}>EN</button>
      </div>
    )
  }
  ```