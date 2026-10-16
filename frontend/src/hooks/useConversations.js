import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../firebase";
import {
  createConversation,
  getConversations,
  getMessages,
  streamMessage,
  askAgent,
  deleteConversation,
} from "../services/chatService";
import {
  setConversations,
  addConversation,
  setCurrentConversation,
  setMessages,
  addMessage,
  appendToLastMessage,
  updateLastMessage,
  removeConversation,
  clearMessages,
} from "../features/conversation/conversationSlice";

export const useConversations = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { conversations, currentConversationId, messages } = useSelector(
    (state) => state.conversation
  );

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [documentId, setDocumentId] = useState(null);

  const getToken = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    return await currentUser.getIdToken();
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    loadConversations();
  }, [isAuthenticated]);

  const loadConversations = async () => {
    try {
      const token = await getToken();
      if (!token || !user) return;

      const data = await getConversations(user.id, token);
      if (data.success) {
        dispatch(setConversations(data.conversations));
      }
    } catch (error) {
      console.error("Load conversations error:", error.response?.data || error.message);
    }
  };

  const createNewConversation = async () => {
    try {
      const token = await getToken();
      if (!token || !user) {
        console.error("No auth token or user found");
        return null;
      }

      const data = await createConversation("New conversation", user.id, token);

      if (!data.success) {
        throw new Error(data.message || "Could not create conversation");
      }

      const conversation = data.conversation;
      dispatch(addConversation(conversation));
      dispatch(setCurrentConversation(conversation._id));
      dispatch(clearMessages());

      return conversation._id;
    } catch (error) {
      console.error("Create conversation error:", error.response?.data || error.message);
      return null;
    }
  };

  const handleNewChat = async () => {
    setMessage("");
    setDocumentId(null);
    const conversationId = await createNewConversation();
    if (!conversationId) alert("Could not create conversation");
  };

  const loadMessages = async (conversationId) => {
    try {
      const token = await getToken();
      if (!token) return;

      const data = await getMessages(conversationId, token);
      if (data.success) {
        dispatch(setMessages(data.messages));
      }
    } catch (error) {
      console.error("Load messages error:", error.response?.data || error.message);
    }
  };

  const selectConversation = async (conversationId) => {
    dispatch(setCurrentConversation(conversationId));
    await loadMessages(conversationId);
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const token = await getToken();

    if (!token || !user) {
      alert("User not authenticated");
      return;
    }

    let conversationId = currentConversationId;

    if (!conversationId) {
      conversationId = await createNewConversation();

      if (!conversationId) {
        alert("Could not create conversation");
        return;
      }
    }

    const userMessage = message.trim();

    dispatch(
      addMessage({
        role: "user",
        content: userMessage,
        type: "text",
      })
    );

    setMessage("");
    setLoading(true);

        try {
      const freshToken = await getToken();

      if (documentId) {
        // Document Q&A: single answer, not streamed
        const agentResult = await askAgent({
          message: userMessage,
          documentId,
          userId: user.id,
          conversationId,
          token: freshToken,
        });

        if (!agentResult.success) {
          throw new Error(agentResult.message || "Failed to generate response");
        }

        dispatch(
          addMessage({
            role: "assistant",
            content: agentResult.answer || agentResult.response || "",
            type: "text",
          })
        );
      } else {
        // Normal chat / search / image: streamed
        let started = false;
        let pending = "";
        let raf = null;

        const ensureAssistant = () => {
          if (started) return;
          started = true;
          dispatch(addMessage({ role: "assistant", content: "", type: "text" }));
        };

        // Batch tokens so React renders once per frame, not once per token
        const flush = () => {
          raf = null;
          if (pending) {
            dispatch(appendToLastMessage(pending));
            pending = "";
          }
        };

        try {
          await streamMessage({
            conversationId,
            message: userMessage,
            userId: user.id,
            token: freshToken,
            onEvent: (evt) => {
              if (evt.type === "token") {
                ensureAssistant();
                pending += evt.token;
                if (!raf) raf = requestAnimationFrame(flush);
              } else if (evt.type === "text") {
                ensureAssistant();
                dispatch(updateLastMessage({ content: evt.content }));
              } else if (evt.type === "image") {
                ensureAssistant();
                dispatch(
                  updateLastMessage({
                    type: "image",
                    image: evt.image,
                    publicId: evt.publicId,
                    prompt: evt.prompt,
                    content: "",
                  })
                );
              } else if (evt.type === "error") {
                throw new Error(evt.message || "Failed to generate response");
              }
            },
          });
        } finally {
          if (raf) cancelAnimationFrame(raf);
          flush();
        }

        if (!started) throw new Error("Empty response");
      }

      await loadConversations();
    } catch (error) {
      console.error("Chat error:", error.response?.data || error.message);

      dispatch(
        addMessage({
          role: "assistant",
          content: "Sorry, something went wrong.",
          type: "text",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (conversationId, event) => {
    event.stopPropagation();

    try {
      const token = await getToken();
      if (!token) return;

      const data = await deleteConversation(conversationId, token);
      if (data.success) {
        dispatch(removeConversation(conversationId));
      }
    } catch (error) {
      console.error("Delete conversation error:", error.response?.data || error.message);
    }
  };

  return {
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
  };
};