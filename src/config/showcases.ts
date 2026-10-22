import type { Pair } from "./profile";
export const showcases: {
  id: string;
  title: Pair;
  audience: Pair;
  example: Pair;
  feature: Pair;
  image: string;
  alt: Pair;
  capture: Pair;
}[] = [
  {
    id: "made",
    title: [
      "Понимай показатели. Управляй изменениями.",
      "Understand your numbers. Guide your progress.",
    ],
    audience: [
      "Для тех, кто хочет разобраться в питании и физических показателях.",
      "For people who want to understand nutrition and physical measurements.",
    ],
    example: [
      "Прежде чем менять рацион, оцени потребности, зафиксируй исходные данные и наблюдай динамику.",
      "Before changing your diet, estimate your needs, record a baseline and observe changes.",
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
    title: [
      "Не просто тренируйся. Понимай свой прогресс.",
      "Go beyond training. Understand your progress.",
    ],
    audience: [
      "Для тех, кому нужен понятный тренировочный процесс.",
      "For people who want a structured training process.",
    ],
    example: [
      "Найди упражнение под своё оборудование, проверь технику и добавь его в тренировку. Затем фиксируй нагрузку и повторы.",
      "Find an exercise for your equipment, check technique and add it to a workout. Then log load and repetitions.",
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
    title: [
      "Сложная работа. Понятные решения.",
      "Complex work. Clear decisions.",
    ],
    audience: [
      "Для Project и Operations Managers и всех, кто отвечает за результат проекта.",
      "For project and operations managers and anyone accountable for delivery.",
    ],
    example: [
      "Собери работу в одном месте: ближайший результат, следующий шаг, ответственный и риск, который требует решения.",
      "Bring work together: the next deliverable, next action, owner and a risk that needs a decision.",
    ],
    feature: [
      "Рабочая среда объединяет задачи, сроки, риски и решения. Данные остаются в браузере; облачная синхронизация не заявляется.",
      "The workspace connects tasks, deadlines, risks and decisions. Data stays in your browser; no cloud sync is claimed.",
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
