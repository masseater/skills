import { atom, read, update } from 'claude-code'

import type { HookContext, On } from './context'

const loaded = atom({ plugin: 'cogload', key: 'skills' } as const, [])

export const RULES = [
  { skill: 'stop-describing-ui', path: /\.(tsx|jsx|vue|svelte|html|css)$/ },
  { skill: 'cognitive-load', path: /\.html$/ },
] as const

function requiredSkills(filePath: string): string[] {
  return RULES.filter(rule => rule.path.test(filePath)).map(rule => rule.skill)
}

function nameOf(skill: string): string {
  return skill.slice(skill.lastIndexOf(':') + 1)
}

async function denial($: HookContext, filePath: string): Promise<string | undefined> {
  const done = await read($, loaded)
  const missing = requiredSkills(filePath).filter(skill => !done.includes(skill))
  if (missing.length === 0) {
    return undefined
  }

  return `${$.plugin.name}: load ${missing.map(skill => `\`${skill}\``).join(' and ')} with the Skill tool, then make this edit to ${filePath} again.`
}

export function registerSkillFirst(on: On): void {
  on('skill.prompt', async ($, e, next) => {
    await update($, loaded, list => [...new Set([...list, nameOf(e.skill)])])

    return next(e)
  })

  on('tool.call', { tool: 'Edit' }, async ($, e, next) => {
    const deny = await denial($, e.file_path)

    return deny === undefined ? next(e) : { deny }
  })

  on('tool.call', { tool: 'Write' }, async ($, e, next) => {
    const deny = await denial($, e.file_path)

    return deny === undefined ? next(e) : { deny }
  })
}
