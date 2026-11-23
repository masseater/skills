import type { Register } from 'claude-code'

import { registerArtifactReview } from './artifact-review'
import { gatewayOf } from './decision'
import { registerShortReport } from './short-report'
import { registerSkillFirst } from './skill-first'
import { registerSurface } from './surface'

export const register: Register = (on, options) => {
  registerArtifactReview(on)
  registerShortReport(on, gatewayOf(options))
  registerSkillFirst(on)
  registerSurface(on)
}
