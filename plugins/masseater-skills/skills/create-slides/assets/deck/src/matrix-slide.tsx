import type { ReactNode } from "react";

import { Frame } from "./frame";
import { MatrixPoint } from "./matrix-point";
import type { Point } from "./matrix-point";

const MatrixSlide = ({
  xLabel,
  yLabel,
  quadrants,
  points,
}: Readonly<{
  xLabel: string;
  yLabel: string;
  quadrants: readonly [string, string, string, string];
  points: readonly Point[];
}>): ReactNode => (
  <Frame kind="matrix">
    <div className="matrix">
      <div className="matrix-y">{yLabel}</div>
      <div className="matrix-x">{xLabel}</div>
      {quadrants.map((quadrant) => (
        <div key={quadrant} className="matrix-quadrant">
          {quadrant}
        </div>
      ))}
      {points.map((point) => (
        <MatrixPoint key={point.label} point={point} />
      ))}
      <div className="matrix-axis" data-axis="y" />
      <div className="matrix-axis" data-axis="x" />
    </div>
  </Frame>
);

export { MatrixSlide };
