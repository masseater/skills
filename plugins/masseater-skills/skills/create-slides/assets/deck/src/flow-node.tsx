import type { ReactNode } from "react";

import { pickState } from "./item-state";

type Node = Readonly<{ label: string; title: string; text: string }>;

const FlowNode = ({ node, highlight }: Readonly<{ node: Node; highlight: boolean }>): ReactNode => (
  <li className="flow-node" data-state={pickState(highlight)}>
    <span className="flow-label">{node.label}</span>
    <b>{node.title}</b>
    <span>{node.text}</span>
  </li>
);

export { FlowNode };
export type { Node };
