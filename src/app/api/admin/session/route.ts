import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  isRequestAuthenticated,
  validateAdminLogin,
} from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const authenticated = isRequestAuthenticated(request);
  return NextResponse.json({ authenticated });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = String(body.username || "");
    const password = String(body.password || "");

    if (!validateAdminLogin(username, password)) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken(username.trim());
    const response = NextResponse.json({ authenticated: true });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Invalid login request." },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
