import { useMemo } from "react";
import type { ReactNode } from "react";

import { frameOf } from "./geo-frame";
import type { GeoMapData } from "./geo-map-data";
import { MapLand } from "./map-land";
import { MapPlace } from "./map-place";
import { MapRoute } from "./map-route";

const GeoMap = ({ map }: Readonly<{ map: GeoMapData }>): ReactNode => {
  const frame = useMemo(() => frameOf(map.view), [map.view]);
  const style = useMemo(
    () => ({ aspectRatio: `${String(frame.width)} / ${String(frame.height)}` }),
    [frame],
  );
  return (
    <div className="geo-map" style={style}>
      <svg viewBox={`0 0 ${String(frame.width)} ${String(frame.height)}`} aria-hidden="true">
        <MapLand frame={frame} areas={map.areas} />
        {map.routes.map((route) => (
          <MapRoute key={route.id} frame={frame} route={route} />
        ))}
      </svg>
      {map.places.map((place) => (
        <MapPlace key={place.id} frame={frame} place={place} />
      ))}
    </div>
  );
};

export { GeoMap };
