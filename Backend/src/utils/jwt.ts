import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

// Define the payload structure
export interface JwtPayload {
  userId: string;
  email: string;
}

// For signup & Google → always fixed expiry
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: "7d" });
}

// For login → support "Keep me logged in"
export function generateLoginToken(payload: JwtPayload, keepLoggedIn: boolean): string {
  return jwt.sign(payload, JWT_SECRET!, {
    expiresIn: keepLoggedIn ? "30d" : "7d",
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET!) as JwtPayload;
}
