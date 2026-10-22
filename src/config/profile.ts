export type Lang = "ru" | "en";
export type Pair = readonly [string, string];
export const profile = {
  name: ["Павел Марков", "Pavel Markov"] as Pair,
  height: 188,
  weight: 105,
  portrait: "media/hero-portrait.webp",
  fitness: "media/fitness.webp",
  editorial: "media/portrait-editorial.webp",
  telegram: "https://t.me/markovmade",
  whatsapp: "https://wa.me/375255223132",
  bot: "https://t.me/markovmadebot",
  phone: null,
  socials: {
    GitHub: "https://github.com/castefeudal",
    Instagram: "",
    TikTok: "",
    YouTube: "",
    LinkedIn: "",
    VK: "",
    Threads: "",
    X: "",
    Facebook: "",
  },
  qualifications: [
    {
      year: 2019,
      name: "EREPS",
      area: ["Тело и тренировки", "Body & training"],
      detail: [
        "European Register of Exercise Professionals — европейский реестр фитнес-профессионалов. Тип регистрации и подтверждающий документ уточняются.",
        "European Register of Exercise Professionals. Registration type and supporting documentation to be confirmed.",
      ],
      document: null,
    },
    {
      year: 2022,
      name: "МИИН",
      area: ["Питание и образ жизни", "Nutrition & lifestyle"],
      detail: [
        "Международный институт интегративной нутрициологии. Направление: нутрициология, питание и образ жизни.",
        "International Institute of Integrative Nutrition. Focus: nutrition and lifestyle.",
      ],
      document: null,
    },
    {
      year: 2026,
      name: "ICA",
      area: ["Мышление и развитие", "Mindset & development"],
      detail: [
        "Коучинг и работа с целями. Название программы и вид документа уточняются; аккредитация ICF не заявляется.",
        "Coaching and goal setting. Programme and qualification details to be confirmed; no ICF accreditation claimed.",
      ],
      document: null,
    },
  ],
  projects: [
    {
      name: "MARKOVMADE",
      tag: "BODY / DATA",
      url: "https://castefeudal.github.io/markovmade/",
      title: ["Понимай свои показатели.", "Understand your numbers."],
      text: [
        "Расчётные инструменты для питания, физического состояния и личного прогресса. Наблюдай за динамикой и принимай решения осознанно.",
        "Tools for nutrition, physical condition and personal progress. Track changes and make informed decisions.",
      ],
      features: [
        ["Питание", "Nutrition"],
        ["Расчёты", "Calculations"],
        ["Динамика", "Trends"],
      ],
      number: "01",
    },
    {
      name: "MARKOVGYM",
      tag: "BODY / TRAINING",
      url: "https://castefeudal.github.io/markovgym/",
      title: ["Тренируйся по системе.", "Train with a system."],
      text: [
        "Упражнения, программы и журнал тренировок. Планируй занятия, фиксируй подходы и следи за прогрессией.",
        "Exercises, programmes and a training log. Plan sessions, record sets and track progression.",
      ],
      features: [
        ["Программы", "Programmes"],
        ["Техника", "Technique"],
        ["Журнал", "Training log"],
      ],
      number: "02",
    },
    {
      name: "PMWORK",
      tag: "SYSTEM / OPERATIONS",
      url: "https://castefeudal.github.io/pmwork/",
      title: ["Делай сложное понятным.", "Make complexity clear."],
      text: [
        "Задачи, сроки, риски и ответственность в одной системе. Следующий шаг проекта — перед глазами, а не в памяти.",
        "Tasks, deadlines, risks and ownership in one system. Keep your next project action visible.",
      ],
      features: [
        ["Задачи", "Tasks"],
        ["Решения", "Decisions"],
        ["Локальные данные", "Local data"],
      ],
      number: "03",
    },
  ],
  casteUrl: "",
  cases: [],
};
