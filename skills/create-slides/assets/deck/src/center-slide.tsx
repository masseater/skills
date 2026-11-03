import type { ReactNode } from "react";

import { Frame } from "./frame";

const CenterSlide = ({
  children,
  note,
}: Readonly<{ children: ReactNode; note: ReactNode }>): ReactNode => (
  <Frame kind="center">
    <p className="center-text">{children}</p>
    <p className="center-note">{note}</p>
  </Frame>
);

export { CenterSlide };
