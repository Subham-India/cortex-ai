import groq from "../../llms/groq/groq.client.js";

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

Return ONLY one word:
chat
OR
search
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content:
            "You are a routing agent. Return only 'chat' or 'search'.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0,
    });

    const result = completion.choices[0].message.content
      .trim()
      .toLowerCase();

    console.log("Router Result:", result);

    if (result.includes("search")) {
      return "search";
    }

    return "chat";

  } catch (error) {
    console.error("Router Agent Error:", error);

    // Safe fallback
    return "chat";
  }
};

export default routerAgent;