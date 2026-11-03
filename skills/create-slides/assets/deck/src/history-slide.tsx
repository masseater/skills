import type { ReactNode } from "react";

import { Frame } from "./frame";
import { HistoryItem } from "./history-item";
import type { TimelineEvent } from "./timeline-event";

const HistorySlide = ({
  title,
  events,
  current,
}: Readonly<{
  title: ReactNode;
  events: readonly TimelineEvent[];
  current: number;
}>): ReactNode => (
  <Frame kind="history">
    <h2 className="slide-heading">{title}</h2>
    <ol className="history">
      {events.map((event, index) => (
        <HistoryItem key={event.when} event={event} current={index === current} />
      ))}
    </ol>
  </Frame>
);

export { HistorySlide };
