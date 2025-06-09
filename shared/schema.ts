// shared/schema.ts

import { z } from 'zod';
import { Prisma, PrismaClient } from "@prisma/client";

// Instantiate Prisma Client
const prisma = new PrismaClient();

// User Validation Schema
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

// University Validation Schema
export const insertUniversitySchema = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
  description: z.string().optional(),
});

export type InsertUniversity = z.infer<typeof insertUniversitySchema>;

// Course Validation Schema
export const insertCourseSchema = z.object({
  universityId: z.number().int(),
  name: z.string().min(1),
  degree: z.string().min(1),
  tuitionFee: z.number().int(),
});

export type InsertCourse = z.infer<typeof insertCourseSchema>;

// Saved University Validation Schema
export const insertSavedUniversitySchema = z.object({
  userId: z.number().int(),
  universityId: z.number().int(),
  isSaved: z.boolean().default(true),
});

export type InsertSavedUniversity = z.infer<typeof insertSavedUniversitySchema>;

// Prisma-generated types (Automatically generated when you run `prisma generate`)
export type User = Prisma.UserUncheckedCreateInput;
export type University = Prisma.UniversityUncheckedCreateInput;
export type Course = Prisma.CourseUncheckedCreateInput;
export type SavedUniversity = Prisma.SavedUniversityUncheckedCreateInput;
