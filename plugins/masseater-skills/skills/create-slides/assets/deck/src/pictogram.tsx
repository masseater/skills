import type { ReactNode } from "react";

type PictogramName =
  | "arm"
  | "brain"
  | "book"
  | "building"
  | "camera"
  | "car"
  | "chat"
  | "check"
  | "chip"
  | "cloud"
  | "document"
  | "folder"
  | "gavel"
  | "globe"
  | "key"
  | "landmark"
  | "laptop"
  | "lock"
  | "person"
  | "robot"
  | "search"
  | "server"
  | "shield"
  | "table"
  | "wrench";

const PATHS: Readonly<Record<PictogramName, readonly string[]>> = {
  arm: [
    "M8 43 H30",
    "M12 43 V37 H26 V43",
    "M19 37 L14 24",
    "M11 21 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0",
    "M17 19 L32 11",
    "M32 11 L38 7 M32 11 L35 17",
  ],
  brain: [
    "M24 10 C20 5 11 6 11 13 C5 14 4 21 8 24 C4 28 6 35 12 35 C13 41 21 42 24 37 C27 42 35 41 36 35 C42 35 44 28 40 24 C44 21 43 14 37 13 C37 6 28 5 24 10 Z",
    "M24 10 V37",
    "M15 18 C18 19 19 22 17 25",
    "M33 18 C30 19 29 22 31 25",
    "M13 30 C16 28 19 30 19 33",
    "M35 30 C32 28 29 30 29 33",
  ],
  book: [
    "M5 12 C11 9 18 10 24 14 C30 10 37 9 43 12 V37 C37 34 30 35 24 39 C18 35 11 34 5 37 Z",
    "M24 14 V39",
    "M10 17 C13 16 16 16 19 18",
    "M10 23 C13 22 16 22 19 24",
    "M29 18 C32 16 35 16 38 17",
    "M29 24 C32 22 35 22 38 23",
  ],
  building: [
    "M10 42 V8 H30 V42",
    "M30 18 H40 V42",
    "M5 42 H43",
    "M15 14 H18 M22 14 H25 M15 21 H18 M22 21 H25 M15 28 H18 M22 28 H25",
    "M34 25 H36 M34 32 H36",
    "M17 42 V35 H23 V42",
  ],
  chat: ["M7 9 H41 V32 H22 L13 40 V32 H7 Z", "M14 17 H34", "M14 24 H28"],
  camera: ["M5 15 H15 L19 9 H29 L33 15 H43 V39 H5 Z", "M16 26 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0"],
  car: [
    "M5 34 V26 L11 15 H37 L43 26 V34 Z",
    "M5 26 H43",
    "M10 34 V39 H16 V34 M32 34 V39 H38 V34",
    "M10 30 H14 M34 30 H38",
  ],
  check: ["M9 25 L19 35 L39 13"],
  chip: [
    "M13 13 H35 V35 H13 Z",
    "M19 19 H29 V29 H19 Z",
    "M18 6 V13 M24 6 V13 M30 6 V13 M18 35 V42 M24 35 V42 M30 35 V42",
    "M6 18 H13 M6 24 H13 M6 30 H13 M35 18 H42 M35 24 H42 M35 30 H42",
  ],
  cloud: ["M14 36 C7 36 5 29 9 25 C8 18 16 14 21 18 C24 10 37 11 37 20 C44 20 45 36 36 36 Z"],
  document: [
    "M12 5 H30 L38 13 V43 H12 Z",
    "M30 5 V13 H38",
    "M17 21 H33",
    "M17 28 H33",
    "M17 35 H27",
  ],
  folder: ["M5 12 H18 L22 16 H43 V39 H5 Z", "M5 21 H43"],
  gavel: ["M14 14 L26 26", "M10 18 L22 6 L30 14 L18 26 Z", "M22 22 L38 38", "M8 43 H28"],
  globe: [
    "M7 24 a17 17 0 1 0 34 0 a17 17 0 1 0 -34 0",
    "M24 7 C15 15 15 33 24 41 C33 33 33 15 24 7",
    "M7 24 H41",
    "M10 15 H38 M10 33 H38",
  ],
  key: ["M7 24 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0", "M23 24 H42", "M35 24 V31 M41 24 V29"],
  landmark: [
    "M5 16 L24 6 L43 16 Z",
    "M9 20 V36 M17 20 V36 M31 20 V36 M39 20 V36",
    "M6 40 H42",
    "M4 44 H44",
  ],
  laptop: ["M11 11 H37 V31 H11 Z", "M5 37 H43 L40 31 H8 Z"],
  lock: ["M11 22 H37 V42 H11 Z", "M16 22 V15 C16 6 32 6 32 15 V22", "M24 29 V35"],
  person: ["M17 14 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0", "M9 43 C9 32 16 26 24 26 C32 26 39 32 39 43"],
  robot: [
    "M11 15 H37 V37 H11 Z",
    "M24 15 V8",
    "M17 24 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0 M26 24 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0",
    "M18 31 H30",
    "M11 22 H6 V30 H11 M37 22 H42 V30 H37",
  ],
  search: ["M9 20 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0", "M28 28 L41 41"],
  server: [
    "M9 7 H39 V19 H9 Z",
    "M9 19 H39 V31 H9 Z",
    "M9 31 H39 V43 H9 Z",
    "M14 13 H16 M14 25 H16 M14 37 H16",
    "M25 13 H34 M25 25 H34 M25 37 H34",
  ],
  shield: ["M24 5 L40 11 V23 C40 33 33 40 24 43 C15 40 8 33 8 23 V11 Z", "M17 24 L22 29 L31 19"],
  table: ["M6 9 H42 V39 H6 Z", "M6 18 H42", "M6 28 H42", "M18 9 V39", "M30 9 V39"],
  wrench: [
    "M31 6 C25 5 20 11 22 17 L7 32 C5 34 5 38 7 40 C9 42 13 42 15 40 L30 25 C36 27 42 22 41 16 L35 22 L29 20 L27 14 Z",
  ],
};

type PictogramPlace = Readonly<{ left: string; top: string; size: string }>;

const FILL: PictogramPlace = { left: "0", top: "0", size: "100%" };

const Pictogram = ({
  name,
  place = FILL,
}: Readonly<{ name: PictogramName; place?: PictogramPlace }>): ReactNode => (
  <svg
    className={`pictogram pictogram-${name}`}
    viewBox="0 0 48 48"
    x={place.left}
    y={place.top}
    width={place.size}
    height={place.size}
    aria-hidden="true"
  >
    {PATHS[name].map((path) => (
      <path key={path} d={path} />
    ))}
  </svg>
);

export { Pictogram };
export type { PictogramName, PictogramPlace };
