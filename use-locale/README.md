# Use Locale

> Simple framework for translations. Statically typed.

## Usage

1. Define what locales you want

  ```jsx
  // locales.ts
  import { make } from 'react-locales'
  import { provider } from 'react-locales/provider'
  export const framework = make(['en', 'es', 'ca'], { fallback: 'en' })
  export const { LocaleCtx, useLocale, locales, DefaultProvider } = framework
  export const LocaleProvider = provider(framework)
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

## Advanced Usage

`react-locales/provider` is just one of the infinitely many possible provider combinations. To select the default locale, it uses the following, in order:

1. The `:locale` route parameter
2. `localStorage.getItem('locale')`
3. The `defaultLocale` prop
   
But you can stack these arbitrarily, even passing your own provider. For example, let's say you want to give `localStorage` priority over the route parameter:

```jsx
import { make } from 'react-locales'
import { localStorageProvider } from 'react-locales/local'
import { routedProvider } from 'react-locales/routed'
export const framework = make(['en', 'es', 'ca'], { fallback: 'en' }) // eslint-disable-line
export const { LocaleCtx, useLocale, locales, DefaultProvider } = framework // eslint-disable-line

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

As they're written, each provider uses the wrapping context as a fallback default, and forwards the `setLocale` calls to it.

So, you can define a custom provider as:

```jsx
function MyLocaleProvider() {
  const { locale: defaultLocale, setLocale: setWrapperLocale, ...ctx } = useLocale()
  
  const [myLocale, setMyLocale] = useState(defaultLocale)

  const setLocale = useCallback(locale => { 
    setMyLocale(locale)
    setWrapperLocale(locale)
  }, [])

  return (
    <LocaleCtx.Provider value={{ ...ctx, locale: myLocale, setMyLocale }}>
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