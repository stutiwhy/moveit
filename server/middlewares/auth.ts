// server/middlewares/auth.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma client
const prisma = new PrismaClient();
const SECRET_KEY = process.env.MID_SECRET; 

// Extend Express Request to include `user`
export interface AuthenticatedRequest extends Request {
  user?: any;
}

// Authentication middleware
export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, SECRET_KEY);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user; // Attach user to the request
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
