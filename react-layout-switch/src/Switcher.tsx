import React, { ReactNode, useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import { useReroute, useSplitPath } from '@moveread/router-tools'

export type Layout = 'mobile' | 'desktop'

type InnerProps = {
  layout: Layout
  children?: ReactNode
}
function Desktop({ layout, children }: InnerProps) {
  const goto = useReroute()
  const [_, post] = useSplitPath() // eslint-disable-line

  useEffect(() => {
    if (layout === 'mobile')
      goto('m' + post)
  }, [goto, post, layout])

  return children
}

function Mobile({ layout, children }: InnerProps) {
  const goto = useReroute()
  const [_, post] = useSplitPath() // eslint-disable-line

  useEffect(() => {
    if (layout === 'desktop')
      goto(post)
  }, [goto, post, layout])

  return children
}

export type Props = {
  layout: Layout
  /** Defaults to `'m'` */
  mobilePrefix?: string
  children?: ReactNode
}
export function LayoutSwitch({ children, layout, ...props }: Props) {
  const mobilePrefix = props.mobilePrefix ?? 'm'
  const routes = useRoutes([
    {
      path: `${mobilePrefix}/*`,
      element: <Mobile layout={layout}>{children}</Mobile>
    },
    {
      path: '*',
      element: <Desktop layout={layout}>{children}</Desktop>
    }
  ])

  return routes
}

export default LayoutSwitch