type TimelineEvent = Readonly<{ when: string; title: string; text: string }>;

const EDGE = 6;
const SPAN = 88;
const CENTER = 50;
const ONE = 1;

const eventPosition = (index: number, count: number): number => {
  if (count === ONE) {
    return CENTER;
  }
  return EDGE + (index * SPAN) / (count - ONE);
};

export { eventPosition };
export type { TimelineEvent };
