import { useSplitPath } from '@moveread/router-tools'

export function App() {
  const parts = useSplitPath()
  console.log('Parts', parts)
  return (
    <h1>App</h1>
  )
}

export default App