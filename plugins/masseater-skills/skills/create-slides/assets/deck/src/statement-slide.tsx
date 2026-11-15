import type { ReactNode } from "react";

import { Frame } from "./frame";

export const StatementSlide = ({ children }: Readonly<{ children: ReactNode }>): ReactNode => (
  <Frame kind="statement">
    <p className="statement">{children}</p>
  </Frame>
);

