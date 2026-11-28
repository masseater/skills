import { expect, test } from 'claude-code/testing'

import { answersOf, gatewayFrom } from './decision'

test('the Workers AI result is read from its envelope', () => {
  const body = { result: { answers: { s0: { type: 'choice', choice: 'done', probabilities: { done: 0.9, detail: 0.1 } } } } }

  expect(answersOf(JSON.stringify(body))).toEqual({ s0: { choice: 'done', probabilities: { done: 0.9, detail: 0.1 } } })
})

test('a result without answers is no answer', () => {
  expect(answersOf('{"success":false}')).toBeNull()
  expect(answersOf('not json')).toBeNull()
})

const gatewayWith = (env: Record<string, string>, options: Record<string, unknown>) =>
  gatewayFrom({ env: { get: async (name: string) => env[name] } }, options)

test('the gateway needs both the account and the token', async () => {
  expect(await gatewayWith({}, {})).toBeNull()
  expect(await gatewayWith({}, { cloudflare_account_id: 'a', cloudflare_api_token: ' ' })).toBeNull()
  expect(await gatewayWith({}, { cloudflare_account_id: ' a ', cloudflare_api_token: 't' })).toEqual({ account: 'a', token: 't', gateway: 'default' })
  expect(await gatewayWith({}, { cloudflare_account_id: 'a', cloudflare_api_token: 't', cloudflare_ai_gateway: 'g' })).toEqual({ account: 'a', token: 't', gateway: 'g' })
})

test('the environment variables fill what the configuration leaves out', async () => {
  const env = { CLOUDFLARE_ACCOUNT_ID: 'ea', CLOUDFLARE_API_TOKEN: 'et', CLOUDFLARE_AI_GATEWAY: 'eg' }

  expect(await gatewayWith(env, {})).toEqual({ account: 'ea', token: 'et', gateway: 'eg' })
  expect(await gatewayWith(env, { cloudflare_account_id: 'a', cloudflare_api_token: 't' })).toEqual({ account: 'a', token: 't', gateway: 'eg' })
})
