import { useEffect, useState, useCallback } from "react";

export type Task = { id: string; time: string; title: string; tag: string };

export const TASKS: Task[] = [
  { id: "t1", time: "09:00", title: "Проверить скрипт и акции дня", tag: "Старт" },
  { id: "t2", time: "09:15", title: "Настроить гарнитуру и рабочее место", tag: "Старт" },
  { id: "t3", time: "10:00", title: "Совершить первые 30 звонков по базе", tag: "Звонки" },
  { id: "t4", time: "12:00", title: "Оформить 3 заявки на продукт", tag: "Продажи" },
  { id: "t5", time: "13:30", title: "Перезвонить клиентам из отложенных", tag: "Звонки" },
  { id: "t6", time: "15:00", title: "Разобрать одно сложное возражение с наставником", tag: "Рост" },
  { id: "t7", time: "17:30", title: "Заполнить итоги смены", tag: "Финиш" },
];

export const WINS = [
  "Довела сложный звонок до заявки",
  "Клиент поблагодарил за консультацию",
  "Сохранила спокойствие в трудном разговоре",
  "Выполнила план раньше времени",
  "Попробовала новую фразу из скрипта",
];

type State = { done: string[]; win: string | null };
const KEY = "my-shift-plan-v1";
const empty: State = { done: [], win: null };

function read(): State {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}

const listeners = new Set<(s: State) => void>();
function write(s: State) {
  localStorage.setItem(KEY, JSON.stringify(s));
  listeners.forEach((l) => l(s));
}

export function useShift() {
  const [state, setState] = useState<State>(empty);
  useEffect(() => {
    setState(read());
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const s = read();
    write({ ...s, done: s.done.includes(id) ? s.done.filter((x) => x !== id) : [...s.done, id] });
  }, []);
  const setWin = useCallback((win: string | null) => write({ ...read(), win }), []);
  const reset = useCallback(() => write(empty), []);

  const doneCount = state.done.filter((id) => TASKS.some((t) => t.id === id)).length;
  const percent = Math.round((doneCount / TASKS.length) * 100);
  return { ...state, toggle, setWin, reset, doneCount, total: TASKS.length, percent };
}

export const TOPICS = {
  csat: {
    title: "CSAT",
    lead: "Удовлетворённость клиента разговором",
    tips: [
      "Назовите себя и цель звонка в первые 10 секунд.",
      "Обращайтесь к клиенту по имени, но не чаще 2–3 раз.",
      "Резюмируйте договорённости в конце разговора.",
      "Поблагодарите за время — даже если клиент отказался.",
    ],
  },
  acsat: {
    title: "ACSAT",
    lead: "Оценка качества работы оператора",
    tips: [
      "Следуйте структуре скрипта: приветствие, выявление, презентация, завершение.",
      "Задавайте открытые вопросы, чтобы понять потребность.",
      "Не перебивайте — дайте клиенту закончить мысль.",
      "Проверяйте корректность данных перед оформлением заявки.",
    ],
  },
  products: {
    title: "Продукты",
    lead: "Краткие шпаргалки по продуктам (демо)",
    tips: [
      "Кредитная карта «Оливка»: 120 дней без процентов, бесплатное обслуживание.",
      "Вклад «Тихий вечер»: ставка до 14% годовых, пополнение без ограничений.",
      "Подписка «Плюс»: кешбэк до 10% у партнёров и бесплатные переводы.",
      "Связывайте продукт с потребностью: «Вы упомянули… — это поможет…».",
    ],
  },
  objections: {
    title: "Возражения",
    lead: "Готовые ответы на частые возражения",
    tips: [
      "«Мне неинтересно» → «Понимаю. Можно один вопрос — как вы сейчас…?»",
      "«Нет времени» → «Займёт буквально минуту. Удобно сейчас или перезвонить в 18:00?»",
      "«Я подумаю» → «Конечно. Что важно взвесить? Помогу разобраться».",
      "«Дорого» → «Давайте посчитаем выгоду именно для вас».",
    ],
  },
} as const;
export type TopicKey = keyof typeof TOPICS;

export const CAT_LINES = [
  "Кот-выживальщик советует: кофе — это не еда, но почти.",
  "Мяу. Пятый отказ подряд? Я тоже не люблю пылесос. Дыши.",
  "Кот одобряет твою гарнитуру. Особенно провод. Можно поиграть?",
  "Совет кота: если клиент ворчит — представь, что он просто не выспался.",
  "Кот ушёл на перерыв. Ты тоже можешь — по графику 😼",
];
