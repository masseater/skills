import type { ReactNode } from "react";

export const PointOverlay = ({ text, shown }: Readonly<{ text: string; shown: boolean }>): ReactNode => (
  <p className="deck-point" data-shown={shown}>
    {text}
  </p>
);

