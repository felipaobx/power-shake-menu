import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "../auth";
import { Brand } from "../components";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  const session = await getSession();
  if (session) redirect(session.role === "admin" ? "/dashboard" : "/cozinha");
  const next = params.next === "/cozinha" || params.next === "/dashboard" ? params.next : undefined;
  return <main className="login-page"><section className="login-card"><Brand inverse /><div className="login-heading"><span>ÁREA RESTRITA</span><h1>Acessar o sistema</h1><p>Entre com seu usuário e senha para continuar.</p></div><LoginForm next={next} /><Link className="back-to-menu" href="/">← Voltar ao cardápio</Link></section><aside className="login-visual"><div><span>GESTÃO POWER SHAKE</span><h2>Cardápio, operação e cozinha em ambientes separados.</h2><p>Cada equipe vê apenas as ferramentas de que precisa.</p></div></aside></main>;
}
