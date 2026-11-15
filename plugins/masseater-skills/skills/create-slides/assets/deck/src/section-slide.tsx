import type { ReactNode } from "react";

import { Frame } from "./frame";

export const SectionSlide = ({
  number,
  title,
}: Readonly<{ number: string; title: ReactNode }>): ReactNode => (
  <Frame kind="section">
    <div className="section-number">{number}</div>
    <h2 className="section-title">{title}</h2>
  </Frame>
);

