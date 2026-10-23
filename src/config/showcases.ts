import type { Pair } from "./profile";
export const showcases: {
  id: string;
  title: Pair;
  steps: Pair[];
  outcome: Pair;
  audience: Pair;
  example: Pair;
  feature: Pair;
  image: string;
  alt: Pair;
  capture: Pair;
}[] = [
  {
    id: "made",
    steps: [
      ["Введи свои данные", "Enter your measurements"],
      [
        "Посмотри расчёт и его допущения",
        "Review the estimate and assumptions",
      ],
      ["Сохраняй наблюдения и сравнивай", "Record and compare observations"],
    ],
    outcome: [
      "Сохранённые измерения помогают сверять расчёт с наблюдениями.",
      "Your measurement history helps compare the estimate with your observations.",
    ],
    title: [
      "Расчёты питания и история показателей",
      "Nutrition estimates and a history of your measurements",
    ],
    audience: [
      "Для тех, кто хочет разобраться в питании и физических показателях.",
      "For people who want to understand nutrition and physical measurements.",
    ],
    example: [
      "Рассчитать ориентир по питанию и сохранить исходные измерения.",
      "Estimate your nutrition needs and keep a record of your starting measurements.",
    ],
    feature: [
      "LAB объединяет расчётные инструменты, профиль и историю наблюдений. Оценки помогают ориентироваться, но не заменяют измерения или медицинскую диагностику.",
      "LAB brings together calculators, a profile and observation history. Estimates offer guidance; they do not replace measurements or medical assessment.",
    ],
    image: "media/markovmade-preview.webp",
    alt: [
      "Настоящий интерфейс расчётного инструмента MARKOVMADE",
      "Actual MARKOVMADE calculator interface",
    ],
    capture: [
      "Реальный расчёт MARKOVMADE / демонстрационные данные",
      "Actual MARKOVMADE calculation / demonstration inputs",
    ],
  },
  {
    id: "gym",
    steps: [
      [
        "Найди упражнение и проверь технику",
        "Find an exercise and review technique",
      ],
      ["Добавь его в свою тренировку", "Add it to your workout"],
      ["Запиши выполненные подходы", "Log the sets you actually complete"],
    ],
    outcome: [
      "В журнале видно, что запланировано и что выполнено.",
      "The log puts planned work and completed sets side by side.",
    ],
    title: [
      "Упражнения, программа и журнал",
      "Exercises, workout plans and a training log",
    ],
    audience: [
      "Для тех, кому нужен понятный тренировочный процесс.",
      "For people who want a structured training process.",
    ],
    example: [
      "Подготовить тренировку под своё оборудование и записать выполненную нагрузку.",
      "Build a workout around your equipment and log the work you complete.",
    ],
    feature: [
      "Библиотека упражнений, конструктор тренировок и журнал помогают связать план с тем, что действительно выполнено.",
      "The exercise library, workout builder and log connect your plan to what you actually did.",
    ],
    image: "media/markovgym-preview.webp",
    alt: [
      "Настоящая библиотека упражнений MARKOVGYM",
      "Actual MARKOVGYM exercise library",
    ],
    capture: [
      "Снимок работающего MARKOVGYM / библиотека упражнений",
      "Live MARKOVGYM capture / exercise library",
    ],
  },
  {
    id: "pm",
    steps: [
      ["Сформулируй ближайшую задачу", "Define the next task"],
      ["Назначь владельца и срок", "Set an owner and a deadline"],
      [
        "Зафиксируй решение и следующий шаг",
        "Record the decision and next action",
      ],
    ],
    outcome: [
      "Решение остаётся рядом с задачей, а не теряется в переписке.",
      "Decisions stay attached to the task for later reference.",
    ],
    title: [
      "Задачи, сроки, риски и решения",
      "Tasks, deadlines, risks and decisions",
    ],
    audience: [
      "Для Project и Operations Managers и всех, кто отвечает за результат проекта.",
      "For project and operations managers and anyone accountable for delivery.",
    ],
    example: [
      "Разобраться, кто делает следующий шаг и к какому сроку.",
      "Make it clear who takes the next action and when it is due.",
    ],
    feature: [
      "Рабочая среда объединяет задачи, сроки, риски и решения. Данные сохраняются в браузере.",
      "The workspace connects tasks, deadlines, risks and decisions. Data is stored in your browser.",
    ],
    image: "media/pmwork-preview.webp",
    alt: [
      "Работа с задачами в реальном демонстрационном примере PMWORK",
      "Tasks in the actual PMWORK demonstration",
    ],
    capture: [
      "Настоящий интерфейс PMWORK / встроенный демонстрационный проект",
      "Actual PMWORK interface / built-in demonstration project",
    ],
  },
];
