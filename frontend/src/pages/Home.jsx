import { useState } from "react";
import { useConversations } from "../hooks/useConversations";
import { PanelLeft } from "../components/icons";
import Sidebar from "../components/sidebar/Sidebar";
import ChatInput from "../components/chat/ChatInput";
import ChatMessages from "../components/chat/ChatMessages";

const SUGGESTIONS = [
  "Explain a concept simply",
  "Draft an email",
  "Debug my code",
  "Summarize an article",
];

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
  const initial =
    user?.displayName?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";
  const firstName = user?.displayName?.split(" ")[0];

  return (
    <div className="flex h-screen overflow-hidden bg-stone-100 text-stone-900 antialiased">
      {/* Collapses in place so the toggle animates instead of snapping */}
      <div
        className={`shrink-0 overflow-hidden transition-[width] duration-300 ease-out ${
          sidebarOpen ? "w-64" : "w-0"
        }`}
      >
        <div className="h-full w-64">
          <Sidebar
            user={user}
            conversations={conversations}
            currentConversationId={currentConversationId}
            onNewChat={handleNewChat}
            onSelectConversation={selectConversation}
            onDeleteConversation={handleDeleteConversation}
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between px-3">
          <button
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-stone-900/5 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20"
          >
            <PanelLeft size={18} />
          </button>

          <div className="flex items-center gap-2">
            <button className="rounded-full bg-stone-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100">
              Get Pro
            </button>
            <button
              aria-label="Account"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-800 text-xs font-medium text-white transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100"
            >
              {initial}
            </button>
          </div>
        </header>

        {hasMessages ? (
          <>
            <main className="min-h-0 flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-3xl px-4 pb-4 pt-2">
                <ChatMessages messages={messages} loading={loading} />
              </div>
            </main>

            <div className="shrink-0 bg-gradient-to-t from-stone-100 via-stone-100 to-transparent pt-4">
              <div className="mx-auto w-full max-w-3xl px-4 pb-3">
                <ChatInput
                  message={message}
                  setMessage={setMessage}
                  sendMessage={sendMessage}
                  loading={loading}
                />
                <p className="mt-2 text-center text-xs text-stone-500">
                  AI can make mistakes. Please double-check responses.
                </p>
              </div>
            </div>
          </>
        ) : (
          <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-14">
            <div className="w-full max-w-3xl">
              <h1 className="mb-8 text-center text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                {firstName ? `What can I help with, ${firstName}?` : "What can I help with?"}
              </h1>

              <ChatInput
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
                loading={loading}
              />

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setMessage(s)}
                    className="rounded-full border border-stone-300 bg-white/60 px-3.5 py-1.5 text-sm text-stone-600 transition-colors hover:border-stone-400 hover:bg-white hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default Home;
