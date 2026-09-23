import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { addMatch, db, deleteMatch, updateMatch } from "@/lib/store";
import type { EventStatus } from "@/lib/types";
export async function GET() { return NextResponse.json((await db()).matches); }
export async function POST(request: Request) {
  const session = await getSession(); if (session?.role !== "ADMIN") return NextResponse.json({ error: "Требуются права администратора" }, { status: 403 });
  const body = await request.json();
  if (!body.eventId || !body.teamA || !body.teamB || body.teamA === body.teamB) return NextResponse.json({ error: "Выберите мероприятие и две разные команды" }, { status: 400 });
  return NextResponse.json(await addMatch({ eventId: body.eventId, teamA: body.teamA, teamB: body.teamB, scoreA: Number(body.scoreA) || 0, scoreB: Number(body.scoreB) || 0, startsAt: body.startsAt || new Date().toISOString(), status: body.status as EventStatus || "UPCOMING", bestOf: Number(body.bestOf) || 3 }), { status: 201 });
}
export async function PATCH(request: Request) {
  const session = await getSession(); if (session?.role !== "ADMIN") return NextResponse.json({ error: "Требуются права администратора" }, { status: 403 });
  const body = await request.json(); const match = await updateMatch(body.id, { scoreA: Number(body.scoreA), scoreB: Number(body.scoreB), status: body.status });
  return match ? NextResponse.json(match) : NextResponse.json({ error: "Матч не найден" }, { status: 404 });
}
export async function DELETE(request: Request) {
  const session = await getSession(); if (session?.role !== "ADMIN") return NextResponse.json({ error: "Требуются права администратора" }, { status: 403 });
  const { id } = await request.json();
  return await deleteMatch(id) ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Матч не найден" }, { status: 404 });
}
