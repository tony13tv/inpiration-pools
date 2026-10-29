import crypto from "crypto";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "atl_admin_session";

function getAdminCredentials() {
  const username = (process.env.ADMIN_USERNAME || "admin").trim();
  const password = (process.env.ADMIN_PASSWORD || "AtlPools2026!").trim();
  const secret = (
    process.env.ADMIN_AUTH_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "atl-inspiration-pools-secret-key-2026"
  ).trim();

  return { username, password, secret };
}

export function createAdminSessionToken(username: string): string {
  const { secret } = getAdminCredentials();
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
  const payload = `${username}.${exp}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${signature}`;
}

export function verifyAdminSessionToken(token?: string | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [encodedPayload, signature] = parts;
  try {
    const payload = Buffer.from(encodedPayload, "base64url").toString("utf-8");
    const { secret } = getAdminCredentials();
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSig);
    if (
      sigBuf.length !== expectedBuf.length ||
      !crypto.timingSafeEqual(sigBuf, expectedBuf)
    ) {
      return false;
    }

    const [, expStr] = payload.split(".");
    const exp = Number(expStr);
    if (!exp || Date.now() > exp) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function validateAdminLogin(
  inputUser: string,
  inputPass: string
): boolean {
  const { username, password } = getAdminCredentials();
  return (
    inputUser.trim().toLowerCase() === username.toLowerCase() &&
    inputPass === password
  );
}

export function isRequestAuthenticated(request: NextRequest): boolean {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(cookie);
}
