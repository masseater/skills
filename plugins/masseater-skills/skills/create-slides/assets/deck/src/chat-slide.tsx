import type { ReactNode } from "react";

import { ChatLog } from "./chat-log";
import type { Post } from "./chat-post";
import { Frame } from "./frame";

const ChatSlide = ({
  channel,
  date,
  posts,
}: Readonly<{ channel: string; date: string; posts: readonly Post[] }>): ReactNode => (
  <Frame kind="chat">
    <div className="slack">
      <p className="slack-channel">{`# ${channel}`}</p>
      <p className="slack-date">{date}</p>
      <ChatLog posts={posts} />
      <p className="slack-composer">{`#${channel} へのメッセージ`}</p>
    </div>
  </Frame>
);

export { ChatSlide };
