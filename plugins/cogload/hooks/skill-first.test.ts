import { expect, test } from 'claude-code/testing'

import { COMMAND_RULES, RULES } from './skill-first'

const UI_SKILL = RULES[0].skill

test('an edit to a UI file is refused until its skill has been loaded', async ($, on) => {
  on('command.list', () => ({ value: [{ name: `some-plugin:${UI_SKILL}` }] as never }))
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

test('an edit passes where the skill is not installed', async ($, on) => {
  on('tool.call', () => ({ result: {} }))
  on('command.list', () => ({ value: [] }))

  const allowed = await $.tool.call({ tool: 'Write', file_path: '/app/login.tsx', content: '' })
  expect(allowed.deny).toBeUndefined()
})

test('a skill loaded through the Skill tool counts when skill.prompt never reaches the mod', async ($, on) => {
  on('command.list', () => ({ value: [{ name: `some-plugin:${UI_SKILL}` }] as never }))
  on('tool.call', () => ({ result: {} }))

  await $.tool.call({ tool: 'Skill', skill: `some-plugin:${UI_SKILL}` })
  const allowed = await $.tool.call({ tool: 'Write', file_path: '/app/login.tsx', content: '' })
  expect(allowed.deny).toBeUndefined()
})

test('building a slide deck is refused until the slide skills have been loaded', async ($, on) => {
  const skills = [...new Set(COMMAND_RULES.map(rule => rule.skill))]
  on('command.list', () => ({ value: skills.map(skill => ({ name: `cogload:${skill}` })) as never }))
  on('tool.call', () => ({ result: {} }))

  const command = 'node /plugins/cogload/skills/gitbook-slides/scripts/build.ts deck out --pdf'
  const refused = await $.tool.call({ tool: 'Bash', command })
  for (const skill of skills) {
    expect(refused.deny).toContain(skill)
  }

  for (const skill of skills) {
    await $.tool.call({ tool: 'Skill', skill: `cogload:${skill}` })
  }
  const allowed = await $.tool.call({ tool: 'Bash', command })
  expect(allowed.deny).toBeUndefined()
})

test('other commands pass', async ($, on) => {
  on('tool.call', () => ({ result: {} }))

  const allowed = await $.tool.call({ tool: 'Bash', command: 'ls' })
  expect(allowed.deny).toBeUndefined()
})
