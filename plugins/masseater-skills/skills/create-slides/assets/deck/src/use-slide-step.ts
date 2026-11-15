import { use } from "react";

import { SlideContext } from "./slide-context";

export const useSlideStep = (): number => use(SlideContext).step;

