import axios from "axios";

const CHAT_API = "http://localhost:8002/api/chat";
const CONVERSATION_API = "http://localhost:8002/api/chat/conversations";
const RAG_API = import.meta.env.VITE_RAG_SERVICE_URL || "http://127.0.0.1:8004";
const AGENT_API = import.meta.env.VITE_AGENT_SERVICE_URL || "http://127.0.0.1:8003";

export const getConversations = async (userId, token) => {
  try {
    const response = await axios.get(CONVERSATION_API, {
      params: { userId },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Get conversations error:", error);
    throw error;
  }
};

export const createConversation = async (title = "New conversation", userId, token) => {
  try {
    const response = await axios.post(
      CONVERSATION_API,
      { title, userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Create conversation error:", error);
    throw error;
  }
};

export const getMessages = async (conversationId, token) => {
  try {
    const response = await axios.get(`${CONVERSATION_API}/${conversationId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Get messages error:", error);
    throw error;
  }
};

export const sendMessage = async (conversationId, message, userId, token) => {
  try {
    const response = await axios.post(
      CHAT_API,
      { conversationId, message, userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Send message error:", error);
    throw error;
  }
};

export const deleteConversation = async (conversationId, token) => {
  try {
    const response = await axios.delete(`${CONVERSATION_API}/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Delete conversation error:", error);
    throw error;
  }
};

export const uploadDocument = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${RAG_API}/documents/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Upload document error:", error.response?.data || error.message);
    throw error;
  }
};

export const askAgent = async ({ message, documentId, userId, conversationId, token }) => {
  try {
    const response = await axios.post(
      `${AGENT_API}/api/agent/run`,
      { message, documentId: documentId || null, userId, conversationId },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  } catch (error) {
    console.error("Ask agent error:", error.response?.data || error.message);
    throw error;
  }
};