import groq from "../llms/groq/groq.client.js";
import routerAgent from "../agents/router/router.agent.js";
import tavilySearch from "../tools/search/tavily.tool.js";
import photoAgent from "../agents/photo/photo.agent.js";
import { ragAgent } from "../agents/rag/ragAgent.js";

const MODEL = "openai/gpt-oss-20b";

// Streams a Groq completion and yields { type: "token" } events
async function* streamTokens({ messages, temperature, signal }) {
  const stream = await groq.chat.completions.create(
    { model: MODEL, messages, temperature, stream: true },
    { signal }
  );

  for await (const chunk of stream) {
    const token = chunk.choices?.[0]?.delta?.content;
    if (token) yield { type: "token", token };
  }
}

// Makes sure the latest user message is last, without duplicating it
const withLatestUserMessage = (messages, userMessage) => {
  const history = [...messages];
  const last = history[history.length - 1];

  if (!last || last.role !== "user" || last.content !== userMessage) {
    history.push({ role: "user", content: userMessage });
  }

  return history.map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.content,
  }));
};

export async function* runAgentStream({
  userId,
  conversationId,
  userMessage,
  messages = [],
  documentId = null,
  signal,
}) {
  // A document is attached -> always answer from the document
  const selectedAgent = documentId ? "rag" : await routerAgent(userMessage);

  yield { type: "meta", selectedAgent };

  // ---------- PHOTO (one result, no tokens) ----------
  if (selectedAgent === "photo") {
    const result = await photoAgent({ userMessage, userId, conversationId });

    if (!result.success) {
      yield { type: "error", message: result.message || "Image generation failed" };
      return;
    }

    yield {
      type: "image",
      image: result.image,
      publicId: result.publicId,
      prompt: result.prompt,
    };
    return;
  }

  // ---------- RAG (one result, no tokens) ----------
  if (selectedAgent === "rag") {
    const result = await ragAgent({ question: userMessage, documentId });
    yield { type: "sources", sources: result.sources || [] };
    yield { type: "text", content: result.answer || "" };
    return;
  }

  // ---------- SEARCH (streamed) ----------
  if (selectedAgent === "search") {
    const results = await tavilySearch(userMessage);

    yield {
      type: "sources",
      sources: results.map((r) => ({ title: r.title, url: r.url })),
    };

    const context = results
      .map((r, i) => `[${i + 1}] ${r.title}\n${r.content}\nSource: ${r.url}`)
      .join("\n\n");

    yield* streamTokens({
      temperature: 0.2,
      signal,
      messages: [
        {
          role: "system",
          content: `You are a web search agent.

Answer the user's question using the provided search results.

Rules:
- Use the search results as your primary source.
- Do not invent facts.
- If the results are insufficient, say so.
- Give a clear answer.
- Include relevant source URLs.`,
        },
        {
          role: "user",
          content: `User question:\n${userMessage}\n\nSearch results:\n${context}`,
        },
      ],
    });
    return;
  }

  // ---------- CHAT (streamed) ----------
  yield* streamTokens({
    temperature: 0.7,
    signal,
    messages: [
      { role: "system", content: "You are a helpful AI assistant." },
      ...withLatestUserMessage(messages, userMessage),
    ],
  });
}