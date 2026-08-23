import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Plus } from "../icons";
import ConversationList from "./ConversationList";

const Sidebar = ({
  user,
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
}) => {
  return (
    <ShadcnSidebar
      collapsible="icon"
      className="border-r border-black/5 dark:border-white/10"
    >
      {/* ================================
          HEADER
      ================================= */}

      <SidebarHeader className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onNewChat}
              tooltip="New Chat"
              className="
                h-10
                rounded-lg
                transition-colors
                hover:bg-black/5
                hover:text-stone-900
                dark:hover:bg-white/10
                dark:hover:text-white
              "
            >
              <Plus size={18} />
              <span>New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ================================
          CONVERSATIONS
      ================================= */}

      <SidebarContent>
        <ConversationList
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelect={onSelectConversation}
          onDelete={onDeleteConversation}
        />
      </SidebarContent>

      {/* ================================
          USER
      ================================= */}

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={user?.displayName || "User"}
              className="
                h-auto
                rounded-lg
                py-2
                transition-colors
                hover:bg-black/5
                dark:hover:bg-white/10
              "
            >
              {/* Avatar */}
              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-300
                  text-sm
                  font-medium
                  dark:bg-gray-700
                "
              >
                {user?.displayName?.charAt(0) ||
                  user?.email?.charAt(0) ||
                  "U"}
              </div>

              {/* User information */}
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium">
                  {user?.displayName || "User"}
                </p>

                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {user?.email || ""}
                </p>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;