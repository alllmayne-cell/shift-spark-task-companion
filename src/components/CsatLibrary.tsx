import { useState } from "react";
import { Search, X, MessageCircle, HeartHandshake, AudioLines, Target, Sparkles, MessagesSquare, Handshake, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { CSAT_CATEGORIES, RATING_POLICY, filterMemos } from "@/lib/csat";

import { FavoriteButton, MemoBody } from "./MemoBody";
import { useLibraryState } from "@/lib/library-state";

const icons = [MessageCircle, HeartHandshake, AudioLines, Target, Sparkles, MessagesSquare, Handshake, Star];

export function CsatLibrary() {
  const [query, setQuery] = useState("");
  const { visit } = useLibraryState();

  return (
    <>
      <div className="mb-6 flex items-start gap-3 border-l-2 border-accent-strong bg-accent/10 px-4 py-3 text-sm leading-relaxed">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-strong" strokeWidth={1.5} />
        <p>Учебные примеры для исходящих продаж, не официальный сценарий Сбера. Обязательные формулировки, условия продуктов и полномочия сверяй с актуальными правилами компании.</p>
      </div>
      <Tabs defaultValue="opening" onValueChange={() => { setQuery(""); }}>
        <TabsList aria-label="Категории CSAT" className="mb-8 grid h-auto w-full grid-cols-2 gap-1.5 rounded-lg bg-secondary/60 p-1.5 md:grid-cols-4">
          {CSAT_CATEGORIES.map((category, index) => {
            const Icon = icons[index] ?? MessageCircle;
            return (
              <TabsTrigger key={category.id} value={category.id} className="min-h-20 min-w-0 flex-col gap-2 whitespace-normal rounded-md px-2 py-3 text-center text-xs leading-relaxed text-muted-foreground data-[state=active]:bg-shift data-[state=active]:text-shift-foreground data-[state=active]:shadow-none">
                <Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
                <span>{category.title}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        {CSAT_CATEGORIES.map((category) => {
          const results = filterMemos(category, query);
          return (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <header className="mb-5">
                <p className="mb-2 text-xs text-accent-strong">{String(CSAT_CATEGORIES.indexOf(category) + 1).padStart(2, "0")} / 08</p>
                <h2 className="font-display text-2xl leading-snug">{category.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{category.lead}</p>
              </header>
              {category.id === "rating" && RATING_POLICY.requiresCurrentScenarioPermission && (
                <p className="mb-5 border-l-2 border-primary pl-4 text-sm leading-relaxed">Просьба об оценке по {RATING_POLICY.scale}-балльной шкале уместна только тогда, когда её разрешают актуальный сценарий и правила компании. Если нет — этот шаг пропускаем.</p>
              )}
              <div className="relative mb-3">
                <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                <Input type="search" aria-label={`Поиск в категории «${category.title}»`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Найти по ситуации или фразе…" className="h-11 bg-card pl-10 pr-11 shadow-none [&::-webkit-search-cancel-button]:appearance-none" />
                {query && <Button variant="ghost" size="icon" aria-label="Очистить поиск" title="Очистить поиск" onClick={() => setQuery("")} className="absolute right-1 top-1 h-9 w-9 text-muted-foreground"><X /></Button>}
              </div>
              <p role="status" className="mb-5 text-xs text-muted-foreground">{query ? `Найдено памяток: ${results.length} из ${category.memos.length}` : `${category.memos.length} памятки`}</p>
              {results.length ? (
                <Accordion key={category.id} type="multiple" onValueChange={(values) => { values.forEach(id => visit(id)); }} defaultValue={[category.memos[0]?.id ?? ""]} className="space-y-3">
                  {results.map((memo) => (
                    <AccordionItem key={memo.id} value={memo.id} className="overflow-hidden rounded-lg border border-border bg-card">
                      <div className="flex items-center gap-1 pr-3"><AccordionTrigger className="min-h-20 flex-1 gap-4 px-5 py-5 text-base hover:no-underline md:px-6">
                        <span className="min-w-0">
                          <span className="block font-display leading-relaxed">{memo.title}</span>
                          <span className="mt-1 block text-xs font-normal leading-relaxed text-muted-foreground">{memo.when}</span>
                        </span>
                      </AccordionTrigger><FavoriteButton memo={memo} /></div>
                      <AccordionContent className="border-t border-border px-5 pb-6 pt-5 md:px-6">
                        <MemoBody memo={memo} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="border-y border-border py-10 text-center">
                  <Search className="mx-auto mb-3 h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
                  <h3 className="font-display text-lg">Памятки не найдены</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Попробуй другое слово или более короткую фразу.</p>
                  <Button variant="link" onClick={() => setQuery("")} className="mt-3">Очистить поиск</Button>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </>
  );
}
