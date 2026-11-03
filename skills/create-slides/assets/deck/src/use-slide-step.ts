import { use } from "react";

import { SlideContext } from "./slide-context";

const useSlideStep = (): number => use(SlideContext).step;

export { useSlideStep };
