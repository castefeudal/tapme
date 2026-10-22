import { migrateLegacy } from "../lib/migrate";
import { useEffect, useRef, useState } from "react";
import { useExperience, readLocal, writeLocal } from "../hooks/useExperience";
import { routes, routeKeys } from "../config/routes";
import { defaults, validInput, resource, type PlanInput } from "../lib/plan";
import { ActionCard } from "./ActionCard";
import { Chapter } from "./Primitives";
import "../styles/next-move.css";
function restore() {
  try {
    const saved = JSON.parse(readLocal("pm-next-v2") || "null");
    if (saved?.version === 2 && validInput(saved.input))
      return {
        input: saved.input as PlanInput,
        complete: saved.complete === true,
      };
    const legacy = migrateLegacy(JSON.parse(readLocal("pm-route") || "null"));
    if (legacy) return { input: legacy, complete: false };
  } catch {}
  return { input: { ...defaults }, complete: false };
}
export function NextMove({ onContact }: { onContact: (text: string) => void }) {
  const { t, p, lang } = useExperience();
  const [saved] = useState(restore);
  const [input, setInput] = useState<PlanInput>(saved.input);
  const [step, setStep] = useState(saved.complete ? 4 : 0);
  const heading = useRef<HTMLHeadingElement>(null);
  const route = routes[input.direction];
  const calc = resource(
    input.minutes,
    input.days,
    input.weeks,
    input.adherence,
  );
  const fmt = (n: number) =>
    n.toLocaleString(lang, { maximumFractionDigits: 1 });
  useEffect(() => {
    writeLocal(
      "pm-next-v2",
      JSON.stringify({ version: 2, input, complete: step === 4 }),
    );
  }, [input, step]);
  useEffect(() => {
    const reset = () => {
      setInput({ ...defaults });
      setStep(0);
    };
    window.addEventListener("pm-clear", reset);
    return () => window.removeEventListener("pm-clear", reset);
  }, []);
  const move = (next: number) => {
    setStep(next);
    requestAnimationFrame(() =>
      heading.current?.focus({ preventScroll: true }),
    );
  };
  const questions = [
    t("Что сейчас требует внимания?", "What needs your attention?"),
    t("Какую задачу решаем?", "What are we working on?"),
    t("Что мешает больше всего?", "What is the main constraint?"),
    t("Какой ритм тебе подходит?", "What rhythm works for you?"),
  ];
  return (
    <section id="next" className="next-chapter chapter-section">
      <div className="next-intro">
        <Chapter ru="ТВОЙ СЛЕДУЮЩИЙ ШАГ" en="YOUR NEXT MOVE" />
        <h2>
          {t("Одна задача.", "One task.")}
          <br />
          {t("План на неделю.", "A week of action.")}
        </h2>
        <p>
          {t(
            "Выбери задачу и реальный ресурс. Получи первый шаг, план недели и способ проверить, что получилось.",
            "Choose a task and a realistic time budget. Get a first action, a week plan and a way to review it.",
          )}
        </p>
        <span className="privacy-note">
          {t(
            "45–90 секунд · без регистрации · только в твоём браузере",
            "45–90 seconds · no sign-up · only in your browser",
          )}
        </span>
      </div>
      <div className="move-workspace">
        <div
          className="trajectory"
          aria-label={t("Траектория плана", "Plan trajectory")}
        >
          {[
            t("Задача", "Goal"),
            t("Ограничение", "Constraint"),
            t("Ресурс", "Capacity"),
            t("Действие", "Action"),
          ].map((label, k) => (
            <span
              key={label}
              className={step > k ? "done" : step === k ? "current" : ""}
            >
              <span className="trajectory-node" />
              {label}
            </span>
          ))}
        </div>
        {step < 4 ? (
          <div className="question-scene" key={step}>
            <div className="question-meta">
              <span>{step + 1} / 4</span>
              <span>
                {step > 0
                  ? route.code
                  : t("ВЫБЕРИ НАПРАВЛЕНИЕ", "CHOOSE A DIRECTION")}
              </span>
            </div>
            <h3 ref={heading} tabIndex={-1}>
              {questions[step]}
            </h3>
            {step < 3 ? (
              <div className="answer-list">
                {(step === 0
                  ? routeKeys.map((key) => ({
                      name: routes[key].label,
                      sub: routes[key].intro,
                      code: routes[key].code,
                    }))
                  : step === 1
                    ? route.goals.map((g) => ({
                        name: g.name,
                        sub: null,
                        code: "",
                      }))
                    : route.barriers.map((b) => ({
                        name: b.name,
                        sub: null,
                        code: "",
                      }))
                ).map((answer, k) => (
                  <button
                    key={p(answer.name)}
                    onClick={() => {
                      setInput({
                        ...input,
                        ...(step === 0
                          ? { direction: routeKeys[k], goal: 0, barrier: 0 }
                          : step === 1
                            ? { goal: k }
                            : { barrier: k }),
                      });
                      move(step + 1);
                    }}
                  >
                    {answer.code && (
                      <span className="answer-code">{answer.code}</span>
                    )}
                    <span>
                      <strong>{p(answer.name)}</strong>
                      {answer.sub && <small>{p(answer.sub)}</small>}
                    </span>
                    <span className="answer-end" aria-hidden="true">
                      →
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <form
                className="resource-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (validInput(input)) move(4);
                }}
              >
                <div className="resource-controls">
                  <label>
                    {t("Минуты на одно действие", "Minutes per action")}
                    <output>
                      {input.minutes} {t("мин", "min")}
                    </output>
                    <input
                      type="range"
                      min="10"
                      max="180"
                      step="5"
                      value={input.minutes}
                      onChange={(e) =>
                        setInput({ ...input, minutes: +e.target.value })
                      }
                    />
                  </label>
                  <fieldset className="day-selector">
                    <legend>{t("Дней в неделю", "Days per week")}</legend>
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <button
                        type="button"
                        key={day}
                        aria-pressed={day === input.days}
                        onClick={() => setInput({ ...input, days: day })}
                      >
                        {day}
                      </button>
                    ))}
                  </fieldset>
                  <label>
                    {t("Реалистичное выполнение", "Realistic adherence")}
                    <output>{input.adherence}%</output>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      step="5"
                      value={input.adherence}
                      onChange={(e) =>
                        setInput({ ...input, adherence: +e.target.value })
                      }
                    />
                  </label>
                </div>
                <div className="capacity-note">
                  <strong>
                    {fmt(calc.weekly)}{" "}
                    <span>{t("ч / неделю", "h / week")}</span>
                  </strong>
                  <p>
                    {t(
                      "Начни с первой недели. Полный горизонт можно изменить ниже. Часы — ресурс, а не обещание результата.",
                      "Begin with week one. Adjust the full horizon below. Hours describe capacity, not a promised outcome.",
                    )}
                  </p>
                </div>
                <details className="plan-details">
                  <summary>
                    {t(
                      "Уточнить задачу и расписание",
                      "Refine the task and schedule",
                    )}
                  </summary>
                  <label>
                    {t(
                      "Мой конкретный результат (необязательно)",
                      "My specific outcome (optional)",
                    )}
                    <input
                      maxLength={160}
                      value={input.target}
                      onChange={(e) =>
                        setInput({ ...input, target: e.target.value })
                      }
                    />
                  </label>
                  {input.direction === "system" && (
                    <label>
                      {t(
                        "Ответственный, если уже согласован",
                        "Owner, if already agreed",
                      )}
                      <input
                        maxLength={160}
                        value={input.owner}
                        onChange={(e) =>
                          setInput({ ...input, owner: e.target.value })
                        }
                      />
                    </label>
                  )}
                  {input.direction === "mind" && (
                    <label>
                      {t(
                        "После какого привычного события начнёшь?",
                        "Which daily event will be your cue?",
                      )}
                      <input
                        maxLength={160}
                        value={input.cue}
                        onChange={(e) =>
                          setInput({ ...input, cue: e.target.value })
                        }
                      />
                    </label>
                  )}
                  <div className="schedule-fields">
                    <label>
                      {t("Начало", "Start date")}
                      <input
                        type="date"
                        min="2000-01-01"
                        max="2100-12-31"
                        required
                        value={input.start}
                        onChange={(e) =>
                          setInput({ ...input, start: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      {t("Время", "Time")}
                      <input
                        type="time"
                        required
                        value={input.time}
                        onChange={(e) =>
                          setInput({ ...input, time: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      {t("Недель в плане", "Weeks in plan")}
                      <select
                        value={input.weeks}
                        onChange={(e) =>
                          setInput({ ...input, weeks: +e.target.value })
                        }
                      >
                        {[4, 8, 12].map((n) => (
                          <option key={n}>{n}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </details>
                <button
                  className="button solid build-plan"
                  type="submit"
                  disabled={!validInput(input)}
                >
                  {t("Собрать мой план", "Build my plan")}
                  <span aria-hidden="true">→</span>
                </button>
              </form>
            )}
            {step > 0 && (
              <button className="back-link" onClick={() => move(step - 1)}>
                {t("Назад", "Back")}
              </button>
            )}
          </div>
        ) : (
          <ActionCard
            input={input}
            onEdit={() => move(0)}
            onContact={onContact}
          />
        )}
      </div>
    </section>
  );
}
