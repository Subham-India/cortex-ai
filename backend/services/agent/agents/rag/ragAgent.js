import { queryRAG } from "../../services/ragClient.js";

export async function ragAgent({
    question,
    documentId
}) {

    if (!documentId) {
        throw new Error(
            "documentId is required for RAG"
        );
    }

    const result = await queryRAG(
        question,
        documentId,
        3
    );

    return {
        answer: result.answer,
        sources: result.sources,
        documentId: result.document_id
    };
}