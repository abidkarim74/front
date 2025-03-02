import { Router } from "express";
import verify from "../middleware/protectRoute.js";
import { getUserConversations, startConversation, getConversation, sendMessage } from "../controllers/messagesControllers.js";


const router = Router();

router.post("/start-conversation", verify, startConversation);
router.post("/send-message/:conversationId", verify, sendMessage)
router.get("/conversations", verify, getUserConversations);
router.get("/conversation/:conversationId", verify, getConversation);


export default router;