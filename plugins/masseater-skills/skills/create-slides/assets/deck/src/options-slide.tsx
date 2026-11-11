import type { ReactNode } from "react";

import { Frame } from "./frame";
import { OptionCard } from "./option-card";
import type { Option } from "./option-card";

const OptionsSlide = ({
  title,
  options,
  recommended,
}: Readonly<{ title: ReactNode; options: readonly Option[]; recommended: number }>): ReactNode => (
  <Frame kind="options">
    <h2 className="slide-heading">{title}</h2>
    <div className="options">
      {options.map((option, index) => (
        <OptionCard key={option.title} option={option} recommended={index === recommended} />
      ))}
    </div>
  </Frame>
);

export { OptionsSlide };
