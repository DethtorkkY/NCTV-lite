import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { addEvent, db, deleteEvent } from "@/lib/store";
import type { EventStatus } from "@/lib/types";

export async function GET() { return NextResponse.json((await db()).events); }
export async function POST(request: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json({ error: "Требуются права администратора" }, { status: 403 });
  const body = await request.json();
  if (!["UPCOMING", "LIVE", "FINISHED"].includes(body.status) || !body.name?.trim() || !body.startsAt) return NextResponse.json({ error: "Заполните название, дату и статус" }, { status: 400 });
  return NextResponse.json(await addEvent({ name: body.name.trim(), location: body.location?.trim() || "TBA", startsAt: body.startsAt, endsAt: body.endsAt || body.startsAt, status: body.status as EventStatus, prize: body.prize?.trim() || "—", description: body.description?.trim() || "Без описания" }), { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN") return NextResponse.json({ error: "Требуются права администратора" }, { status: 403 });
  const { id } = await request.json();
  return await deleteEvent(id) ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Мероприятие не найдено" }, { status: 404 });
}
