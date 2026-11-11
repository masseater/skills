import { useMemo } from "react";
import type { ReactNode } from "react";

import { progressState } from "./item-state";
import { eventPosition } from "./timeline-event";
import type { TimelineEvent } from "./timeline-event";

const RoadmapEvent = ({
  event,
  index,
  events,
  current,
}: Readonly<{
  event: TimelineEvent;
  index: number;
  events: number;
  current: number;
}>): ReactNode => {
  const style = useMemo(
    () => ({ left: `${String(eventPosition(index, events))}%` }),
    [index, events],
  );
  return (
    <li className="roadmap-event" data-state={progressState(index, current)} style={style}>
      <i />
      <b>{event.when}</b>
      <span>{event.title}</span>
      <small>{event.text}</small>
    </li>
  );
};

export { RoadmapEvent };
