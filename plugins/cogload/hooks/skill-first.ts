import { atom, read, update } from 'claude-code'

import type { HookContext, On } from './context'

const loaded = atom({ plugin: 'cogload', key: 'skills' } as const, [])

export const RULES = [
  { skill: 'stop-describing-ui', path: /\.(tsx|jsx|vue|svelte|html|css)$/ },
  { skill: 'cognitive-load', path: /\.(tsx|jsx|vue|svelte|html|css)$/ },
  { skill: 'infographic', path: /\.svg$/ },
  { skill: 'cognitive-load', path: /\.svg$/ },
] as const

export const COMMAND_RULES = [
  { skill: 'slide-content', command: /gitbook-slides\/scripts\/build\.ts/ },
  { skill: 'infographic', command: /gitbook-slides\/scripts\/build\.ts/ },
  { skill: 'gitbook-slides', command: /gitbook-slides\/scripts\/build\.ts/ },
  { skill: 'cognitive-load', command: /gitbook-slides\/scripts\/build\.ts/ },
] as const

function requiredSkills(target: { filePath?: string; command?: string }): string[] {
  const byPath = target.filePath === undefined ? [] : RULES.filter(rule => rule.path.test(target.filePath as string))
  const byCommand = target.command === undefined ? [] : COMMAND_RULES.filter(rule => rule.command.test(target.command as string))

  return [...new Set([...byPath, ...byCommand].map(rule => rule.skill))]
}

function nameOf(skill: string): string {
  return skill.slice(skill.lastIndexOf(':') + 1)
}

async function record($: HookContext, skill: string): Promise<void> {
  await update($, loaded, list => [...new Set([...list, nameOf(skill)])])
}

async function denial($: HookContext, target: { filePath?: string; command?: string }, action: string): Promise<string | undefined> {
  const done = await read($, loaded)
  const required = requiredSkills(target).filter(skill => !done.includes(skill))
  if (required.length === 0) {
    return undefined
  }
  const installed = (await $.command.list()).map(command => nameOf(command.name))
  const missing = required.filter(skill => installed.includes(skill))
  if (missing.length === 0) {
    return undefined
  }

  return `${$.plugin.name}: load ${missing.map(skill => `\`${skill}\``).join(' and ')} with the Skill tool, follow them, then ${action} again.`
}

export function registerSkillFirst(on: On): void {
  on('skill.prompt', async ($, e, next) => {
    await record($, e.skill)

    return next(e)
  })

  on('tool.call', { tool: 'Skill' }, async ($, e, next) => {
    const result = await next(e)
    if (result.deny === undefined && result.isError !== true) {
      await record($, e.skill)
    }

    return result
  })

  on('tool.call', { tool: 'Edit' }, async ($, e, next) => {
    const deny = await denial($, { filePath: e.file_path }, `make this edit to ${e.file_path}`)

    return deny === undefined ? next(e) : { deny }
  })

  on('tool.call', { tool: 'Write' }, async ($, e, next) => {
    const deny = await denial($, { filePath: e.file_path }, `write ${e.file_path}`)

    return deny === undefined ? next(e) : { deny }
  })

  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const deny = await denial($, { command: e.command }, 'run this command')

    return deny === undefined ? next(e) : { deny }
  })
}
