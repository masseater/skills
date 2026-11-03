import type { ReactNode } from "react";

import { useSlideStep } from "./use-slide-step";

const Reveal = ({ at, children }: Readonly<{ at: number; children: ReactNode }>): ReactNode => {
  const step = useSlideStep();
  return (
    <div className="reveal" data-shown={step >= at}>
      {children}
    </div>
  );
};

export { Reveal };
