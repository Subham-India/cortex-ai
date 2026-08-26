import axios from "axios";

const RAG_SERVICE_URL =
    process.env.RAG_SERVICE_URL || "http://127.0.0.1:8004";

export async function queryRAG(
    question,
    documentId,
    limit = 3
) {

    try {

        const response = await axios.post(
            `${RAG_SERVICE_URL}/rag/query`,
            {
                question,
                document_id: documentId,
                limit
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "RAG Service Error:",
            error.response?.data || error.message
        );

        throw error;
    }
}