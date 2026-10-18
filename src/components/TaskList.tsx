import { Check } from "lucide-react";
import { TASKS, useShift } from "@/lib/shift";

export function TaskList() {
  const { done, toggle } = useShift();
  return (
    <ul className="divide-y divide-border">
      {TASKS.map((t) => {
        const isDone = done.includes(t.id);
        return (
          <li key={t.id}>
            <button onClick={() => toggle(t.id)} role="checkbox" aria-checked={isDone}
              className="flex w-full items-center gap-4 py-4 text-left">
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors ${isDone ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>
                {isDone && <Check className="h-4 w-4" />}
              </span>
              <span className="flex-1">
                <span className={`block text-[15px] ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>{t.title}</span>
                <span className="text-xs text-muted-foreground">{t.time} · {t.tag}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function Progress({ percent }: { percent: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-on-dark-muted">
      <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${percent}%` }} />
    </div>
  );
}
