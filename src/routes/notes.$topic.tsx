import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell, Card, PageTitle } from "@/components/AppShell";
import { TOPICS, type TopicKey } from "@/lib/shift";
import { CsatLibrary } from "@/components/CsatLibrary";

export const Route = createFileRoute("/notes/$topic")({
  loader: ({ params }) => {
    const t = TOPICS[params.topic as TopicKey];
    if (!t) throw notFound();
    return { title: t.title, lead: params.topic === "csat" ? "Клиентский опыт в исходящих продажах" : t.lead, tips: [...t.tips], isCsat: params.topic === "csat" };
  },
  head: ({ loaderData }) => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: `${loaderData?.title ?? "Памятка"} — Мой план на смену` },
      { name: "description", content: loaderData?.isCsat ? "24 памятки по CSAT для исходящих продаж: начало разговора, эмпатия, презентация, вопросы, завершение и оценка качества." : loaderData?.lead ?? "Памятка для сотрудника" },
      { property: "og:title", content: `${loaderData?.title ?? "Памятка"} — Мой план на смену` },
      { property: "og:description", content: loaderData?.isCsat ? "Библиотека клиентского опыта: восемь категорий, готовые фразы и примеры диалогов для исходящего телемаркетинга." : loaderData?.lead ?? "Памятка для сотрудника" },
    ],
  }),
  component: Topic,
});

function Topic() {
  const t = Route.useLoaderData();
  return (
    <AppShell>
      <Link to="/notes" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Памятки
      </Link>
      <PageTitle eyebrow={t.lead} title={t.title} />
      {t.isCsat ? <CsatLibrary /> : <Card>
        <ol className="space-y-5">
          {t.tips.map((tip, i) => (
            <li key={i} className="flex gap-4">
              <span className="font-display text-2xl text-accent-strong">{String(i + 1).padStart(2, "0")}</span>
              <p className="pt-1 text-foreground">{tip}</p>
            </li>
          ))}
        </ol>
      </Card>}
    </AppShell>
  );
}
