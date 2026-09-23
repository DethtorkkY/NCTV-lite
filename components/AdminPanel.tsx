"use client";

import { useState } from "react";
import type { Event, Match, Team } from "@/lib/types";

type Props = { events: Event[]; teams: Team[]; matches: Match[] };

export default function AdminPanel({ events, teams, matches }: Props) {
  const [notice, setNotice] = useState("");
  async function send(url: string, method: string, data: Record<string, FormDataEntryValue>) {
    const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) return setNotice(result.error);
    setNotice("Сохранено. Обновляем данные…"); window.location.reload();
  }
  function submit(url: string, method: string, form: HTMLFormElement) { send(url, method, Object.fromEntries(new FormData(form))); }
  return <div className="admin-grid">
    <section className="card pad"><h2>Новое мероприятие</h2><form className="stack" onSubmit={(e) => { e.preventDefault(); submit("/api/events", "POST", e.currentTarget); }}><input name="name" required placeholder="Название турнира"/><input name="location" placeholder="Город проведения"/><div className="two"><label>Начало<input name="startsAt" required type="date"/></label><label>Конец<input name="endsAt" type="date"/></label></div><select name="status"><option value="UPCOMING">Скоро</option><option value="LIVE">Идёт</option><option value="FINISHED">Завершено</option></select><input name="prize" placeholder="Награда"/><textarea name="description" placeholder="Краткое описание"/><button className="primary">Опубликовать</button></form></section>
    <section className="card pad"><h2>Добавить матч</h2><form className="stack" onSubmit={(e) => { e.preventDefault(); submit("/api/matches", "POST", e.currentTarget); }}><select name="eventId" required><option value="">Мероприятие</option>{events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select><div className="two"><select name="teamA" required><option value="">Участник 1</option>{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select><select name="teamB" required><option value="">Участник 2</option>{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div><div className="two"><input name="scoreA" type="number" min="0" defaultValue="0"/><input name="scoreB" type="number" min="0" defaultValue="0"/></div><select name="status"><option value="UPCOMING">Скоро</option><option value="LIVE">Идёт</option><option value="FINISHED">Завершён</option></select><button className="primary" disabled={!events.length}>Добавить матч</button>{!events.length && <small>Сначала создайте мероприятие.</small>}</form></section>
    <section className="card pad admin-matches"><h2>Управление данными</h2><div className="manage-group"><h3>Мероприятия</h3>{events.length ? events.map(event => <div className="manage-row" key={event.id}><span>{event.name}</span><button className="danger" onClick={() => send("/api/events", "DELETE", { id: event.id })}>Удалить</button></div>) : <p className="empty">Мероприятий пока нет.</p>}</div><div className="manage-group"><h3>Матчи</h3>{matches.length ? matches.map(m => <form key={m.id} className="score-form" onSubmit={(e) => { e.preventDefault(); submit("/api/matches", "PATCH", e.currentTarget); }}><input name="id" type="hidden" value={m.id}/><span>{teams.find(t=>t.id===m.teamA)?.name} — {teams.find(t=>t.id===m.teamB)?.name}</span><input name="scoreA" type="number" min="0" defaultValue={m.scoreA}/><input name="scoreB" type="number" min="0" defaultValue={m.scoreB}/><select name="status" defaultValue={m.status}><option value="UPCOMING">Скоро</option><option value="LIVE">Идёт</option><option value="FINISHED">Готово</option></select><button>Сохранить</button><button type="button" className="danger" onClick={() => send("/api/matches", "DELETE", { id: m.id })}>Удалить</button></form>) : <p className="empty">Матчей пока нет — их добавит администратор.</p>}</div></section>{notice && <p className="notice">{notice}</p>}
  </div>;
}
