import { promises as fs } from "fs";
import path from "path";
import type { Database, Event, Match } from "./types";

const filePath = path.join(process.cwd(), "data", "nctv.json");

export async function db(): Promise<Database> {
  return JSON.parse(await fs.readFile(filePath, "utf8")) as Database;
}

async function save(data: Database) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function addEvent(input: Omit<Event, "id" | "createdAt">) {
  const data = await db();
  const event: Event = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  data.events.unshift(event);
  await save(data);
  return event;
}

export async function addMatch(input: Omit<Match, "id">) {
  const data = await db();
  const match: Match = { ...input, id: crypto.randomUUID() };
  data.matches.unshift(match);
  await save(data);
  return match;
}

export async function updateMatch(id: string, patch: Pick<Match, "scoreA" | "scoreB" | "status">) {
  const data = await db();
  const match = data.matches.find((item) => item.id === id);
  if (!match) return null;
  Object.assign(match, patch);
  await save(data);
  return match;
}

export async function deleteMatch(id: string) {
  const data = await db();
  const length = data.matches.length;
  data.matches = data.matches.filter((match) => match.id !== id);
  if (data.matches.length === length) return false;
  await save(data);
  return true;
}

export async function deleteEvent(id: string) {
  const data = await db();
  const length = data.events.length;
  data.events = data.events.filter((event) => event.id !== id);
  data.matches = data.matches.filter((match) => match.eventId !== id);
  if (data.events.length === length) return false;
  await save(data);
  return true;
}
