import { useState } from "react";
import axios from "axios";

/* --- Inline icon components --- */
const Icon = ({ children, size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const PanelLeft = (p) => (
  <Icon {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
  </Icon>
);
const Plus = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);
const GitBranch = (p) => (
  <Icon {...p}>
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </Icon>
);
const LayoutGrid = (p) => (
  <Icon {...p}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </Icon>
);
const Paperclip = (p) => (
  <Icon {...p}>
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </Icon>
);
const Search = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </Icon>
);
const Lightbulb = (p) => (
  <Icon {...p}>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V17h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z" />
  </Icon>
);
const MoreHorizontal = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </Icon>
);
const ArrowUp = (p) => (
  <Icon {...p}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </Icon>
);

const Home = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8002/api/chat", {
        message: userMessage,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.response },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen flex bg-[#f4f4f2]">
      {/* Sidebar */}
      <aside className="w-14 flex flex-col items-center py-4 gap-3 border-r border-black/5">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-black/5 text-gray-600">
          <PanelLeft size={18} />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-black text-white">
          <Plus size={18} />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-black/5 text-gray-600">
          <GitBranch size={18} />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-black/5 text-gray-600">
          <LayoutGrid size={18} />
        </button>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col relative">
        {/* Top right */}
        <div className="absolute top-4 right-6 flex items-center gap-3 z-10">
          <div className="w-8 h-8 rounded-full bg-gray-300" />
          <button className="px-4 py-2 rounded-full bg-black text-white text-sm font-medium">
            Get Pro
          </button>
        </div>

        {hasMessages ? (
          <main className="flex-1 overflow-y-auto px-6 pt-20 pb-40">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={
                      msg.role === "user"
                        ? "max-w-[75%] rounded-2xl px-4 py-3 bg-black text-white"
                        : "max-w-[75%] px-4 py-3"
                    }
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}
              {loading && <div className="text-gray-500">Thinking...</div>}
            </div>

            <div className="fixed bottom-6 left-14 right-0 px-6">
              <div className="max-w-2xl mx-auto">
                <ChatInput
                  message={message}
                  setMessage={setMessage}
                  sendMessage={sendMessage}
                  loading={loading}
                />
              </div>
            </div>
          </main>
        ) : (
          <main className="flex-1 flex flex-col items-center justify-center px-6">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6">
              What can I help with?
            </h1>

            <div className="w-full max-w-2xl">
              <ChatInput
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
                loading={loading}
              />
            </div>

            <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 px-4">
              <div className="bg-white/80 backdrop-blur border border-black/5 rounded-lg px-4 py-2 text-center shadow-sm">
                <p className="text-sm text-gray-800">
                  You've hit the Free plan limit for Crawl-4o.{" "}
                  <span className="font-medium">Subscribe to Pro plan to increase limits.</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Responses will use another model until your limit resets after 8:35 PM.
                </p>
              </div>
              <p className="text-xs text-gray-500">
                AI can make mistakes. Please double-check responses.
              </p>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

const ChatInput = ({ message, setMessage, sendMessage, loading }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-3">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
        placeholder="Ask anything"
        className="w-full px-2 py-2 outline-none text-[15px] placeholder:text-gray-400"
      />

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600">
            <Paperclip size={16} />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 text-sm text-gray-700">
            <Search size={14} />
            Deep Search
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 text-sm text-gray-700">
            <Lightbulb size={14} />
            Reason
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600">
            <MoreHorizontal size={16} />
          </button>
        </div>

        <button
          onClick={sendMessage}
          disabled={loading}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-black text-white disabled:opacity-50 hover:bg-gray-800"
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </div>
  );
};

export default Home;
