import { expect, test } from 'claude-code/testing'

import { CONFIDENT } from './short-report'

const LINES = [
  'ログイン画面の入力チェックを直します。',
  'まず src/login.tsx を読みました。',
  '検証関数が空文字を通していました。',
  '正規表現を直し、テストを足しました。',
  'メール欄の検証を直し、テストが通りました。',
  'パスワード欄も同じ直し方でよいですか。',
]

const ROLES = ['start', 'detail', 'detail', 'detail', 'done', 'ask']

const MESSAGE = {
  plugin: 'cogload',
  component: 'AssistantMessage',
  requestId: 'm',
  surface: 'desktop',
  props: { text: LINES.join('\n'), isFirstOfReply: true },
} as const

const TURN = {
  answer: LINES.join('\n'),
  durationMs: 1,
  isAborted: false,
  turnId: 't',
  reason: 'answer',
} as const

function answered(kind: string, roles: readonly string[]) {
  const answers = {
    kind: { type: 'choice', choice: kind, probabilities: { [kind]: CONFIDENT } },
    ...Object.fromEntries(
      roles.map((choice, index) => [
        `s${index}`,
        { type: 'choice', choice, probabilities: { [choice]: CONFIDENT } },
      ]),
    ),
  }

  return { value: { ok: true, status: 200, text: JSON.stringify({ result: { answers } }) } as never }
}

const OPTIONS = { options: { cloudflare_account_id: 'account', cloudflare_api_token: 'token' } }

test('a report is drawn whole while it is written, then as start, result and question', OPTIONS, async ($, on) => {
  on('env.get', () => ({ value: undefined }))
  on('clock.now', () => ({ value: 0 }))
  on('store.get', () => ({ value: undefined }))
  on('store.set', () => ({ value: undefined }))
  on('turn.complete', (_, e) => ({ text: e.answer }))
  on('http.fetch', () => answered('report', ROLES))
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>{e.component === 'AssistantMessage' ? e.props.text : ''}</Text>
  })

  const ui = await $.ui.mount(MESSAGE)
  expect((await ui.find({ type: 'Text' }))?.text).toBe(LINES.join('\n'))

  await $.turn.complete(TURN)

  expect((await ui.find({ type: 'Text' }))?.text).toBe([LINES[0], LINES[4], '', LINES[5]].join('\n'))
})

test('a message the model calls an answer stays whole', OPTIONS, async ($, on) => {
  on('env.get', () => ({ value: undefined }))
  on('clock.now', () => ({ value: 0 }))
  on('turn.complete', (_, e) => ({ text: e.answer }))
  on('http.fetch', () => answered('answer', []))
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>{e.component === 'AssistantMessage' ? e.props.text : ''}</Text>
  })

  const ui = await $.ui.mount(MESSAGE)
  await $.turn.complete(TURN)

  expect((await ui.find({ type: 'Text' }))?.text).toBe(LINES.join('\n'))
})

test('when the gateway cannot be reached the message stays whole', OPTIONS, async ($, on) => {
  on('env.get', () => ({ value: undefined }))
  on('clock.now', () => ({ value: 0 }))
  on('http.fetch', () => {
    throw new Error('offline')
  })
  on('turn.complete', (_, e) => ({ text: e.answer }))
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>{e.component === 'AssistantMessage' ? e.props.text : ''}</Text>
  })

  const ui = await $.ui.mount(MESSAGE)
  await $.turn.complete(TURN)

  expect((await ui.find({ type: 'Text' }))?.text).toBe(LINES.join('\n'))
})

test('without an API key the message stays whole and nothing is sent', async ($, on) => {
  on('env.get', () => ({ value: undefined }))
  let sent = 0
  on('clock.now', () => ({ value: 0 }))
  on('http.fetch', () => {
    sent += 1
    return answered('report', ROLES)
  })
  on('turn.complete', (_, e) => ({ text: e.answer }))
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>{e.component === 'AssistantMessage' ? e.props.text : ''}</Text>
  })

  const ui = await $.ui.mount(MESSAGE)
  await $.turn.complete(TURN)

  expect((await ui.find({ type: 'Text' }))?.text).toBe(LINES.join('\n'))
  expect(sent).toBe(0)
})

test('the environment variables send the judgement when the configuration is empty', async ($, on) => {
  const env: Record<string, string> = { CLOUDFLARE_ACCOUNT_ID: 'account', CLOUDFLARE_API_TOKEN: 'token' }
  on('env.get', (_, e) => ({ value: env[e.name] }))
  on('clock.now', () => ({ value: 0 }))
  on('store.get', () => ({ value: undefined }))
  on('store.set', () => ({ value: undefined }))
  on('http.fetch', () => answered('report', ROLES))
  on('turn.complete', (_, e) => ({ text: e.answer }))
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>{e.component === 'AssistantMessage' ? e.props.text : ''}</Text>
  })

  const ui = await $.ui.mount(MESSAGE)
  await $.turn.complete(TURN)

  expect((await ui.find({ type: 'Text' }))?.text).toBe([LINES[0], LINES[4], '', LINES[5]].join('\n'))
})
