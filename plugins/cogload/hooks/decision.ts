import type { HookContext } from './context'

export type ChoiceQuestion = {
  type: 'choice'
  instructions: string
  criteria: Record<string, string>
}

export type ChoiceAnswer = { choice: string; probabilities?: Record<string, number> }

export type Decided = { answers: Record<string, ChoiceAnswer>; ms: number; chars: number }

export type Gateway = { account: string; token: string; gateway: string }

const MODEL = '@cf/cloudflare/clef-flash'
const MAX_QUESTIONS = 64
const PORTAL_SERVERS = ['masseater-mcp', 'claude.ai masseater-mcp']
const PORTAL_TOOL = 'portal_codemode_execute'

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

export function answersOf(text: string): Record<string, ChoiceAnswer> | null {
  const body = parse(text)

  return answersFrom(isRecord(body) ? body.result : undefined)
}

function textOf(value: unknown): string | undefined {
  const blocks = Array.isArray(value) ? value : [value]
  const first = blocks.find(block => isRecord(block) && block.type === 'text')

  return isRecord(first) && typeof first.text === 'string' ? first.text : undefined
}

function answersFrom(value: unknown): Record<string, ChoiceAnswer> | null {
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

export function portalAnswersOf(blocks: readonly { type: string; text?: string }[]): Record<string, ChoiceAnswer> | null {
  let value: unknown = textOf(blocks)
  for (let depth = 0; depth < 3 && typeof value === 'string'; depth += 1) {
    const parsed = parse(value)
    value = parsed === undefined ? undefined : (textOf(parsed) ?? parsed)
  }

  return answersFrom(value)
}

export function gatewayOf(options: Readonly<Record<string, unknown>>): Gateway | null {
  const account = options.cloudflare_account_id
  const token = options.cloudflare_api_token
  const gateway = options.cloudflare_ai_gateway
  if (typeof account !== 'string' || account.trim() === '' || typeof token !== 'string' || token.trim() === '') {
    return null
  }

  return {
    account: account.trim(),
    token: token.trim(),
    gateway: typeof gateway === 'string' && gateway.trim() !== '' ? gateway.trim() : 'default',
  }
}

async function viaGateway(
  $: HookContext,
  gateway: Gateway,
  snippets: Record<string, string>,
  questions: readonly [string, ChoiceQuestion][],
): Promise<{ answers: Record<string, ChoiceAnswer>; chars: number } | null> {
  const body = JSON.stringify({ model: 'clef-flash', state: { snippets }, questions: Object.fromEntries(questions) })
  try {
    const response = await $.http.fetch(
      `https://api.cloudflare.com/client/v4/accounts/${gateway.account}/ai/run/${MODEL}`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${gateway.token}`,
          'content-type': 'application/json',
          'cf-aig-gateway-id': gateway.gateway,
          'cf-aig-metadata': JSON.stringify({ tool: 'cogload' }),
        },
        body,
      },
    )
    const answers = response.ok ? answersOf(response.text) : null

    return answers === null ? null : { answers, chars: body.length }
  } catch {
    return null
  }
}

async function viaPortal(
  $: HookContext,
  snippets: Record<string, string>,
  questions: readonly [string, ChoiceQuestion][],
): Promise<{ answers: Record<string, ChoiceAnswer>; chars: number } | null> {
  const input = JSON.stringify({ snippets, questions: Object.fromEntries(questions) })
  const code = `async () => codemode.sundries_decide(${input})`
  for (const server of PORTAL_SERVERS) {
    try {
      const result = await $.mcp.call(server, PORTAL_TOOL, { code })
      const answers = result.isError ? null : portalAnswersOf(result.content)
      if (answers !== null) {
        return { answers, chars: code.length }
      }
    } catch {
      continue
    }
  }

  return null
}

export async function decide(
  $: HookContext,
  gateway: Gateway | null,
  snippets: Record<string, string>,
  questions: Record<string, ChoiceQuestion>,
): Promise<Decided | null> {
  const startedAt = await $.clock.now()
  const entries = Object.entries(questions)
  const answers: Record<string, ChoiceAnswer> = {}
  let chars = 0

  for (let from = 0; from < entries.length; from += MAX_QUESTIONS) {
    const batch = entries.slice(from, from + MAX_QUESTIONS)
    const part = gateway === null ? await viaPortal($, snippets, batch) : await viaGateway($, gateway, snippets, batch)
    if (part === null) {
      return null
    }
    Object.assign(answers, part.answers)
    chars += part.chars
  }

  return { answers, ms: (await $.clock.now()) - startedAt, chars }
}
