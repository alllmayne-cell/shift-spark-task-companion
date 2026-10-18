import { useState } from "react";
import { Check, Copy, Search, X, MessageCircle, HeartHandshake, AudioLines, Target, Sparkles, MessagesSquare, Handshake, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { CSAT_CATEGORIES, RATING_POLICY, filterMemos, type Memo } from "@/lib/csat";

const icons = [MessageCircle, HeartHandshake, AudioLines, Target, Sparkles, MessagesSquare, Handshake, Star];

export function CsatLibrary() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  async function copyPhrase(phrase: string) {
    try {
      await navigator.clipboard.writeText(phrase);
      setCopied(phrase);
      setNotice("Фраза скопирована.");
    } catch {
      setCopied(null);
      setNotice("Не удалось скопировать. Можно выделить фразу и скопировать её вручную.");
    }
  }

  return (
    <>
      <div className="mb-6 flex items-start gap-3 border-l-2 border-accent-strong bg-accent/10 px-4 py-3 text-sm leading-relaxed">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-strong" strokeWidth={1.5} />
        <p>Учебные примеры для исходящих продаж, не официальный сценарий Сбера. Обязательные формулировки, условия продуктов и полномочия сверяй с актуальными правилами компании.</p>
      </div>
      <Tabs defaultValue="opening" onValueChange={() => { setQuery(""); setCopied(null); setNotice(""); }}>
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
                <Accordion key={category.id} type="multiple" defaultValue={[category.memos[0]?.id ?? ""]} className="space-y-3">
                  {results.map((memo) => (
                    <AccordionItem key={memo.id} value={memo.id} className="overflow-hidden rounded-lg border border-border bg-card">
                      <AccordionTrigger className="min-h-20 gap-4 px-5 py-5 text-base hover:no-underline md:px-6">
                        <span className="min-w-0">
                          <span className="block font-display leading-relaxed">{memo.title}</span>
                          <span className="mt-1 block text-xs font-normal leading-relaxed text-muted-foreground">{memo.when}</span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="border-t border-border px-5 pb-6 pt-5 md:px-6">
                        <MemoBody memo={memo} copied={copied} copyPhrase={copyPhrase} />
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
      <p role="status" aria-live="polite" className={notice ? "mt-5 text-sm leading-relaxed text-primary" : "sr-only"}>{notice}</p>
    </>
  );
}

function MemoBody({ memo, copied, copyPhrase }: { memo: Memo; copied: string | null; copyPhrase: (phrase: string) => Promise<void> }) {
  return (
    <div className="space-y-6 text-sm leading-relaxed">
      <section><h3 className="mb-2 font-semibold text-primary">Когда применять</h3><p>{memo.when}</p></section>
      <section><h3 className="mb-2 font-semibold text-primary">Основной принцип</h3><p>{memo.principle}</p></section>
      <section>
        <h3 className="mb-2 font-semibold text-primary">Готовые фразы</h3>
        <ul className="divide-y divide-border">
          {memo.phrases.map((phrase) => (
            <li key={phrase} className="flex items-start gap-3 py-3">
              <p className="min-w-0 flex-1 select-text">«{phrase}»</p>
              <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 text-primary" onClick={() => void copyPhrase(phrase)} aria-label={`Копировать фразу: ${phrase}`} title={copied === phrase ? "Скопировано" : "Копировать фразу"}>
                {copied === phrase ? <Check /> : <Copy />}
              </Button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="mb-3 font-semibold text-primary">Пример диалога</h3>
        <dl className="space-y-3 border-l-2 border-border pl-4">
          {memo.dialogue.map((line, index) => (
            <div key={index}><dt className={`mb-1 text-xs font-semibold ${line.speaker === "Клиент" ? "text-muted-foreground" : "text-primary"}`}>{line.speaker}</dt><dd>{line.text}</dd></div>
          ))}
        </dl>
      </section>
      <section className="border-t border-border pt-5">
        <h3 className="mb-3 font-semibold text-accent-strong">Чего лучше избегать</h3>
        <h4 className="mb-2 font-medium">Лучше не говорить</h4>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">{memo.avoid.map((phrase) => <li key={phrase}>{phrase}</li>)}</ul>
        <h4 className="mb-2 mt-4 font-medium text-primary">Попробуй вместо этого</h4><p>{memo.instead}</p>
      </section>
      <section className="border-l-2 border-primary pl-4"><h3 className="mb-1 text-xs font-semibold text-primary">Короткий итог</h3><p className="font-medium">{memo.takeaway}</p></section>
    </div>
  );
}