export const STYLE_SKILL = "masseater-style";

export const REASON = `終える前に、この作業の差分を \`${STYLE_SKILL}\` と照らし合わせること。\`${STYLE_SKILL}\` のスキルを読み、今回の状況に挙がっているスキルと規約に差分が反していないか確かめる。反していれば直してから終える。すでに照らし合わせて反していなければ、そのまま終える。`;

export type StopInput = {
  readonly stopHookActive: boolean;
  readonly masseaterRepository: boolean;
  readonly hasChanges: boolean;
};

export function decide(input: StopInput): { decision: "block"; reason: string } | undefined {
  if (input.stopHookActive || !input.masseaterRepository || !input.hasChanges) return undefined;
  return { decision: "block", reason: REASON };
}
