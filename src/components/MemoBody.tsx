import { useState } from "react";
import { Check, Copy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Memo } from "@/lib/csat";
import { useLibraryState } from "@/lib/library-state";
import type { AcsatDetails } from "@/lib/acsat";

export function FavoriteButton({ memo }: { memo: Memo }) {
  const { favorites, toggleFavorite, storageUnavailable } = useLibraryState();
  const active = favorites.includes(memo.id);
  return <div><Button variant="ghost" size="icon" aria-label={`${active ? "Убрать из избранного" : "Добавить в избранное"}: ${memo.title}`} aria-pressed={active} title={active ? "Убрать из избранного" : "Добавить в избранное"} className="shrink-0 text-accent-strong" onClick={() => toggleFavorite(memo.id)}><Star className={active ? "fill-current" : ""} strokeWidth={1.5} /></Button>{storageUnavailable && <p role="status" className="text-xs text-muted-foreground">Сохранение в браузере недоступно. Избранное останется только до закрытия страницы.</p>}</div>;
}
export function MemoBody({ memo }: { memo: Memo & Partial<AcsatDetails> & { section?: string } }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  async function copyPhrase(phrase: string) {
    try { await navigator.clipboard.writeText(phrase); setCopied(phrase); setNotice("Фраза скопирована."); }
    catch { setCopied(null); setNotice("Не удалось скопировать. Выдели фразу и скопируй вручную."); }
  }
  return <div className="space-y-6 text-sm leading-relaxed">
    <section><h3 className="mb-2 font-semibold text-primary">Когда применять</h3><p>{memo.when}</p></section>
    <section><h3 className="mb-2 font-semibold text-primary">{memo.section === "acsat-critical" ? "Риск и основной принцип" : "Основной принцип"}</h3><p>{memo.principle}</p></section>
    {memo.steps?.length ? <section><h3 className="mb-2 font-semibold text-primary">Что делать</h3><ol className="list-decimal space-y-2 pl-5">{memo.steps.map(step => <li key={step}>{step}</li>)}</ol></section> : null}
    <section><h3 className="mb-2 font-semibold text-primary">Готовые фразы</h3><ul className="divide-y divide-border">
      {memo.phrases.map(phrase => <li key={phrase} className="flex items-start gap-3 py-3"><p className="min-w-0 flex-1 select-text">«{phrase}»</p><Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 text-primary" onClick={() => void copyPhrase(phrase)} aria-label={`Скопировать фразу: ${phrase}`} title={copied === phrase ? "Скопировано" : "Скопировать фразу"}>{copied === phrase ? <Check /> : <Copy />}</Button></li>)}
    </ul><p role="status" aria-live="polite" className={notice ? "text-primary" : "sr-only"}>{notice}</p></section>
    <section><h3 className="mb-3 font-semibold text-primary">Пример диалога</h3><dl className="space-y-3 border-l-2 border-border pl-4">{memo.dialogue.map((line, index) => <div key={index}><dt className={`mb-1 text-xs font-semibold ${line.speaker === "Клиент" ? "text-muted-foreground" : "text-primary"}`}>{line.speaker}</dt><dd>{line.text}</dd></div>)}</dl></section>
    <section className="border-t border-border pt-5"><h3 className="mb-2 font-semibold text-accent-strong">Лучше не говорить</h3><ul className="list-disc space-y-2 pl-5 text-muted-foreground">{memo.avoid.map(phrase => <li key={phrase}>{phrase}</li>)}</ul><h3 className="mb-2 mt-4 font-semibold text-primary">Попробуй вместо этого</h3><p>{memo.instead}</p></section>
    {memo.checklist?.length ? <section><h3 className="mb-2 font-semibold text-primary">Мини-чек-лист</h3><ul className="space-y-2">{memo.checklist.map(item => <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{item}</span></li>)}</ul></section> : null}
    <section className="border-l-2 border-primary pl-4"><h3 className="mb-1 text-xs font-semibold text-primary">Короткий итог</h3><p className="font-medium">{memo.takeaway}</p></section>
  </div>;
}
export function LibraryNotice() {
  return <p className="mb-6 border-l-2 border-accent-strong bg-accent/10 px-4 py-3 text-sm leading-relaxed">Учебные примеры для исходящих продаж, не официальный сценарий и не официальная шкала ACSAT Сбера. Формулировки, условия продуктов и полномочия сверяй с актуальными правилами компании.</p>;
}
