import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

// Create conversation
export const createConversation = async (req, res) => {
  try {
    const { userId, title } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const conversation = await Conversation.create({
      userId,
      title: title || "New conversation",
    });

    return res.status(201).json({
      success: true,
      conversation,
    });

  } catch (error) {
    console.error("Create Conversation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create conversation",
    });
  }
};


// Get user's recent conversations
export const getConversations = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .select("_id title createdAt updatedAt");

    return res.status(200).json({
      success: true,
      conversations,
    });

  } catch (error) {
    console.error("Get Conversations Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
};


// Get messages of a conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({
      conversationId,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      messages,
    });

  } catch (error) {
    console.error("Get Messages Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};


// Delete conversation
export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    await Message.deleteMany({
      conversationId,
    });

    await Conversation.findByIdAndDelete(conversationId);

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });

  } catch (error) {
    console.error("Delete Conversation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete conversation",
    });
  }
};