import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createToken, sessionCookie } from "@/lib/auth";
import { db } from "@/lib/store";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const user = (await db()).users.find((candidate) => candidate.email.toLowerCase() === String(email).toLowerCase());
  if (!user || !(await bcrypt.compare(String(password), user.passwordHash))) return NextResponse.json({ error: "Неверный e-mail или пароль" }, { status: 401 });
  const response = NextResponse.json({ ok: true, user: { name: user.name, role: user.role } });
  response.cookies.set(sessionCookie(await createToken({ id: user.id, name: user.name, email: user.email, role: user.role })));
  return response;
}
