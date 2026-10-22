import { routes, routeKeys, type RouteKey } from "../config/routes";
import type { Lang } from "../config/profile";
export type PlanInput = {
  direction: RouteKey;
  goal: number;
  barrier: number;
  minutes: number;
  days: number;
  weeks: number;
  adherence: number;
  owner: string;
  target: string;
  cue: string;
  start: string;
  time: string;
};
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export const defaults: PlanInput = {
  direction: "body",
  goal: 0,
  barrier: 0,
  minutes: 25,
  days: 3,
  weeks: 8,
  adherence: 80,
  owner: "",
  target: "",
  cue: "",
  start: localDate(),
  time: "09:00",
};
export function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + "T12:00:00");
  return (
    !Number.isNaN(d.getTime()) &&
    localDate(d) === value &&
    d.getFullYear() >= 2000 &&
    d.getFullYear() <= 2100
  );
}
export function validInput(v: unknown): v is PlanInput {
  if (!v || typeof v !== "object") return false;
  const a = v as PlanInput;
  return (
    routeKeys.includes(a.direction) &&
    [a.goal, a.barrier].every((n) => Number.isInteger(n) && n >= 0 && n < 4) &&
    Number.isFinite(a.minutes) &&
    a.minutes >= 10 &&
    a.minutes <= 180 &&
    Number.isInteger(a.days) &&
    a.days >= 1 &&
    a.days <= 7 &&
    [4, 8, 12].includes(a.weeks) &&
    Number.isFinite(a.adherence) &&
    a.adherence >= 50 &&
    a.adherence <= 100 &&
    ["owner", "target", "cue"].every(
      (k) =>
        typeof a[k as keyof PlanInput] === "string" &&
        String(a[k as keyof PlanInput]).length <= 160,
    ) &&
    validDate(a.start) &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(a.time)
  );
}
export function resource(
  minutes: number,
  days: number,
  weeks: number,
  adherence: number,
) {
  if (
    !Number.isFinite(minutes) ||
    minutes < 10 ||
    minutes > 180 ||
    !Number.isInteger(days) ||
    days < 1 ||
    days > 7 ||
    ![4, 8, 12].includes(weeks) ||
    !Number.isFinite(adherence) ||
    adherence < 50 ||
    adherence > 100
  )
    throw Error("Invalid resource parameters");
  const ideal = (minutes * days * weeks) / 60;
  const total = (ideal * adherence) / 100;
  return {
    weekly: (minutes * days * adherence) / 6000,
    total,
    sessions: days * weeks,
    ideal,
    gap: ideal - total,
  };
}
export function buildPlan(a: PlanInput, lang: Lang) {
  if (!validInput(a)) throw Error("Invalid plan");
  const i = lang === "ru" ? 0 : 1;
  const t = (ru: string, en: string) => (i === 0 ? ru : en);
  const r = routes[a.direction];
  const g = r.goals[a.goal];
  const b = r.barriers[a.barrier];
  const short = a.minutes <= 15;
  const limited = short || (a.direction === "body" && a.barrier === 3);
  const today = limited ? b.minimum[i] : g.today[i];
  const capacity = resource(a.minutes, a.days, a.weeks, a.adherence);
  const dates = Array.from({ length: a.days }, (_, j) => {
    const date = new Date(a.start + "T12:00:00");
    date.setDate(date.getDate() + Math.floor((j * 7) / a.days));
    return localDate(date);
  });
  const sessions = dates.map((date, j) => ({
    date,
    action: j === 0 ? today : g.practice[i],
    minutes: a.minutes,
  }));
  const last = new Date(a.start + "T12:00:00");
  last.setDate(last.getDate() + 6);
  return {
    title: a.target.trim() || g.name[i],
    goal: g.name[i],
    direction: r.label[i],
    code: r.code,
    today,
    practice: g.practice[i],
    review: g.review[i],
    metric: g.metric[i],
    obstacle: b.action[i],
    product: r.product,
    capacity,
    sessions,
    checkpoint: localDate(last),
    owner:
      a.owner.trim() ||
      t(
        "Не согласован — уточни владельца результата",
        "Not agreed — clarify the deliverable owner",
      ),
    priority: t(
      "Один ближайший результат; остальные задачи — после проверки",
      "One near-term deliverable; review before adding tasks",
    ),
    cue:
      a.cue.trim() ||
      t(
        "После привычного утреннего действия",
        "After an existing morning routine",
      ),
    why: t(
      `Цель: «${g.name[0]}». Ограничение: «${b.name[0]}». ${limited ? "Выбрана минимальная версия действия." : "Первое действие соответствует выбранной задаче."} График: ${a.days} × ${a.minutes} минут, реалистичное выполнение ${a.adherence}%.`,
      `Goal: “${g.name[1]}”. Constraint: “${b.name[1]}”. ${limited ? "A minimum version of the action is used." : "The first action matches the selected task."} Schedule: ${a.days} × ${a.minutes} minutes, realistic adherence ${a.adherence}%.`,
    ),
    limit: t(
      "План основан только на твоих ответах. Это отправная точка, не медицинская или психологическая диагностика и не обещание результата.",
      "This plan uses only your answers. It is a starting point, not a medical or psychological assessment or a promised outcome.",
    ),
  };
}
export type ActionPlan = ReturnType<typeof buildPlan>;
export function planText(plan: ActionPlan, a: PlanInput, lang: Lang) {
  const t = (ru: string, en: string) => (lang === "ru" ? ru : en);
  const fmt = (n: number) =>
    n.toLocaleString(lang, { maximumFractionDigits: 1 });
  return [
    t("МОЙ СЛЕДУЮЩИЙ ШАГ", "MY NEXT MOVE"),
    plan.title,
    "",
    t("Начни сегодня: ", "Start today: ") + plan.today,
    t("Следующие 7 дней:", "Next seven days:"),
    ...plan.sessions.map(
      (s) =>
        `${s.date}, ${a.time} · ${s.minutes} ${t("мин", "min")}: ${s.action}`,
    ),
    t("Проверка: ", "Review: ") + `${plan.checkpoint}. ${plan.review}`,
    t("Показатель: ", "Measure: ") + plan.metric,
    t("Ограничение: ", "Constraint: ") + plan.obstacle,
    ...(a.direction === "system"
      ? [
          t("Ответственный: ", "Owner: ") + plan.owner,
          t("Приоритет: ", "Priority: ") + plan.priority,
        ]
      : []),
    ...(a.direction === "mind" ? [t("Триггер: ", "Cue: ") + plan.cue] : []),
    `${t("Ресурс", "Capacity")}: ${fmt(plan.capacity.weekly)} ${t("ч/нед", "h/week")}; ${fmt(plan.capacity.total)} ${t("ч за", "h over")} ${a.weeks} ${t("недель", "weeks")} (${a.adherence}%).`,
    plan.why,
    plan.limit,
    "https://castefeudal.github.io/tapme/",
  ].join("\n");
}
