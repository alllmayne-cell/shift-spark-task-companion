import { Link } from "@tanstack/react-router";
import { Home, ListChecks, BookOpen, User, Headphones } from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Главная", icon: Home },
  { to: "/tasks", label: "Мои задачи", icon: ListChecks },
  { to: "/notes", label: "Памятки", icon: BookOpen },
  { to: "/profile", label: "Профиль", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-28 md:pb-12 md:pl-60">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar px-5 py-9 text-sidebar-foreground md:flex">
        <Headphones className="mb-5 h-7 w-7 text-sidebar-primary" strokeWidth={1.5} />
        <p className="font-display text-2xl">Мой план</p>
        <p className="mb-10 mt-1 text-sm text-sidebar-foreground/60">на смену</p>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/" }}
              className="flex min-h-12 items-center gap-3 rounded-lg px-3 py-3 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-primary focus-visible:outline-2 focus-visible:outline-sidebar-primary">
              <Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} /> {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="mx-auto max-w-4xl px-5 pt-6 md:px-10 md:pt-10">{children}</main>
      <nav aria-label="Основная навигация" className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-border bg-card/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: to === "/" }}
            className="flex min-h-16 min-w-0 flex-col items-center justify-center gap-1.5 rounded-lg py-2.5 text-[11px] font-medium text-muted-foreground data-[status=active]:text-primary focus-visible:outline-2 focus-visible:outline-primary">
            <span className="flex h-7 w-12 items-center justify-center rounded-lg in-data-[status=active]:bg-secondary"><Icon className="h-5 w-5 shrink-0" strokeWidth={1.7} /></span> {label}
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
      <h1 className="font-display text-3xl leading-tight text-foreground md:text-4xl">{title}</h1>
    </header>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-border bg-card p-5 md:p-6 ${className}`}>{children}</section>;
}
