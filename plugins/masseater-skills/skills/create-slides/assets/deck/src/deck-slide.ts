import type { ReactNode } from "react";

export type DeckSlide = Readonly<{
  id: string;
  name: string;
  topic: string;
  content: ReactNode;
  steps?: number;
  point?: string;
}>;

