import type { ReactNode } from "react";

import { pickState } from "./item-state";
import type { TimelineEvent } from "./timeline-event";

const HistoryItem = ({
  event,
  current,
}: Readonly<{ event: TimelineEvent; current: boolean }>): ReactNode => (
  <li className="history-item" data-state={pickState(current)}>
    <time>{event.when}</time>
    <div>
      <b>{event.title}</b>
      <span>{event.text}</span>
    </div>
  </li>
);

export { HistoryItem };
