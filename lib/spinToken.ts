import crypto from "crypto";

export function generateSpinToken() {
  return crypto.randomBytes(32).toString("hex");
}