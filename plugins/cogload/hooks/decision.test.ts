import { expect, test } from 'claude-code/testing'

import { answersOf, gatewayOf } from './decision'

test('the Workers AI result is read from its envelope', () => {
  const body = { result: { answers: { s0: { type: 'choice', choice: 'done', probabilities: { done: 0.9, detail: 0.1 } } } } }

  expect(answersOf(JSON.stringify(body))).toEqual({ s0: { choice: 'done', probabilities: { done: 0.9, detail: 0.1 } } })
})

test('a result without answers is no answer', () => {
  expect(answersOf('{"success":false}')).toBeNull()
  expect(answersOf('not json')).toBeNull()
})

const NONE = { account: undefined, token: undefined, gateway: undefined }

test('the gateway needs both the account and the token', () => {
  expect(gatewayOf({}, NONE)).toBeNull()
  expect(gatewayOf({ cloudflare_account_id: 'a', cloudflare_api_token: ' ' }, NONE)).toBeNull()
  expect(gatewayOf({ cloudflare_account_id: ' a ', cloudflare_api_token: 't' }, NONE)).toEqual({ account: 'a', token: 't', gateway: 'default' })
  expect(gatewayOf({ cloudflare_account_id: 'a', cloudflare_api_token: 't', cloudflare_ai_gateway: 'g' }, NONE)).toEqual({ account: 'a', token: 't', gateway: 'g' })
})

test('the environment variables fill what the configuration leaves out', () => {
  const env = { account: 'ea', token: 'et', gateway: 'eg' }

  expect(gatewayOf({}, env)).toEqual({ account: 'ea', token: 'et', gateway: 'eg' })
  expect(gatewayOf({ cloudflare_account_id: 'a', cloudflare_api_token: 't' }, env)).toEqual({ account: 'a', token: 't', gateway: 'eg' })
})
