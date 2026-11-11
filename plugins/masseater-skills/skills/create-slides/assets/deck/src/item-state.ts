type ItemState = "done" | "on" | "todo";

const progressState = (index: number, current: number): ItemState => {
  if (index < current) {
    return "done";
  }
  if (index === current) {
    return "on";
  }
  return "todo";
};

const pickState = (picked: boolean): ItemState => {
  if (picked) {
    return "on";
  }
  return "todo";
};

export { pickState, progressState };
export type { ItemState };
