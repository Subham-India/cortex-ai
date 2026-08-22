import agentGraph from "../graph/agent.graph.js";

const runAgent = async ({
  userId,
  conversationId,
  userMessage,
  messages = [],
}) => {
  const result = await agentGraph.invoke({
    userId,
    conversationId,
    userMessage,
    messages,
  });

  return {
    response: result.response,

    // Response type
    type: result.type,

    // Selected agent
    selectedAgent: result.selectedAgent,

    // Search results
    searchResults: result.searchResults || [],

    // Photo Agent
    image: result.image || null,
    publicId: result.publicId || null,
    prompt: result.prompt || null,

    // Error
    error: result.error || null,
  };
};

export default runAgent;