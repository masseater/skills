import type { Register } from 'claude-code'

import { registerShortReport } from './short-report'
import { registerSkillFirst } from './skill-first'
import { registerSurface } from './surface'

export const register: Register = on => {
  registerShortReport(on)
  registerSkillFirst(on)
  registerSurface(on)
}
