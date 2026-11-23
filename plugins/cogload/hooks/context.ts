import type { Hook, On } from 'claude-code'

export type { On }

export type HookContext = Parameters<Hook<'classic.MessageDisplay'>>[0]
