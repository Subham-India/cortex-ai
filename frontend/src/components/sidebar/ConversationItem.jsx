import { Trash } from "../icons";

const ConversationItem = ({ conversation, isActive, onSelect, onDelete }) => (
  <div
    onClick={() => onSelect(conversation._id)}
    title={conversation.title || "New conversation"}
    className={`group relative flex items-center justify-between gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
      isActive ? "bg-black/10 font-medium" : "hover:bg-black/5"
    }`}
  >
    <span className="truncate flex-1 min-w-0">
      {conversation.title || "New conversation"}
    </span>

    <button
      onClick={(event) => onDelete(conversation._id, event)}
      className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-md hover:bg-black/10 text-gray-500 shrink-0 transition-opacity"
    >
      <Trash size={13} />
    </button>

    <div
      className={`pointer-events-none absolute right-8 top-0 bottom-0 w-6 bg-gradient-to-l ${
        isActive ? "from-black/10" : "from-[#eeeeec] group-hover:from-black/5"
      } to-transparent`}
    />
  </div>
);

export default ConversationItem;