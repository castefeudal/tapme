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
        <Chapter ru="II / МОИ ПРОЕКТЫ" en="II / THE WORK" />
        <h2>
          {t("Делаю инструменты,", "Tools I build.")}
          <br />
          {t("которые можно попробовать.", "Ready to try.")}
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
            <span className="project-brand">
              <span className="project-number">0{k + 1}</span>
              {profile.projects[k].name}
            </span>
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
            <ol className="product-steps">
              {s.steps.map((step) => (
                <li key={step[0]}>{p(step)}</li>
              ))}
            </ol>
            <p className="product-outcome">{p(s.outcome)}</p>
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
      {profile.cases.length > 0 && (
        <div className="verified-cases chapter-section">
          {profile.cases.map((item) => (
            <article key={item.evidence}>
              <h3>{p(item.title)}</h3>
              <p>{p(item.task)}</p>
              <p>{p(item.work)}</p>
              <p>{p(item.result)}</p>
              <External href={item.evidence}>
                {t("Подтверждение", "Evidence")}
              </External>
            </article>
          ))}
        </div>
      )}
      <div className="ecosystem-notes chapter-section">
        <div>
          <span className="small-label">{t("В TELEGRAM", "IN TELEGRAM")}</span>
          <h3>MARKOVMADE BOT</h3>
          <p>
            {t(
              "Открой мои инструменты и материалы прямо в Telegram.",
              "Open my tools and materials directly in Telegram.",
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
