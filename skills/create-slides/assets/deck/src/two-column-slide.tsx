import type { ReactNode } from "react";

import { Frame } from "./frame";

const TwoColumnSlide = ({
  title,
  text,
  code,
}: Readonly<{ title: ReactNode; text: ReactNode; code: string }>): ReactNode => (
  <Frame kind="two-column">
    <h2 className="slide-heading">{title}</h2>
    <div className="columns">
      <div>{text}</div>
      <pre className="panel">{code}</pre>
    </div>
  </Frame>
);

export { TwoColumnSlide };
