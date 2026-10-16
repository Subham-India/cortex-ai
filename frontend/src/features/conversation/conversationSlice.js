import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  currentConversationId: null,
  messages: [],
  loading: false,
  error: null,
};

const conversationSlice = createSlice({
  name: "conversation",

  initialState,

  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },

    addConversation: (state, action) => {
      state.conversations.unshift(action.payload);
    },

    setCurrentConversation: (state, action) => {
      state.currentConversationId = action.payload;
    },

    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
        appendToLastMessage: (state, action) => {
      const last = state.messages[state.messages.length - 1];
      if (last) last.content = (last.content || "") + action.payload;
    },

    updateLastMessage: (state, action) => {
      const last = state.messages[state.messages.length - 1];
      if (last) Object.assign(last, action.payload);
    },

    removeConversation: (state, action) => {
      state.conversations = state.conversations.filter(
        (conversation) => conversation._id !== action.payload
      );

      if (state.currentConversationId === action.payload) {
        state.currentConversationId = null;
        state.messages = [];
      }
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  setConversations,
  addConversation,
  setCurrentConversation,
  setMessages,
  addMessage,
  appendToLastMessage,
  updateLastMessage,
  removeConversation,
  setLoading,
  setError,
  clearMessages,
} = conversationSlice.actions;

export default conversationSlice.reducer;