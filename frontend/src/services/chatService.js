import axios from "axios";

const CHAT_API = "/api/chat";
const CONVERSATION_API = "/api/chat/conversations";
const RAG_API = "/documents";
const AGENT_API = "/api/agent";

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

    const response = await axios.post(`${RAG_API}/upload`, formData, {
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
      `${AGENT_API}/run`,
      { message, documentId: documentId || null, userId, conversationId },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  } catch (error) {
    console.error("Ask agent error:", error.response?.data || error.message);
    throw error;
  }
};
export const streamMessage = async ({
  conversationId,
  message,
  userId,
  token,
  onEvent,
  signal,
}) => {
  const res = await fetch(`${CHAT_API}/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ conversationId, message, userId }),
    signal,
  });

  if (!res.ok || !res.body) {
    let msg = "Failed to generate response";
    try {
      msg = (await res.json()).message || msg;
    } catch {
      // not JSON
    }
    throw new Error(msg);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop();

    for (const part of parts) {
      const line = part.split("\n").find((l) => l.startsWith("data: "));
      if (!line) continue;

      let event;
      try {
        event = JSON.parse(line.slice(6));
      } catch {
        continue;
      }
      onEvent(event);
    }
  }
};