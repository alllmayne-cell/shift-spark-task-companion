import { useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Search, X, Star, History, MessageCircle, ShieldCheck, Headphones, Layers, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CSAT_CATEGORIES } from "@/lib/csat";
import { LIBRARY_MEMOS, LIBRARY_SECTIONS, searchLibrary, type LibraryMemo } from "@/lib/library-content";
import { useLibraryState } from "@/lib/library-state";
import { FavoriteButton, LibraryNotice, MemoBody } from "./MemoBody";
const icons = [MessageCircle, ShieldCheck, Headphones, Layers, MessagesSquare];

export function WorkingLibrary({ initialSection = "all" }: { initialSection?: string }) {
  const [section, setSection] = useState(initialSection);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState<LibraryMemo | null>(null);
  const { favorites, recent, visit, storageUnavailable } = useLibraryState();
  const listScroll = useRef(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const results = searchLibrary(query, section === "all" || section === "favorites" ? [] : [section], section === "favorites" ? favorites : undefined, category);
  function openMemo(memo: LibraryMemo) {
    listScroll.current = window.scrollY; visit(memo.id); setOpened(memo);
    window.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(() => heading.current?.focus());
  }
  function back() {
    const id = opened?.id; setOpened(null);
    requestAnimationFrame(() => { document.getElementById(`open-${id}`)?.focus({ preventScroll: true }); window.scrollTo({ top: listScroll.current, behavior: "instant" }); });
  }
  function clear() { setQuery(""); setSection("all"); setCategory("all"); }
  if (opened) return <>
    <Button variant="ghost" onClick={back} className="mb-4 px-0"><ArrowLeft /> К списку памяток</Button>
    <div className="mb-5 flex items-start justify-between gap-3"><div className="min-w-0"><p className="mb-2 text-xs text-accent-strong">{LIBRARY_SECTIONS.find(item => item.id === opened.section)?.title}</p><h2 ref={heading} tabIndex={-1} className="font-display text-2xl leading-snug outline-none">{opened.title}</h2></div><FavoriteButton memo={opened} /></div>
    <LibraryNotice /><MemoBody key={opened.id} memo={opened} />
    <Button variant="outline" onClick={back} className="mt-7"><ArrowLeft /> К списку памяток</Button>
  </>;
  return <>
    <LibraryNotice />
    <Tabs value={section} onValueChange={value => { setSection(value); setCategory("all"); }}>
      <TabsList aria-label="Разделы библиотеки" className="mb-5 grid h-auto w-full grid-cols-2 gap-1 rounded-lg bg-secondary/60 p-1 sm:grid-cols-3">
        {LIBRARY_SECTIONS.map((item, index) => { const Icon = icons[index] ?? MessageCircle; return <TabsTrigger key={item.id} value={item.id} className="min-h-20 min-w-0 flex-col gap-2 whitespace-normal rounded-md px-2 py-3 text-xs leading-relaxed data-[state=active]:bg-shift data-[state=active]:text-shift-foreground data-[state=active]:shadow-none"><Icon className="h-5 w-5" strokeWidth={1.5} /><span>{item.title}</span></TabsTrigger>; })}
        <TabsTrigger value="favorites" className="min-h-20 flex-col gap-2 whitespace-normal rounded-md px-2 py-3 text-xs data-[state=active]:bg-shift data-[state=active]:text-shift-foreground"><Star className="h-5 w-5" strokeWidth={1.5} /><span>Избранное · {favorites.length}</span></TabsTrigger>
      </TabsList>
    </Tabs>
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="font-display text-lg">{section === "all" ? "Все памятки" : section === "favorites" ? "Избранное" : LIBRARY_SECTIONS.find(item => item.id === section)?.title}</h2><Button variant="link" onClick={clear} className="h-auto px-0 text-xs"><X className="h-3.5 w-3.5" /> Очистить поиск и фильтры</Button></div>
    <div className="mb-4 grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,240px)]">
      <div className="relative min-w-0"><Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" /><Input type="search" value={query} onChange={event => setQuery(event.target.value)} aria-label="Поиск по всем памяткам" placeholder="Ситуация, слово или фраза…" className="h-11 bg-card pl-10 pr-10 [&::-webkit-search-cancel-button]:appearance-none" />{query && <Button variant="ghost" size="icon" aria-label="Очистить поиск" title="Очистить поиск" onClick={() => setQuery("")} className="absolute right-1 top-1 h-9 w-9"><X /></Button>}</div>
      <Select value={category} onValueChange={setCategory}><SelectTrigger aria-label="Фильтр по категории" className="h-11 w-full min-w-0 bg-card text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Все категории</SelectItem>{(section === "all" || section === "csat" || section === "favorites") && CSAT_CATEGORIES.map(item => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>)}{LIBRARY_SECTIONS.filter(item => item.id !== "csat" && (section === "all" || section === "favorites" || section === item.id)).map(item => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>)}</SelectContent></Select>
    </div>
    <p role="status" className="mb-4 text-xs text-muted-foreground">Найдено памяток: {results.length}</p>
    {storageUnavailable && <p role="status" className="mb-4 text-sm text-muted-foreground">Историю не удалось сохранить в браузере. Она доступна только до закрытия страницы.</p>}
    {results.length ? <div className="grid gap-3 md:grid-cols-2">{results.map(memo => <article key={memo.id} className="flex min-w-0 items-start gap-1 rounded-lg border border-border bg-card p-3"><Button id={`open-${memo.id}`} variant="ghost" onClick={() => openMemo(memo)} className="h-auto min-h-24 min-w-0 flex-1 items-start justify-start gap-2 whitespace-normal p-2 text-left hover:bg-secondary/60"><span className="min-w-0"><span className="mb-1.5 block text-xs font-normal text-accent-strong">{LIBRARY_SECTIONS.find(item => item.id === memo.section)?.title}</span><span className="block font-display text-sm leading-relaxed">{memo.title}</span><span className="mt-2 line-clamp-2 block text-xs font-normal leading-relaxed text-muted-foreground">{memo.when}</span></span><ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" /></Button><FavoriteButton memo={memo} /></article>)}</div> : <div className="border-y border-border py-10 text-center"><Search className="mx-auto mb-3 h-6 w-6 text-muted-foreground" /><h3 className="font-display text-lg">Пока ничего не нашлось</h3><p className="mt-2 text-sm text-muted-foreground">{section === "favorites" && favorites.length === 0 ? "Можно сохранить нужную памятку звёздочкой — она будет ждать здесь." : "Попробуй другое слово или убери часть фильтров."}</p><Button variant="link" onClick={clear} className="mt-3">Очистить поиск и фильтры</Button></div>}
    {recent.length > 0 && <section className="mt-8 border-t border-border pt-5"><h2 className="mb-3 flex items-center gap-2 font-display text-base"><History className="h-4 w-4 text-primary" /> Недавно открытые</h2><ul className="divide-y divide-border">{recent.map(id => { const memo = LIBRARY_MEMOS.find(item => item.id === id); if (!memo) return null; return <li key={id}><Button variant="ghost" onClick={() => openMemo(memo)} className="h-auto min-h-11 w-full justify-start whitespace-normal px-0 py-3 text-left text-sm font-normal">{memo.title}<ArrowUpRight className="ml-auto shrink-0" /></Button></li>; })}</ul></section>}
  </>;
}
