import type { DeckSlide } from "./deck-slide";
import { FIRST, FORWARD } from "./deck-state";

export const contentSteps = (slide: DeckSlide): number => slide.steps ?? FIRST;

export const totalSteps = (slide: DeckSlide): number => {
  if (typeof slide.point === "string") {
    return contentSteps(slide) + FORWARD;
  }
  return contentSteps(slide);
};

