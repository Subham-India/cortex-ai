// graph/state.js

import { Annotation } from "@langchain/langgraph";

export const AgentState = Annotation.Root({
  userId: Annotation({
    reducer: (_, value) => value,
    default: () => null,
  }),

  conversationId: Annotation({
    reducer: (_, value) => value,
    default: () => null,
  }),

  userMessage: Annotation({
    reducer: (_, value) => value,
    default: () => "",
  }),

  selectedAgent: Annotation({
    reducer: (_, value) => value,
    default: () => null,
  }),

  messages: Annotation({
    reducer: (current, update) => [...current, ...update],
    default: () => [],
  }),

  searchResults: Annotation({
    reducer: (_, value) => value,
    default: () => [],
  }),

  response: Annotation({
    reducer: (_, value) => value,
    default: () => null,
  }),

  error: Annotation({
    reducer: (_, value) => value,
    default: () => null,
  }),
});