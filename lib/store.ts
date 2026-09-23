import { neon } from "@neondatabase/serverless";
import type { Database, Event, Match, Team } from "./types";

const sql = neon(process.env.nctv_POSTGRES_URL || process.env.POSTGRES_URL || "postgresql://nctv:nctv@localhost:5432/nctv");

let setup: Promise<void> | undefined;
async function ensureDatabase() {
  if (setup) return setup;
  setup = (async () => {
    await sql`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL)`;
    await sql`CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, name TEXT NOT NULL, location TEXT NOT NULL, starts_at TEXT NOT NULL, ends_at TEXT NOT NULL, status TEXT NOT NULL, prize TEXT NOT NULL, description TEXT NOT NULL, created_at TEXT NOT NULL)`;
    await sql`CREATE TABLE IF NOT EXISTS teams (id TEXT PRIMARY KEY, name TEXT NOT NULL, city TEXT NOT NULL, points INTEGER NOT NULL, color TEXT NOT NULL)`;
    await sql`CREATE TABLE IF NOT EXISTS matches (id TEXT PRIMARY KEY, event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE, team_a TEXT NOT NULL, team_b TEXT NOT NULL, score_a INTEGER NOT NULL, score_b INTEGER NOT NULL, starts_at TEXT NOT NULL, status TEXT NOT NULL, best_of INTEGER NOT NULL)`;
    const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM users`;
    if (Number(count) > 0) return;
    await sql`INSERT INTO users (id, name, email, password_hash, role) VALUES ('admin-1', 'Администратор NCTV', 'admin@nctv.kz', '$2a$12$EEYuehOZh91bbvvb5tu05.JwTG2hXrIeA3a9xc/PXgY97lRscuy3G', 'ADMIN')`;
    await sql`INSERT INTO events (id, name, location, starts_at, ends_at, status, prize, description, created_at) VALUES ('chess-cup-2026', 'NIS Chess Cup 2026', 'Астана', '2026-10-12', '2026-10-13', 'UPCOMING', 'Кубок NCTV', 'Первый школьный шахматный турнир NIS. Регистрация участников скоро откроется.', '2026-09-04T10:00:00.000Z')`;
    const teams = [['astana', 'NIS Astana', 'Астана', 892, '#e31c23'], ['almaty', 'NIS Almaty', 'Алматы', 861, '#2f6feb'], ['shymkent', 'NIS Shymkent', 'Шымкент', 804, '#27a35a'], ['semey', 'NIS Semey', 'Семей', 751, '#c9a227'], ['aktau', 'NIS Aktau', 'Актау', 718, '#7a5cff']];
    for (const [id, name, city, points, color] of teams) await sql`INSERT INTO teams (id, name, city, points, color) VALUES (${id}, ${name}, ${city}, ${points}, ${color})`;
  })();
  return setup;
}

export async function db(): Promise<Database> {
  await ensureDatabase();
  const [users, events, teams, matches] = await Promise.all([sql`SELECT id, name, email, password_hash, role FROM users`, sql`SELECT id, name, location, starts_at, ends_at, status, prize, description, created_at FROM events ORDER BY starts_at DESC`, sql`SELECT id, name, city, points, color FROM teams ORDER BY points DESC`, sql`SELECT id, event_id, team_a, team_b, score_a, score_b, starts_at, status, best_of FROM matches ORDER BY starts_at DESC`]);
  return { users: users.map(row => ({ id: String(row.id), name: String(row.name), email: String(row.email), passwordHash: String(row.password_hash), role: row.role as "USER" | "ADMIN" })), events: events.map(row => ({ id: String(row.id), name: String(row.name), location: String(row.location), startsAt: String(row.starts_at), endsAt: String(row.ends_at), status: row.status as Event["status"], prize: String(row.prize), description: String(row.description), createdAt: String(row.created_at) })), teams: teams.map(row => ({ id: String(row.id), name: String(row.name), city: String(row.city), points: Number(row.points), color: String(row.color) })), matches: matches.map(row => ({ id: String(row.id), eventId: String(row.event_id), teamA: String(row.team_a), teamB: String(row.team_b), scoreA: Number(row.score_a), scoreB: Number(row.score_b), startsAt: String(row.starts_at), status: row.status as Match["status"], bestOf: Number(row.best_of) })) };
}

export async function addEvent(input: Omit<Event, "id" | "createdAt">) { await ensureDatabase(); const event: Event = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() }; await sql`INSERT INTO events (id, name, location, starts_at, ends_at, status, prize, description, created_at) VALUES (${event.id}, ${event.name}, ${event.location}, ${event.startsAt}, ${event.endsAt}, ${event.status}, ${event.prize}, ${event.description}, ${event.createdAt})`; return event; }
export async function addMatch(input: Omit<Match, "id">) { await ensureDatabase(); const match: Match = { ...input, id: crypto.randomUUID() }; await sql`INSERT INTO matches (id, event_id, team_a, team_b, score_a, score_b, starts_at, status, best_of) VALUES (${match.id}, ${match.eventId}, ${match.teamA}, ${match.teamB}, ${match.scoreA}, ${match.scoreB}, ${match.startsAt}, ${match.status}, ${match.bestOf})`; return match; }
export async function updateMatch(id: string, patch: Pick<Match, "scoreA" | "scoreB" | "status">) { await ensureDatabase(); const rows = await sql`UPDATE matches SET score_a = ${patch.scoreA}, score_b = ${patch.scoreB}, status = ${patch.status} WHERE id = ${id} RETURNING id, event_id, team_a, team_b, score_a, score_b, starts_at, status, best_of`; const row = rows[0]; return row ? { id: String(row.id), eventId: String(row.event_id), teamA: String(row.team_a), teamB: String(row.team_b), scoreA: Number(row.score_a), scoreB: Number(row.score_b), startsAt: String(row.starts_at), status: row.status as Match["status"], bestOf: Number(row.best_of) } : null; }
export async function deleteMatch(id: string) { await ensureDatabase(); return (await sql`DELETE FROM matches WHERE id = ${id} RETURNING id`).length > 0; }
export async function deleteEvent(id: string) { await ensureDatabase(); return (await sql`DELETE FROM events WHERE id = ${id} RETURNING id`).length > 0; }
export async function addTeam(input: Omit<Team, "id">) { await ensureDatabase(); const team: Team = { ...input, id: crypto.randomUUID() }; await sql`INSERT INTO teams (id, name, city, points, color) VALUES (${team.id}, ${team.name}, ${team.city}, ${team.points}, ${team.color})`; return team; }
export async function updateTeam(id: string, patch: Omit<Team, "id">) { await ensureDatabase(); const rows = await sql`UPDATE teams SET name = ${patch.name}, city = ${patch.city}, points = ${patch.points}, color = ${patch.color} WHERE id = ${id} RETURNING id, name, city, points, color`; const row = rows[0]; return row ? { id: String(row.id), name: String(row.name), city: String(row.city), points: Number(row.points), color: String(row.color) } : null; }
export async function deleteTeam(id: string) { await ensureDatabase(); const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM matches WHERE team_a = ${id} OR team_b = ${id}`; if (Number(count) > 0) return "HAS_MATCHES"; return (await sql`DELETE FROM teams WHERE id = ${id} RETURNING id`).length > 0 ? "DELETED" : "NOT_FOUND"; }
