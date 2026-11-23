import { expect, test } from 'claude-code/testing'

import { RULES } from './skill-first'

const UI_SKILL = RULES[0].skill

test('an edit to a UI file is refused until its skill has been loaded', async ($, on) => {
  on('tool.call', () => ({ result: {} }))
  on('skill.prompt', (_, e) => ({ text: e.text }))

  const refused = await $.tool.call({ tool: 'Write', file_path: '/app/login.tsx', content: '' })
  expect(refused.deny).toContain(UI_SKILL)

  await $.skill.prompt({ skill: `some-plugin:${UI_SKILL}`, text: '', frontmatter: {}, source: 'plugin' })
  const allowed = await $.tool.call({ tool: 'Write', file_path: '/app/login.tsx', content: '' })
  expect(allowed.deny).toBeUndefined()
})

test('an edit to another file passes', async ($, on) => {
  on('tool.call', () => ({ result: {} }))

  const allowed = await $.tool.call({ tool: 'Edit', file_path: '/app/login.ts', old_string: 'a', new_string: 'b' })
  expect(allowed.deny).toBeUndefined()
})
