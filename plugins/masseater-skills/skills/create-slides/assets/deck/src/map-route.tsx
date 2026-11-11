import { useMemo } from "react";
import type { ReactNode } from "react";

import { ORIGIN } from "./geo-frame";
import type { GeoFrame, ScreenPoint } from "./geo-frame";
import type { MapRoute as Route } from "./geo-map-data";

const HEAD = 14;
const SPREAD = 0.45;
const LAST = -1;
const BEFORE_LAST = -2;

const arrowHead = ([fromX, fromY]: ScreenPoint, [toX, toY]: ScreenPoint): string => {
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const corner = (turn: number): string =>
    `${String(toX - HEAD * Math.cos(angle + turn))} ${String(toY - HEAD * Math.sin(angle + turn))}`;
  return `M${String(toX)} ${String(toY)} L${corner(SPREAD)} L${corner(-SPREAD)} Z`;
};

const MapRoute = ({ frame, route }: Readonly<{ frame: GeoFrame; route: Route }>): ReactNode => {
  const shape = useMemo(() => {
    const points = route.path.map((point) => frame.place(point));
    const line = `M${points.map((point) => point.join(" ")).join(" L")}`;
    const last = points.at(LAST) ?? ORIGIN;
    const before = points.at(BEFORE_LAST) ?? last;
    return { line, head: arrowHead(before, last) };
  }, [frame, route.path]);
  return (
    <g className="geo-route" data-tone={route.tone} data-line={route.line} data-head={route.head}>
      <path className="geo-route-line" d={shape.line} />
      <path className="geo-route-head" d={shape.head} />
    </g>
  );
};

export { MapRoute };
