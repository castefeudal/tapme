export type Direction = "fitness" | "nutrition" | "work" | "focus";
export type Answers = {
  direction: Direction;
  goal: number;
  barrier: number;
  time: number;
};
export function resource(
  minutes: number,
  days: number,
  weeks: number,
  adherence: number,
) {
  if (
    !Number.isFinite(minutes) ||
    minutes < 10 ||
    minutes > 180 ||
    !Number.isInteger(days) ||
    days < 1 ||
    days > 7 ||
    ![4, 8, 12].includes(weeks) ||
    !Number.isFinite(adherence) ||
    adherence < 50 ||
    adherence > 100
  )
    throw new Error("Invalid resource parameters");
  const ideal = (minutes * days * weeks) / 60;
  const total = (ideal * adherence) / 100;
  return {
    weekly: (minutes * days * adherence) / 6000,
    total,
    sessions: days * weeks,
    ideal,
    gap: ideal - total,
  };
}
export const directions = [
  ["Физическая форма", "Physical fitness"],
  ["Питание и привычки", "Nutrition & habits"],
  ["Работа и проекты", "Work & projects"],
  ["Личная эффективность", "Personal effectiveness"],
];
export const keys: Direction[] = ["fitness", "nutrition", "work", "focus"];
export const goals = {
  fitness: [
    ["Стать сильнее", "Get stronger"],
    ["Изменить состав тела", "Change body composition"],
    ["Заниматься регулярно", "Train consistently"],
  ],
  nutrition: [
    ["Понять свой рацион", "Understand my diet"],
    ["Наладить режим", "Build a routine"],
    ["Отслеживать динамику", "Track changes"],
  ],
  work: [
    ["Завершить проект", "Finish a project"],
    ["Разобраться с задачами", "Organise tasks"],
    ["Уточнить ответственность", "Clarify ownership"],
  ],
  focus: [
    ["Определить приоритет", "Choose a priority"],
    ["Меньше откладывать", "Stop postponing"],
    ["Закрепить привычку", "Build a habit"],
  ],
};
export function recommendation(a: Answers, lang: "ru" | "en") {
  const en = lang === "en";
  const index = keys.indexOf(a.direction);
  const title = goals[a.direction][a.goal][en ? 1 : 0];
  const actions = en
    ? [
        "Record one baseline exercise and choose a repeatable training slot.",
        "Record a typical day of eating without trying to change everything.",
        "Write down one deliverable, its owner, the next action and a deadline.",
        "Choose one observable result for this week.",
      ]
    : [
        "Запиши исходный результат в одном упражнении и выбери удобное время занятий.",
        "Запиши обычный день питания, не пытаясь сразу менять всё.",
        "Зафиксируй один результат проекта, ответственного, следующий шаг и срок.",
        "Выбери один проверяемый результат этой недели.",
      ];
  const goalSteps = en
    ? [
        [
          "Track load and repetitions in the same exercise.",
          "Observe body-weight trends across several days.",
          "Repeat a comfortable session schedule.",
        ],
        [
          "Observe meals for three days.",
          "Choose a consistent meal time.",
          "Compare several measurements under similar conditions.",
        ],
        [
          "Break the deliverable into three milestones.",
          "Keep only one task in progress.",
          "Confirm ownership with the people involved.",
        ],
        [
          "Define what “done” looks like.",
          "Make the first action small enough to start.",
          "Attach the action to an existing routine.",
        ],
      ]
    : [
        [
          "Отслеживай нагрузку и повторы в одном упражнении.",
          "Наблюдай динамику массы за несколько дней.",
          "Повтори удобный график занятий.",
        ],
        [
          "Наблюдай за питанием три дня.",
          "Выбери постоянное время одного приёма пищи.",
          "Сравни несколько измерений в похожих условиях.",
        ],
        [
          "Разбей результат на три этапа.",
          "Оставь одну задачу в работе.",
          "Согласуй ответственность с участниками.",
        ],
        [
          "Опиши, как выглядит готовый результат.",
          "Уменьши первое действие до простого старта.",
          "Привяжи действие к существующей привычке.",
        ],
      ];
  const barriers = en
    ? [
        "Remove one avoidable obstacle before starting.",
        "Put the action in your calendar.",
        "Record completion instead of relying on memory.",
      ]
    : [
        "Убери одно препятствие перед началом.",
        "Заранее внеси действие в календарь.",
        "Отмечай выполнение, не полагаясь на память.",
      ];
  const minutes = [10, 25, 45][a.time];
  return {
    title,
    action: actions[index],
    steps: [
      goalSteps[index][a.goal],
      barriers[a.barrier],
      en
        ? `Reserve ${minutes} minutes; review the week after seven days.`
        : `Выдели ${minutes} минут; через семь дней подведи итог.`,
    ],
    metric: en
      ? "Completed planned actions / planned actions this week."
      : "Выполненные действия / запланированные действия за неделю.",
    why: en
      ? `Based on your goal “${title}”, your main obstacle and a ${minutes}-minute time budget. These are transparent planning rules, not a medical or psychological assessment.`
      : `Основание: цель «${title}», выбранное препятствие и доступные ${minutes} минут. Это прозрачные правила планирования, а не медицинская или психологическая диагностика.`,
    product: index === 0 ? 1 : index === 2 ? 2 : 0,
  };
}
