import { useState } from "react";
import { useExperience } from "../hooks/useExperience";
import { profile } from "../config/profile";
import { Socials } from "./Socials";
import { Media } from "./Primitives";
export function Hero() {
  const { t } = useExperience();
  const [side, setSide] = useState(1);
  const [hasTransition, setHasTransition] = useState(false);
  const modes = [
    {
      name: "BODY",
      image: profile.fitness,
      alt: t(
        "Павел с кубком по бодибилдингу",
        "Pavel with a bodybuilding trophy",
      ),
      tag: t("Личная спортивная практика", "My sporting background"),
      text: t(
        "Занимаюсь бодибилдингом и кикбоксингом. Работаю с тренировками, питанием и учётом нагрузки.",
        "My background is in bodybuilding and kickboxing. My work covers training, nutrition and keeping track of workload.",
      ),
      link: "#work-gym",
      cta: t("Мой подход к тренировкам", "Explore my training tools"),
    },
    {
      name: "MIND",
      image: profile.portrait,
      alt: t("Павел Марков в белом костюме", "Pavel Markov in a white suit"),
      tag: t("Знакомство / Павел Марков", "Introduction / Pavel Markov"),
      text: t(
        "Я Павел Марков. Тренер, нутрициолог и коуч. Управляю проектами и делаю приложения для тренировок, питания и работы.",
        "I’m Pavel Markov. I work in fitness, nutrition and personal development. I also manage projects and build digital tools for everyday use.",
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
      tag: t("Blockchain Life / 2022", "Blockchain Life / 2022"),
      text: t(
        "Работаю с проектами и операционными процессами. В PMWORK собрал задачи, сроки, риски и решения в одном рабочем пространстве.",
        "I work in project and operations management. PMWORK brings tasks, deadlines, risks and decisions into one workspace.",
      ),
      link: "#work-pm",
      cta: t("Посмотреть PMWORK", "Explore PMWORK"),
    },
  ];
  const mode = modes[side];
  return (
    <section
      className={
        "cover" +
        (hasTransition ? " has-transition" : "") +
        " side-" +
        mode.name.toLowerCase()
      }
      id="person"
      aria-labelledby="person-title"
    >
      <div className="cover-kicker">
        <span>MARKOV / PERSONAL EDITORIAL</span>
        <span>{t("I — Человек", "Person → practice → products")}</span>
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
                ? `${import.meta.env.BASE_URL}media/hero-portrait-small.webp 600w, ${import.meta.env.BASE_URL}media/hero-portrait-mobile.webp 700w, ${import.meta.env.BASE_URL}media/hero-portrait-medium.webp 800w, ${import.meta.env.BASE_URL}media/hero-portrait.webp 1200w`
                : undefined
            }
            sizes={side === 1 ? "(max-width:760px) 90vw, 52vw" : undefined}
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
            {t(
              "Фитнес. Питание. Коучинг. Проекты.",
              "Fitness. Nutrition. Coaching. Projects.",
            )}
          </span>
          <p>{mode.text}</p>
          <a className="quiet-link" href={mode.link}>
            {mode.cta}
          </a>
        </div>
        <div className="cover-actions">
          <a className="button solid" href="#next">
            {t("Составить план на неделю", "Plan my week")}
            <span aria-hidden="true">↗</span>
          </a>
          <a className="quiet-link" href="#work">
            {t("Мои проекты", "My projects")}
          </a>
          <a
            className="hero-contact quiet-link"
            href={profile.telegram}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("Написать в Telegram", "Message me on Telegram")}
          </a>
        </div>
        <div className="cover-socials">
          <Socials />
        </div>
        <nav
          className="audience-paths"
          aria-label={t("Что тебе нужно сейчас", "What are you here for?")}
        >
          <a href="#work-made">
            <span>01</span>
            <strong>{t("Для себя", "For yourself")}</strong>
            <small>
              {t(
                "Тренировки, питание, развитие",
                "Training, nutrition, personal goals",
              )}
            </small>
          </a>
          <a href="#work-pm">
            <span>02</span>
            <strong>{t("Для работы", "For your work")}</strong>
            <small>
              {t("Задачи, процессы, решения", "Tasks, processes, decisions")}
            </small>
          </a>
        </nav>
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
              onClick={() => {
                if (k !== side) {
                  setHasTransition(true);
                  setSide(k);
                }
              }}
            >
              <span>{m.name}</span>
              <span className="side-indicator" />
            </button>
          ))}
        </div>
        <p>{t("Смена кадра", "Change the scene")}</p>
        <a className="cover-index" href="#proof">
          {t("ПОЗНАКОМИМСЯ БЛИЖЕ", "NEXT — YOUR MOVE")}{" "}
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
