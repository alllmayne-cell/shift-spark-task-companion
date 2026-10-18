import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Sparkles, Clock3, X, Award, Check, MessageCircle, Headphones, Layers, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import officeCat from "@/assets/office-cat.png";
import { AppShell } from "@/components/AppShell";
import { TaskList, Progress } from "@/components/TaskList";
import { CAT_LINES, TOPICS, WINS, useShift, type TopicKey } from "@/lib/shift";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Мой план на смену — главная" },
      { name: "description", content: "План смены, прогресс задач и памятки для сотрудника контакт-центра." },
      { property: "og:title", content: "Мой план на смену" },
      { property: "og:description", content: "План смены, прогресс задач и памятки для сотрудника контакт-центра." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Доброе утро" : h < 18 ? "Добрый день" : "Добрый вечер";
}

function Index() {
  const { percent, doneCount, total, win, setWin } = useShift();
  const [cat, setCat] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const date = new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" });

  return (
    <AppShell>
      <header className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:gap-4">
        <div className="min-w-0">
          <p className="mb-2 text-xs text-muted-foreground first-letter:uppercase" suppressHydrationWarning>{date}</p>
          <h1 className="font-display text-2xl leading-snug text-foreground md:text-3xl" suppressHydrationWarning>{greeting()}, Анна</h1>
        </div>
        <Button variant="ghost" aria-label="Кот-выживальщик" title="Совет кота-выживальщика"
          onClick={() => setCat(CAT_LINES[Math.floor(Math.random() * CAT_LINES.length)] ?? null)}
          className="h-24 w-20 shrink-0 p-0 transition-transform hover:-rotate-3 hover:bg-transparent motion-reduce:transform-none md:h-28 md:w-24">
          <img src={officeCat} alt="Кот в офисной гарнитуре с чашкой кофе" width={512} height={512} className="h-full w-full object-contain" />
        </Button>
      </header>
      {cat && (
        <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-lg border border-accent bg-accent/20 p-4 text-sm text-foreground">
          <p role="status" className="min-w-0 leading-relaxed">{cat}</p>
          <Button variant="ghost" size="icon" aria-label="Закрыть совет" onClick={() => setCat(null)} className="h-7 w-7 text-muted-foreground"><X /></Button>
        </div>
      )}

      <section aria-label="Моя смена" className="mb-6 rounded-lg bg-shift p-6 text-shift-foreground md:p-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h2 className="font-display text-xl">Моя смена</h2>
          <p className="flex shrink-0 items-center gap-1.5 text-xs text-shift-foreground/70"><Clock3 className="h-3.5 w-3.5" strokeWidth={1.5} />09:00–18:00</p>
        </div>
        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <p className="font-display text-6xl leading-none md:text-7xl">{percent}<span className="ml-1 text-3xl text-shift-foreground/60">%</span></p>
          </div>
          <p className="pb-1 text-xs text-shift-foreground/70">{doneCount} из {total} задач</p>
        </div>
        <div className="mt-5"><Progress percent={percent} /></div>
        <p className="mt-4 text-sm leading-relaxed text-shift-foreground/75">
          {percent === 100 ? "Смена закрыта. Вы великолепны." : percent >= 50 ? "Больше половины позади — держите темп." : "Спокойный старт — лучший старт."}
        </p>
      </section>

      <section className="mb-7 border-y border-border bg-card px-3 py-5 md:px-6">
        <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <h2 className="font-display text-lg">План на сегодня</h2>
          <Button asChild variant="link" className="h-8 px-0 text-xs"><Link to="/tasks">Все задачи <ArrowUpRight /></Link></Button>
        </div>
        <TaskList />
      </section>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {(Object.keys(TOPICS) as TopicKey[]).map((k) => (
          <Link key={k} to="/notes/$topic" params={{ topic: k }}
            className="group min-w-0 rounded-lg border border-border bg-secondary/60 p-4 transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-primary">
            <div className="mb-4 flex items-center justify-between text-primary">
              {k === "csat" ? <MessageCircle className="h-5 w-5" strokeWidth={1.5} /> : k === "acsat" ? <Headphones className="h-5 w-5" strokeWidth={1.5} /> : k === "products" ? <Layers className="h-5 w-5" strokeWidth={1.5} /> : <MessagesSquare className="h-5 w-5" strokeWidth={1.5} />}
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-accent-strong" />
            </div>
            <p className="font-display text-base">{TOPICS[k].title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{TOPICS[k].lead}</p>
          </Link>
        ))}
      </div>

      <section className="border-t border-border pt-6">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent-strong" />
          <h2 className="font-display text-lg">Моя маленькая победа</h2>
        </div>
        {win ? (
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg bg-accent/20 p-4">
            <p className="min-w-0 text-sm text-foreground"><Award className="mb-2 h-5 w-5 text-accent-strong" />{win}</p>
            <Button variant="ghost" onClick={() => setWin(null)} className="px-2 text-xs text-muted-foreground">Изменить</Button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {WINS.map((w) => (
                <Button variant="outline" key={w} onClick={() => setWin(w)}
                  className="h-auto min-h-10 max-w-full whitespace-normal rounded-lg px-3 py-2 text-left text-xs font-normal shadow-none hover:border-accent-strong hover:bg-accent/20">{w}</Button>
              ))}
            </div>
            <form className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-2" onSubmit={(e) => { e.preventDefault(); if (custom.trim()) { setWin(custom.trim()); setCustom(""); } }}>
              <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Или напишите свою…"
                aria-label="Своя маленькая победа" className="min-w-0 rounded-lg border border-input bg-card px-3 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              <Button type="submit" size="icon" aria-label="Отметить победу" title="Отметить победу" className="h-12 w-12 rounded-lg"><Check /></Button>
            </form>
          </>
        )}
      </section>
    </AppShell>
  );
}
