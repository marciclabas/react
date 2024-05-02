import { delay } from "@haskellian/async/promises/single"

export type Config = {
  delaySecs?: number
}

export type RequestsHook = {
  schedule(reqId, config?: Config): Promise<boolean>
  cancel(reqId): void
}

/** Simple closure for scheduling and canceling requests
 * ```
 * const reqs = cancellableRequests({ delaySecs: 10 })
 * 
 * async function request(id) {
 *    const ok = await reqs.schedule(id)
 *    if (ok)
 *      fetch(id)
 * }
 * 
 * request(id)
 * request(id) // first one gets cancelled, second executed after `delaySecs`
 * 
 * // or, one can cancel them manually using:
 * reqs.cancel(id)
 * ```
 * 
 * ### React usage
 * ```
 * const reqs = useRef(cancellableRequests({ delaySecs: 10 }))
 * reqs.current.schedule(id) // etc.
 * ```
 */
export function cancellableRequests(defaultConfig?: Config): RequestsHook {
  
  const counters: Map<any, number> = new Map()

  return {
    async schedule(reqId, config?: Config): Promise<boolean> {
      const delaySecs = config?.delaySecs ?? defaultConfig?.delaySecs ?? 15
      const counter = (counters.get(reqId) ?? 0) + 1
      counters.set(reqId, counter)
      await delay(delaySecs)
      return counters.get(reqId) === counter
    },
    cancel(reqId: string) {
      counters.delete(reqId)
    }
  }
}