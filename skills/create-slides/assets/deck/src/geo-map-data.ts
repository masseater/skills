type GeoPoint = Readonly<{ lon: number; lat: number }>;

type MapView = Readonly<{ west: number; east: number; south: number; north: number }>;

type MapTone = "plain" | "accent" | "alert";

type MapArea = Readonly<{ country: string; tone: MapTone }>;

type MapRoute = Readonly<{
  id: string;
  path: readonly GeoPoint[];
  tone: MapTone;
  line: "solid" | "dashed";
  head: "arrow" | "none";
}>;

type MapPlace = Readonly<{
  id: string;
  at: GeoPoint;
  label: string;
  note: string;
  href: string;
  tone: MapTone;
  mark: "dot" | "cross" | "none";
  side: "right" | "left" | "top" | "bottom";
}>;

type GeoMapData = Readonly<{
  view: MapView;
  areas: readonly MapArea[];
  routes: readonly MapRoute[];
  places: readonly MapPlace[];
}>;

export type { GeoMapData, GeoPoint, MapArea, MapPlace, MapRoute, MapTone, MapView };
