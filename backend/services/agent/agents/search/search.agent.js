import tavilySearch from "../../tools/search/tavily.tool.js";
import groq from "../../llms/groq/groq.client.js";

const searchAgent = async (query) => {
  try {

    // Step 1: Search the web
    const results = await tavilySearch(query);

    // Step 2: Prepare search context
    const context = results
      .map(
        (result, index) =>
          `[${index + 1}] ${result.title}\n${result.content}\nSource: ${result.url}`
      )
      .join("\n\n");

    // Step 3: Ask LLM to answer using results
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: `
You are a web search agent.

Answer the user's question using the provided search results.

Rules:
- Use the search results as your primary source.
- Do not invent facts.
- If the results are insufficient, say so.
- Give a clear answer.
- Include relevant source URLs.
          `,
        },
        {
          role: "user",
          content: `
User question:
${query}

Search results:
${context}
          `,
        },
      ],

      temperature: 0.2,
    });

    return {
      answer: response.choices[0].message.content,
      sources: results.map((result) => ({
        title: result.title,
        url: result.url,
      })),
    };

  } catch (error) {
    console.error("Search Agent Error:", error);
    throw error;
  }
};

export default searchAgent;