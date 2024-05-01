import { SetStateAction, useState } from "react"

export type Hook<T> = {
    push(action: SetStateAction<T>): void,
    present: T,
    history: History<T>,
    undo(): void,
    redo(): void
}

export type History<T> = {
    states: T[],
    time: number
}

/**
 * Lightweight history of states. Returns:
 * - `present`: current state
 * - `push`: add new state and set it as present. Future states get discarded
 * - `undo`, `redo`: navigate through history
 * 
 * For complexer use case, also returns the underlying representation `history: { time, states }`:
*  - `present === states[time]`
*  - `states[0]`: newest state
*  - `states[-1]`: oldest state
 */
export function useHistory<T>(init: () => T): Hook<T> {
    const [history, setHistory] = useState<History<T>>(() => ({time: 0, states: [init()]}));
    const { time, states } = history;
    const present = states[time];
    const push = (action: SetStateAction<T>) => setHistory(
        ({time, states}) => ({ time: 0, states: [applyAction(action, states[time]), ...states.slice(time)] })
    );
    const undo = () => setHistory(
        ({time, states}) => ({time: Math.min(states.length-1, time+1), states})
    );
    const redo = () => setHistory(
        ({time, states}) => ({time: Math.max(0, time-1), states})
    );

    return { present, history, push, undo, redo };
}

const applyAction = <T>(action: SetStateAction<T>, curr: T): T =>
  typeof action === 'function' ? (action as (x: T) => T)(curr) : action