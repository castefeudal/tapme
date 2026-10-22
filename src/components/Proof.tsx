import { profile } from "../config/profile";
import { useExperience } from "../hooks/useExperience";
import { Chapter, Media } from "./Primitives";
import "../styles/proof.css";
export function Proof() {
  const { t, p } = useExperience();
  return (
    <section className="proof-chapter chapter-section" id="proof">
      <Chapter ru="ПРАКТИКА И ПОДГОТОВКА" en="THE PROOF" />
      <div className="proof-title">
        <h2>
          {t("Спорт, обучение", "Sport, study")}
          <br />
          {t("и работа.", "and work.")}
        </h2>
        <p>
          {t(
            "Мой опыт объединяет спорт, фитнес и нутрициологию, коучинг, предпринимательство и управление проектами.",
            "My experience spans sport, fitness, nutrition, coaching, entrepreneurship and project management.",
          )}
        </p>
      </div>
      <div className="proof-spread">
        <figure className="athlete-frame" data-enter>
          <Media
            src={profile.fitness}
            width="600"
            height="771"
            loading="lazy"
            alt={t(
              "Павел со спортивным кубком и медалью",
              "Pavel with a sports trophy and medal",
            )}
          />
          <figcaption>
            {t(
              "КМС по бодибилдингу",
              "Candidate for Master of Sport: bodybuilding",
            )}
          </figcaption>
        </figure>
        <div className="proof-record">
          <div className="personal-facts">
            <span>
              <strong>{profile.height}</strong>
              {t("см · рост", "cm · height")}
            </span>
            <span>
              <strong>{profile.weight}</strong>
              {t("кг · вес может меняться", "kg · weight may change")}
            </span>
          </div>
          <p className="sport-rank">
            {t(
              "КМС по кикбоксингу",
              "Candidate for Master of Sport: kickboxing",
            )}
          </p>
          <p className="small-note">
            {t(
              "Спортивные звания отражают личную практику и представлены отдельно от квалификаций.",
              "Sports ranks reflect personal practice and are separate from professional qualifications.",
            )}
          </p>
          <div className="qualification-timeline">
            {profile.qualifications.map((q) => (
              <details key={q.name}>
                <summary>
                  <time>{q.year}</time>
                  <span>
                    <strong>{q.name}</strong>
                    <span>{p(q.area)}</span>
                  </span>
                  <span className="disclosure" aria-hidden="true">
                    ⌄
                  </span>
                </summary>
                <p>{p(q.detail)}</p>
                {q.document && (
                  <a href={q.document}>
                    {t("Подтверждающий документ", "Supporting document")}
                  </a>
                )}
              </details>
            ))}
          </div>
          <p className="practical-work">
            {t(
              "Управление проектами, процессы и создание продуктов — отдельная практическая деятельность.",
              "Project management, operations and product creation are separate areas of practical work.",
            )}
          </p>
        </div>
        <figure className="speaker-frame" data-enter>
          <Media
            src={profile.editorial}
            width="1280"
            height="853"
            loading="lazy"
            alt={t(
              "Выступление Павла Маркова на Blockchain Life 2022",
              "Pavel Markov speaking at Blockchain Life 2022",
            )}
          />
          <figcaption>Blockchain Life / 2022</figcaption>
        </figure>
      </div>
    </section>
  );
}
