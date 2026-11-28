import type { HookContext } from './context'
import { decide, gatewayFrom } from './decision'
import type { ChoiceQuestion } from './decision'
import { record } from './measure'

export const CONFIDENT = 0.7
const MAX_URLS = 12
const REQUEST_CHARS = 1500
const EXCERPT_CHARS = 500
const URL_PATTERN = /https?:\/\/[^\s)\]>"'`<）」』。、]+/g
const TRAILING = /[.,;:!?。、」』）]+$/

export type Turn = {
  request: string
  answer: string
  fetched: { url: string; excerpt: string }[]
}

type Message = Awaited<ReturnType<HookContext['session']['messages']>>

export function urlsIn(text: string): string[] {
  return (text.match(URL_PATTERN) ?? []).map(url => url.replace(TRAILING, ''))
}

function isRemote(url: string): boolean {
  try {
    return new URL(url).hostname.includes('.')
  } catch {
    return false
  }
}

export function turnOf(messages: Exclude<Message, { deny: string }>, lastAnswer: string | undefined): Turn {
  const start = messages.findLastIndex(message => message.role === 'user' && message.text !== '')
  const turn = start < 0 ? messages : messages.slice(start)
  const request = turn[0]?.role === 'user' ? turn[0].text : ''
  const fetched = new Map<string, string>()
  for (const message of turn) {
    for (const use of message.toolUses) {
      const url = use.input.url
      if (typeof url === 'string' && isRemote(url) && use.tool !== 'Artifact') {
        fetched.set(url, (use.text ?? '').slice(0, EXCERPT_CHARS))
      }
    }
  }
  const answer = lastAnswer ?? turn.findLast(message => message.role === 'assistant' && message.text !== '')?.text ?? ''

  return { request, answer, fetched: [...fetched].map(([url, excerpt]) => ({ url, excerpt })) }
}

export function candidatesOf(turn: Turn): { url: string; excerpt: string }[] {
  const given = new Set(urlsIn(turn.request))
  const seen = new Map<string, string>()
  for (const { url, excerpt } of turn.fetched) {
    seen.set(url, excerpt)
  }
  for (const url of urlsIn(turn.answer)) {
    if (isRemote(url) && !seen.has(url)) {
      seen.set(url, '')
    }
  }

  return [...seen]
    .filter(([url]) => !given.has(url))
    .slice(0, MAX_URLS)
    .map(([url, excerpt]) => ({ url, excerpt }))
}

function question(ref: string): ChoiceQuestion {
  return {
    type: 'choice',
    instructions: `state.snippets.request is what the owner asked an AI coding agent to do. state.snippets.${ref} is a web page the agent read or cited while working: its URL, then the start of its content when the agent fetched it. Is this page written and published by the organization or project that makes or governs what it describes?`,
    criteria: {
      official:
        "Yes: vendor documentation, a specification or standard, the project's own repository or release notes, the vendor's own blog or announcement, or the primary source of a paper, a law or a dataset",
      third_party:
        'No: anyone else, such as a personal or company blog post, a tutorial, a news site reporting on it, a Q&A site or forum where any user can post, an aggregator, a mirror, a content farm, or an AI-generated summary',
    },
  }
}

export async function unofficialOf($: HookContext, options: Readonly<Record<string, unknown>>, turn: Turn): Promise<string[]> {
  const candidates = candidatesOf(turn)
  if (candidates.length === 0) {
    return []
  }
  const snippets: Record<string, string> = { request: turn.request.slice(0, REQUEST_CHARS) }
  const questions: Record<string, ChoiceQuestion> = {}
  candidates.forEach(({ url, excerpt }, index) => {
    snippets[`u${index}`] = excerpt === '' ? url : `${url}\n${excerpt}`
    questions[`u${index}`] = question(`u${index}`)
  })

  const decided = await decide($, await gatewayFrom($, options), snippets, questions)
  if (decided === null) {
    return []
  }
  const flagged = candidates.filter(({ url }, index) => {
    const answer = decided.answers[`u${index}`]

    return answer?.choice === 'third_party' && (answer.probabilities?.third_party ?? 0) >= CONFIDENT
  })
  await record($, {
    hook: 'source-check',
    at: await $.clock.now(),
    ms: decided.ms,
    chars: decided.chars,
    units: candidates.length,
    dropped: flagged.length,
    isShortened: false,
  })

  return flagged.map(({ url }) => url)
}

export async function sourceBlock($: HookContext, options: Readonly<Record<string, unknown>>, lastAnswer: string | undefined): Promise<string | undefined> {
  const messages = await $.session.messages()
  if ('deny' in messages) {
    return undefined
  }
  const unofficial = await unofficialOf($, options, turnOf(messages, lastAnswer))
  if (unofficial.length === 0) {
    return undefined
  }

  return `${$.plugin.name}: this turn relied on pages that do not look like official sources:\n${unofficial.map(url => `- ${url}`).join('\n')}\nFor each fact you took from them, find the page of the maker or maintainer (official documentation, specification, repository or release notes), confirm the fact there and rest your answer on that source. Where no official source exists, say so in the answer. Then end the turn.`
}
