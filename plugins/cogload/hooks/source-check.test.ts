import { expect, test } from 'claude-code/testing'

import { CONFIDENT, candidatesOf, urlsIn } from './source-check'

const STOP = { stop_hook_active: false, hook_event_name: 'Stop', session_id: 's', transcript_path: '/t', cwd: '/' } as never
const STOP_AGAIN = { stop_hook_active: true, hook_event_name: 'Stop', session_id: 's', transcript_path: '/t', cwd: '/' } as never

const OPTIONS = { options: { cloudflare_account_id: 'account', cloudflare_api_token: 'token' } }

const OFFICIAL = 'https://developers.cloudflare.com/workers-ai/platform/pricing/'
const BLOG = 'https://example-blog.dev/posts/workers-ai-pricing'

const TURN = [
  { role: 'user', text: 'Workers AI の料金を調べて', toolUses: [] },
  {
    role: 'assistant',
    text: '',
    toolUses: [{ tool_use_id: 'a', tool: 'WebFetch', input: { url: BLOG }, text: 'ブログの本文' }],
  },
  { role: 'assistant', text: `料金は ${BLOG} によると 1M あたり 0.04 ドルです。` , toolUses: [] },
] as never

function answered(third: readonly boolean[]) {
  const answers = Object.fromEntries(
    third.map((isThird, index) => {
      const choice = isThird ? 'third_party' : 'official'

      return [`u${index}`, { type: 'choice', choice, probabilities: { [choice]: CONFIDENT } }]
    }),
  )

  return { value: { ok: true, status: 200, text: JSON.stringify({ result: { answers } }) } as never }
}

test('urls are read from prose without the punctuation that follows them', () => {
  expect(urlsIn(`見てください（${OFFICIAL}）。また ${BLOG}.`)).toEqual([OFFICIAL, BLOG])
})

test('pages the owner pasted into the prompt and local addresses are not judged', () => {
  const turn = {
    request: `この ${BLOG} を読んで`,
    answer: `${BLOG} と http://localhost:3000/ と ${OFFICIAL} を見ました`,
    fetched: [],
  }

  expect(candidatesOf(turn).map(({ url }) => url)).toEqual([OFFICIAL])
})

test('a turn that rested on a third-party page is sent back once', OPTIONS, async ($, on) => {
  on('env.get', () => ({ value: undefined }))
  on('clock.now', () => ({ value: 0 }))
  on('store.get', () => ({ value: undefined }))
  on('store.set', () => ({ value: undefined }))
  on('session.messages', () => ({ value: TURN }))
  on('http.fetch', () => answered([true]))
  on('classic.Stop', () => ({}))

  const first = await $.classic.Stop(STOP)
  expect(first.block).toContain(BLOG)

  const again = await $.classic.Stop(STOP_AGAIN)
  expect(again.block).toBeUndefined()
})

function passes(name: string, reply: () => { value: never }) {
  test(name, OPTIONS, async ($, on) => {
    on('env.get', () => ({ value: undefined }))
    on('clock.now', () => ({ value: 0 }))
    on('store.get', () => ({ value: undefined }))
    on('store.set', () => ({ value: undefined }))
    on('session.messages', () => ({ value: TURN }))
    on('http.fetch', reply)
    on('classic.Stop', () => ({}))

    expect((await $.classic.Stop(STOP)).block).toBeUndefined()
  })
}

passes('a turn passes when the pages are official', () => answered([false]))

passes('a turn passes when the model is not sure', () => ({
  value: {
    ok: true,
    status: 200,
    text: JSON.stringify({ result: { answers: { u0: { type: 'choice', choice: 'third_party', probabilities: { third_party: 0.5 } } } } }),
  } as never,
}))

passes('a turn passes when the call fails', () => ({ value: { ok: false, status: 500, text: '' } as never }))

test('a turn that read no web page makes no model call', OPTIONS, async ($, on) => {
  let calls = 0
  on('env.get', () => ({ value: undefined }))
  on('session.messages', () => ({ value: [{ role: 'user', text: '直して', toolUses: [] }, { role: 'assistant', text: '直しました', toolUses: [] }] as never }))
  on('http.fetch', () => {
    calls += 1

    return answered([])
  })
  on('classic.Stop', () => ({}))

  expect((await $.classic.Stop(STOP)).block).toBeUndefined()
  expect(calls).toBe(0)
})
