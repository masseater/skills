export type ItemState = "done" | "on" | "todo";

export const progressState = (index: number, current: number): ItemState => {
  if (index < current) {
    return "done";
  }
  if (index === current) {
    return "on";
  }
  return "todo";
};

export const pickState = (picked: boolean): ItemState => {
  if (picked) {
    return "on";
  }
  return "todo";
};

