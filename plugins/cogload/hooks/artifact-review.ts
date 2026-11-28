import { atom, read, update } from 'claude-code'

import type { HookContext, On } from './context'

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
}

export async function artifactBlock($: HookContext, isRepeat: boolean): Promise<string | undefined> {
  if (!(await read($, published))) {
    return undefined
  }
  await update($, published, () => false)
  if (isRepeat) {
    return undefined
  }
  const installed = (await $.command.list()).some(command => command.name.endsWith(REVIEW_SKILL))
  if (!installed) {
    return undefined
  }

  return `${$.plugin.name}: you published an Artifact page in this turn. Load \`${REVIEW_SKILL}\` with the Skill tool, check every piece of text on the pages you published against it, fix the copy that explains instead of acting, and publish them again to the same URLs. Then end the turn.`
}
