export type EventStatus = "UPCOMING" | "LIVE" | "FINISHED";
export type Role = "USER" | "ADMIN";
export type Team = { id: string; name: string; city: string; points: number; color: string };
export type Event = { id: string; name: string; location: string; startsAt: string; endsAt: string; status: EventStatus; prize: string; description: string; createdAt: string };
export type Match = { id: string; eventId: string; teamA: string; teamB: string; scoreA: number; scoreB: number; startsAt: string; status: EventStatus; bestOf: number };
export type User = { id: string; name: string; email: string; passwordHash: string; role: Role };
export type Database = { users: User[]; events: Event[]; teams: Team[]; matches: Match[] };
