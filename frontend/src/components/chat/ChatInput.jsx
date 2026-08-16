import { Paperclip, Search, Lightbulb, MoreHorizontal, ArrowUp } from "../icons";

const ChatInput = ({ message, setMessage, sendMessage, loading }) => (
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
        disabled={loading || !message.trim()}
        className="w-9 h-9 flex items-center justify-center rounded-lg bg-black text-white disabled:opacity-50 hover:bg-gray-800"
      >
        <ArrowUp size={18} />
      </button>
    </div>
  </div>
);

export default ChatInput;