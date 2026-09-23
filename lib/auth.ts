import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { Role } from "./types";

const key = new TextEncoder().encode(process.env.AUTH_SECRET || "change-this-nctv-secret-before-production");
const cookieName = "nctv_session";
export type Session = { id: string; name: string; email: string; role: Role };

export async function createToken(user: Session) {
  return new SignJWT(user).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key);
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  try { return (await jwtVerify(token, key)).payload as unknown as Session; } catch { return null; }
}

export const sessionCookie = (value: string) => ({ name: cookieName, value, httpOnly: true, sameSite: "lax" as const, path: "/", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 7 });
