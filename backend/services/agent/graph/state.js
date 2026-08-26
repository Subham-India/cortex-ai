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

    // RAG document ID
    documentId: Annotation({
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

    // Response type
    type: Annotation({
        reducer: (_, value) => value,
        default: () => "text",
    }),

    // Photo Agent
    image: Annotation({
        reducer: (_, value) => value,
        default: () => null,
    }),

    publicId: Annotation({
        reducer: (_, value) => value,
        default: () => null,
    }),

    prompt: Annotation({
        reducer: (_, value) => value,
        default: () => null,
    }),

    error: Annotation({
        reducer: (_, value) => value,
        default: () => null,
    }),
});