import {
  StateGraph,
  START,
  END,
} from "@langchain/langgraph";

import { AgentState } from "./state.js";

import routerNode from "./nodes/router.node.js";
import chatNode from "./nodes/chat.node.js";
import searchNode from "./nodes/search.node.js";
import photoNode from "./nodes/photo.node.js";

import routeFromRouter from "./edges/router.edges.js";

const graph = new StateGraph(AgentState);

// -------------------------
// Nodes
// -------------------------

graph.addNode("router", routerNode);
graph.addNode("chat", chatNode);
graph.addNode("search", searchNode);
graph.addNode("photo", photoNode);

// -------------------------
// START → Router
// -------------------------

graph.addEdge(START, "router");

// -------------------------
// Router → Chat / Search / Photo
// -------------------------

graph.addConditionalEdges(
  "router",
  routeFromRouter,
  {
    chat: "chat",
    search: "search",
    photo: "photo",
  }
);

// -------------------------
// Agents → END
// -------------------------

graph.addEdge("chat", END);
graph.addEdge("search", END);
graph.addEdge("photo", END);

// -------------------------
// Compile
// -------------------------

const agentGraph = graph.compile();

export default agentGraph;