import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Bot, Crown, Sparkles } from "lucide-react";
import wordmark from "@/assets/agentus-wordmark.png";
import { isProActive } from "@/lib/pro-subscription";

export const Route = createFileRoute("/seller/publish/$agentId")({
  component: SellerPublishPage,
  head: () => ({
    meta: [
      { title: "Sotuvchi nashriyot ustasi — Agentus" },
      {
        name: "description",
        content:
          "Agentni Marketplace'ga chiqarish uchun sotuvchi nashriyot ustasi.",
      },
    ],
  }),
});

function SellerPublishPage() {
  const { agentId } = Route.useParams();
  const [pro, setPro] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPro(isProActive());
    setHydrated(true);
  }, []);

  if (!hydrated) return <div className="min-h-screen bg-background" />;

  if (!pro) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div className="max-w-md">
          <Crown className="mx-auto h-8 w-8 text-violet-300" />
          <h1 className="mt-4 text-xl font-semibold">Pro obuna talab qilinadi</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Marketplace nashriyoti Pro sotuvchilar uchun ochiq.
          </p>
          <Link
            to="/seller"
            className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Sotuvchi paneliga o'tish
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex h-16 items-center justify-between border-b border-border/60 px-6">
        <div className="flex items-center gap-3">
          <Link
            to="/seller"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/40 text-muted-foreground transition hover:text-foreground"
            title="Sotuvchi paneli"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <img src={wordmark} alt="Agentus" className="h-6" />
        </div>
        <div className="text-xs text-muted-foreground">Nashriyot ustasi</div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 ring-1 ring-inset ring-violet-500/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Marketplace nashriyot ustasi</h1>
              <p className="text-xs text-muted-foreground">
                Agent identifikatori: <span className="font-mono text-foreground/80">{agentId}</span>
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-border/60 bg-background/60 p-5 text-sm leading-relaxed text-muted-foreground">
            Bu marshrut nashriyot ustasi uchun joy egallovchi sifatida
            tayyorlangan. Keyingi bosqichda quyidagi bosqichlar to'liq
            sehrgar shaklida ochiladi:
          </div>

          <ul className="mt-4 grid grid-cols-1 gap-2 text-xs text-foreground/85 sm:grid-cols-2">
            {[
              "Agent nomi va ommaviy tavsif",
              "Kategoriya va belgi",
              "Banner tasviri",
              "Sotuvchi narxi va versiya",
              "Toollar va workflow'lar soni",
              "Muvaffaqiyatli vazifalar statistikasi",
              "Agent kuchi va oylik API narxi",
              "Talab qilinadigan APIlar va modellar",
              "YouTube va Instagram demo havolalari",
              "Hujjatlashtirish va xaridor ko'rsatmalari",
            ].map((t) => (
              <li
                key={t}
                className="flex items-center gap-2 rounded-lg border border-border/40 bg-background/40 px-3 py-2"
              >
                <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-2 text-xs">
            <span className="rounded-md bg-muted px-2 py-1 text-muted-foreground">
              Tez orada
            </span>
            <span className="text-muted-foreground">
              To'liq sehrgar backend ulangandan so'ng faollashadi.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
