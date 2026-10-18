import { Check } from "lucide-react";
import { TASKS, useShift } from "@/lib/shift";
import { Button } from "@/components/ui/button";

export function TaskList() {
  const { done, toggle } = useShift();
  return (
    <ul className="divide-y divide-border">
      {TASKS.map((t) => {
        const isDone = done.includes(t.id);
        return (
          <li key={t.id}>
            <Button variant="ghost" onClick={() => toggle(t.id)} role="checkbox" aria-checked={isDone}
              className="h-auto min-h-20 w-full justify-start gap-3 whitespace-normal rounded-md px-2 py-4 text-left font-normal hover:bg-secondary/60">
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${isDone ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background"}`}>
                {isDone && <Check className="h-4 w-4" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block text-sm leading-relaxed ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>{t.title}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{t.time} · {t.tag}</span>
              </span>
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

export function Progress({ percent }: { percent: number }) {
  return (
    <div role="progressbar" aria-label="Прогресс смены" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} className="h-2 overflow-hidden rounded-full bg-on-dark-muted">
      <div className="h-full rounded-full bg-shift-progress transition-all duration-500 motion-reduce:transition-none" style={{ width: `${percent}%` }} />
    </div>
  );
}
