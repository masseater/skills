import { expect, test } from 'claude-code/testing'

import { REVIEW_SKILL } from './artifact-review'

const STOP = { stop_hook_active: false, hook_event_name: 'Stop', session_id: 's', transcript_path: '/t', cwd: '/' } as never
const STOP_AGAIN = { stop_hook_active: true, hook_event_name: 'Stop', session_id: 's', transcript_path: '/t', cwd: '/' } as never

test('a turn that published an Artifact page is sent back to review its copy once', async ($, on) => {
  on('command.list', () => ({ value: [{ name: `some-plugin:${REVIEW_SKILL}` }] as never }))
  on('tool.call', () => ({ result: {} }))
  on('classic.Stop', () => ({}))
  on('session.messages', () => ({ value: [] }))

  await $.tool.call({ tool: 'Artifact', file_path: '/s/page.html' })
  const first = await $.classic.Stop(STOP)
  expect(first.block).toContain(REVIEW_SKILL)

  await $.tool.call({ tool: 'Artifact', file_path: '/s/page.html' })
  const second = await $.classic.Stop(STOP_AGAIN)
  expect(second.block).toBeUndefined()

  const later = await $.classic.Stop(STOP)
  expect(later.block).toBeUndefined()
})

test('reading, listing or uploading an asset does not ask for a review', async ($, on) => {
  on('command.list', () => ({ value: [{ name: REVIEW_SKILL }] as never }))
  on('tool.call', () => ({ result: {} }))
  on('classic.Stop', () => ({}))
  on('session.messages', () => ({ value: [] }))

  await $.tool.call({ tool: 'Artifact', action: 'read', url: 'https://claude.ai/artifact/x' })
  await $.tool.call({ tool: 'Artifact', action: 'list' })
  await $.tool.call({ tool: 'Artifact', url: 'https://claude.ai/artifact/x', file_path: '/s/a.png', asset: true } as never)
  const stop = await $.classic.Stop(STOP)
  expect(stop.block).toBeUndefined()
})

test('a turn passes where the skill is not installed', async ($, on) => {
  on('command.list', () => ({ value: [] }))
  on('tool.call', () => ({ result: {} }))
  on('classic.Stop', () => ({}))
  on('session.messages', () => ({ value: [] }))

  await $.tool.call({ tool: 'Artifact', file_path: '/s/page.html' })
  const stop = await $.classic.Stop(STOP)
  expect(stop.block).toBeUndefined()
})
