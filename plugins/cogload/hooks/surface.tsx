import { atom, read } from 'claude-code'

import type { On } from './context'

const report = atom({ plugin: 'cogload', key: 'report' } as const, null)

const PANE = 'cogload-full'

export function registerSurface(on: On): void {
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const current = await read($, report)
    if (e.props.hasSurvey || current === null) {
      return next(e)
    }

    const { Box, Button, Text } = $.ui.resolve(e)
    const [first, ...rest] = current.ask
    const line =
      first === undefined
        ? `詳細 ${current.dropped} 件を省略 `
        : `確認：${first}${rest.length > 0 ? ` ほか ${rest.length} 件` : ''} `

    return (
      <Box>
        <Text>{line}</Text>
        <Button key="full" label="全文" onPress={() => $.ui.open({ id: PANE, title: '全文' })} />
      </Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text } = $.ui.resolve(e)
    const current = await read($, report)

    return (
      <Box flexDirection="column">
        {(current?.full ?? '').split('\n').map(line => (
          <Text>{line === '' ? ' ' : line}</Text>
        ))}
      </Box>
    )
  })
}
