import { useMemo } from "react";
import type { ReactNode } from "react";

import { pickState } from "./item-state";

export type Point = Readonly<{ left: number; top: number; label: string; highlight: boolean }>;

export const MatrixPoint = ({ point }: Readonly<{ point: Point }>): ReactNode => {
  const style = useMemo(
    () => ({ left: `${String(point.left)}%`, top: `${String(point.top)}%` }),
    [point.left, point.top],
  );
  return (
    <i className="matrix-point" data-state={pickState(point.highlight)} style={style}>
      <span>{point.label}</span>
    </i>
  );
};

