import express from "express";
import { queryRAG } from "../services/ragClient.js";

const router = express.Router();

router.post("/test-rag", async (req, res) => {
    try {
        const { question, documentId } = req.body;

        const result = await queryRAG(
            question,
            documentId,
            3
        );

        res.json(result);

    } catch (error) {
        res.status(500).json({
            error: "RAG request failed",
            details: error.response?.data || error.message
        });
    }
});

export default router;