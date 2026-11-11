import { useMemo } from "react";
import type { ReactNode } from "react";

import type { GeoFrame } from "./geo-frame";
import type { MapArea, MapTone } from "./geo-map-data";

const MapLand = ({
  frame,
  areas,
}: Readonly<{ frame: GeoFrame; areas: readonly MapArea[] }>): ReactNode => {
  const tones = useMemo(
    () => new Map<string, MapTone>(areas.map((area) => [area.country, area.tone])),
    [areas],
  );
  return (
    <g className="geo-land">
      {frame.lands.map((land) => (
        <path key={land.key} d={land.outline} data-tone={tones.get(land.id) ?? "plain"} />
      ))}
    </g>
  );
};

export { MapLand };
