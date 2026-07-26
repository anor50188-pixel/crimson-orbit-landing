import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, Rocket, SlidersHorizontal, Users } from "lucide-react";
import heroPlanet from "@/assets/hero-planet.jpg";
import wordmark from "@/assets/agentus-wordmark.png";

export const Route = createFileRoute("/biz-haqimizda")({
  head: () => ({
    meta: [
      { title: "Biz haqimizda — Agentus" },
      { name: "description", content: "Agentus — har bir inson uchun AI jamoa. O'z agentlaringizni yarating, biznesingizga moslashtiring va sun'iy intellekt ekotizimidan foydalaning." },
      { property: "og:title", content: "Biz haqimizda — Agentus" },
      { property: "og:description", content: "Agentus — har bir inson uchun AI jamoa. O'z agentlaringizni yarating, biznesingizga moslashtiring." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BizHaqimizda,
});

const values = [
  {
    icon: Heart,
    title: "Inson markazida",
    desc: "AI insonning o'rnini emas, uning rivojlanishini tezlashtiradi. Har bir funksiya foydalanuvchi hayotini yaxshilaydimi — shu savoldan boshlanadi.",
  },
  {
    icon: Rocket,
    title: "Oson boshlash",
    desc: "G'oyadan ishlaydigan AI agentga atigi bir necha daqiqa. Kod yoki murakkab sozlamalar talab qilmaydi.",
  },
  {
    icon: SlidersHorizontal,
    title: "Cheksiz moslashuv",
    desc: "Boshlash oson, chuqur moslashtirish esa cheklanmagan. Agentlaringizni o'z biznesingiz va vazifalaringizga qarab o'stiring.",
  },
  {
    icon: Users,
    title: "Hamkor AI jamoasi",
    desc: "Agentlaringizni birga ishga soling, ulashing va AI jamoalaringizni Marketplace'da dunyo bilan ulisting.",
  },
];

function BizHaqimizda() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="relative z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link to="/" className="flex items-baseline gap-0.5">
            <span className="text-xl font-black italic tracking-tight">AGENTUS</span>
            <span className="text-primary">.</span>
          </Link>
          <nav className="hidden items-center gap-10 md:flex">
            <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Bosh sahifa
            </Link>
            <a href="/#xususiyatlar" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Xususiyatlar
            </a>
            <Link
              to="/biz-haqimizda"
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Biz haqimizda
            </Link>
            <Link
              to="/roadmap"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Yo'l xaritasi
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70vh]">
          <img
            src={heroPlanet}
            alt=""
            width={1920}
            height={1280}
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/30 to-background/90" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
        </div>

        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-24 pt-16 text-center md:pt-24">
          <img
            src={wordmark}
            alt="AGENTUS"
            width={1600}
            height={544}
            className="w-full max-w-2xl select-none"
            draggable={false}
          />
          <h1 className="mt-8 text-3xl font-bold tracking-tight md:text-4xl">
            Biz haqimizda
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-xl text-foreground/90 md:text-2xl">
            <span className="text-primary">Agentus</span> — har bir inson uchun AI jamoa.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">Kompaniya haqida</p>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Agentus — har bir inson uchun AI jamoa
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/90">
            <p>
              Biz ishonamizki, muvaffaqiyatga erishish faqat katta kompaniyalarniki emas. Har bir inson, tadbirkor, freelancer va startap asoschisi ham o'zining sun'iy intellekt jamoasiga ega bo'lishi kerak.
            </p>
            <p>
              Agentus aynan shu maqsadda yaratilmoqda. Bugun ko'plab insonlar o'z g'oyalarini amalga oshirishni xohlaydi, lekin vaqt, mablag' yoki jamoa yetishmaydi. Agentus aynan shu muammoni hal qilish uchun mo'ljallangan.
            </p>
            <p>
              Bu yerda siz o'zingizga agentlaringizni yaratasiz, ularni biznesingizga moslashtirasiz, kerakli tool va integratsiyalarni ulaysiz, AI jamoalaringizni birgalikda ishlatasiz, vaqtingizni tejaysiz va samaradorlikni oshirasiz.
            </p>
            <p>
              Agentus AI platformasi emas. Bu — o'z g'oyalarini tatbiq etishni talab qiladigan insonlar uchun yaratilayotgan AI ekotizimidir.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">Missiya</p>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Bizning maqsadimiz oddiy
          </h2>
          <p className="mt-6 text-base leading-relaxed text-foreground/90">
            Har qanday odamga bir necha daqiqada o'ziga mos AI agent yoki AI jamoaga yordam berish.
          </p>
          <ul className="mt-8 space-y-4 text-base leading-relaxed text-foreground/90">
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>O'zingizga agentlaringizni yaratasiz.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>Ularni biznesingizga moslashtirasiz.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>Kerakli tool va integratsiyalarni ulaysiz.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>AI jamoalaringizni birgalikda ishlatasiz.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>Vaqtingizni tejaysiz va samaradorlikni oshirasiz.</span>
            </li>
          </ul>
          <p className="mt-8 text-base leading-relaxed text-foreground/90">
            Biz AI insonniga emas, insonning rivojlanishiga ishonamiz. Buning uchun Agentusning har bir funksiyasi bitta savol asosida yaratiladi: <em className="text-foreground">“Bu foydalanuvchining hayotini yaxshilaydimi?”</em> Agar javob ha bo'lsa, biz uni quramiz. Agar javob yo'q bo'lsa, biz uni qayta o'ylaymiz.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="mb-4 text-center text-xs uppercase tracking-widest text-muted-foreground">
            Asosiy qadriyatlar
          </p>
          <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
            Nega Agentus?
          </h2>
          <div className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-border text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Slogan */}
      <section className="border-t border-border/60 bg-background">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Bizning shiorimiz</p>
          <p className="mt-6 text-2xl font-semibold italic leading-snug text-foreground md:text-3xl">
            “Boshlash oson. Chuqur moslashtirish esa cheklanmagan.”
          </p>
        </div>
      </section>

      {/* Back link */}
      <section className="border-t border-border/60 bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Bosh sahifaga qaytish
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-xs text-muted-foreground">
          © 2026 Agentus — ishlab chiqilmoqda
        </div>
      </footer>
    </div>
  );
}
