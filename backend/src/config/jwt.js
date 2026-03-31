import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export const secretKey = process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");

if (!process.env.JWT_SECRET) {
  console.warn("WARNING: Using generated JWT secret. All tokens will be invalidated on server restart. Set JWT_SECRET in .env file.");
}