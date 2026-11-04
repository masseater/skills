import type { ReactNode } from "react";

import { Frame } from "./frame";

const QuestionSlide = ({
  children,
  lead,
}: Readonly<{ children: ReactNode; lead: string }>): ReactNode => (
  <Frame kind="question">
    <p className="question-lead">{lead}</p>
    <p className="question">{children}</p>
  </Frame>
);

export { QuestionSlide };
