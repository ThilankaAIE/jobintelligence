// web/components/chat/ChatLayout.tsx
import React from "react";

type Props = {
  left: React.ReactNode;
  right: React.ReactNode;
};

export default function ChatTwoPane({ left, right }: Props) {
  return (
    <div className="ji-twoPane">
      <section className="ji-leftPane">{left}</section>
      <aside className="ji-rightPane">{right}</aside>
    </div>
  );
}
