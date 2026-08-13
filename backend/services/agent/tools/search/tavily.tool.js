import { tavily } from "@tavily/core";

const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

const tavilySearch = async (query) => {
  try {
    const response = await tvly.search(query, {
      searchDepth: "advanced",
      maxResults: 5,
      includeAnswer: false,
    });

    return response.results.map((result) => ({
      title: result.title,
      url: result.url,
      content: result.content,
    }));

  } catch (error) {
    console.error("Tavily Search Error:", error);
    throw error;
  }
};

export default tavilySearch;