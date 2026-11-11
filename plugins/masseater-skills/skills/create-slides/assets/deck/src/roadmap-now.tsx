import { useMemo } from "react";
import type { ReactNode } from "react";

import { eventPosition } from "./timeline-event";

const ONE = 1;
const HALF = 2;

const nowPosition = (current: number, events: number): number =>
  (eventPosition(current, events) + eventPosition(current + ONE, events)) / HALF;

const nowSide = (current: number, events: number): "middle" | "end" => {
  if (current + ONE < events) {
    return "middle";
  }
  return "end";
};

const RoadmapNow = ({
  label,
  current,
  events,
}: Readonly<{ label: string; current: number; events: number }>): ReactNode => {
  const style = useMemo(
    () => ({ left: `${String(nowPosition(current, events))}%` }),
    [current, events],
  );
  return (
    <li className="roadmap-now" data-side={nowSide(current, events)} style={style}>
      {label}
    </li>
  );
};

export { RoadmapNow };
