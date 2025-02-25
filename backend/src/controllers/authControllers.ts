import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import prisma from "../db/prisma.js";
import bcrypt from "bcrypt";


export const loginFunc = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    res.status(400).json("Invalid username or password");
    return;
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.status(400).json("Invalid username or password");
    return;
  }

  const accessToken = await generateAccessToken(user.username);
  console.log(accessToken);
  const refreshToken = await generateRefreshToken(user.username);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });

  res.json({ accessToken });
  return;
  
}


export const signupFunc = async (req: Request, res: Response) => {
  
}


export const logoutFunc = async (req: Request, res: Response) => {
  console.log(req.url);
  res.clearCookie("refreshToken", { path: "/" });
  res.status(200).json("You logged out successfully.");
  return;
}


export const getAuthenticatedUser = async (req: Request, res: Response) => {
  if (!req.user) { res.status(401).json("User not authenticated"); return }

  res.json({
    id: req.user.id,
    username: req.user.username,
    fullname: req.user.fullname,
  });
  return;
}


export const refreshTokenFunc = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json("You are not authenticated!");
    return;
  }

  try {
    const decodedUser = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload;

    if (!decodedUser || typeof decodedUser !== "object" || !decodedUser.id) {
      res.status(403).json("Invalid token payload");
      return;
    }
    const user = await prisma.user.findUnique({
      where: { id: decodedUser.id },
    });

    if (!user) {
      res.clearCookie("refreshToken", { path: "/" });
      res.status(403).json("User no longer exists!");
      return;
    }
    const newAccessToken = await generateAccessToken(user.username);
    const newRefreshToken = await generateRefreshToken(user.username);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.json({ accessToken: newAccessToken });
    return;
  } catch (err) {
    console.error("Token verification error:", err);
    res.clearCookie("refreshToken", { path: "/" });
    res.status(403).json("Refresh token is not valid!");
    return;
  }
}