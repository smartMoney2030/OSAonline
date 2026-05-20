import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SESSION_SECRET ?? "orale-secret";

export function generateToken(): string {
  return jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: "24h" });
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = header.slice(7);
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
