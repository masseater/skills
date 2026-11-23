export type Role = 'start' | 'done' | 'ask' | 'detail'

export type Unit = { text: string; isJudged: boolean }

const FENCE = /^\s*(```|~~~)/
const TABLE = /^\s*\|/
const HEADING = /^\s*#{1,6}\s/

export function splitUnits(message: string): Unit[] {
  const units: Unit[] = []
  let block: string[] | null = null
  let isFenced = false

  const closeBlock = () => {
    if (block !== null) {
      units.push({ text: block.join('\n'), isJudged: false })
      block = null
    }
  }

  for (const line of message.split('\n')) {
    if (isFenced) {
      block?.push(line)
      if (FENCE.test(line)) {
        isFenced = false
        closeBlock()
      }
    } else if (FENCE.test(line)) {
      closeBlock()
      block = [line]
      isFenced = true
    } else if (TABLE.test(line)) {
      block = block ?? []
      block.push(line)
    } else {
      closeBlock()
      if (line.trim() !== '') {
        units.push({ text: line, isJudged: !HEADING.test(line) })
      }
    }
  }
  closeBlock()

  return units
}

export type Composed = { shown: string; ask: string[]; dropped: number }

export function compose(units: readonly Unit[], roles: readonly Role[]): Composed {
  const body: string[] = []
  const ask: string[] = []
  let dropped = 0

  units.forEach((unit, index) => {
    const role = roles[index] ?? 'detail'
    if (role === 'ask') {
      ask.push(unit.text)
    } else if (role === 'detail') {
      dropped += 1
    } else {
      body.push(unit.text)
    }
  })

  const shown = [body.join('\n'), ask.join('\n')].filter(part => part !== '').join('\n\n')

  return { shown, ask, dropped }
}
