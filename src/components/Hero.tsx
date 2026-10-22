import { useState } from "react";
import { useExperience } from "../hooks/useExperience";
import { profile } from "../config/profile";
import { Media } from "./Primitives";
export function Hero() {
  const { t } = useExperience();
  const [side, setSide] = useState(1);
  const modes = [
    {
      name: "BODY",
      image: profile.fitness,
      alt: t(
        "Павел с кубком по бодибилдингу",
        "Pavel with a bodybuilding trophy",
      ),
      tag: t("ДИСЦИПЛИНА В ДЕЙСТВИИ", "DISCIPLINE IN PRACTICE"),
      text: t(
        "Форма — это практика, которую ты повторяешь. Тренировки, питание и понятный прогресс.",
        "Fitness is a practice you repeat. Training, nutrition and progress you can track.",
      ),
      link: "#work-gym",
      cta: t("Мой подход к тренировкам", "Explore my training tools"),
    },
    {
      name: "MIND",
      image: profile.portrait,
      alt: t("Павел Марков в белом костюме", "Pavel Markov in a white suit"),
      tag: t("ОТ НАМЕРЕНИЯ К ДЕЙСТВИЮ", "FROM INTENTION TO ACTION"),
      text: t(
        "Предприниматель. Фитнес и нутрициология. Коучинг. Управление проектами. Создаю инструменты, которые помогают переходить от намерений к действиям.",
        "Entrepreneur. Fitness and nutrition. Coaching. Project management. I create tools that turn intentions into action.",
      ),
      link: "#next",
      cta: t("Найти свой следующий шаг", "Find your next move"),
    },
    {
      name: "SYSTEM",
      image: profile.editorial,
      alt: t(
        "Павел выступает на Blockchain Life 2022",
        "Pavel speaking at Blockchain Life 2022",
      ),
      tag: t("СЛОЖНОЕ СТАНОВИТСЯ ПОНЯТНЫМ", "MAKE COMPLEXITY CLEAR"),
      text: t(
        "Проекты, процессы и продукты. Мне интересно создавать системы, которыми удобно пользоваться каждый день.",
        "Projects, processes and products. I build systems that are useful every day.",
      ),
      link: "#work-pm",
      cta: t("Посмотреть PMWORK", "Explore PMWORK"),
    },
  ];
  const mode = modes[side];
  return (
    <section
      className={"cover side-" + mode.name.toLowerCase()}
      id="person"
      aria-labelledby="person-title"
    >
      <div className="cover-kicker">
        <span>A LIVING PORTFOLIO</span>
        <span>{t("Форма. Мышление. Система.", "Body. Mind. System.")}</span>
      </div>
      <div className="cover-scene">
        <h1 id="person-title">
          <span>{t("ПАВЕЛ", "PAVEL")}</span>
          <span>{t("МАРКОВ", "MARKOV")}</span>
        </h1>
        <div className="cover-portrait" key={mode.name}>
          <Media
            src={mode.image}
            srcSet={
              side === 1
                ? `${import.meta.env.BASE_URL}media/hero-portrait-small.webp 600w, ${import.meta.env.BASE_URL}media/hero-portrait.webp 1200w`
                : undefined
            }
            sizes={side === 1 ? "(max-width:760px) 90vw, 50vw" : undefined}
            width={side === 0 ? 600 : 1200}
            height={side === 0 ? 771 : 857}
            alt={mode.alt}
            fetchPriority={side === 1 ? "high" : "auto"}
            loading="eager"
          />
          <span className="portrait-credit">{mode.tag}</span>
        </div>
        <div className="cover-note" key={"text-" + mode.name}>
          <span className="small-label">
            {t("ЧЕЛОВЕК. ПРАКТИКА. ПРОДУКТЫ.", "PERSON. PRACTICE. PRODUCTS.")}
          </span>
          <p>{mode.text}</p>
          <a className="quiet-link" href={mode.link}>
            {mode.cta}
          </a>
        </div>
        <div className="cover-actions">
          <a className="button solid" href="#next">
            {t("Получить первый полезный шаг", "Get your first useful step")}
            <span aria-hidden="true">↗</span>
          </a>
          <a className="quiet-link" href="#work">
            {t("Посмотреть мои проекты", "Explore my work")}
          </a>
        </div>
      </div>
      <div className="cover-bottom">
        <div
          className="side-switch"
          role="group"
          aria-label={t("Три стороны Павла Маркова", "Three sides of Markov")}
        >
          {modes.map((m, k) => (
            <button
              key={m.name}
              aria-pressed={side === k}
              onClick={() => setSide(k)}
            >
              <span>{m.name}</span>
              <span className="side-indicator" />
            </button>
          ))}
        </div>
        <p>{t("Три стороны. Один человек.", "Three sides. One person.")}</p>
        <a className="cover-index" href="#next">
          {t("ДАЛЬШЕ — ТВОЙ ШАГ", "NEXT — YOUR MOVE")}{" "}
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
