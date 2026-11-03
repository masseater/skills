import type { ReactNode } from "react";

import { Icon } from "./icon";
import { pickState } from "./item-state";

type Option = Readonly<{ tag: string; title: string; text: string; icon?: string }>;

const OptionCard = ({
  option,
  recommended,
}: Readonly<{ option: Option; recommended: boolean }>): ReactNode => (
  <div className="option-card" data-state={pickState(recommended)}>
    <Icon src={option.icon ?? ""} />
    <small>{option.tag}</small>
    <b>{option.title}</b>
    <p>{option.text}</p>
  </div>
);

export { OptionCard };
export type { Option };
