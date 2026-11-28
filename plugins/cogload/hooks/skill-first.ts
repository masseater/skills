import { atom, read, update } from 'claude-code'

import type { HookContext, On } from './context'

const loaded = atom({ plugin: 'cogload', key: 'skills' } as const, [])
const figureAsked = atom({ plugin: 'cogload', key: 'figureAsked' } as const, false)

export const FIGURE_REQUEST = /インフォグラフィック|図示|図解|図にし|図で|図を(作|描|書|出)|構成図|概念図|フロー図|関係図|ダイアグラム|infographic|diagram|flowchart/i

export const RULES = [
  { skill: 'stop-describing-ui', path: /\.(tsx|jsx|vue|svelte|html|css)$/ },
  { skill: 'cognitive-load', path: /\.(tsx|jsx|vue|svelte|html|css)$/ },
  { skill: 'infographic', path: /\.svg$/ },
  { skill: 'cognitive-load', path: /\.svg$/ },
] as const

export const FIGURE_SKILL = 'infographic'

export const FIGURE_FILE = /\.(html|svg|tsx|jsx|vue|svelte)$/

export const DRAWN_FIGURE = /<svg\b[\s\S]*<(?:text|marker)\b/i

export const COMMAND_RULES = [
  { skill: 'slide-content', command: /gitbook-slides\/scripts\/build\.ts/ },
  { skill: 'infographic', command: /gitbook-slides\/scripts\/build\.ts/ },
  { skill: 'gitbook-slides', command: /gitbook-slides\/scripts\/build\.ts/ },
  { skill: 'cognitive-load', command: /gitbook-slides\/scripts\/build\.ts/ },
] as const

interface Target {
  filePath?: string
  command?: string
  content?: string
  asked?: boolean
  publish?: boolean
}

function requiredSkills(target: Target): string[] {
  const byPath = target.filePath === undefined ? [] : RULES.filter(rule => rule.path.test(target.filePath as string))
  const byCommand = target.command === undefined ? [] : COMMAND_RULES.filter(rule => rule.command.test(target.command as string))
  const drawn = target.content !== undefined && DRAWN_FIGURE.test(target.content)
  const asked = target.asked === true && (target.publish === true || (target.filePath !== undefined && FIGURE_FILE.test(target.filePath)))
  const skills: string[] = [...byPath, ...byCommand].map(rule => rule.skill)
  if (drawn || asked) {
    skills.push(FIGURE_SKILL)
  }

  return [...new Set(skills)]
}

function nameOf(skill: string): string {
  return skill.slice(skill.lastIndexOf(':') + 1)
}

async function record($: HookContext, skill: string): Promise<void> {
  await update($, loaded, list => [...new Set([...list, nameOf(skill)])])
}

async function denial($: HookContext, target: Target, action: string): Promise<string | undefined> {
  const done = await read($, loaded)
  const required = requiredSkills({ ...target, asked: await read($, figureAsked) }).filter(skill => !done.includes(skill))
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

  on('prompt.submit', async ($, e, next) => {
    if (!FIGURE_REQUEST.test(e.text)) {
      return next(e)
    }
    await update($, figureAsked, () => true)
    const done = await read($, loaded)
    if (done.includes(FIGURE_SKILL)) {
      return next(e)
    }

    return next({ ...e, context: [...(e.context ?? []), `${$.plugin.name}: the person asked for a figure. Load \`${FIGURE_SKILL}\` with the Skill tool before you design or write it. Writes and publishes are refused until you have.`] })
  })

  on('tool.call', { tool: 'Artifact' }, async ($, e, next) => {
    const isPagePublish = (e.action === undefined || e.action === 'publish') && (e as { asset?: unknown }).asset !== true
    const deny = isPagePublish ? await denial($, { publish: true }, 'publish') : undefined

    return deny === undefined ? next(e) : { deny }
  })

  on('tool.call', { tool: 'Edit' }, async ($, e, next) => {
    const deny = await denial($, { filePath: e.file_path, content: e.new_string }, `make this edit to ${e.file_path}`)

    return deny === undefined ? next(e) : { deny }
  })

  on('tool.call', { tool: 'Write' }, async ($, e, next) => {
    const deny = await denial($, { filePath: e.file_path, content: e.content }, `write ${e.file_path}`)

    return deny === undefined ? next(e) : { deny }
  })

  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const deny = await denial($, { command: e.command }, 'run this command')

    return deny === undefined ? next(e) : { deny }
  })
}
