import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell, Card, PageTitle } from "@/components/AppShell";
import { TOPICS, type TopicKey } from "@/lib/shift";

export const Route = createFileRoute("/notes/$topic")({
  loader: ({ params }) => {
    const t = TOPICS[params.topic as TopicKey];
    if (!t) throw notFound();
    return { title: t.title, lead: t.lead, tips: [...t.tips] };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Памятка"} — Мой план на смену` },
      { name: "description", content: loaderData?.lead ?? "Памятка для сотрудника" },
      { property: "og:title", content: loaderData?.title ?? "Памятка" },
      { property: "og:description", content: loaderData?.lead ?? "Памятка для сотрудника" },
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
      <Card>
        <ol className="space-y-5">
          {t.tips.map((tip, i) => (
            <li key={i} className="flex gap-4">
              <span className="font-display text-2xl text-accent-strong">{String(i + 1).padStart(2, "0")}</span>
              <p className="pt-1 text-foreground">{tip}</p>
            </li>
          ))}
        </ol>
      </Card>
    </AppShell>
  );
}
