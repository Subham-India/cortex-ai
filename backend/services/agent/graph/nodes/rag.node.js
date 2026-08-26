import { ragAgent } from "../../agents/rag/ragAgent.js";

const ragNode = async (state) => {

    try {

        console.log("RAG Node");
        console.log("Question:", state.userMessage);
        console.log("Document ID:", state.documentId);

        const result = await ragAgent({
            question: state.userMessage,
            documentId: state.documentId,
        });

        return {
            response: result.answer,
            searchResults: result.sources,
            selectedAgent: "rag",
            type: "text",
            error: null,
        };

    } catch (error) {

        console.error(
            "RAG Node Error:",
            error.response?.data || error.message
        );

        return {
            response: "Failed to get an answer from the document.",
            selectedAgent: "rag",
            type: "text",
            error: error.message,
        };
    }
};

export default ragNode;