import type { ReactNode } from "react";

import { CompareSide } from "./compare-side";
import type { Side } from "./compare-side";
import { Frame } from "./frame";

const CompareSlide = ({
  title,
  before,
  after,
}: Readonly<{ title: ReactNode; before: Side; after: Side }>): ReactNode => (
  <Frame kind="compare">
    <h2 className="slide-heading">{title}</h2>
    <div className="compare">
      <CompareSide side={before} kind="before" />
      <CompareSide side={after} kind="after" />
    </div>
  </Frame>
);

export { CompareSlide };
