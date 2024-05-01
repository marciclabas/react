# Synced Hooks

> Hooks for better synchronization

### Ref-State

> Like `useState` but with a ref to the latest state

```jsx
import { useRefState } from 'synced-hooks/ref-state'

const [state, setState, ref] = useRefState(0)
ref.current // always the latest state
```

### Interval

> Run a callback at an interval. The interval can be changed dynamically.

```jsx
import { useInterval } from 'synced-hooks/interval'

const callback = useCallback((stop) => {
    console.log('Next interval')
    if (condition)
      stop()
  }, [])

const { playing, setPlaying } = useInterval(callback, {
  autoplay: true,
  delaySecs: 2, // need not be a constant value, and will be updated after every interval
})

{playing
  ? <button onClick={() => setPlaying(true)}>Play</button>
  : <button onClick={() => setPlaying(false)}>Pause</button>}

```

### Notified State

> Like `useState` but with a promise that resolves after the UI is updated

```jsx
import { useNotifiedState } from 'synced-hooks/notified'

const [state, setState] = useNotifiedState(0)

await setState(5) // resolves after the UI is updated
````