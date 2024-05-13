import { useCallback } from 'react';
import { useResolvedPath, useMatch, useLocation, useNavigate, Location, NavigateOptions } from 'react-router-dom'

const removeTrailingSlashes = (url: string) => url.replace(/\/$/, '')

/** Split the current path into parent and children routes
 *
 * - Both paths start with a slash, and end without one
 * 
 * ```
 * function Parent() {
 *   return useRoutes([{
 *     path: '/nested/path/*',
 *     element: <Nested />
 *   }])
 * }
 * 
 * function Nested() {
 *   const [pre, post] = useSplitPath() // ['/nested/path', '/children/path']
 *   return useRoutes([{
 *     path: '*',
 *     element: <Navigate to='children/path' />
 *   }])
 * }
 * ```
 */
export function useSplitPath(): [string, string] {
  const resolvedPath = useResolvedPath('');
  const match = useMatch({ path: resolvedPath.pathname, end: false });
  const basePath = removeTrailingSlashes(match?.pathnameBase ?? '')
  const complement = basePath ? location.pathname.substring(basePath.length) : location.pathname;
  return [basePath, complement]
}

/** Change the path whilst keeping query parameters and hash intact */
export function reroute(location: Location, newPath: string) {
  return newPath + location.search + location.hash
}

/** Like `useNavigate`, but keeping query parameters and hash intact */
export function useReroute() {
  const location = useLocation()
  const goto = useNavigate()
  return useCallback((to: string, options?: NavigateOptions) => goto(reroute(location, to), options), [goto, location])
}