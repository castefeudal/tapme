import { profile } from "../config/profile";
import { useExperience } from "../hooks/useExperience";
import { Chapter, Media } from "./Primitives";
import "../styles/proof.css";
export function Proof() {
  const { t, p } = useExperience();
  return (
    <section className="proof-chapter chapter-section" id="proof">
      <Chapter ru="ОПЫТ И ПОДГОТОВКА" en="BACKGROUND & PRACTICE" />
      <div className="proof-title">
        <h2>
          {t("Мой опыт", "My background")}
          <br />
          {t("и подготовка.", "and training.")}
        </h2>
        <p>
          {t(
            "Бодибилдинг и кикбоксинг — моя спортивная практика. Фитнес, питание и коучинг — направления подготовки. В работе занимаюсь проектами и создаю свои инструменты.",
            "Bodybuilding and kickboxing are part of my sporting life. My professional training covers fitness, nutrition and coaching. My work includes managing projects and building my own tools.",
          )}
        </p>
      </div>
      <div className="proof-spread">
        <figure className="athlete-frame">
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

          <div className="qualification-timeline">
            {profile.qualifications.map((q, index) => (
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
                <a
                  className="practice-bridge"
                  href={["#work-gym", "#work-made", "#next"][index]}
                >
                  {t(
                    [
                      "Тренировки → MARKOVGYM",
                      "Питание → MARKOVMADE",
                      "Цели → план на неделю",
                    ][index],
                    [
                      "Training → MARKOVGYM",
                      "Nutrition → MARKOVMADE",
                      "Goals → a weekly plan",
                    ][index],
                  )}
                </a>
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
              "Предприниматель, Project / Operations Manager. Создаю MARKOVMADE, MARKOVGYM, PMWORK и образовательные проекты.",
              "Entrepreneur and project / operations manager. Creator of MARKOVMADE, MARKOVGYM, PMWORK and educational projects.",
            )}
          </p>
        </div>
        <figure className="speaker-frame">
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
