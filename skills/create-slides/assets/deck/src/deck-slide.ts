import type { ReactNode } from "react";

type DeckSlide = Readonly<{
  id: string;
  name: string;
  topic: string;
  content: ReactNode;
  steps?: number;
  point?: string;
}>;

export type { DeckSlide };
