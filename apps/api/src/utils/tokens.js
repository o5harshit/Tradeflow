
import crypto from "node:crypto";

export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function generateRefreshToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashRefreshToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateSessionFamilyId() {
  return crypto.randomUUID();
}
