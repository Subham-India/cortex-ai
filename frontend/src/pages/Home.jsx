import { useState } from "react";
import { useConversations } from "../hooks/useConversations";
import { PanelLeft } from "../components/icons";
import Sidebar from "../components/sidebar/Sidebar";
import ChatInput from "../components/chat/ChatInput";
import ChatMessages from "../components/chat/ChatMessages";

const Home = () => {
  const {
    user,
    conversations,
    currentConversationId,
    messages,
    message,
    setMessage,
    loading,
    handleNewChat,
    selectConversation,
    sendMessage,
    handleDeleteConversation,
  } = useConversations();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const hasMessages = messages.length > 0;

  return (
    <div className="h-screen flex bg-[#f4f4f2] text-gray-900 overflow-hidden">
      {sidebarOpen && (
        <Sidebar
          user={user}
          conversations={conversations}
          currentConversationId={currentConversationId}
          onNewChat={handleNewChat}
          onSelectConversation={selectConversation}
          onDeleteConversation={handleDeleteConversation}
        />
      )}

      <div className="flex-1 flex flex-col relative">
        <div className="absolute top-4 right-6 flex items-center gap-3 z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-black/5 text-gray-600"
          >
            <PanelLeft size={18} />
          </button>

          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm">
            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
          </div>

          <button className="px-4 py-2 rounded-full bg-black text-white text-sm font-medium">
            Get Pro
          </button>
        </div>

        {hasMessages ? (
          <main className="flex-1 overflow-y-auto px-6 pt-20 pb-40">
            <ChatMessages messages={messages} loading={loading} />

            <div
              className={`fixed bottom-6 ${sidebarOpen ? "left-64" : "left-14"} right-0 px-6`}
            >
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

export default Home;