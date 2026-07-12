import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bot, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/agentlarim")({
  component: AgentlarimPage,
  head: () => ({
    meta: [
      { title: "Agentlarim — Agentus" },
      { name: "description", content: "Sizning yaratgan AI agentlaringiz ro'yxati." },
    ],
  }),
});

type SavedAgent = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

function AgentlarimPage() {
  const [agents, setAgents] = useState<SavedAgent[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("agentus:agents");
      if (raw) setAgents(JSON.parse(raw));
    } catch {
      // ignore parse errors
    }
  }, []);

  return (
    <div className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/agent-yaratish"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Orqaga
        </Link>
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">Agentlarim</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Siz yaratgan agentlar shu yerda saqlanadi (demo — brauzerda saqlanmoqda).
        </p>

        {agents.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-card/60 p-10 text-center">
            <Bot className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Hozircha agent yo'q. Birinchi agentingizni yaratib ko'ring.
            </p>
            <Link
              to="/agent-yaratish"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Agent yaratish
            </Link>
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {agents.map((a) => (
              <li
                key={a.id}
                className="rounded-xl border border-border/60 bg-card/60 p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
                    <Bot className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-semibold">{a.name}</p>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {a.description}
                </p>
                <p className="mt-3 text-[10px] uppercase tracking-wide text-muted-foreground/70">
                  {new Date(a.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}