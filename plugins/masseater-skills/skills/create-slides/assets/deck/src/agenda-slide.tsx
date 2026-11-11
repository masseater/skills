import type { ReactNode } from "react";

import { AgendaItem } from "./agenda-item";
import { Frame } from "./frame";

const AgendaSlide = ({
  title,
  items,
  current,
}: Readonly<{ title: ReactNode; items: readonly string[]; current: number }>): ReactNode => (
  <Frame kind="agenda">
    <h2 className="slide-heading">{title}</h2>
    <ol className="agenda">
      {items.map((item, index) => (
        <AgendaItem key={item} item={item} index={index} current={current} />
      ))}
    </ol>
  </Frame>
);

export { AgendaSlide };
