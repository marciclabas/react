import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ChakraProvider, ColorModeScript, ThemeConfig, extendTheme } from '@chakra-ui/react'
import './index.css'
import { LocaleProvider } from './locales.ts'

const config: ThemeConfig = {
  initialColorMode: import.meta.env.PROD ? 'system' : 'dark',
  useSystemColorMode: true,
}
const colors = {
  brand: {
    50: '#dffff0',
    100: '#b5f9d9',
    200: '#89f4c1',
    300: '#5cefa8',
    400: '#32eb90',
    500: '#1bd176',
    600: '#10a35b',
    700: '#057440',
    800: '#004725',
    900: '#001909',
  }
}

const theme = extendTheme({ config, colors })

const router = createBrowserRouter([
  {
    path: '/nested/route/*',
    element: (
      <LocaleProvider defaultLocale='en'>
        <App />
      </LocaleProvider>
    )
  },
  {
    path: '*',
    element: <Navigate to='/nested/route' />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <ColorModeScript initialColorMode={config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </>
)
