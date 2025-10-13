import jwt from "jsonwebtoken";

// JWT secret key - in production, use environment variable
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "your-super-secret-jwt-key-please-change-in-production";

// JWT expiration time
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface TokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT token with user ID and email
 */
export function generateToken(userId: string): string {
  const payload: TokenPayload = {
    userId,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
