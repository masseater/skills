import type { ReactNode } from "react";

import { Frame } from "./frame";

const KeywordSlide = ({
  word,
  kicker,
  meaning,
}: Readonly<{ word: ReactNode; kicker: ReactNode; meaning: ReactNode }>): ReactNode => (
  <Frame kind="keyword">
    <p className="keyword-kicker">{kicker}</p>
    <p className="keyword-word">{word}</p>
    <p className="center-note">{meaning}</p>
  </Frame>
);

export { KeywordSlide };
