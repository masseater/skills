import type { ReactNode } from "react";

import { Frame } from "./frame";
import type { Step } from "./step";
import { StepItem } from "./step-item";

const StepsSlide = ({
  title,
  steps,
  current,
}: Readonly<{ title: ReactNode; steps: readonly Step[]; current: number }>): ReactNode => (
  <Frame kind="steps">
    <h2 className="slide-heading">{title}</h2>
    <ol className="steps">
      {steps.map((step, index) => (
        <StepItem key={step.title} step={step} index={index} current={current} />
      ))}
    </ol>
  </Frame>
);

export { StepsSlide };
