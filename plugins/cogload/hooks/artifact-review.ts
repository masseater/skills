import { atom, read, update } from 'claude-code'

import type { On } from './context'

const published = atom({ plugin: 'cogload', key: 'published' } as const, false)

export const REVIEW_SKILL = 'stop-describing-ui'

export function registerArtifactReview(on: On): void {
  on('tool.call', { tool: 'Artifact' }, async ($, e, next) => {
    const result = await next(e)
    const isPagePublish = (e.action === undefined || e.action === 'publish') && (e as { asset?: unknown }).asset !== true
    if (isPagePublish && result.deny === undefined && result.isError !== true) {
      await update($, published, () => true)
    }

    return result
  })

  on('classic.Stop', async ($, e, next) => {
    if (!(await read($, published))) {
      return next(e)
    }
    await update($, published, () => false)
    if (e.stop_hook_active) {
      return next(e)
    }
    const installed = (await $.command.list()).some(command => command.name.endsWith(REVIEW_SKILL))
    if (!installed) {
      return next(e)
    }

    return {
      ...(await next(e)),
      block: `${$.plugin.name}: you published an Artifact page in this turn. Load \`${REVIEW_SKILL}\` with the Skill tool, check every piece of text on the pages you published against it, fix the copy that explains instead of acting, and publish them again to the same URLs. Then end the turn.`,
    }
  })
}
