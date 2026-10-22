import { useEffect, useRef, useState } from "react";
import { useExperience } from "../hooks/useExperience";
import { buildPlan, planText, localDate, type PlanInput } from "../lib/plan";
import { profile } from "../config/profile";
import { External } from "./Primitives";
export function ActionCard({
  input,
  onEdit,
  onContact,
  onReschedule,
}: {
  input: PlanInput;
  onEdit: () => void;
  onContact: (text: string) => void;
  onReschedule: () => void;
}) {
  const { t, lang, copy, notify } = useExperience();
  const [busy, setBusy] = useState(false);
  const title = useRef<HTMLHeadingElement>(null);
  const plan = buildPlan(input, lang);
  const text = planText(plan, input, lang);
  const fmt = (n: number) =>
    n.toLocaleString(lang, { maximumFractionDigits: 1 });
  const date = (v: string) =>
    new Date(v + "T12:00:00").toLocaleDateString(lang, {
      day: "numeric",
      month: "short",
    });
  useEffect(() => {
    title.current?.focus({ preventScroll: true });
  }, []);
  const exportFile = async (kind: "png" | "ics") => {
    setBusy(true);
    try {
      const exp = await import("../lib/exports");
      const blob =
        kind === "png"
          ? await exp.exportPNG(plan, input, lang)
          : new Blob([exp.calendar(plan, input, lang)], {
              type: "text/calendar;charset=utf-8",
            });
      exp.download(blob, "markov-next-move." + kind);
      notify(t("Файл подготовлен", "File ready"));
    } catch {
      notify(
        t(
          "Не удалось подготовить файл. Можно скопировать план.",
          "Could not prepare the file. You can copy the plan instead.",
        ),
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="action-document">
      <div className="action-document-top">
        <span>PM / PERSONAL ACTION CARD</span>
        <span>{plan.code}</span>
      </div>
      <h3 ref={title} tabIndex={-1}>
        {plan.title}
      </h3>
      {input.start < localDate() && (
        <div className="stale-plan" role="status">
          <p>
            {t(
              "Дата начала этого плана уже прошла. Сохранённые даты не изменены.",
              "This plan’s start date has passed. Your saved dates are unchanged.",
            )}
          </p>
          <button onClick={onReschedule}>
            {t("Начать с сегодняшнего дня", "Start from today")}
          </button>
        </div>
      )}
      <div className="action-document-grid">
        <div className="action-main">
          <span className="small-label">
            {input.start === localDate() ? t("НАЧНИ СЕГОДНЯ", "START TODAY") : t("ПЕРВОЕ ДЕЙСТВИЕ", "FIRST ACTION")}
          </span>
          <p className="first-action">{plan.today}</p>
          {input.direction === "mind" && (
            <p className="cue-line">
              {t("Твой триггер: ", "Your cue: ")}
              <strong>{plan.cue}</strong> · {input.time}
            </p>
          )}
          <div className="week-plan">
            <h4>{t("Следующие 7 дней", "The next seven days")}</h4>
            <p>{plan.practice}</p>
            <div className="session-dates">
              {plan.sessions.map((s) => (
                <span key={s.date}>
                  {date(s.date)}
                  <small>
                    {input.time} · {s.minutes} {t("мин", "min")}
                  </small>
                </span>
              ))}
            </div>
            <p className="checkpoint">
              <strong>
                {t("Контрольная точка: ", "Review point: ")}
                {date(plan.checkpoint)}
              </strong>
              <br />
              {plan.review}
            </p>
          </div>
          <h4>{t("Как понять, что получилось", "How to know it worked")}</h4>
          <p>{plan.metric}</p>
          <details className="rule-explanation">
            <summary>{t("Почему именно такой план", "Why this plan")}</summary>
            <p>{plan.why}</p>
            <p>{plan.limit}</p>
          </details>
        </div>
        <aside className="action-aside">
          <details className="capacity-details">
            <summary>{t("Расчёт времени", "Time budget")}</summary>
            <div className="time-total">
              <strong>{fmt(plan.capacity.weekly)}</strong>
              <span>{t("ч / неделю", "h / week")}</span>
            </div>
            <p>
              {fmt(plan.capacity.total)} {t("ч за", "h over")} {input.weeks}{" "}
              {t("недель", "weeks")}
              <br />
              {plan.capacity.sessions}{" "}
              {t("занятий запланировано", "sessions planned")}
              <br />
              {t("Идеальный ресурс:", "Ideal capacity:")}{" "}
              {fmt(plan.capacity.ideal)} {t("ч", "h")}
              <br />
              {t("Разница:", "Gap:")} {fmt(plan.capacity.gap)} {t("ч", "h")}
            </p>
          </details>
          <h4>
            {t("Если возникнет препятствие", "When the constraint appears")}
          </h4>
          <p>{plan.obstacle}</p>
          {input.direction === "system" && (
            <div className="action-brief">
              <h4>Action Brief</h4>
              <dl>
                <dt>{t("Ответственный", "Owner")}</dt>
                <dd>{plan.owner}</dd>
                <dt>{t("Приоритет", "Priority")}</dt>
                <dd>{plan.priority}</dd>
                <dt>{t("Приёмка", "Acceptance")}</dt>
                <dd>{plan.metric}</dd>
              </dl>
            </div>
          )}
          <External
            href={profile.projects[plan.product].url}
            className="tool-link"
          >
            {profile.projects[plan.product].name}
          </External>
          <span className="small-note">
            {t("Инструмент для следующего шага", "A tool for your next step")}
          </span>
        </aside>
      </div>
      <div className="action-exports">
        <button onClick={() => copy(text)}>
          {t("Скопировать план", "Copy plan")}
        </button>
        <button onClick={() => exportFile("png")} disabled={busy}>
          {busy
            ? t("Подготовка…", "Preparing…")
            : t("Сохранить PNG", "Save PNG")}
        </button>
        <button onClick={() => exportFile("ics")} disabled={busy}>
          {t("В календарь .ics", "Calendar .ics")}
        </button>
        <button onClick={onEdit}>{t("Изменить ответы", "Edit answers")}</button>
      </div>
      <div className="action-contact">
        <p>{t("Хочешь обсудить этот план?", "Want to discuss this plan?")}</p>
        <button
          className="button ink"
          onClick={() =>
            onContact(
              t(
                "Павел, хочу обсудить мой следующий шаг.\n",
                "Pavel, I would like to discuss my next move.\n",
              ) + text,
            )
          }
        >
          {t("Обсудить с Павлом", "Discuss with Pavel")}
        </button>
      </div>
      <p className="calendar-note">
        {t(
          "Календарь: выбранные занятия повторяются каждую неделю весь период. Время локальное для твоего календаря; отметка проверки — в конце первой недели.",
          "Calendar: selected sessions repeat weekly for the full period. Times use your calendar’s local time; the review is at the end of week one.",
        )}
      </p>
    </div>
  );
}
