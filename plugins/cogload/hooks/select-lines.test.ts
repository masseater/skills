import { expect, test } from 'claude-code/testing'

import { compose, splitUnits } from './select-lines'

test('a fenced block, a table and a heading are units the model does not judge', async () => {
  const units = splitUnits(
    ['# 見出し', '直します。', '```ts', 'const a = 1', '', 'const b = 2', '```', '| a | b |', '| - | - |', '', '直しました。'].join('\n'),
  )

  expect(units.map(unit => unit.isJudged)).toEqual([false, true, false, false, true])
  expect(units[2]?.text).toBe('```ts\nconst a = 1\n\nconst b = 2\n```')
})

test('questions move to the end and details are dropped', async () => {
  const units = splitUnits(['直します。', 'よいですか。', '読みました。', '直しました。'].join('\n'))
  const composed = compose(units, ['start', 'ask', 'detail', 'done'])

  expect(composed.shown).toBe('直します。\n直しました。\n\nよいですか。')
  expect(composed.ask).toEqual(['よいですか。'])
  expect(composed.dropped).toBe(1)
})
