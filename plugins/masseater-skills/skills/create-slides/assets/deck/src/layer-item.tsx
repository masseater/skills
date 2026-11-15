import type { ReactNode } from "react";

export type Layer = Readonly<{ name: string; text: string; note: string }>;

export const LayerItem = ({ layer }: Readonly<{ layer: Layer }>): ReactNode => (
  <li className="layer">
    <b>{layer.name}</b>
    <span>{layer.text}</span>
    <em>{layer.note}</em>
  </li>
);

