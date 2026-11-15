import type { ReactNode } from "react";

import { Frame } from "./frame";

export const TitleSlide = ({
  title,
  subtitle,
}: Readonly<{ title: ReactNode; subtitle: ReactNode }>): ReactNode => (
  <Frame kind="title">
    <h1 className="title-text">{title}</h1>
    <p className="title-sub">{subtitle}</p>
  </Frame>
);

