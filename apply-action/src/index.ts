import { SetStateAction } from 'react'
export const applyAction = <T>(action: SetStateAction<T>, curr: T): T => typeof action === 'function' ? (action as any)(curr) : action