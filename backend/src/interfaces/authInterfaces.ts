import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface AuthUser {
  id: string;
  username: string;
  password: string;
  fullname:string,
  isAdmin: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    fullname: string;
  };
}


export interface DecodedToken extends JwtPayload {
  id: string;
}