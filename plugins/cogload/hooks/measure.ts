import type { HookContext } from './context'

export type Measure = {
  hook: 'short-report' | 'source-check'
  at: number
  ms: number
  chars: number
  units: number
  dropped: number
  isShortened: boolean
}

const KEY = 'measure'
const KEPT = 2000

export async function record($: HookContext, entry: Measure): Promise<void> {
  const stored = await $.store.get(KEY)
  const list = Array.isArray(stored) ? stored : []
  await $.store.set(KEY, [...list, entry].slice(-KEPT))
}
