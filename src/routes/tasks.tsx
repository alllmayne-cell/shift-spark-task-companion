import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, PageTitle } from "@/components/AppShell";
import { TaskList } from "@/components/TaskList";
import { useShift } from "@/lib/shift";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Мои задачи — Мой план на смену" },
      { name: "description", content: "Список задач на смену с отметками выполнения." },
      { property: "og:title", content: "Мои задачи" },
      { property: "og:description", content: "Список задач на смену с отметками выполнения." },
    ],
  }),
  component: Tasks,
});

function Tasks() {
  const { doneCount, total, reset } = useShift();
  return (
    <AppShell>
      <PageTitle eyebrow={`Выполнено ${doneCount} из ${total}`} title="Мои задачи" />
      <Card className="mb-6"><TaskList /></Card>
      <Button variant="outline" onClick={() => { if (confirm("Сбросить прогресс и начать новую смену?")) reset(); }}
        className="h-auto min-h-12 w-full whitespace-normal rounded-lg px-4 py-3 text-sm">
        <RotateCcw /> Начать новую смену
      </Button>
    </AppShell>
  );
}
