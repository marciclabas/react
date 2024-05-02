import { mod } from "@haskellian/mod"
import { useState } from "react"

export type Rotation = 0 | 90 | 180 | -90

export const toCSSdegrees = (rot: Rotation) =>
  rot === 0 ? 0 :
  rot === 90 ? -90 :
  rot === 180 ? -180 :
  -270

export function useRotation(start: Rotation = 0): {
  rotation: Rotation
  clockwiseDegrees: number
  /** CSS does angles backwards, it seems */
  rotate(to: 'left' | 'right' | Rotation): void
} {
  const ANGLES: Rotation[] = [0, 90, 180, -90]
  const [idx, setIdx] = useState(ANGLES.indexOf(start))
  const rotation = ANGLES[idx]
  return {
    rotation, clockwiseDegrees: toCSSdegrees(rotation),
    rotate(to) {
      if (typeof to === 'string') {
        const delta = to === 'left' ? 1 : -1
        setIdx(i => mod(i + delta, 4))
      }
      else setIdx(ANGLES.indexOf(to))
    }
  }
}