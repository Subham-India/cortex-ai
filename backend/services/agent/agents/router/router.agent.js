import groq from "../../llms/groq/groq.client.js";

const routerAgent = async (userMessage) => {

  try {

    const prompt = `
You are the Router Agent of a multi-agent AI system.

Choose exactly ONE agent for the user's request.

Available agents:

- chat: normal conversation, explanations, general questions
- search: latest information, news, current events, web research
- photo: image generation requests, creating pictures, generating images from prompts
- rag: questions about a user's uploaded documents/files

Use RAG when the user is asking about information contained in
their uploaded document, PDF, DOCX, TXT, or other file.

Examples:

"Hello, how are you?" → chat
"Explain recursion in Python" → chat
"What is React?" → chat

"What is the latest news about AI?" → search
"Search the web for the latest NVIDIA news" → search
"What happened today in India?" → search

"Create an image of a futuristic city" → photo
"Generate a picture of a cat" → photo
"Make a realistic photo of a mountain" → photo
"Create a cyberpunk wallpaper" → photo

"What is my internship report about?" → rag
"What is the objective of my uploaded document?" → rag
"Summarize my PDF" → rag
"What does my internship report say about machine learning?" → rag
"According to my document, what is the project objective?" → rag

Important:
If the question clearly refers to an uploaded document,
choose RAG instead of chat.

User request:
${userMessage}

Return ONLY one word:

chat
OR
search
OR
photo
OR
rag
`;

    const completion = await groq.chat.completions.create({

      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content:
            "You are a routing agent. Return only 'chat', 'search', 'photo', or 'rag'.",
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


    if (result.includes("rag")) {
      return "rag";
    }

    if (result.includes("photo")) {
      return "photo";
    }

    if (result.includes("search")) {
      return "search";
    }

    return "chat";

  } catch (error) {

    console.error(
      "Router Agent Error:",
      error
    );

    // Safe fallback
    return "chat";
  }
};

export default routerAgent;