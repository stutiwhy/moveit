import { Request } from "express";
import { User as SelectUser } from "../shared/schema"; // Adjust import as per your project

declare global {
  namespace Express {
    interface User extends SelectUser {}
    interface Request {
      login(user: User, done: (err: any) => void): void;
      logout(done: (err: any) => void): void;
      user?: User;
    }
  }
}
