import { useConversations } from "../hooks/useConversations";
import Sidebar from "../components/sidebar/Sidebar";
import ChatInput from "../components/chat/ChatInput";
import ChatMessages from "../components/chat/ChatMessages";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const SUGGESTIONS = [
  "Explain a concept simply",
  "Draft an email",
  "Debug my code",
  "Summarize an article",
];

const Home = () => {
  const {
    user,
    getToken,
    conversations,
    currentConversationId,
    messages,
    message,
    setMessage,
    loading,
    documentId,
    setDocumentId,
    handleNewChat,
    selectConversation,
    sendMessage,
    handleDeleteConversation,
  } = useConversations();

  const hasMessages = messages.length > 0;

  const initial =
    user?.displayName?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  const firstName = user?.displayName?.split(" ")[0];

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-stone-100 text-stone-900 antialiased dark:bg-[#212121] dark:text-gray-100">

        <Sidebar
          user={user}
          conversations={conversations}
          currentConversationId={currentConversationId}
          onNewChat={handleNewChat}
          onSelectConversation={selectConversation}
          onDeleteConversation={handleDeleteConversation}
        />

        <div className="flex min-w-0 flex-1 flex-col">

          <header className="flex h-14 shrink-0 items-center justify-between px-3">

            <SidebarTrigger
              className="
                h-9
                w-9
                rounded-lg
                text-stone-500
                hover:bg-stone-900/5
                hover:text-stone-900
                dark:text-gray-400
                dark:hover:bg-white/10
                dark:hover:text-white
              "
            />

            <div className="flex items-center gap-2">

              <button
                className="
                  rounded-full
                  bg-stone-900
                  px-4
                  py-1.5
                  text-sm
                  font-medium
                  text-white
                  transition-colors
                  hover:bg-stone-700
                  dark:bg-white
                  dark:text-black
                  dark:hover:bg-gray-200
                "
              >
                Get Pro
              </button>

              <button
                aria-label="Account"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-stone-800
                  text-xs
                  font-medium
                  text-white
                  transition-opacity
                  hover:opacity-80
                  dark:bg-gray-600
                "
              >
                {initial}
              </button>

            </div>
          </header>

          {hasMessages ? (
            <>
              <main className="min-h-0 flex-1 overflow-y-auto">

                <div className="mx-auto w-full max-w-3xl px-4 pb-4 pt-2">

                  <ChatMessages
                    messages={messages}
                    loading={loading}
                  />

                </div>

              </main>

              <div
                className="
                  shrink-0
                  bg-gradient-to-t
                  from-stone-100
                  via-stone-100
                  to-transparent
                  pt-4
                  dark:from-[#212121]
                  dark:via-[#212121]
                "
              >
                <div className="mx-auto w-full max-w-3xl px-4 pb-3">

                  <ChatInput
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                    loading={loading}
                    getToken={getToken}
                    documentId={documentId}
                    setDocumentId={setDocumentId}
                  />

                  <p className="mt-2 text-center text-xs text-stone-500 dark:text-gray-500">
                    AI can make mistakes. Please double-check responses.
                  </p>

                </div>
              </div>
            </>
          ) : (

            <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-14">

              <div className="w-full max-w-3xl">

                <h1
                  className="
                    mb-8
                    text-center
                    text-3xl
                    font-semibold
                    tracking-tight
                    text-stone-900
                    dark:text-gray-100
                    sm:text-4xl
                  "
                >
                  {firstName
                    ? `What can I help with, ${firstName}?`
                    : "What can I help with?"}
                </h1>

                <ChatInput
                  message={message}
                  setMessage={setMessage}
                  sendMessage={sendMessage}
                  loading={loading}
                  getToken={getToken}
                  documentId={documentId}
                  setDocumentId={setDocumentId}
                />

                <div className="mt-4 flex flex-wrap justify-center gap-2">

                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setMessage(suggestion)}
                      className="
                        rounded-full
                        border
                        border-stone-300
                        bg-white/60
                        px-3.5
                        py-1.5
                        text-sm
                        text-stone-600
                        transition-colors
                        hover:border-stone-400
                        hover:bg-white
                        hover:text-stone-900
                        dark:border-gray-700
                        dark:bg-[#2f2f2f]
                        dark:text-gray-300
                        dark:hover:border-gray-600
                        dark:hover:bg-[#3a3a3a]
                        dark:hover:text-white
                      "
                    >
                      {suggestion}
                    </button>
                  ))}

                </div>

              </div>

            </main>
          )}

        </div>
      </div>
    </SidebarProvider>
  );
};

export default Home;