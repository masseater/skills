import type { ReactNode } from "react";

import { Icon } from "./icon";

export type Side = Readonly<{ label: string; items: readonly string[]; icon?: string }>;

export const CompareSide = ({ side, kind }: Readonly<{ side: Side; kind: string }>): ReactNode => (
  <div className={`compare-${kind}`}>
    <Icon src={side.icon ?? ""} />
    <span className="compare-tag">{side.label}</span>
    <ul>
      {side.items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

