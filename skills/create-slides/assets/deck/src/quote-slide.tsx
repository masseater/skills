import type { ReactNode } from "react";

import { Frame } from "./frame";

const QuoteSlide = ({
  children,
  cite,
}: Readonly<{ children: ReactNode; cite: string }>): ReactNode => (
  <Frame kind="quote">
    <blockquote className="quote">
      <p>{children}</p>
      <cite className="quote-cite">{cite}</cite>
    </blockquote>
  </Frame>
);

export { QuoteSlide };
