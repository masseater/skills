import { geoMercator, geoPath } from "d3-geo";
import type { MultiPoint } from "geojson";

import { countries } from "./geo-land";
import type { GeoPoint, MapView } from "./geo-map-data";

type ScreenPoint = readonly [left: number, top: number];

type LandShape = Readonly<{ key: string; id: string; outline: string }>;

type GeoFrame = Readonly<{
  width: number;
  height: number;
  lands: readonly LandShape[];
  place: (point: GeoPoint) => ScreenPoint;
}>;

const WIDTH = 1000;
const STEPS = 8;
const SAMPLES = 9;
const ZERO = 0;
const ORIGIN: ScreenPoint = [ZERO, ZERO];

const edgePoints = (view: MapView): MultiPoint => ({
  type: "MultiPoint",
  coordinates: Array.from({ length: SAMPLES }, (_value, step) => {
    const longitude = view.west + ((view.east - view.west) * step) / STEPS;
    const latitude = view.south + ((view.north - view.south) * step) / STEPS;
    return [
      [longitude, view.south],
      [longitude, view.north],
      [view.west, latitude],
      [view.east, latitude],
    ];
  }).flat(),
});

const frameOf = (view: MapView): GeoFrame => {
  const edges = edgePoints(view);
  const projection = geoMercator().fitWidth(WIDTH, edges);
  const [[, top], [, bottom]] = geoPath(projection).bounds(edges);
  const height = Math.ceil(bottom - top);
  const extent: [[number, number], [number, number]] = [
    [ZERO, ZERO],
    [WIDTH, height],
  ];
  projection.fitExtent(extent, edges).clipExtent(extent);
  const path = geoPath(projection);
  return {
    width: WIDTH,
    height,
    lands: countries().flatMap((country, index) => {
      const outline = path(country) ?? "";
      if (outline === "") {
        return [];
      }
      const id = String(country.id ?? index);
      return [{ key: `${id}-${String(index)}`, id, outline }];
    }),
    place: ({ lon, lat }) => projection([lon, lat]) ?? ORIGIN,
  };
};

export { frameOf, ORIGIN };
export type { GeoFrame, LandShape, ScreenPoint };
