import type { ReactNode } from "react";

import { Frame } from "./frame";
import { LayerItem } from "./layer-item";
import type { Layer } from "./layer-item";

const LayersSlide = ({
  layers,
  direction,
}: Readonly<{ layers: readonly Layer[]; direction: string }>): ReactNode => (
  <Frame kind="layers">
    <ol className="layers">
      {layers.map((layer) => (
        <LayerItem key={layer.name} layer={layer} />
      ))}
    </ol>
    <div className="layers-direction">
      <span>{direction}</span>
      <i className="arrow" />
    </div>
  </Frame>
);

export { LayersSlide };
