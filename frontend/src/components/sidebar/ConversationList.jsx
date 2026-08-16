import { useState } from "react";
import { Search } from "../icons";
import { groupConversationsByDate } from "../../utils/dateGrouping";
import ConversationItem from "./ConversationItem";

const ConversationList = ({
  conversations,
  currentConversationId,
  onSelect,
  onDelete,
}) => {
  const [historySearch, setHistorySearch] = useState("");

  const filtered = historySearch.trim()
    ? conversations.filter((c) =>
        (c.title || "New conversation")
          .toLowerCase()
          .includes(historySearch.trim().toLowerCase())
      )
    : conversations;

  const grouped = groupConversationsByDate(filtered);

  return (
    <>
      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/5 focus-within:ring-1 focus-within:ring-black/20">
          <Search size={14} className="text-gray-500 shrink-0" />
          <input
            type="text"
            value={historySearch}
            onChange={(e) => setHistorySearch(e.target.value)}
            placeholder="Search chats"
            className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {filtered.length === 0 ? (
          <p className="px-3 py-4 text-xs text-gray-400">
            {historySearch.trim() ? "No matching chats" : "No conversations yet"}
          </p>
        ) : (
          grouped.map(([label, items]) => (
            <div key={label} className="mb-3">
              <p className="px-3 py-1.5 text-xs font-medium text-gray-500 sticky top-0 bg-[#eeeeec]">
                {label}
              </p>
              <div className="space-y-0.5">
                {items.map((conversation) => (
                  <ConversationItem
                    key={conversation._id}
                    conversation={conversation}
                    isActive={currentConversationId === conversation._id}
                    onSelect={onSelect}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ConversationList;