export type GeoPoint = Readonly<{ lon: number; lat: number }>;

export type MapView = Readonly<{ west: number; east: number; south: number; north: number }>;

export type MapTone = "plain" | "accent" | "alert";

export type MapArea = Readonly<{ country: string; tone: MapTone }>;

export type MapRoute = Readonly<{
  id: string;
  path: readonly GeoPoint[];
  tone: MapTone;
  line: "solid" | "dashed";
  head: "arrow" | "none";
}>;

export type MapPlace = Readonly<{
  id: string;
  at: GeoPoint;
  label: string;
  note: string;
  href: string;
  tone: MapTone;
  mark: "dot" | "cross" | "none";
  side: "right" | "left" | "top" | "bottom";
}>;

export type GeoMapData = Readonly<{
  view: MapView;
  areas: readonly MapArea[];
  routes: readonly MapRoute[];
  places: readonly MapPlace[];
}>;

