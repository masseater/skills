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
  return {
    value: {
      status: 200,
      ok: true,
      headers: {},
      text: JSON.stringify({
        result: {
          answers: {
            kind: { type: 'choice', choice: kind, probabilities: { [kind]: CONFIDENT } },
            ...Object.fromEntries(
              roles.map((choice, index) => [
                `s${index}`,
                { type: 'choice', choice, probabilities: { [choice]: CONFIDENT } },
              ]),
            ),
          },
        },
      }),
    },
  }
}

test('a report is drawn whole while it is written, then as start, result and question', async ($, on) => {
  on('env.get', () => ({ value: 'x' }))
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

test('a message the model calls an answer stays whole', async ($, on) => {
  on('env.get', () => ({ value: 'x' }))
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

test('without a Cloudflare token the message stays whole', async ($, on) => {
  on('env.get', () => ({ value: undefined }))
  on('turn.complete', (_, e) => ({ text: e.answer }))
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>{e.component === 'AssistantMessage' ? e.props.text : ''}</Text>
  })

  const ui = await $.ui.mount(MESSAGE)
  await $.turn.complete(TURN)

  expect((await ui.find({ type: 'Text' }))?.text).toBe(LINES.join('\n'))
})
