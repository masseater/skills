import type { ReactNode } from "react";

import { Frame } from "./frame";

const BulletsSlide = ({
  title,
  items,
}: Readonly<{ title: ReactNode; items: readonly string[] }>): ReactNode => (
  <Frame kind="bullets">
    <h2 className="slide-heading">{title}</h2>
    <ol className="bullets">
      {items.map((item) => (
        <li key={item} className="bullet">
          {item}
        </li>
      ))}
    </ol>
  </Frame>
);

export { BulletsSlide };
