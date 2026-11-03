type DeckView = "present" | "grid";

type DeckState = Readonly<{ view: DeckView; current: number; step: number }>;

const FORWARD = 1;
const BACKWARD = -1;
const FIRST = 0;
const OUTSIDE = -1;

const STEP_KEYS: ReadonlyMap<string, number> = new Map([
  ["ArrowRight", FORWARD],
  [" ", FORWARD],
  ["PageDown", FORWARD],
  ["ArrowLeft", BACKWARD],
  ["PageUp", BACKWARD],
]);

const toggleView = (view: DeckView): DeckView => {
  if (view === "grid") {
    return "present";
  }
  return "grid";
};

const VIEW_KEYS: ReadonlyMap<string, (view: DeckView) => DeckView> = new Map([
  ["g", toggleView],
  ["Escape", (): DeckView => "grid"],
]);

const lastStep = (steps: readonly number[], index: number): number => steps[index] ?? FIRST;

const forward = (state: DeckState, steps: readonly number[]): DeckState => {
  if (state.step < lastStep(steps, state.current)) {
    return { view: "present", current: state.current, step: state.step + FORWARD };
  }
  if (state.current + FORWARD < steps.length) {
    return { view: "present", current: state.current + FORWARD, step: FIRST };
  }
  return { ...state, view: "present" };
};

const backward = (state: DeckState, steps: readonly number[]): DeckState => {
  if (state.step > FIRST) {
    return { view: "present", current: state.current, step: state.step + BACKWARD };
  }
  if (state.current > FIRST) {
    const previous = state.current + BACKWARD;
    return { view: "present", current: previous, step: lastStep(steps, previous) };
  }
  return { ...state, view: "present" };
};

const moved = (state: DeckState, direction: number, steps: readonly number[]): DeckState => {
  if (direction === FORWARD) {
    return forward(state, steps);
  }
  return backward(state, steps);
};

const afterKey = (state: DeckState, key: string, steps: readonly number[]): DeckState => {
  const toView = VIEW_KEYS.get(key);
  if (typeof toView === "function") {
    return { ...state, view: toView(state.view) };
  }
  const direction = STEP_KEYS.get(key);
  if (typeof direction !== "number" || state.view === "grid") {
    return state;
  }
  return moved(state, direction, steps);
};

const afterClick = (
  state: DeckState,
  click: Readonly<{ index: number; step: number }>,
  steps: readonly number[],
): DeckState => {
  if (state.view === "present") {
    return moved(state, click.step, steps);
  }
  if (click.index === OUTSIDE) {
    return state;
  }
  return { view: "present", current: click.index, step: FIRST };
};

const stepOf = (index: number, state: DeckState, steps: readonly number[]): number => {
  if (index === state.current) {
    return state.step;
  }
  return lastStep(steps, index);
};

export { afterClick, afterKey, FIRST, FORWARD, OUTSIDE, stepOf };
export type { DeckState, DeckView };
