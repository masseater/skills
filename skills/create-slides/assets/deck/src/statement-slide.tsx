import type { ReactNode } from "react";

import { Frame } from "./frame";

const StatementSlide = ({ children }: Readonly<{ children: ReactNode }>): ReactNode => (
  <Frame kind="statement">
    <p className="statement">{children}</p>
  </Frame>
);

export { StatementSlide };
