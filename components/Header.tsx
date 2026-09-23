import Link from "next/link";
import { getSession } from "@/lib/auth";
export default async function Header() {
  const session = await getSession();
  return <><header className="topbar"><div className="topbar-inner"><Link className="logo" href="/"><span>N</span>CTV</Link><nav><Link href="/">Новости</Link><Link href="/matches">Матчи</Link><Link href="/ranking">Рейтинг</Link><Link href="/events">События</Link></nav>{session ? <div className="user-menu"><span>{session.name}</span>{session.role === "ADMIN" && <Link className="admin-link" href="/admin">Админка</Link>}<form action="/api/auth/logout" method="post"><button className="text-button">Выйти</button></form></div> : <Link className="login-link" href="/login">Войти</Link>}</div></header><div className="ticker"><div className="ticker-inner"><span><b className="pill soon">CHESS</b>NIS Chess Cup 2026 · 12 октября</span><span><b className="pill soon">NCTV</b>Школьные соревнования NIS в одном месте</span><span><b className="pill soon">СКОРО</b>Расписание публикует администратор</span></div></div></>;
}
