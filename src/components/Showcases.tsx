import { ProductCapture } from "./ProductCapture";
import { useExperience } from "../hooks/useExperience";
import { profile } from "../config/profile";
import { showcases } from "../config/showcases";
import { Chapter, Media, External } from "./Primitives";
import "../styles/showcases.css";
export function Showcases() {
  const { t, p } = useExperience();
  return (
    <section id="work" className="work-chapter">
      <div className="work-heading chapter-section">
        <Chapter ru="СОЗДАНО МНОЙ" en="THE WORK" />
        <h2>
          {t("Это мои проекты.", "These are my projects.")}
          <br />
          {t("Открой и попробуй.", "Open one and try it.")}
        </h2>
        <p>
          {t(
            "Расчёты питания, тренировочный журнал и рабочее пространство для проектов. Выбери то, что нужно сейчас.",
            "Nutrition calculations, a training log and a project workspace. Choose the tool that fits what you’re doing.",
          )}
        </p>
      </div>
      {showcases.map((s, k) => (
        <article
          className={"showcase showcase-" + s.id}
          key={s.id}
          id={"work-" + s.id}
        >
          <div className="showcase-title">
            <span className="project-brand">{profile.projects[k].name}</span>
            <h3>{p(s.title)}</h3>
            <p className="audience">{p(s.audience)}</p>
          </div>
          <ProductCapture
            image={s.image}
            alt={p(s.alt)}
            capture={p(s.capture)}
            name={profile.projects[k].name}
          />
          <div className="showcase-story">
            <span className="small-label">
              {t("ОДИН ПРАКТИЧЕСКИЙ СЦЕНАРИЙ", "ONE PRACTICAL USE")}
            </span>
            <p>{p(s.example)}</p>
            <details>
              <summary>{t("Как это устроено", "How it works")}</summary>
              <p>{p(s.feature)}</p>
            </details>
            <External href={profile.projects[k].url} className="button solid">
              {t("Открыть", "Open")} {profile.projects[k].name}
            </External>
            {k === 2 && (
              <External
                href="https://github.com/castefeudal/pmwork"
                className="source-link"
              >
                {t("Исходный код", "Source code")}
              </External>
            )}
          </div>
        </article>
      ))}
      <div className="ecosystem-notes chapter-section">
        <div>
          <span className="small-label">
            {t("ЭКОСИСТЕМА В TELEGRAM", "THE ECOSYSTEM IN TELEGRAM")}
          </span>
          <h3>MARKOVMADE BOT</h3>
          <p>
            {t(
              "Ещё один удобный вход в мои проекты. Прямо из Telegram.",
              "Another convenient entry to my projects. Directly in Telegram.",
            )}
          </p>
          <External href={profile.bot} className="quiet-link">
            {t("Открыть бота", "Open the bot")}
          </External>
        </div>
        <div className="caste-note">
          <Media
            src="media/caste.webp"
            width="100"
            height="100"
            loading="lazy"
            alt=""
          />
          <div>
            <h3>Каста Феодалов</h3>
            <p>
              {t(
                "Мой авторский образовательный проект о развитии человека, дисциплине и практических знаниях.",
                "My educational project about personal development, discipline and practical knowledge.",
              )}
            </p>
            {profile.casteUrl && (
              <External href={profile.casteUrl}>
                {t("Открыть проект", "Open project")}
              </External>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
