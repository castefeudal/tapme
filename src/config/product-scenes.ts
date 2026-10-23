import type { Pair } from "./profile";
export const productScenes: Record<
  string,
  { file: string; label: Pair; note: Pair }[]
> = {
  MARKOVMADE: [
    {
      file: "made-input",
      label: ["Исходные данные", "Inputs"],
      note: [
        "Демонстрация: мужчина, 29 лет, 188 см, 100 кг. Эти значения введены в работающий калькулятор.",
        "Demo: a man aged 29, 188 cm, 100 kg. These inputs were entered in the live calculator.",
      ],
    },
    {
      file: "made-result",
      label: ["Результат расчёта", "Calculation"],
      note: [
        "Для этих демонстрационных данных получен диапазон 2842–3018 ккал. Его можно сопоставлять с последующими наблюдениями; это не рекомендация посетителю.",
        "These demonstration inputs return a range of 2842–3018 kcal, which can be compared with later observations. This is not a target for the visitor.",
      ],
    },
  ],
  MARKOVGYM: [
    {
      file: "gym-technique",
      label: ["Техника движения", "Exercise guide"],
      note: [
        "Открыта карточка упражнения: профиль движения и инструкция. Можно проверить детали до добавления в тренировку.",
        "The exercise card shows its movement profile and instructions, ready to review before adding it to a workout.",
      ],
    },
    {
      file: "gym-workout",
      label: ["В тренировке", "In the workout"],
      note: [
        "В демонстрационную тренировку добавлено упражнение. Здесь можно записывать подходы и фактически выполненную нагрузку.",
        "An exercise has been added to a demonstration workout. This is where sets and completed workload can be recorded.",
      ],
    },
  ],
  PMWORK: [
    {
      file: "pm-work",
      label: ["Работа", "Work"],
      note: [
        "Встроенный демо-проект: задачи разделены по состоянию, у каждой видны владелец и срок.",
        "Built-in demo project: work is grouped by status, with an owner and deadline shown for each item.",
      ],
    },
    {
      file: "pm-decisions",
      label: ["Решения", "Decisions"],
      note: [
        "В том же демо-проекте можно посмотреть управленческие решения. Это учебные записи, а не результаты клиентского проекта.",
        "The same demo project also shows its decisions. These are sample records, not client delivery results.",
      ],
    },
  ],
};
