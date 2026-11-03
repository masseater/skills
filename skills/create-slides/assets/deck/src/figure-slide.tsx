import type { ReactNode } from "react";

import { Frame } from "./frame";

const FigureSlide = ({
  title,
  children,
}: Readonly<{ title: ReactNode; children: ReactNode }>): ReactNode => (
  <Frame kind="figure">
    <h2 className="slide-heading">{title}</h2>
    <div className="figure">{children}</div>
  </Frame>
);

export { FigureSlide };
