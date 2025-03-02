import { Router, Response, Request } from "express";
import prisma from "../db/prisma.js";
import verify from "../middleware/protectRoute.js";


const router = Router();

export const getUserProfile = async (req: Request, res: Response) => {
  console.log("Here")
    try {
    const userId = req.params.userId;

    console.log(userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    console.log(user);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

router.get("/profile/:userId", verify, getUserProfile);
router.get("/clean-messages", async (req: Request, res: Response) => {
  try {
    const result = await prisma.message.deleteMany();
    console.log("Deleted messages:", result); // Log the deletion result
    res.status(200).json({ message: "Database cleaned successfully", deletedCount: result.count });
  } catch (error) {
    console.error("Error cleaning database:", error); // Log the error
    res.status(500).json({ error: "Failed to clean database", details: error });
  }
});


export default router;


