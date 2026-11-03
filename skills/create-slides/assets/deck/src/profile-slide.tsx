import type { ReactNode } from "react";

import { Frame } from "./frame";

const ProfileSlide = ({
  name,
  reading,
  tagline,
  image,
}: Readonly<{
  name: string;
  reading: ReactNode;
  tagline: ReactNode;
  image: string;
}>): ReactNode => (
  <Frame kind="profile">
    <img className="profile-image" src={image} alt={name} />
    <p className="profile-reading">{reading}</p>
    <h1 className="profile-name">{name}</h1>
    <p className="profile-role">{tagline}</p>
  </Frame>
);

export { ProfileSlide };
