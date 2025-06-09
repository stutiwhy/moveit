// server/controllers/auth.ts

import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if any required fields are missing
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return res.status(400).json({ error: "Username taken" });

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword, firstName, lastName },
    });

    res.status(201).json({ message: "User registered", user });
  } catch (error) {
    console.error(error); // Log the full error
    res.status(500).json({ error: error.message || "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(400).json({ error: "User not found" });

    const valid = await comparePassword(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = generateToken(user.id);
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id; // Assuming `req.user` is set after authentication

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, email: true, firstName: true, lastName: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};