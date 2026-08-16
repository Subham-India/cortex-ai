import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const ChatMessages = ({ messages, loading }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {messages.map((msg, index) => (
        <MessageBubble key={index} role={msg.role} content={msg.content} />
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="px-4 py-3 rounded-2xl bg-[#e5e5e3] text-gray-500">
            Thinking...
          </div>
        </div>
      )}

      {/* invisible anchor - scrolling to this element scrolls the container to the bottom */}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;