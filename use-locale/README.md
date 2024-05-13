# Use Locale

> Simple framework for translations. Statically typed.

## Installation

- The full thing

```bash
npm i react-locales @moveread/router-tools preferred-locale
```

```bash
yarn add react-locales @moveread/router-tools preferred-locale
```

- Simplified, w/o language detection nor routes

```bash
npm i react-locales
```

```bash
yarn add react-locales
```

## Usage

1. Define what locales you want

  ```jsx
  // locales.ts
  import { make } from 'react-locales'
  import { provider } from 'react-locales/provider'
  export const framework = make(['en', 'es', 'ca'], { fallback: 'en' })
  export const { LocaleCtx, useLocale, locales, DefaultProvider } = framework
  export const LocaleProvider = provider(framework)
  
  // or use the `DefaultProvider` with the basic installation
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

3. Define translations where they're used or elsewhere

  ```jsx
  // MyComponent.tsx
  import { useLocale, t } from './locales.ts'

  const subtitle = t({
    en: 'Hello',
    es: 'Hola',
    ca: 'Hola',
    ...
  })

  function MyComponent() {

    const { t, setLocale } = useLocale()

    const title = t({
      en: '...',
      ca: '...',
      es: '...',
      fr: '...',
      it: '...'
    })

    return (
      <div>
        <h1>{title}</h1>
        <h2>{t(subtitle)}</h2>
        <button onClick={() => setLocale('en')}>EN</button>
      </div>
    )
  }
  ```

## Advanced Usage

`react-locales/provider` is just one of the infinitely many possible provider combinations. To select the default locale, it uses the following, in order:

1. The `:locale` route parameter
2. `localStorage.getItem('locale')`
3. The detected `preferredLocale()` (using [`preferred-locale`](https://www.npmjs.com/package/preferred-locale))
4. The `defaultLocale` prop
   
But you can stack these arbitrarily, even passing your own provider. For example, let's say you want to give `localStorage` priority over the route parameter:

```jsx
import { make } from 'react-locales'
import { localStorageProvider } from 'react-locales/local'
import { routedProvider } from 'react-locales/routed'
export const framework = make(['en', 'es', 'ca'], { fallback: 'en' }) // eslint-disable-line
export const { LocaleCtx, useLocale, locales, DefaultProvider, makeT, t } = framework // eslint-disable-line

export function LocaleProvider() {
  return (
    <DefaultProvider defaultLocale='en'>
      <RoutedProvider>
        <LocalStorageProvider>
          {children}
        </LocalStorageProvider>
      </RoutedProvider>
    </DefaultProvider>
  )
}
```

As they're written, each provider uses the wrapping context as a fallback default So, you can define a custom provider as:

```jsx
function MyLocaleProvider({ children }) {
  const { locale: defaultLocale } = useLocale()
  
  const [myLocale, setMyLocale] = useState(defaultLocale)

  return (
    <LocaleCtx.Provider value={{ locale: myLocale, setLocale: setMyLocale, t: makeT(myLocale) }}>
      {children}
    </LocaleCtx.Provider>
  )
}
```

And then nest it at whatever level you want according to the required priority, e.g:

```jsx
<DefaultProvider defaultLocale='en'>
  <MyLocaleProvider>
    <RoutedProvider>
      <LocalStorageProvider>
        {children}
      </LocalStorageProvider>
    </RoutedProvider>
  </MyLocaleProvider>
</DefaultProvider>
```