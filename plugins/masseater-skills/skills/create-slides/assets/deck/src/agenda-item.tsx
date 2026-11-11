import type { ReactNode } from "react";

import { progressState } from "./item-state";

const NUMBER_LENGTH = 2;
const ONE = 1;

const AgendaItem = ({
  item,
  index,
  current,
}: Readonly<{ item: string; index: number; current: number }>): ReactNode => (
  <li data-state={progressState(index, current)}>
    <b>{String(index + ONE).padStart(NUMBER_LENGTH, "0")}</b>
    {item}
  </li>
);

export { AgendaItem };
