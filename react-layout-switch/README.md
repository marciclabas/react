# React Layout Switch

> Simple path-based desktop/mobile switching

## Usage

```jsx
import LayoutSwitch from 'react-layout-switch'

function App() {
  const layout = window.innerWidth > window.innerHeight ? 'desktop' : 'mobile'
  return (
    <LayoutSwitch layout={layout} mobilePrefix='m'>
      ...
    </LayoutSwitch>
  )
}
```

- Renders `/m/...` if mobile
- Otherwise renders `/...`