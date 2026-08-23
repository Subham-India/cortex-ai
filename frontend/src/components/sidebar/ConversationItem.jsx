import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";

import { Trash2 } from "lucide-react";

const ConversationItem = ({
  conversation,
  active,
  onSelect,
  onDelete,
}) => {
  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete(conversation._id, event);
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={active}
        onClick={() => onSelect(conversation._id)}
        tooltip={conversation.title || "New conversation"}
        className="
          h-9
          rounded-lg
          transition-colors
          hover:bg-black/5
          hover:text-stone-900
          dark:hover:bg-white/10
          dark:hover:text-white
        "
      >
        <span className="truncate">
          {conversation.title || "New conversation"}
        </span>
      </SidebarMenuButton>

      <SidebarMenuAction
        showOnHover
        onClick={handleDelete}
        className="
          text-stone-400
          hover:bg-black/5
          hover:text-red-500
          dark:text-gray-500
          dark:hover:bg-white/10
          dark:hover:text-red-400
        "
      >
        <Trash2 size={15} />
        <span className="sr-only">
          Delete conversation
        </span>
      </SidebarMenuAction>
    </SidebarMenuItem>
  );
};

export default ConversationItem;