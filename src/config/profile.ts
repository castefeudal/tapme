export type Lang = "ru" | "en";
export type Pair = readonly [string, string];
export type VerifiedCase = {
  title: Pair;
  task: Pair;
  work: Pair;
  result: Pair;
  evidence: string;
};
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
  phone: null as string | null,
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
        "European Register of Exercise Professionals. Фитнес и персональный тренинг.",
        "European Register of Exercise Professionals. Fitness and personal training.",
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
      detail: ["Коучинг и работа с целями.", "Coaching and goal setting."],
      document: null,
    },
  ],
  projects: [
    { name: "MARKOVMADE", url: "https://castefeudal.github.io/markovmade/" },
    { name: "MARKOVGYM", url: "https://castefeudal.github.io/markovgym/" },
    { name: "PMWORK", url: "https://castefeudal.github.io/pmwork/" },
  ],
  casteUrl: "",
  cases: [] as VerifiedCase[],
};
