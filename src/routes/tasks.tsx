import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, PageTitle } from "@/components/AppShell";
import { TaskList } from "@/components/TaskList";
import { useShift } from "@/lib/shift";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
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
      <button onClick={() => { if (confirm("Сбросить прогресс и начать новую смену?")) reset(); }}
        className="w-full rounded-full border border-border px-5 py-3 text-sm text-muted-foreground hover:border-primary hover:text-foreground">
        Начать новую смену
      </button>
    </AppShell>
  );
}
