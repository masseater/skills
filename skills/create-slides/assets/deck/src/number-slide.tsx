import type { ReactNode } from "react";

import { Frame } from "./frame";

const NumberSlide = ({
  value,
  unit,
  caption,
}: Readonly<{ value: string; unit: string; caption: ReactNode }>): ReactNode => (
  <Frame kind="numeral">
    <div className="number-value">
      {value}
      <small>{unit}</small>
    </div>
    <p className="number-caption">{caption}</p>
  </Frame>
);

export { NumberSlide };
