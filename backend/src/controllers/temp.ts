import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const getUserConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    console.log("Requested user: ", userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      res.status(404).json({ error: "User not found!" });
      return;
    }
    const conversations = await prisma.conversation.findMany({
      where: {
        users: {
          some: {
            id: userId,
            
          },
        },
      },
      include: {
        users: true, 
        messages: {
          orderBy: { createdAt: "desc" }, 
          take: 1, 
        },
      },
    });

    console.log(conversations);
    res.json({ conversations });
    return;

  } catch (err: any) {
    console.error("Error fetching user conversations:", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};


export const getConversation = async (req: Request, res: Response) => {
  try {
    const conversationId = req.params.conversationId;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" }, 
          include: {sender:true}
        },
        users: true, 
      },
    });

    if (!conversation) {
      res.status(404).json({ error: "Conversation not found!" });
      return;
    }

    res.json(conversation);
    return;
  } catch (err: any) {
    console.error("Error fetching conversation:", err);
    res.status(500).json({ error: "Internal server error!" });
    return;
  }
};


export const startConversation = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const otherUserId = req.user?.id;

    if (!otherUserId) {
      res.status(401).json({ error: "You are not authenticated!" });
      return;
    }
    if (!userId) {
      res.status(400).json({ error: "User ID is required!" });
      return;
    }
    if (userId === otherUserId) {
      res.status(400).json({ error: "You cannot start a conversation with yourself!" });
      return;
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "User not found!" });
      return;
    }
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        users: {
          every: {
            id: { in: [userId, otherUserId] },
          },
        },
      },
      include: { users: true },
    });

    if (existingConversation) {
      res.json(existingConversation); 
      return;
    }

    const newConversation = await prisma.conversation.create({
      data: {
        name: "",
        users: {
          connect: [{ id: userId }, { id: otherUserId }],
        },
      },
      include: { users: true },
    });

    res.status(201).json(newConversation);
  } catch (err: any) {
    console.error("Error starting conversation:", err);
    res.status(500).json({ error: "Internal server error!" });
    return;
  }
};


export const sendMessage = async (req: Request, res: Response) => {
  try {
    const conversationId = req.params.conversationId;
    const senderId = req.user?.id; 

    if (!senderId) {
      res.status(401).json({ error: "You are not authenticated!" });
      return;
    }

    if (!conversationId) {
      res.status(400).json({ error: "No conversation ID provided!" });
      return;
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {users:true}
    });

    if (!conversation) {
      res.status(404).json({ error: "Conversation not found!" });
      return;
    }

    const { message } = req.body;
    if (!message) {
      
      res.status(400).json({ error: "Message text is required!" });
      return;
    }

    const newMessage = await prisma.message.create({
      data: {
        message: message,
        sender: {
          connect: { id: senderId },
        },
        conversation: {
          connect: { id: conversationId },
        },
      },
      include: {
        sender: {
          select: { id: true, username: true,fullname:true, profilePic: true },
        },
      },
    });

    const receiver = conversation.users.find((user) => user.id !== senderId);
    
    console.log("What the: ", receiver);
    const receiverSocketId = receiver?.id ? getReceiverSocketId(receiver?.id) : null;

    // Emit real-time message event
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (err: any) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Internal server error!" });
  }
}