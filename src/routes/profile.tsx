import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, PageTitle } from "@/components/AppShell";
import { useShift } from "@/lib/shift";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Профиль — Мой план на смену" },
      { name: "description", content: "Профиль сотрудника и итоги текущей смены." },
      { property: "og:title", content: "Профиль" },
      { property: "og:description", content: "Профиль сотрудника и итоги текущей смены." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { percent, win, reset } = useShift();
  return (
    <AppShell>
      <PageTitle eyebrow="Профиль" title="Анна Смирнова" />
      <Card className="mb-6">
        <dl className="grid grid-cols-2 gap-6 text-sm">
          <div><dt className="text-muted-foreground">Роль</dt><dd>Оператор исходящих продаж</dd></div>
          <div><dt className="text-muted-foreground">Группа</dt><dd>Олива-3</dd></div>
          <div><dt className="text-muted-foreground">Прогресс смены</dt><dd className="font-display text-3xl">{percent}%</dd></div>
          <div><dt className="text-muted-foreground">Победа дня</dt><dd>{win ?? "Пока не отмечена"}</dd></div>
        </dl>
      </Card>
      <button onClick={() => { if (confirm("Сбросить прогресс и начать новую смену?")) reset(); }}
        className="w-full rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground">
        Сбросить прогресс для новой смены
      </button>
      <p className="mt-6 text-center text-xs text-muted-foreground">Данные вымышленные и хранятся только в этом браузере.</p>
    </AppShell>
  );
}
