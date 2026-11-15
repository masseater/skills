import { useMemo } from "react";
import type { ReactNode } from "react";

const NONE = "";

export const Icon = ({ src }: Readonly<{ src: string }>): ReactNode => {
  const style = useMemo(() => ({ maskImage: `url("${src}")` }), [src]);
  return <i className="deck-icon" style={style} hidden={src === NONE} />;
};

