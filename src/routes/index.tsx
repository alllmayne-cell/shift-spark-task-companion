import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { AppShell, Card } from "@/components/AppShell";
import { TaskList, Progress } from "@/components/TaskList";
import { CAT_LINES, TOPICS, WINS, useShift, type TopicKey } from "@/lib/shift";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Мой план на смену — главная" },
      { name: "description", content: "План смены, прогресс задач и памятки для сотрудника контакт-центра." },
      { property: "og:title", content: "Мой план на смену" },
      { property: "og:description", content: "План смены, прогресс задач и памятки для сотрудника контакт-центра." },
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
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-muted-foreground" suppressHydrationWarning>{date}</p>
          <h1 className="font-display text-4xl text-foreground md:text-5xl" suppressHydrationWarning>{greeting()}, Анна</h1>
        </div>
        <button aria-label="Кот-выживальщик" title="Кто это тут?"
          onClick={() => setCat(CAT_LINES[Math.floor(Math.random() * CAT_LINES.length)] ?? null)}
          className="rounded-full border border-border bg-card px-3 py-2 text-xl transition-transform hover:-rotate-12">
          🐈‍⬛
        </button>
      </header>
      {cat && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-accent/30 p-4 text-sm text-foreground">
          <span>☕</span><p className="flex-1">{cat}</p>
          <button onClick={() => setCat(null)} className="text-muted-foreground">✕</button>
        </div>
      )}

      <section className="mb-6 rounded-3xl bg-primary p-6 text-primary-foreground md:p-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] opacity-70">Моя смена · 09:00–18:00</p>
            <p className="mt-2 font-display text-6xl">{percent}%</p>
          </div>
          <p className="text-sm opacity-80">{doneCount} из {total} задач</p>
        </div>
        <div className="mt-5"><Progress percent={percent} /></div>
        <p className="mt-4 text-sm opacity-80">
          {percent === 100 ? "Смена закрыта. Вы великолепны." : percent >= 50 ? "Больше половины позади — держите темп." : "Спокойный старт — лучший старт."}
        </p>
      </section>

      <Card className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-display text-2xl">План на сегодня</h2>
          <Link to="/tasks" className="text-sm text-muted-foreground hover:text-foreground">Все задачи</Link>
        </div>
        <TaskList />
      </Card>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {(Object.keys(TOPICS) as TopicKey[]).map((k) => (
          <Link key={k} to="/notes/$topic" params={{ topic: k }}
            className="group rounded-3xl border border-border bg-secondary p-5 transition-colors hover:bg-card">
            <ArrowUpRight className="mb-6 h-4 w-4 text-muted-foreground group-hover:text-accent-strong" />
            <p className="font-display text-xl">{TOPICS[k].title}</p>
            <p className="text-xs text-muted-foreground">{TOPICS[k].lead}</p>
          </Link>
        ))}
      </div>

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent-strong" />
          <h2 className="font-display text-2xl">Моя маленькая победа</h2>
        </div>
        {win ? (
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-accent/30 p-4">
            <p className="text-foreground">🏅 {win}</p>
            <button onClick={() => setWin(null)} className="text-sm text-muted-foreground hover:text-foreground">Изменить</button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {WINS.map((w) => (
                <button key={w} onClick={() => setWin(w)}
                  className="rounded-full border border-border px-4 py-2 text-sm hover:border-accent-strong hover:bg-accent/20">{w}</button>
              ))}
            </div>
            <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (custom.trim()) { setWin(custom.trim()); setCustom(""); } }}>
              <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Или напишите свою…"
                className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus:border-primary" />
              <button className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">Отметить</button>
            </form>
          </>
        )}
      </Card>
    </AppShell>
  );
}
