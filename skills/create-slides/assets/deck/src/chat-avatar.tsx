import type { ReactNode } from "react";

type Avatar =
  | Readonly<{ kind: "image"; src: string }>
  | Readonly<{ kind: "initial"; text: string }>;

const ChatAvatar = ({ avatar, name }: Readonly<{ avatar: Avatar; name: string }>): ReactNode => {
  if (avatar.kind === "image") {
    return <img className="slack-avatar" src={avatar.src} alt={name} />;
  }
  return <span className="slack-avatar">{avatar.text}</span>;
};

export { ChatAvatar };
export type { Avatar };
