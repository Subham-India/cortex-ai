import { Plus } from "../icons";
import ConversationList from "./ConversationList";

const Sidebar = ({
  user,
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
}) => (
  <aside className="w-64 h-screen flex flex-col border-r border-black/5 bg-[#eeeeec]">
    <div className="p-3">
      <button
        onClick={onNewChat}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 text-sm font-medium"
      >
        <Plus size={18} />
        New Chat
      </button>
    </div>

    <ConversationList
      conversations={conversations}
      currentConversationId={currentConversationId}
      onSelect={onSelectConversation}
      onDelete={onDeleteConversation}
    />

    <div className="p-3 border-t border-black/5">
      <div className="flex items-center gap-2 px-2">
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
          {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{user?.displayName || "User"}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
        </div>
      </div>
    </div>
  </aside>
);

export default Sidebar;