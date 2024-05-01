# Use History

A lightweight React hook for a history of states (with undo/redo)

## Example

```jsx
function Shop({ items }) {
    const { present: cart, undo, redo, push } = useHistory(() => []);
    
    const addItem = it => push(items => [...items, it]);

    return (
        <h1>Cart</h1>
        {cart.map(i =>
            <p>items[i]</p>
        )}
        /* ... */
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        {items.map((item, i) => (
            <button onClick={() => addItem(i)}>Add to cart {item.name}</button>
        ))}
    );
}

```