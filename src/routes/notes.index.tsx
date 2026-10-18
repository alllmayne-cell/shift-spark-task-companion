import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { AppShell, PageTitle } from "@/components/AppShell";
import { TOPICS, type TopicKey } from "@/lib/shift";

export const Route = createFileRoute("/notes/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Памятки — Мой план на смену" },
      { name: "description", content: "Памятки по CSAT, ACSAT, продуктам и возражениям." },
      { property: "og:title", content: "Памятки" },
      { property: "og:description", content: "Памятки по CSAT, ACSAT, продуктам и возражениям." },
    ],
  }),
  component: Notes,
});

function Notes() {
  return (
    <AppShell>
      <PageTitle eyebrow="База знаний" title="Памятки" />
      <div className="grid gap-3 md:grid-cols-2">
        {(Object.keys(TOPICS) as TopicKey[]).map((k) => (
          <Link key={k} to="/notes/$topic" params={{ topic: k }}
            className="flex items-center justify-between rounded-lg border border-border bg-card p-6 hover:bg-secondary">
            <div>
              <p className="font-display text-2xl">{TOPICS[k].title}</p>
              <p className="text-sm text-muted-foreground">{TOPICS[k].lead}</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-accent-strong" />
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
