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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

export function answersOf(text: string): Record<string, ChoiceAnswer> | null {
  const body = parseJson(text)
  const result = isRecord(body) ? body.result : undefined
  const answers = isRecord(result) ? result.answers : undefined
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

function filled(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null
}

export type CloudflareEnv = { account: unknown; token: unknown; gateway: unknown }

export function gatewayOf(options: Readonly<Record<string, unknown>>, env: CloudflareEnv): Gateway | null {
  const account = filled(options.cloudflare_account_id) ?? filled(env.account)
  const token = filled(options.cloudflare_api_token) ?? filled(env.token)
  if (account === null || token === null) {
    return null
  }

  return { account, token, gateway: filled(options.cloudflare_ai_gateway) ?? filled(env.gateway) ?? 'default' }
}

export async function decide(
  $: HookContext,
  gateway: Gateway | null,
  snippets: Record<string, string>,
  questions: Record<string, ChoiceQuestion>,
): Promise<Decided | null> {
  if (gateway === null) {
    return null
  }

  const startedAt = await $.clock.now()
  const entries = Object.entries(questions)
  const answers: Record<string, ChoiceAnswer> = {}
  let chars = 0

  for (let from = 0; from < entries.length; from += MAX_QUESTIONS) {
    const body = JSON.stringify({
      model: 'clef-flash',
      state: { snippets },
      questions: Object.fromEntries(entries.slice(from, from + MAX_QUESTIONS)),
    })
    chars += body.length
    let part: Record<string, ChoiceAnswer> | null = null
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
      part = response.ok ? answersOf(response.text) : null
    } catch {
      part = null
    }
    if (part === null) {
      return null
    }
    Object.assign(answers, part)
  }

  return { answers, ms: (await $.clock.now()) - startedAt, chars }
}
