import type { HookContext } from './context'

export type ChoiceQuestion = {
  type: 'choice'
  instructions: string
  criteria: Record<string, string>
}

export type ChoiceAnswer = { choice: string; probabilities?: Record<string, number> }

export type Decided = { answers: Record<string, ChoiceAnswer>; ms: number; chars: number }

const SERVERS = ['masseater-mcp', 'claude.ai masseater-mcp']
const PORTAL_TOOL = 'portal_codemode_execute'
const MAX_QUESTIONS = 64

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parse(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

function textOf(value: unknown): string | undefined {
  const blocks = Array.isArray(value) ? value : [value]
  const first = blocks.find(block => isRecord(block) && block.type === 'text')

  return isRecord(first) && typeof first.text === 'string' ? first.text : undefined
}

export function answersOf(blocks: readonly { type: string; text?: string }[]): Record<string, ChoiceAnswer> | null {
  let value: unknown = textOf(blocks)
  for (let depth = 0; depth < 3 && typeof value === 'string'; depth += 1) {
    const parsed = parse(value)
    value = parsed === undefined ? undefined : (textOf(parsed) ?? parsed)
  }
  const answers = isRecord(value) ? value.answers : undefined
  if (!isRecord(answers)) {
    return null
  }
  const out: Record<string, ChoiceAnswer> = {}
  for (const [id, answer] of Object.entries(answers)) {
    if (isRecord(answer) && typeof answer.choice === 'string') {
      const probabilities = isRecord(answer.probabilities)
        ? (answer.probabilities as Record<string, number>)
        : undefined
      out[id] = { choice: answer.choice, probabilities }
    }
  }
  return out
}

async function call($: HookContext, code: string) {
  for (const server of SERVERS) {
    try {
      const result = await $.mcp.call(server, PORTAL_TOOL, { code })
      if (!result.isError) {
        return result
      }
    } catch {
      continue
    }
  }
  return null
}

export async function decide(
  $: HookContext,
  snippets: Record<string, string>,
  questions: Record<string, ChoiceQuestion>,
): Promise<Decided | null> {
  const startedAt = await $.clock.now()
  const entries = Object.entries(questions)
  const answers: Record<string, ChoiceAnswer> = {}
  let chars = 0

  for (let from = 0; from < entries.length; from += MAX_QUESTIONS) {
    const input = JSON.stringify({
      snippets,
      questions: Object.fromEntries(entries.slice(from, from + MAX_QUESTIONS)),
    })
    const code = `async () => codemode.sundries_decide(${input})`
    chars += code.length
    const result = await call($, code)
    const part = result === null ? null : answersOf(result.content)
    if (part === null) {
      return null
    }
    Object.assign(answers, part)
  }

  return { answers, ms: (await $.clock.now()) - startedAt, chars }
}
