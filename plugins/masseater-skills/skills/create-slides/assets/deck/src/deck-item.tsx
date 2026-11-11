import { useMemo } from "react";
import type { ReactNode } from "react";

import type { DeckSlide } from "./deck-slide";
import { FORWARD } from "./deck-state";
import { PointOverlay } from "./point-overlay";
import { SlideContext } from "./slide-context";
import { contentSteps } from "./slide-steps";

const DeckItem = ({
  slide,
  index,
  total,
  footer,
  active,
  step,
}: Readonly<{
  slide: DeckSlide;
  index: number;
  total: number;
  footer: string;
  active: boolean;
  step: number;
}>): ReactNode => {
  const last = contentSteps(slide);
  const value = useMemo(
    () => ({
      number: index + FORWARD,
      total,
      topic: slide.topic,
      footer,
      step: Math.min(step, last),
    }),
    [index, total, slide.topic, footer, step, last],
  );
  return (
    <figure className="deck-item" data-index={index} data-active={active}>
      <div className="deck-stage">
        <SlideContext value={value}>{slide.content}</SlideContext>
        <PointOverlay text={slide.point ?? ""} shown={step > last} />
      </div>
      <figcaption>{slide.name}</figcaption>
    </figure>
  );
};

export { DeckItem };
