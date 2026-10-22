import { ReadingProgress } from "./ReadingProgress";
import { Services } from "./Services";
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowRight,
  Sun,
  Moon,
  X,
  Copy,
  Menu,
} from "lucide-react";
import "@fontsource/manrope/cyrillic-400.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/cyrillic-600.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/cyrillic-700.css";
import "@fontsource/manrope/latin-700.css";
import "./style.css";
import { profile, type Lang } from "./config/profile";
import {
  resource,
  recommendation,
  keys,
  directions,
  goals,
  type Answers,
} from "./logic";
function read(k: string, f: string) {
  try {
    return localStorage.getItem(k) || f;
  } catch {
    return f;
  }
}
function save(k: string, v: string) {
  try {
    localStorage.setItem(k, v);
  } catch {}
}
const base = import.meta.env.BASE_URL;
function App() {
  const [lang, setLang] = useState<Lang>(
    read("pm-lang", "ru") === "en" ? "en" : "ru",
  );
  const i = lang === "ru" ? 0 : 1;
  const t = (ru: string, en: string) => (i === 0 ? ru : en);
  const [theme, setTheme] = useState(read("pm-theme", "dark"));
  const [menu, setMenu] = useState(false);
  const [contact, setContact] = useState(false);
  const [topic, setTopic] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const [notice, setNotice] = useState("");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() => {
    try {
      const a = JSON.parse(read("pm-route", "null"));
      if (
        a &&
        keys.includes(a.direction) &&
        [a.goal, a.barrier, a.time].every(
          (v) => Number.isInteger(v) && v >= 0 && v < 3,
        )
      )
        return a;
    } catch {}
    return { direction: "fitness", goal: 0, barrier: 0, time: 0 };
  });
  const [minutes, setMinutes] = useState(25);
  const [days, setDays] = useState(3);
  const [weeks, setWeeks] = useState(8);
  const [adherence, setAdherence] = useState(80);
  const [plan, setPlan] = useState(false);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t(
      "Павел Марков — Форма. Мышление. Система.",
      "Pavel Markov — Body. Mind. System.",
    );
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        t(
          "Павел Марков: фитнес, нутрициология, коучинг и управление проектами. Инструменты осмысленного прогресса.",
          "Pavel Markov: fitness, nutrition, coaching and project management. Tools for meaningful progress.",
        ),
      );
    save("pm-lang", lang);
  }, [lang]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    save("pm-theme", theme);
  }, [theme]);
  useEffect(() => save("pm-route", JSON.stringify(answers)), [answers]);
  useEffect(() => {
    if (contact) dialog.current?.showModal();
    else dialog.current?.close();
  }, [contact]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timer);
  }, [notice]);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setNotice(t("Скопировано", "Copied"));
    } catch {
      setNotice(
        t(
          "Не удалось скопировать. Выдели текст вручную.",
          "Could not copy. Select the text manually.",
        ),
      );
    }
  };
  const openContact = () => {
    setMenu(false);
    setContact(true);
  };
  const result = recommendation(answers, lang);
  const calc = resource(minutes, days, weeks, adherence);
  const num = (n: number) =>
    n.toLocaleString(lang, { maximumFractionDigits: 1 });
  const topics = [
    t("Персональные тренировки", "Personal training"),
    t("Питание и привычки", "Nutrition & habits"),
    t("Коучинг", "Coaching"),
    t("Управление проектом", "Project management"),
  ];
  const message = t(
    `Павел, хочу обсудить: ${topics[topic].toLowerCase()}.`,
    `Pavel, I would like to discuss ${topics[topic].toLowerCase()}.`,
  );
  const planText = t(
    `Мой план: ${directions[keys.indexOf(answers.direction)][0]}. ${minutes} мин × ${days} дн/нед × ${weeks} недель. Выполнение: ${adherence}%. Реалистично: ${num(calc.weekly)} ч/нед, ${num(calc.total)} ч всего. Начну с одного занятия и отмечу выполнение.`,
    `My plan: ${directions[keys.indexOf(answers.direction)][1]}. ${minutes} min × ${days} days/week × ${weeks} weeks. Adherence: ${adherence}%. Realistic: ${num(calc.weekly)} h/week, ${num(calc.total)} h total. Start with one session and record completion.`,
  );
  return (
    <>
      <ReadingProgress />
      <a className="skip" href="#main">
        {t("К содержимому", "Skip to content")}
      </a>
      <header className="header">
        <a href="#" className="signature" aria-label="Pavel Markov">
          PM
          <span>
            PAVEL
            <br />
            MARKOV
          </span>
        </a>
        <nav
          className={menu ? "nav open" : "nav"}
          aria-label={t("Навигация", "Navigation")}
        >
          {[
            ["about", t("Обо мне", "About")],
            ["route", t("Твой маршрут", "Your route")],
            ["projects", t("Проекты", "Projects")],
          ].map(([id, label]) => (
            <a key={id} href={"#" + id} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="text-button"
            onClick={() => setLang(lang === "ru" ? "en" : "ru")}
            aria-label={t("Switch to English", "Переключить на русский")}
          >
            {lang.toUpperCase()}{" "}
            <span className="muted">/ {lang === "ru" ? "EN" : "RU"}</span>
          </button>
          <button
            className="icon-button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={t("Сменить тему", "Change theme")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="header-contact" onClick={openContact}>
            {t("Связаться", "Let’s talk")} <ArrowUpRight size={16} />
          </button>
          <button
            className="mobile-menu icon-button"
            aria-expanded={menu}
            aria-label={t("Меню", "Menu")}
            onClick={() => setMenu(!menu)}
          >
            <Menu />
          </button>
        </div>
      </header>
      <main id="main">
        <section className="hero">
          <div className="hero-top">
            <span className="eyebrow">
              <b className="dot" /> PERSONAL EXPERIENCE / 01
            </span>
            <span className="hero-aside">
              {t("ДИСЦИПЛИНА В ДЕЙСТВИИ", "DISCIPLINE IN ACTION")}
            </span>
          </div>
          <div className="hero-layout">
            <div className="hero-copy">
              <p className="hero-name">{profile.name[i]}</p>
              <h1>
                {t("Форма.", "Body.")}
                <br />
                <span className="outline">{t("Мышление.", "Mind.")}</span>
                <br />
                {t("Система.", "System.")}
                <span className="accent">↗</span>
              </h1>
              <p className="hero-description">
                {t(
                  "Фитнес, нутрициология, развитие личности и управление проектами. Мой подход — меньше лишнего, больше осмысленных действий и измеримого прогресса.",
                  "Fitness, nutrition, personal development and project management. My approach: fewer distractions, more intentional action and measurable progress.",
                )}
              </p>
              <div className="hero-ctas">
                <a className="button primary" href="#route">
                  {t("Найти свой инструмент", "Find your tool")}
                  <ArrowUpRight size={20} />
                </a>
                <button className="button understated" onClick={openContact}>
                  {t("Связаться со мной", "Let’s connect")}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
            <div
              className="hero-photo"
              onPointerMove={(e) => {
                if (
                  matchMedia(
                    "(pointer:fine) and (prefers-reduced-motion:no-preference)",
                  ).matches
                ) {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty(
                    "--shift",
                    `${(e.clientX - r.left - r.width / 2) / 70}px`,
                  );
                }
              }}
              onPointerLeave={(e) =>
                e.currentTarget.style.setProperty("--shift", "0px")
              }
            >
              <img
                src={base + profile.portrait}
                srcSet={`${base}media/hero-portrait-small.webp 600w, ${base + profile.portrait} 1200w`}
                sizes="(max-width:760px) 88vw, 43vw"
                width="1200"
                height="857"
                alt={t(
                  "Павел Марков в белом смокинге",
                  "Pavel Markov wearing a white tuxedo",
                )}
                fetchPriority="high"
              />
              <div className="portrait-label">
                <span>PAVEL MARKOV</span>
                <span>BODY / MIND / SYSTEM</span>
              </div>
              <div className="photo-caption">
                <b className="dot" />
                {t(
                  "Практика, которая становится системой.",
                  "Practice that becomes a system.",
                )}
              </div>
            </div>
          </div>
          <div className="hero-bottom">
            <span>
              {t(
                "Не просто познакомимся. Найдём, что полезно именно тебе.",
                "More than an introduction. Find what works for you.",
              )}
            </span>
            <a href="#about">SCROLL TO EXPLORE ↓</a>
          </div>
        </section>
        <div className="ticker">
          <span>{t("КМС × 2", "SPORTS RANKS × 2")}</span>
          <span>✳</span>
          <span>
            {t(
              "ФИТНЕС / НУТРИЦИОЛОГИЯ / КОУЧИНГ",
              "FITNESS / NUTRITION / COACHING",
            )}
          </span>
          <span>✳</span>
          <span>PROJECT & OPERATIONS</span>
          <span>✳</span>
          <span>
            {t("АВТОР ЦИФРОВЫХ ПРОДУКТОВ", "DIGITAL PRODUCT CREATOR")}
          </span>
        </div>
        <section id="about" className="section about">
          <div className="section-label">
            01 / {t("ЧЕЛОВЕК И ПОДХОД", "PERSON & APPROACH")}
          </div>
          <div className="about-grid">
            <h2>
              {t("Несколько направлений.", "Different disciplines.")}
              <br />
              <em>{t("Один подход.", "One approach.")}</em>
            </h2>
            <div>
              <p className="lead">
                {t(
                  "Я работаю с задачами, в которых важны система, дисциплина и понятный результат. Это касается и физических тренировок, и питания, и управления проектами.",
                  "I work on challenges where structure, discipline and a clear result matter. That applies to training, nutrition and managing projects.",
                )}
              </p>
              <p className="muted">
                {t(
                  "Мне интересно превращать сложное в инструменты, которыми удобно пользоваться каждый день. Предпринимательство и создание продуктов — моя практическая деятельность.",
                  "I turn complexity into tools that are useful every day. Entrepreneurship and product creation are part of my practical work.",
                )}
              </p>
            </div>
          </div>
          <div className="pillars">
            {[
              [
                t("Тело", "Body"),
                t(
                  "Физическая форма, тренировки, питание. Система начинается с личной практики.",
                  "Fitness, training, nutrition. A system starts with personal practice.",
                ),
              ],
              [
                t("Мышление", "Mind"),
                t(
                  "Развитие, цели, привычки, коучинг. Конкретные действия вместо абстракций.",
                  "Development, goals, habits, coaching. Specific actions make ideas useful.",
                ),
              ],
              [
                t("Система", "System"),
                t(
                  "Управление проектами, процессы, продукты. Структура помогает двигаться вперёд.",
                  "Project management, processes, products. Structure helps you move forward.",
                ),
              ],
            ].map(([name, text], k) => (
              <article key={name}>
                <span className="eyebrow">0{k + 1} /</span>
                <h3>
                  {name}
                  <span>+</span>
                </h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <div className="profile-grid">
            <figure className="fitness-photo">
              <img
                src={base + profile.fitness}
                width="600"
                height="771"
                loading="lazy"
                alt={t(
                  "Павел с кубком и медалью",
                  "Pavel with a trophy and medal",
                )}
              />
              <figcaption>
                {t(
                  "Личная практика. Не только теория.",
                  "Personal practice. Beyond theory.",
                )}
              </figcaption>
            </figure>
            <div className="credentials">
              <div className="facts">
                <div>
                  <strong>
                    {profile.height}
                    <small>{t("см", "cm")}</small>
                  </strong>
                  <span>{t("РОСТ", "HEIGHT")}</span>
                </div>
                <div>
                  <strong>
                    {profile.weight}
                    <small>{t("кг", "kg")}</small>
                  </strong>
                  <span>
                    {t("ВЕС · МОЖЕТ МЕНЯТЬСЯ", "WEIGHT · MAY CHANGE")}
                  </span>
                </div>
              </div>
              <p>
                {t(
                  "КМС по бодибилдингу · КМС по кикбоксингу",
                  "Candidate for Master of Sport: bodybuilding & kickboxing",
                )}
              </p>
              <p className="muted small">
                {t(
                  "Спортивные звания — личный опыт, отдельный от профессиональной подготовки.",
                  "Sports ranks reflect personal practice and are separate from professional education.",
                )}
              </p>
              {profile.qualifications.map((q) => (
                <details key={q.name}>
                  <summary>
                    <span>{q.year}</span>
                    <strong>{q.name}</strong>
                    <span>{q.area[i]}</span>
                    <span>+</span>
                  </summary>
                  <p>{q.detail[i]}</p>
                  {q.document && (
                    <a
                      className="text-link"
                      href={q.document}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("Подтверждающий документ", "Supporting document")} ↗
                    </a>
                  )}
                </details>
              ))}
            </div>
          </div>
        </section>
        <section id="route" className="section route-section">
          <div className="section-label">
            02 / {t("ОТ ИНТЕРЕСА К ДЕЙСТВИЮ", "FROM INTEREST TO ACTION")}
          </div>
          <div className="section-heading">
            <h2>
              {t("С чего", "Where do we")}
              <br />
              <em>{t("начнём?", "start?")}</em>
            </h2>
            <p>
              {t(
                "Выбери, что хочешь улучшить. Я покажу первый практический шаг и инструмент, который поможет двигаться дальше.",
                "Choose what you want to improve. Find a practical first step and a tool to keep moving.",
              )}
              <span className="small muted block">
                {t(
                  "Без регистрации. Ответы остаются в этом браузере.",
                  "No sign-up. Answers stay in this browser.",
                )}
              </span>
            </p>
          </div>
          <div className="route-panel">
            <div className="route-meta">
              <span>{t("ТВОЯ ТОЧКА РОСТА", "YOUR GROWTH POINT")}</span>
              <span>
                {step < 4
                  ? `0${step + 1} / 04`
                  : t("ТВОЙ МАРШРУТ", "YOUR ROUTE")}
              </span>
            </div>
            <div
              className="steps"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={4}
              aria-valuenow={Math.min(step + 1, 4)}
              aria-label={t("Прогресс", "Progress")}
            >
              {[0, 1, 2, 3].map((n) => (
                <span key={n} className={n <= step ? "complete" : ""} />
              ))}
            </div>
            {step < 4 ? (
              <>
                <h3
                  tabIndex={-1}
                  key={`${step}-${lang}`}
                  ref={(el) => {
                    if (el && step > 0) el.focus({ preventScroll: true });
                  }}
                >
                  {
                    [
                      t(
                        "Что ты хочешь улучшить прямо сейчас?",
                        "What would you like to improve?",
                      ),
                      t(
                        "Какой результат сейчас важнее?",
                        "Which result matters most?",
                      ),
                      t(
                        "Что чаще мешает двигаться?",
                        "What usually gets in the way?",
                      ),
                      t(
                        "Сколько времени есть на один шаг?",
                        "How much time can you give one action?",
                      ),
                    ][step]
                  }
                </h3>
                <div className="route-options">
                  {(step === 0
                    ? directions
                    : step === 1
                      ? goals[answers.direction]
                      : step === 2
                        ? [
                            [
                              t(
                                "Неясно, с чего начать",
                                "Not sure where to start",
                              ),
                            ],
                            [t("Сложно найти время", "Hard to find time")],
                            [
                              t(
                                "Теряю последовательность",
                                "I struggle with consistency",
                              ),
                            ],
                          ]
                        : [
                            [t("10 минут", "10 minutes")],
                            [t("25 минут", "25 minutes")],
                            [t("45 минут", "45 minutes")],
                          ]
                  ).map((option, k) => (
                    <button
                      key={k}
                      onClick={() => {
                        setAnswers({
                          ...answers,
                          ...(step === 0
                            ? { direction: keys[k], goal: 0 }
                            : step === 1
                              ? { goal: k }
                              : step === 2
                                ? { barrier: k }
                                : { time: k }),
                        });
                        if (step === 3) setMinutes([10, 25, 45][k]);
                        setStep(step + 1);
                      }}
                    >
                      <span className="option-number">0{k + 1}</span>
                      <span>{step <= 1 ? option[i] : option[0]}</span>
                      <ArrowUpRight size={22} />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="route-result">
                <span className="eyebrow">
                  {t("ТВОЯ СЛЕДУЮЩАЯ ТОЧКА РОСТА", "YOUR NEXT GROWTH POINT")}
                </span>
                <h3>{result.title}</h3>
                <p className="result-action">{result.action}</p>
                <h4>{t("Три шага на 7 дней", "Three steps for seven days")}</h4>
                <ol>
                  {result.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                <p>
                  <strong>{t("Показатель: ", "Metric: ")}</strong>
                  {result.metric}
                </p>
                <p className="small muted">{result.why}</p>
                <div className="result-actions">
                  <a
                    className="button primary"
                    href={profile.projects[result.product].url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {profile.projects[result.product].name}
                    <ArrowUpRight size={18} />
                  </a>
                  <button
                    className="button secondary"
                    onClick={() =>
                      copy(
                        [
                          result.title,
                          result.action,
                          ...result.steps,
                          result.metric,
                          result.why,
                          profile.projects[result.product].url,
                        ].join("\n"),
                      )
                    }
                  >
                    <Copy size={16} />
                    {t("Скопировать", "Copy")}
                  </button>
                  <button className="button secondary" onClick={openContact}>
                    {t("Обсудить с Павлом", "Discuss with Pavel")}
                  </button>
                </div>
              </div>
            )}
            {step > 0 && (
              <button
                className="back text-button"
                onClick={() => setStep(step - 1)}
              >
                ← {t("Назад, изменить ответ", "Back, change answer")}
              </button>
            )}
          </div>
        </section>

        <section className="section resource-section" id="resource">
          <div className="section-label">
            03 / {t("РЕСУРС ВРЕМЕНИ", "YOUR TIME BUDGET")}
          </div>
          <div className="resource-grid">
            <div>
              <h2>
                {t("Маленькие шаги.", "Small steps.")}
                <br />
                <em>{t("Реальный ресурс.", "Real capacity.")}</em>
              </h2>
              <p className="muted">
                {t(
                  "Сколько времени у тебя действительно есть? Не нужно начинать с идеального графика. Посмотрим, какой объём действий ты реально можешь поддерживать.",
                  "How much time do you really have? Start with a schedule you can sustain.",
                )}
              </p>
              <label>
                {t("Направление", "Direction")}
                <select
                  value={answers.direction}
                  onChange={(e) => {
                    setAnswers({
                      ...answers,
                      direction: e.target.value as Answers["direction"],
                      goal: 0,
                    });
                    setPlan(false);
                  }}
                >
                  {directions.map((d, k) => (
                    <option key={keys[k]} value={keys[k]}>
                      {d[i]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="calculator">
              <div className="sliders">
                {[
                  {
                    label: t("Минуты на занятие", "Minutes per session"),
                    value: minutes,
                    set: setMinutes,
                    min: 10,
                    max: 180,
                    unit: t("мин", "min"),
                  },
                  {
                    label: t("Дней в неделю", "Days per week"),
                    value: days,
                    set: setDays,
                    min: 1,
                    max: 7,
                    unit: t("дн", "days"),
                  },
                  {
                    label: t("Реалистичное выполнение", "Realistic adherence"),
                    value: adherence,
                    set: setAdherence,
                    min: 50,
                    max: 100,
                    unit: "%",
                  },
                ].map((s) => (
                  <label key={s.label}>
                    {s.label}
                    <strong>
                      {s.value} {s.unit}
                    </strong>
                    <input
                      type="range"
                      min={s.min}
                      max={s.max}
                      value={s.value}
                      onChange={(e) => {
                        s.set(Number(e.target.value));
                        setPlan(false);
                      }}
                    />
                  </label>
                ))}
              </div>
              <fieldset className="week-options">
                <legend>{t("Продолжительность", "Plan length")}</legend>
                {[4, 8, 12].map((w) => (
                  <button
                    key={w}
                    className={weeks === w ? "selected" : ""}
                    aria-pressed={weeks === w}
                    onClick={() => {
                      setWeeks(w);
                      setPlan(false);
                    }}
                  >
                    {w} {t("недель", "weeks")}
                  </button>
                ))}
              </fieldset>
              <div className="calc-output" aria-live="polite">
                <div>
                  <strong>
                    {num(calc.total)}
                    <small>{t("часов", "hours")}</small>
                  </strong>
                  <span>{t("реальной практики", "of realistic practice")}</span>
                </div>
                <p>
                  {num(calc.weekly)} {t("ч / неделю", "h / week")}
                  <br />
                  {calc.sessions}{" "}
                  {t("занятий запланировано", "sessions planned")}
                  <br />
                  {t("Идеально:", "Ideal:")} {num(calc.ideal)}{" "}
                  {t("ч · разница:", "h · gap:")} {num(calc.gap)} {t("ч", "h")}
                </p>
              </div>
              <p className="small muted">
                {t(
                  "Начни с одного выполнимого занятия. Часы показывают объём практики, а не обещание результата.",
                  "Start with one manageable session. Hours describe practice time, not a promised outcome.",
                )}
              </p>
              <button
                className="button primary full"
                onClick={() => setPlan(true)}
              >
                {t("Превратить это в план", "Turn this into a plan")}
                <ArrowRight size={18} />
              </button>
              {plan && (
                <div className="generated-plan">
                  <p>{planText}</p>
                  <button
                    className="text-button"
                    onClick={() => copy(planText)}
                  >
                    <Copy size={16} />
                    {t("Скопировать план", "Copy plan")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
        <section id="projects" className="section projects-section">
          <div className="section-label">
            04 / {t("СОЗДАНО МНОЙ", "BUILT BY ME")}
          </div>
          <div className="section-heading">
            <h2>
              {t("Не просто идеи.", "More than ideas.")}
              <br />
              <em>{t("Инструменты.", "Working tools.")}</em>
            </h2>
            <p>
              {t(
                "Я создаю инструменты, которыми пользуются. У каждого проекта своя задача. Выбирай тот, который решает твою.",
                "I create tools for everyday use. Each project has a purpose. Choose the one that helps with yours.",
              )}
            </p>
          </div>
          <div className="project-list">
            {profile.projects.map((p, idx) => (
              <article className={"project project-" + idx} key={p.name}>
                <div className="project-visual" aria-hidden="true">
                  <span>{p.tag}</span>
                  {idx === 0 ? (
                    <img
                      src={base + "media/markovmade.webp"}
                      loading="lazy"
                      width="420"
                      height="420"
                      alt=""
                    />
                  ) : (
                    <div className="project-type">
                      {idx === 1 ? (
                        <>
                          MOVE.
                          <br />
                          LIFT.
                          <br />
                          <em>REPEAT.</em>
                        </>
                      ) : (
                        <>
                          MAKE
                          <br />
                          <em>IT</em>
                          <br />
                          WORK.
                        </>
                      )}
                    </div>
                  )}
                  <span>
                    {t("АВТОРСКИЙ ПРОДУКТ", "AN ORIGINAL PRODUCT")} / {p.number}
                  </span>
                </div>
                <div className="project-content">
                  <div className="project-meta">
                    <span>
                      {p.number} / {p.name}
                    </span>
                    <ArrowUpRight size={26} />
                  </div>
                  <h3>{p.title[i]}</h3>
                  <p>{p.text[i]}</p>
                  <div className="tags">
                    {p.features.map((f) => (
                      <span key={f[0]}>{f[i]}</span>
                    ))}
                  </div>
                  <a
                    href={p.url}
                    className="project-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("Открыть", "Open")} {p.name}
                    <ArrowUpRight size={19} />
                  </a>
                  {idx === 2 && (
                    <a
                      className="small muted"
                      href="https://github.com/castefeudal/pmwork"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("Исходный код GitHub", "Source on GitHub")} ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
          <div className="extras">
            <article>
              <span className="eyebrow">TELEGRAM / ECOSYSTEM</span>
              <h3>
                MARKOVMADE BOT <ArrowUpRight size={22} />
              </h3>
              <p>
                {t(
                  "Удобная точка входа в мою экосистему прямо из Telegram.",
                  "A convenient entry point to my ecosystem, directly in Telegram.",
                )}
              </p>
              <a
                className="text-link"
                href={profile.bot}
                target="_blank"
                rel="noreferrer"
              >
                {t("Открыть бота", "Open bot")} ↗
              </a>
            </article>
            <article className="caste">
              <img
                src={base + "media/caste.webp"}
                width="120"
                height="120"
                loading="lazy"
                alt=""
              />
              <div>
                <span className="eyebrow">
                  {t("ОБРАЗОВАТЕЛЬНЫЙ ПРОЕКТ", "EDUCATION PROJECT")}
                </span>
                <h3>Каста Феодалов</h3>
                <p>
                  {t(
                    "Мой авторский проект о развитии человека, дисциплине и практических знаниях.",
                    "My educational project about personal development, discipline and practical knowledge.",
                  )}
                </p>
              </div>
            </article>
          </div>
        </section>
        <Services
          en={i === 1}
          onContact={(k) => {
            setTopic(k);
            openContact();
          }}
        />
        <section className="editorial-strip">
          <img
            src={base + profile.editorial}
            loading="lazy"
            width="1280"
            height="853"
            alt={t(
              "Павел Марков выступает на сцене Blockchain Life 2022",
              "Pavel Markov speaking at Blockchain Life 2022",
            )}
          />
          <div>
            <span className="eyebrow">
              {t(
                "ОТ ЛИЧНОЙ ПРАКТИКИ — К ПОЛЕЗНЫМ ПРОДУКТАМ",
                "FROM PERSONAL PRACTICE TO USEFUL PRODUCTS",
              )}
            </span>
            <h2>
              {t("Знать недостаточно.", "Knowing is not enough.")}
              <br />
              <em>{t("Важно применять.", "Put it into practice.")}</em>
            </h2>
            <p>
              {t(
                "Я ценю знания, которые выдерживают проверку практикой. Простые решения, которые можно повторить. Системы, в которых видно движение вперёд. И работу, где результат важнее красивых обещаний.",
                "I value knowledge tested in practice. Simple solutions you can repeat. Systems that make progress visible. And work where results matter more than promises.",
              )}
            </p>
          </div>
        </section>
        <section id="contacts" className="section contacts">
          <div className="section-label">
            06 / {t("ПРОДОЛЖИМ ЗНАКОМСТВО", "LET’S CONTINUE")}
          </div>
          <div className="contact-grid">
            <h2>
              {t("Есть задача?", "Something in mind?")}
              <br />
              <em>{t("Давай обсудим.", "Let’s talk.")}</em>
            </h2>
            <div>
              <p>
                {t(
                  "Тренировки, питание, личное развитие или проект. Начнём с твоей задачи и поймём, чем я могу быть полезен.",
                  "Training, nutrition, personal growth or a project. Let’s start with your situation and see how I can help.",
                )}
              </p>
              <button className="button primary" onClick={openContact}>
                {t("Связаться со мной", "Get in touch")}
                <ArrowUpRight size={20} />
              </button>
              <p className="creator-note">
                {t(
                  "«Мне интересны люди, которые готовы делать. До связи». — Павел",
                  "“I enjoy working with people who are ready to act. Talk soon.” — Pavel",
                )}
              </p>
            </div>
          </div>
          <div className="contact-links">
            <a href={profile.telegram} target="_blank" rel="noreferrer">
              Telegram ↗
            </a>
            <a href={profile.whatsapp} target="_blank" rel="noreferrer">
              WhatsApp ↗
            </a>
            <a href={profile.bot} target="_blank" rel="noreferrer">
              Telegram Bot ↗
            </a>
            {Object.entries(profile.socials)
              .filter(([, url]) => url)
              .map(([name, url]) => (
                <a key={name} href={url} target="_blank" rel="noreferrer">
                  {name} ↗
                </a>
              ))}
          </div>
        </section>
      </main>
      <footer>
        <div className="footer-name">
          PAVEL MARKOV<span>↗</span>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} PAVEL MARKOV</span>
          <span>Make progress tangible.</span>
          <button
            className="text-button"
            onClick={() => {
              try {
                ["pm-route", "pm-lang", "pm-theme"].forEach((k) =>
                  localStorage.removeItem(k),
                );
              } catch {}
              setAnswers({
                direction: "fitness",
                goal: 0,
                barrier: 0,
                time: 0,
              });
              setStep(0);
              setLang("ru");
              setTheme("dark");
              setNotice(
                t(
                  "Локальные предпочтения очищены",
                  "Local preferences cleared",
                ),
              );
            }}
          >
            {t("Очистить предпочтения", "Clear preferences")}
          </button>
        </div>
      </footer>
      <button
        className="floating-contact"
        onClick={openContact}
        aria-label={t("Связаться с Павлом", "Contact Pavel")}
      >
        <ArrowUpRight size={22} />
      </button>
      <dialog
        ref={dialog}
        onCancel={() => setContact(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setContact(false);
        }}
        aria-labelledby="contact-title"
      >
        <div className="dialog-heading">
          <span className="eyebrow">LET’S CONNECT</span>
          <button
            className="icon-button"
            onClick={() => setContact(false)}
            aria-label={t("Закрыть", "Close")}
          >
            <X />
          </button>
        </div>
        <h2 id="contact-title">
          {t("О чём хочешь поговорить?", "What’s on your mind?")}
        </h2>
        <label>
          {t("Направление", "Topic")}
          <select
            value={topic}
            onChange={(e) => setTopic(Number(e.target.value))}
          >
            {topics.map((v, k) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <p className="message">{message}</p>
        <a
          className="button primary full"
          href={profile.whatsapp + "?text=" + encodeURIComponent(message)}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
          <ArrowUpRight size={18} />
        </a>
        <a
          className="button secondary full"
          href={profile.telegram}
          target="_blank"
          rel="noreferrer"
        >
          Telegram
          <ArrowUpRight size={18} />
        </a>
        <button className="text-button" onClick={() => copy(message)}>
          <Copy size={16} />
          {t("Скопировать обращение", "Copy message")}
        </button>
        <p className="small muted">
          {t(
            "WhatsApp подставит текст. Для Telegram скопируй его перед переходом.",
            "WhatsApp includes your message. Copy it before opening Telegram.",
          )}
        </p>
      </dialog>
      <div role="status" className={notice ? "toast visible" : "toast"}>
        {notice}
      </div>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
