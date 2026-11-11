import type { ReactNode } from "react";

import { Icon } from "./icon";
import { progressState } from "./item-state";
import type { Step } from "./step";

const ONE = 1;

const StepItem = ({
  step,
  index,
  current,
}: Readonly<{ step: Step; index: number; current: number }>): ReactNode => (
  <li data-state={progressState(index, current)}>
    <b className="step-mark">{index + ONE}</b>
    <Icon src={step.icon ?? ""} />
    <span>{step.title}</span>
    <small>{step.text}</small>
  </li>
);

export { StepItem };
