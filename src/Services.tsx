import { ArrowUpRight } from "lucide-react";
export function Services({
  en,
  onContact,
}: {
  en: boolean;
  onContact: (topic: number) => void;
}) {
  const services = en
    ? [
        [
          "Training & fitness",
          "Build a routine, choose exercises and understand progression.",
          "Discuss your starting point and a suitable way to work together.",
        ],
        [
          "Nutrition & lifestyle",
          "Understand eating habits and build a sustainable routine.",
          "Start by discussing your current habits and the change you want.",
        ],
        [
          "Coaching & goals",
          "Choose priorities, stop postponing and turn a goal into actions.",
          "Discuss the result you want and your current obstacles.",
        ],
        [
          "Projects & operations",
          "Clarify tasks, deadlines, responsibilities and processes.",
          "Bring a project challenge; agree on the scope and format together.",
        ],
      ]
    : [
        [
          "Тренировки и форма",
          "Выстроить график, подобрать упражнения, разобраться с прогрессией.",
          "Обсудим исходную точку и подходящий формат совместной работы.",
        ],
        [
          "Питание и образ жизни",
          "Разобраться с привычками питания и наладить устойчивый режим.",
          "Начнём с обсуждения текущего рациона и желаемых изменений.",
        ],
        [
          "Коучинг и цели",
          "Определить приоритеты, перестать откладывать, перевести цель в действия.",
          "Обсудим желаемый результат и препятствия, которые мешают двигаться.",
        ],
        [
          "Проекты и процессы",
          "Уточнить задачи, сроки, ответственность и организацию работы.",
          "Расскажи о проектной задаче — вместе определим объём и формат взаимодействия.",
        ],
      ];
  return (
    <section className="section services">
      <div className="section-label">
        05 / {en ? "WORK WITH ME" : "ЛИЧНАЯ РАБОТА"}
      </div>
      <h2>
        {en ? "Your challenge." : "Твоя задача."}
        <br />
        <em>{en ? "A clear next step." : "Понятный следующий шаг."}</em>
      </h2>
      <div className="service-list">
        {services.map(([title, request, format], idx) => (
          <article key={title}>
            <span className="eyebrow">0{idx + 1}</span>
            <div>
              <h3>{title}</h3>
              <p>{request}</p>
              <p className="muted small">{format}</p>
            </div>
            <button
              className="icon-button"
              onClick={() => onContact(idx)}
              aria-label={(en ? "Discuss: " : "Обсудить: ") + title}
            >
              <ArrowUpRight />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
