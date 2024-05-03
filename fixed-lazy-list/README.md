# Fixed Lazy List

> Simple wrapper around `react-window-infinite-loader` and `react-window`'s `FixedSizeList`

## Usage

```jsx
async function load(idx: number) {
  await delay(1)
  return `Fake item ${idx}`
}

return (
  <LazyList numItems={42} load={load}
    fixedProps={{ height: 512, itemSize: 64, width: '100%' }}
    Item={({ style, index, item }) => (
      <div style={style}>
        <p>{item}</p>
      </div>
    )}
  />
)
```