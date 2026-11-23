import { expect, test } from 'claude-code/testing'

import { answersOf } from './decision'

const ANSWERS = { answers: { s0: { type: 'choice', choice: 'done', probabilities: { done: 0.9, detail: 0.1 } } } }

test('the portal result is read whether it wraps the tool result or not', async () => {
  const plain = [{ type: 'text', text: JSON.stringify(ANSWERS) }]
  const wrapped = [{ type: 'text', text: JSON.stringify([{ type: 'text', text: JSON.stringify(ANSWERS) }]) }]
  const expected = { s0: { choice: 'done', probabilities: { done: 0.9, detail: 0.1 } } }

  expect(answersOf(plain)).toEqual(expected)
  expect(answersOf(wrapped)).toEqual(expected)
})

test('a result without answers is no answer', async () => {
  expect(answersOf([{ type: 'text', text: 'sundries failed: decision model' }])).toBeNull()
  expect(answersOf([])).toBeNull()
})
