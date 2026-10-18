import { Link } from "@tanstack/react-router";
import { Home, ListChecks, BookOpen, User } from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Главная", icon: Home },
  { to: "/tasks", label: "Мои задачи", icon: ListChecks },
  { to: "/notes", label: "Памятки", icon: BookOpen },
  { to: "/profile", label: "Профиль", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-10 md:pl-60">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-card px-5 py-8 md:flex">
        <p className="font-display text-2xl text-foreground">Мой план</p>
        <p className="mb-8 text-xs uppercase tracking-[0.2em] text-muted-foreground">на смену</p>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/" }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary data-[status=active]:bg-primary data-[status=active]:text-primary-foreground">
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="mx-auto max-w-3xl px-5 pt-8 md:px-10 md:pt-12">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-border bg-card/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: to === "/" }}
            className="flex flex-col items-center gap-1 py-3 text-[11px] text-muted-foreground data-[status=active]:text-primary">
            <Icon className="h-5 w-5" /> {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function PageTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <header className="mb-8">
      {eyebrow && <p className="mb-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p>}
      <h1 className="font-display text-4xl text-foreground md:text-5xl">{title}</h1>
    </header>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-border bg-card p-6 ${className}`}>{children}</section>;
}
