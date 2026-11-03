import type { ReactNode } from "react";

import { ChatAvatar } from "./chat-avatar";
import type { Avatar } from "./chat-avatar";

type Post = Readonly<{
  author: string;
  avatar: Avatar;
  time: string;
  text: string;
  format: "plain" | "strike" | "emoji";
  reactions: readonly Readonly<{ emoji: string; count: number; by: "me" | "others" }>[];
}>;

const ChatPost = ({
  post,
  placement,
}: Readonly<{ post: Post; placement: "head" | "follow" }>): ReactNode => (
  <li className="slack-post" data-placement={placement} data-format={post.format}>
    <ChatAvatar avatar={post.avatar} name={post.author} />
    <b className="slack-author">{post.author}</b>
    <time className="slack-time">{post.time}</time>
    <p className="slack-text">{post.text}</p>
    <ul className="slack-reactions">
      {post.reactions.map((reaction) => (
        <li key={reaction.emoji} className="slack-reaction" data-by={reaction.by}>
          {`${reaction.emoji} ${reaction.count}`}
        </li>
      ))}
    </ul>
  </li>
);

export { ChatPost };
export type { Post };
