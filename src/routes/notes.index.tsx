import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageTitle } from "@/components/AppShell";
import { WorkingLibrary } from "@/components/WorkingLibrary";

export const Route = createFileRoute("/notes/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Памятки — Мой план на смену" },
      { name: "description", content: "Библиотека исходящих звонков: CSAT, две зоны ACSAT, кросс-продажи, поиск и избранное." },
      { property: "og:title", content: "Памятки" },
      { property: "og:description", content: "Библиотека исходящих звонков: CSAT, две зоны ACSAT, кросс-продажи, поиск и избранное." },
    ],
  }),
  component: Notes,
});

function Notes() {
  return (
    <AppShell>
      <PageTitle eyebrow="База знаний" title="Памятки" />
      <WorkingLibrary />
    </AppShell>
  );
}
