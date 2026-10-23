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
        "Tell me about your training, equipment and available time. We can discuss your starting point and agree on a format.",
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
        "We can start with your habits and observations, then discuss changes that fit your routine.",
      ),
    },
    {
      title: t("Коучинг", "Coaching"),
      task: t(
        "Выбрать приоритет, сформулировать цель и решить, с чего начать.",
        "Choose a priority, define a goal and decide where to start.",
      ),
      help: t(
        "Обсудим желаемый результат, препятствия и доступные варианты. Выберем действие и дату, когда проверим результат.",
        "We can clarify the outcome and obstacles, choose an action and agree on when to review it.",
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
        "Tell me about the project, next deliverable and current decisions. We can work out what help would be useful.",
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
            "Расскажи о своей ситуации, цели и ограничениях. Обсудим, чем я могу помочь и какой формат подойдёт.",
            "Tell me about your situation, goal and constraints. We can discuss how I can help and what format would work.",
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
