import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../firebase";
import {
  createConversation,
  getConversations,
  getMessages,
  sendMessage as sendMessageApi,
  deleteConversation,
} from "../services/chatService";
import {
  setConversations,
  addConversation,
  setCurrentConversation,
  setMessages,
  addMessage,
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

  /* --------------------------------
     Get a fresh Firebase ID token
     right before each API call
  -------------------------------- */

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

    dispatch(addMessage({ role: "user", content: userMessage }));
    setMessage("");
    setLoading(true);

    try {
      const freshToken = await getToken();
      const data = await sendMessageApi(conversationId, userMessage, user.id, freshToken);

      if (!data.success) {
        throw new Error(data.message || "Failed to generate response");
      }

      dispatch(addMessage({ role: "assistant", content: data.response }));
      await loadConversations();
    } catch (error) {
      console.error("Chat error:", error.response?.data || error.message);
      dispatch(addMessage({ role: "assistant", content: "Sorry, something went wrong." }));
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
  };
};