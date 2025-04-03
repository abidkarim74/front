import { Request, Response } from "express";
import prisma from "../db/prisma.js";


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