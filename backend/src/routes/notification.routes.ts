import { Request, Response, Router } from "express";
import prisma from "../db/prisma.js";
import verify from "../middleware/protectRoute.js";
import { getAllNotifications, createNotification } from "../controllers/notificationControllers.js";


const router = Router();

router.get("/all", verify, getAllNotifications);
router.post("/create", verify, createNotification);


export default router;
