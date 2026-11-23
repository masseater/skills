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

const BASE = {
  hook_event_name: 'MessageDisplay',
  session_id: 's',
  transcript_path: '/t',
  cwd: '/',
  turn_id: 't',
  message_id: 'm',
} as const

test('a report is held until its last batch, then shown as start, result and question', async ($, on) => {
  on('env.get', () => ({ value: 'x' }))
  on('clock.now', () => ({ value: 0 }))
  on('store.get', () => ({ value: undefined }))
  on('store.set', () => ({ value: undefined }))
  on('classic.MessageDisplay', () => ({}))
  on('http.fetch', () => ({
    value: {
      status: 200,
      ok: true,
      headers: {},
      text: JSON.stringify({
        result: {
          answers: {
            kind: { type: 'choice', choice: 'report', probabilities: { report: CONFIDENT } },
            ...Object.fromEntries(
              ROLES.map((choice, index) => [
                `s${index}`,
                { type: 'choice', choice, probabilities: { [choice]: CONFIDENT } },
              ]),
            ),
          },
        },
      }),
    },
  }))

  const held = await $.classic.MessageDisplay({
    ...BASE,
    index: 0,
    final: false,
    delta: `${LINES.slice(0, 3).join('\n')}\n`,
  })
  expect(held.displayContent).toBe('')

  const shown = await $.classic.MessageDisplay({
    ...BASE,
    index: 1,
    final: true,
    delta: LINES.slice(3).join('\n'),
  })
  expect(shown.displayContent).toBe([LINES[0], LINES[4], '', LINES[5]].join('\n'))
})

test('a message the model calls an answer is shown whole', async ($, on) => {
  on('env.get', () => ({ value: 'x' }))
  on('clock.now', () => ({ value: 0 }))
  on('classic.MessageDisplay', () => ({}))
  on('http.fetch', () => ({
    value: {
      status: 200,
      ok: true,
      headers: {},
      text: JSON.stringify({
        result: { answers: { kind: { type: 'choice', choice: 'answer', probabilities: { answer: CONFIDENT } } } },
      }),
    },
  }))

  const shown = await $.classic.MessageDisplay({ ...BASE, index: 0, final: true, delta: LINES.join('\n') })
  expect(shown.displayContent).toBe(LINES.join('\n'))
})

test('without a Cloudflare token the message is shown whole', async ($, on) => {
  on('env.get', () => ({ value: undefined }))
  on('classic.MessageDisplay', () => ({}))

  const shown = await $.classic.MessageDisplay({ ...BASE, index: 0, final: true, delta: LINES.join('\n') })
  expect(shown.displayContent).toBe(LINES.join('\n'))
})
