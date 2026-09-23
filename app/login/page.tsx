import { redirect } from "next/navigation";
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import { getSession } from "@/lib/auth";
export default async function LoginPage() { if (await getSession()) redirect("/"); return <><Header/><main className="auth-page"><section className="card auth-card"><div className="auth-heading"><span className="logo"><i>N</i>CTV</span><h1>Вход в NCTV</h1><p>Авторизуйтесь, чтобы управлять турнирами.</p></div><LoginForm/></section></main></>; }
