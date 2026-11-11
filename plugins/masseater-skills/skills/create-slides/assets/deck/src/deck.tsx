import { useMemo } from "react";
import type { ReactNode } from "react";

import { DeckItem } from "./deck-item";
import type { DeckSlide } from "./deck-slide";
import { stepOf } from "./deck-state";
import type { DeckView } from "./deck-state";
import { insertPhraseBreaks } from "./phrase-breaks";
import { totalSteps } from "./slide-steps";
import { useDeckState } from "./use-deck-state";

const Deck = ({
  slides,
  footer,
  view,
}: Readonly<{ slides: readonly DeckSlide[]; footer: string; view: DeckView }>): ReactNode => {
  const steps = useMemo(() => slides.map((slide) => totalSteps(slide)), [slides]);
  const state = useDeckState(view, steps);
  return (
    <div className="deck" data-view={state.view} ref={insertPhraseBreaks}>
      {slides.map((slide, index) => (
        <DeckItem
          key={slide.id}
          slide={slide}
          index={index}
          total={slides.length}
          footer={footer}
          active={index === state.current}
          step={stepOf(index, state, steps)}
        />
      ))}
    </div>
  );
};

export { Deck };
