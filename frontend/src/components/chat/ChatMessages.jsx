import { useEffect, useLayoutEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const getScrollParent = (node) => {
  let el = node?.parentElement;
  while (el) {
    const { overflowY } = getComputedStyle(el);
    if (overflowY === "auto" || overflowY === "scroll") return el;
    el = el.parentElement;
  }
  return null;
};

const ChatMessages = ({ messages, loading }) => {
  const rootRef = useRef(null);
  const scrollerRef = useRef(null);
  const pinnedRef = useRef(true);
  const firstRunRef = useRef(true);

  // Track whether the user is following along at the bottom.
  useEffect(() => {
    const scroller = getScrollParent(rootRef.current);
    scrollerRef.current = scroller;
    if (!scroller) return;

    const onScroll = () => {
      const gap = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
      pinnedRef.current = gap < 120;
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !pinnedRef.current) return;

    scroller.scrollTo({
      top: scroller.scrollHeight,
      // instant while streaming (smooth on every token jitters)
      behavior: firstRunRef.current || loading ? "auto" : "smooth",
    });
    firstRunRef.current = false;
  }, [messages, loading]);

  return (
    <div ref={rootRef} className="space-y-6 py-4">
      {messages.map((msg, index) => (
        <MessageBubble
          key={msg.id ?? index}
          role={msg.role}
          content={msg.content}
          type={msg.type}
          image={msg.image}
        />
      ))}

      {/* typing dots only until the first word of the reply arrives */}
      {loading && messages[messages.length - 1]?.role === "user" && (
        <div className="flex items-center gap-1.5 py-1" aria-label="Assistant is thinking">
          <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400" />
        </div>
      )}
    </div>
  );
};

export default ChatMessages;