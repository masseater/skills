import { use } from "react";
import type { ReactNode } from "react";

import { SlideContext } from "./slide-context";

const PAD_LENGTH = 2;

const pad = (value: number): string => String(value).padStart(PAD_LENGTH, "0");

const Frame = ({ kind, children }: Readonly<{ kind: string; children: ReactNode }>): ReactNode => {
  const { number, total, topic, footer } = use(SlideContext);
  return (
    <div className={`slide slide-${kind}`}>
      <div className="slide-inner">{children}</div>
      <footer className="slide-foot">
        <b className="slide-topic">{topic}</b>
        <span className="slide-author">{footer}</span>
        <b className="slide-number">{pad(number)}</b>
        <span className="slide-total">{`/ ${pad(total)}`}</span>
      </footer>
    </div>
  );
};

export { Frame };
