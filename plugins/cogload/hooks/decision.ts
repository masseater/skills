import type { HookContext } from './context'

export type ChoiceQuestion = {
  type: 'choice'
  instructions: string
  criteria: Record<string, string>
}

export type ChoiceAnswer = { choice: string; probabilities?: Record<string, number> }

export type Decided = { answers: Record<string, ChoiceAnswer>; ms: number; chars: number }

const MODEL = '@cf/cloudflare/clef-flash'
const GATEWAY = 'default'
const MAX_QUESTIONS = 64

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function answersOf(text: string): Record<string, ChoiceAnswer> | null {
  const body: unknown = JSON.parse(text)
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

export async function decide(
  $: HookContext,
  snippets: Record<string, string>,
  questions: Record<string, ChoiceQuestion>,
): Promise<Decided | null> {
  const account = await $.env.get('CLOUDFLARE_ACCOUNT_ID')
  const token = await $.env.get('CLOUDFLARE_API_TOKEN')
  if (account === undefined || token === undefined) {
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
    const response = await $.http.fetch(
      `https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/${MODEL}`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
          'cf-aig-gateway-id': GATEWAY,
          'cf-aig-metadata': JSON.stringify({ tool: 'cogload' }),
        },
        body,
      },
    )
    const part = response.ok ? answersOf(response.text) : null
    if (part === null) {
      return null
    }
    Object.assign(answers, part)
  }

  return { answers, ms: (await $.clock.now()) - startedAt, chars }
}
