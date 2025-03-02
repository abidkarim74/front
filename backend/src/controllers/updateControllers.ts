import { Response, Request } from "express";
import prisma from "../db/prisma.js";


export const updateUserProfilePic = async (req: Request, res: Response) => {
  try {
    console.log("Request Params:", req.params);

    if (!req.file) {
      console.log("Damn");
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const userId = req.params.userId;

    if (!userId) {
      console.log("Damn");

      res.status(400).json({ error: "User ID is required" });
      return;
    }

    console.log("Fine");

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        profilePic: `http://localhost:5000/uploads/${req.file.filename}`,
      },
    });



    res.status(200).json(user);
    return;
  } catch (err: any) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error uploading profile picture" });
    return;
  }
};
