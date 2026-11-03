import { useEffect, useState } from "react";

import { afterClick, afterKey, FIRST, FORWARD, OUTSIDE } from "./deck-state";
import type { DeckState, DeckView } from "./deck-state";

const HALVES = 2;

const itemIndex = (target: unknown): number => {
  if (!(target instanceof Element)) {
    return OUTSIDE;
  }
  const item = target.closest(".deck-item");
  if (!(item instanceof HTMLElement)) {
    return OUTSIDE;
  }
  return Number(item.dataset["index"] ?? OUTSIDE);
};

const clickStep = (target: unknown, clientX: number): number => {
  if (!(target instanceof Element)) {
    return FORWARD;
  }
  const deck = target.closest(".deck") ?? target;
  const { left, width } = deck.getBoundingClientRect();
  return Math.sign(clientX - left - width / HALVES) || FORWARD;
};

const useDeckState = (view: DeckView, steps: readonly number[]): DeckState => {
  const [state, setState] = useState<DeckState>({ view, current: FIRST, step: FIRST });

  useEffect(() => {
    const controller = new AbortController();
    globalThis.addEventListener(
      "keydown",
      (event) => {
        setState((previous) => afterKey(previous, event.key, steps));
      },
      { signal: controller.signal },
    );
    globalThis.addEventListener(
      "click",
      (event) => {
        const click = {
          index: itemIndex(event.target),
          step: clickStep(event.target, event.clientX),
        };
        setState((previous) => afterClick(previous, click, steps));
      },
      { signal: controller.signal },
    );
    return (): void => {
      controller.abort();
    };
  }, [steps]);

  return state;
};

export { useDeckState };
