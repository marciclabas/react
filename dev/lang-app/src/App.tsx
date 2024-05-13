import { Button, ButtonGroup, Heading, Text, VStack } from "@chakra-ui/react"
import { useLocale, locales } from "./locales"
import { useNavigate, useRoutes } from "react-router-dom"

function About() {
  const goto = useNavigate()
  const { translate } = useLocale()
  const ABOUT = translate({ en: 'About', ca: 'Sobre' })
  return (
    <VStack>
      <Heading>{ABOUT}</Heading>
      <Button onClick={() => goto('..')}>Back</Button>
    </VStack>
  )
}

export function App() {
  const { locale, setLocale, translate } = useLocale()
  const APP = translate({ en: 'App', ca: 'Aplicació' })
  const goto = useNavigate()
  const routes = useRoutes([
    {
      path: '',
      element: (
        <ButtonGroup>
          <Button onClick={() => goto('about')}>About</Button>
        </ButtonGroup>
      )
    },
    {
      path: 'about/*',
      element: <About />
    }
  ])

  return (
    <VStack>
      <Heading>{APP}</Heading>
      <Text>{locale}</Text>
      <ButtonGroup isAttached>
        {locales.map(locale => (
          <Button key={locale} onClick={() => setLocale(locale)}>
            {locale}
          </Button>
        ))}
      </ButtonGroup>
      {routes}
    </VStack>
  )
}

export default App