import type { ReactNode } from "react";

import { Frame } from "./frame";

const ClosingSlide = ({
  children,
  contact,
}: Readonly<{ children: ReactNode; contact: string }>): ReactNode => (
  <Frame kind="closing">
    <p className="closing">{children}</p>
    <p className="closing-contact">{contact}</p>
  </Frame>
);

export { ClosingSlide };
