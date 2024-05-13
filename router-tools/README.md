# Router Tools

> Tools for react-router-dom

## `useSplitPath`

> Split the current path into parent and children routes

```jsx
import { useSplitPath } from '@moveread/router-tools'

function Parent() {
  return useRoutes([{
    path: '/nested/path/*',
    element: <Nested />
  }])
}

function Nested() {
  const [pre, post] = useSplitPath() // ['/nested/path', '/children/path']
  return useRoutes([{
    path: '*',
    element: <Navigate to='children/path' />
  }])
}
```
