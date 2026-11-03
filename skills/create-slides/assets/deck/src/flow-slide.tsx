import type { ReactNode } from "react";

import { FlowNode } from "./flow-node";
import type { Node } from "./flow-node";
import { Frame } from "./frame";

const FlowSlide = ({
  nodes,
  highlight,
  caption,
}: Readonly<{ nodes: readonly Node[]; highlight: number; caption: string }>): ReactNode => (
  <Frame kind="flow">
    <ol className="flow">
      {nodes.map((node, index) => (
        <FlowNode key={node.title} node={node} highlight={index === highlight} />
      ))}
    </ol>
    <p className="figure-caption">{caption}</p>
  </Frame>
);

export { FlowSlide };
