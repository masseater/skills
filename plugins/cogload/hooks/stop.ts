import { artifactBlock } from './artifact-review'
import type { On } from './context'
import { sourceBlock } from './source-check'

export function registerStop(on: On, options: Readonly<Record<string, unknown>>): void {
  on('classic.Stop', async ($, e, next) => {
    const blocks = [await artifactBlock($, e.stop_hook_active), e.stop_hook_active ? undefined : await sourceBlock($, options, e.last_assistant_message)]
      .filter(block => block !== undefined)
    if (blocks.length === 0) {
      return next(e)
    }

    return { ...(await next(e)), block: blocks.join('\n') }
  })
}
