import gemini from "../../llms/gemini/gemini.client.js";

const routerAgent = async (userMessage) => {
  try {
    const prompt = `
You are the Router Agent of a multi-agent AI system.

Choose exactly ONE agent for the user's request.

Available agents:

- chat: normal conversation, explanations, general questions
- search: latest information, news, current events, web research

User request:
${userMessage}

Return ONLY:
chat
OR
search
`;

    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const result = response.text.trim().toLowerCase();

    if (result.includes("search")) {
      return "search";
    }

    return "chat";

  } catch (error) {
    console.error("Router Agent Error:", error);
    throw error;
  }
};

export default routerAgent;