import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "NCTV — NIS Competitive Tournament Viewer", description: "Турниры, матчи и рейтинг команд NIS" };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ru"><body>{children}</body></html>; }
