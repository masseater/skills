import type { ReactNode } from "react";

import { Frame } from "./frame";
import { RoadmapEvent } from "./roadmap-event";
import { RoadmapNow } from "./roadmap-now";
import type { TimelineEvent } from "./timeline-event";

const RoadmapSlide = ({
  title,
  events,
  current,
  nowLabel,
}: Readonly<{
  title: ReactNode;
  events: readonly TimelineEvent[];
  current: number;
  nowLabel: string;
}>): ReactNode => (
  <Frame kind="roadmap">
    <h2 className="slide-heading">{title}</h2>
    <ol className="roadmap">
      <RoadmapNow label={nowLabel} current={current} events={events.length} />
      {events.map((event, index) => (
        <RoadmapEvent
          key={event.when}
          event={event}
          index={index}
          events={events.length}
          current={current}
        />
      ))}
    </ol>
  </Frame>
);

export { RoadmapSlide };
