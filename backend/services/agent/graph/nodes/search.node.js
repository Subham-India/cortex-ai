import searchAgent from "../../agents/search/search.agent.js";

const searchNode = async (state) => {
  try {
    const result = await searchAgent(
      state.userMessage
    );

    return {
      response: result.answer,
      searchResults: result.sources,
    };

  } catch (error) {
    console.error("Search Node Error:", error);

    return {
      error: error.message,
    };
  }
};

export default searchNode;