export type Report = { ask: string[]; full: string; dropped: number }

declare module 'claude-code' {
  interface PluginState {
    cogload: { report: Report | null; skills: string[]; shown: Record<string, string>; published: boolean; figureAsked: boolean }
  }
}
