import { useMemo } from "react";
import type { ReactNode } from "react";

import type { GeoFrame } from "./geo-frame";
import type { MapPlace as Place } from "./geo-map-data";

const PERCENT = 100;

const MapPlace = ({ frame, place }: Readonly<{ frame: GeoFrame; place: Place }>): ReactNode => {
  const style = useMemo(() => {
    const [left, top] = frame.place(place.at);
    return {
      left: `${String((left / frame.width) * PERCENT)}%`,
      top: `${String((top / frame.height) * PERCENT)}%`,
    };
  }, [frame, place.at]);
  return (
    <a
      className="geo-place"
      href={place.href}
      target="_blank"
      rel="noreferrer"
      data-mark={place.mark}
      data-side={place.side}
      data-tone={place.tone}
      style={style}
    >
      <b>{place.label}</b>
      <span>{place.note}</span>
    </a>
  );
};

export { MapPlace };
