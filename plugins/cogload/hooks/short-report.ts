import { atom, update } from 'claude-code'

import type { HookContext, On } from './context'
import { decide } from './decision'
import type { ChoiceQuestion } from './decision'
import { record } from './measure'
import { compose, splitUnits } from './select-lines'
import type { Role } from './select-lines'

const report = atom({ plugin: 'cogload', key: 'report' } as const, null)

const MIN_JUDGED_UNITS = 6
export const CONFIDENT = 0.8
const KIND_CHARS = 6000

const KIND: ChoiceQuestion = {
  type: 'choice',
  instructions:
    'state.snippets.all is one message from an AI coding agent to its owner. What is this message mainly?',
  criteria: {
    report: 'A report of work the agent did or is doing: steps taken, findings along the way, results',
    answer:
      'An answer to a question, an explanation, a proposal or other content the owner asked to read',
  },
}

const ROLE_CRITERIA = {
  start: 'States what work is about to begin, or the state things were in at the start',
  done: 'States the final result, or the state after the work finished',
  ask: 'Asks the owner a question, or requests a decision or confirmation',
  detail: 'An intermediate step, a finding along the way, or supporting detail',
}

function roleQuestion(ref: string): ChoiceQuestion {
  return {
    type: 'choice',
    instructions: `state.snippets holds the lines of one work report from an AI coding agent to its owner, in order. Consider only snippet "${ref}". Which role does this line play in the report?`,
    criteria: ROLE_CRITERIA,
  }
}

function isRole(value: string): value is Role {
  return value in ROLE_CRITERIA
}

async function shorten($: HookContext, message: string): Promise<string> {
  const units = splitUnits(message)
  const judged = units.filter(unit => unit.isJudged)
  if (judged.length < MIN_JUDGED_UNITS) {
    await update($, report, () => null)
    return message
  }

  const snippets: Record<string, string> = { all: message.slice(0, KIND_CHARS) }
  const questions: Record<string, ChoiceQuestion> = { kind: KIND }
  units.forEach((unit, index) => {
    if (unit.isJudged) {
      snippets[`s${index}`] = unit.text
      questions[`s${index}`] = roleQuestion(`s${index}`)
    }
  })

  const decided = await decide($, snippets, questions)
  const kind = decided?.answers.kind
  const isReport =
    kind?.choice === 'report' && (kind.probabilities?.report ?? 1) >= CONFIDENT
  if (decided === null || !isReport) {
    await update($, report, () => null)
    return message
  }

  const roles = units.map((unit, index): Role => {
    const answer = decided.answers[`s${index}`]
    if (!unit.isJudged) {
      return 'detail'
    }
    if (answer === undefined || !isRole(answer.choice)) {
      return 'done'
    }
    const isSure = (answer.probabilities?.[answer.choice] ?? 1) >= CONFIDENT
    return answer.choice === 'detail' && !isSure ? 'done' : answer.choice
  })

  const composed = compose(units, roles)
  const isShortened = composed.dropped > 0 && composed.shown !== ''
  await record($, {
    at: await $.clock.now(),
    ms: decided.ms,
    chars: decided.chars,
    units: units.length,
    dropped: composed.dropped,
    isShortened,
  })
  if (!isShortened) {
    await update($, report, () => null)
    return message
  }

  await update($, report, () => ({
    ask: composed.ask,
    full: message,
    dropped: composed.dropped,
  }))

  return composed.shown
}

export function registerShortReport(on: On): void {
  const buffers = new Map<string, string>()

  on('classic.MessageDisplay', async ($, e, next) => {
    const message = (buffers.get(e.message_id) ?? '') + e.delta
    if (!e.final) {
      buffers.set(e.message_id, message)
      return { displayContent: '' }
    }
    buffers.delete(e.message_id)

    const shown = await shorten($, message)
    const below = await next({ ...e, delta: shown })

    return { displayContent: below.displayContent ?? shown }
  })
}
