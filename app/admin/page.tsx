import { redirect } from "next/navigation";
import Header from "@/components/Header";
import AdminPanel from "@/components/AdminPanel";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/store";
export default async function AdminPage() { const session=await getSession(); if (session?.role !== "ADMIN") redirect("/login"); const data=await db(); return <><Header/><main className="page"><div className="page-head"><h1>Панель администратора</h1><p>Публикуйте турниры, добавляйте матчи и обновляйте результаты.</p></div><AdminPanel events={data.events} teams={data.teams} matches={data.matches}/></main></>; }
