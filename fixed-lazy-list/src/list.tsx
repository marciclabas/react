import React, { CSSProperties, ReactNode, useCallback, useRef, useState } from "react"
import { FixedSizeList, FixedSizeListProps } from "react-window"
import InfiniteLoader from "react-window-infinite-loader"
import { range, update } from 'ramda'

export type InfiniteProps = {
  threshold?: number | undefined;
  minimumBatchSize?: number | undefined;
}
export type FixedProps = Omit<FixedSizeListProps, 'itemCount' | 'onItemsRendered' | 'ref' | 'children'> 
export type ItemProps<T> = { style: CSSProperties, index: number, item: T }

export type Props<T> = {
  /** Props for `InfiniteLoader` */
  infiniteProps?: InfiniteProps
  /** Props for `FixedSizeList` */
  fixedProps: FixedProps
  numItems: number
  load(idx: number): Promise<T>
  Item(p: ItemProps<T>): ReactNode
}

/** `InfiniteLoader` + `FixedSizeList`
 * 
 * ```
 * return (
 *    <LazyList numItems={1e5} fixedProps={{ height: 512, itemSize: 64, width: '100%' }}
 *      load={(i) => Promise.resolve(`${i}`)}
 *      Item={({ index, item, style }) => (
 *        <div style={style}>{index}: {item}</div> 
 *      )}  />
 * )
 * ```
 */
export function LazyList<T>({ numItems, fixedProps, load, Item, infiniteProps }: Props<T>) {

  const loaded = useRef(new Set<number>())
  const [items, setItems] = useState<(T|null)[]>(new Array(numItems).fill(null))

  const loadMore = useCallback(async (from: number, toInclusive: number) => {
    await Promise.all(range(from, toInclusive+1).map(async (idx) => {
      if (loaded.current.has(idx))
        return
      loaded.current.add(idx)
      const item = await load(idx)
      setItems(its => update(idx, item, its))
    }))
  }, [load])

  return (
    <InfiniteLoader itemCount={numItems} isItemLoaded={i => items[i] !== null}
      loadMoreItems={loadMore} {...infiniteProps}
    >
        {({ onItemsRendered, ref }) => (
          <FixedSizeList itemCount={numItems} onItemsRendered={onItemsRendered} ref={ref} {...fixedProps}>
            {({ style, index }) => items[index] && <Item style={style} index={index} key={index} item={items[index]!} />}
          </FixedSizeList>
        )}
      </InfiniteLoader>
  )
}