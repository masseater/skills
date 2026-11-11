import type { ReactNode } from "react";

import { ChatPost } from "./chat-post";
import type { Post } from "./chat-post";

const placementOf = (previous: string | undefined, author: string): "head" | "follow" => {
  if (previous === author) {
    return "follow";
  }
  return "head";
};

const ChatLog = ({ posts }: Readonly<{ posts: readonly Post[] }>): ReactNode => {
  const previousAuthors = ["", ...posts.map((post) => post.author)];
  return (
    <ol className="slack-log">
      {posts.map((post, index) => (
        <ChatPost
          key={post.text}
          post={post}
          placement={placementOf(previousAuthors[index], post.author)}
        />
      ))}
    </ol>
  );
};

export { ChatLog };
