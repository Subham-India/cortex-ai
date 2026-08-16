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
    selectedAgent: result.selectedAgent,
    searchResults: result.searchResults || [],
  };
};

export default runAgent;