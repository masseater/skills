import type { Register } from 'claude-code'

import { registerArtifactReview } from './artifact-review'
import { registerShortReport } from './short-report'
import { registerSkillFirst } from './skill-first'
import { registerStop } from './stop'
import { registerSurface } from './surface'

export const register: Register = (on, options) => {
  registerArtifactReview(on)
  registerShortReport(on, options)
  registerSkillFirst(on)
  registerStop(on, options)
  registerSurface(on)
}
