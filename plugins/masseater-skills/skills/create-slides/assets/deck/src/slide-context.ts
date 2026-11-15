import { createContext } from "react";

export type SlideContextValue = Readonly<{
  number: number;
  total: number;
  topic: string;
  footer: string;
  step: number;
}>;

export const SlideContext = createContext<SlideContextValue>({
  number: 1,
  total: 1,
  topic: "",
  footer: "",
  step: 0,
});

