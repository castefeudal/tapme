import { useExperience } from "../hooks/useExperience";
import { Chapter } from "./Primitives";
import "../styles/connection.css";
export function WorkWithMe({
  onContact,
}: {
  onContact: (text: string) => void;
}) {
  const { t } = useExperience();
  const services = [
    {
      title: t("Физическая форма", "Physical fitness"),
      task: t(
        "Построить регулярные тренировки, разобраться с техникой и отслеживать нагрузку.",
        "Build consistent training, understand technique and track load.",
      ),
      help: t(
        "Разберём исходную точку, ограничения и организацию тренировочного процесса. Формат работы определим после знакомства с задачей.",
        "We can review your starting point, constraints and training structure. Agree on a format after discussing the task.",
      ),
    },
    {
      title: t("Питание", "Nutrition"),
      task: t(
        "Организовать рацион, наладить режим или разобраться с динамикой показателей.",
        "Organise meals, build a routine or understand changes in measurements.",
      ),
      help: t(
        "Начнём с привычек и наблюдений. Обсудим изменения, которые реально поддерживать в твоём режиме.",
        "Start with habits and observations. Discuss changes you can sustain in your routine.",
      ),
    },
    {
      title: t("Коучинг", "Coaching"),
      task: t(
        "Определить приоритет, сформулировать цель и перейти от размышлений к действиям.",
        "Choose a priority, define a goal and move from thinking to acting.",
      ),
      help: t(
        "Уточним желаемый результат и препятствия. Найдём проверяемый следующий шаг, а не универсальный рецепт.",
        "Clarify the outcome and obstacles. Find a verifiable next action rather than a universal formula.",
      ),
    },
    {
      title: t("Проекты и процессы", "Projects & operations"),
      task: t(
        "Навести порядок в задачах, сроках, ответственности и управленческих решениях.",
        "Clarify tasks, deadlines, ownership and management decisions.",
      ),
      help: t(
        "Разберём контекст проекта, ближайший результат и процесс принятия решений. Согласуем объём возможной работы.",
        "Review the project context, next deliverable and decision process. Agree on a possible scope of work.",
      ),
    },
  ];
  return (
    <section id="together" className="collaboration chapter-section">
      <div className="collaboration-heading">
        <Chapter ru="ЛИЧНАЯ РАБОТА" en="WORK WITH ME" />
        <h2>
          {t("Начнём", "Let’s start")}
          <br />
          {t("с твоей задачи.", "with your task.")}
        </h2>
        <p>
          {t(
            "Без универсальных обещаний. Сначала поймём, чем я могу быть полезен.",
            "No universal promises. First, let’s see how I can help.",
          )}
        </p>
      </div>
      <div className="service-accordion">
        {services.map((s) => (
          <details key={s.title}>
            <summary>
              {s.title}
              <span aria-hidden="true">⌄</span>
            </summary>
            <div>
              <span className="small-label">
                {t("С ЧЕМ ПРИЙТИ", "YOUR CHALLENGE")}
              </span>
              <p>{s.task}</p>
              <span className="small-label">
                {t("КАК МОЖЕМ РАБОТАТЬ", "HOW WE CAN WORK")}
              </span>
              <p>{s.help}</p>
              <button
                className="quiet-link"
                onClick={() =>
                  onContact(
                    t(
                      "Павел, хочу обсудить: ",
                      "Pavel, I would like to discuss ",
                    ) +
                      s.title.toLowerCase() +
                      ".",
                  )
                }
              >
                {t("Обсудить задачу", "Discuss your task")}
              </button>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
