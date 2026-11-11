import { createContext } from "react";

type SlideContextValue = Readonly<{
  number: number;
  total: number;
  topic: string;
  footer: string;
  step: number;
}>;

const SlideContext = createContext<SlideContextValue>({
  number: 1,
  total: 1,
  topic: "",
  footer: "",
  step: 0,
});

export { SlideContext };
export type { SlideContextValue };
