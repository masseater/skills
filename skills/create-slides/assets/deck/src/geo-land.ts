import type { Feature } from "geojson";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-50m.json";

type Atlas = Topology<{ countries: GeometryCollection<{ name: string }> }>;

const isAtlas = (value: unknown): value is Atlas =>
  typeof value === "object" && value !== null && "arcs" in value && "objects" in value;

const atlas: unknown = world;

const countries = (): readonly Feature[] => {
  if (!isAtlas(atlas)) {
    return [];
  }
  return feature(atlas, atlas.objects.countries).features;
};

export { countries };
