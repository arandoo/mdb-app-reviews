import crypto from "crypto";

export function generateApiKey(): string {
  const key = crypto.randomBytes(24).toString("base64url");
  return `rk_${key}`;
}
