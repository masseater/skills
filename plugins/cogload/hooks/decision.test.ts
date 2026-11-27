import { expect, test } from 'claude-code/testing'

import { answersOf, gatewayOf, portalAnswersOf } from './decision'

test('the Workers AI result is read from its envelope', async () => {
  const body = { result: { answers: { s0: { type: 'choice', choice: 'done', probabilities: { done: 0.9, detail: 0.1 } } } } }

  expect(answersOf(JSON.stringify(body))).toEqual({ s0: { choice: 'done', probabilities: { done: 0.9, detail: 0.1 } } })
})

test('a result without answers is no answer', async () => {
  expect(answersOf('{"success":false}')).toBeNull()
  expect(answersOf('not json')).toBeNull()
})

test('the gateway needs both the account and the token', async () => {
  expect(gatewayOf({})).toBeNull()
  expect(gatewayOf({ cloudflare_account_id: 'a', cloudflare_api_token: ' ' })).toBeNull()
  expect(gatewayOf({ cloudflare_account_id: ' a ', cloudflare_api_token: 't' })).toEqual({ account: 'a', token: 't', gateway: 'default' })
  expect(gatewayOf({ cloudflare_account_id: 'a', cloudflare_api_token: 't', cloudflare_ai_gateway: 'g' })).toEqual({ account: 'a', token: 't', gateway: 'g' })
})

test('the portal result is read through its nested text blocks', async () => {
  const answers = { s0: { type: 'choice', choice: 'done', probabilities: { done: 0.9 } } }
  const inner = [{ type: 'text', text: JSON.stringify({ answers }) }]

  expect(portalAnswersOf([{ type: 'text', text: JSON.stringify(inner) }])).toEqual({
    s0: { choice: 'done', probabilities: { done: 0.9 } },
  })
  expect(portalAnswersOf([{ type: 'text', text: 'nope' }])).toBeNull()
})
