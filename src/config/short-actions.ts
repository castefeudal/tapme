import type { Pair } from "./profile";
import type { RouteKey } from "./routes";
/** Each recipe fits the minimum selectable 10-minute slot, including setup. */
export const shortActions: Record<RouteKey, Pair[]> = {
  body: [
    [
      "2 минуты: подготовь место. 5 минут: один комфортный подход знакомого движения с разминкой. 3 минуты: запиши нагрузку и самочувствие.",
      "2 minutes: prepare your space. 5 minutes: warm up and do one comfortable set of a familiar movement. 3 minutes: log the load and how you feel.",
    ],
    [
      "3 минуты: запиши один исходный показатель в привычных условиях. 5 минут: спокойная знакомая активность. 2 минуты: отметь выполнение.",
      "3 minutes: record one baseline measurement under familiar conditions. 5 minutes: gentle, familiar activity. 2 minutes: log completion.",
    ],
    [
      "2 минуты: подготовь одежду и место. 5 минут: знакомое лёгкое движение. 3 минуты: отметь занятие и выбери время следующего.",
      "2 minutes: prepare clothes and space. 5 minutes: a familiar, easy movement. 3 minutes: log it and choose your next session time.",
    ],
    [
      "7 минут: прочитай инструкцию к одному упражнению в MARKOVGYM. 3 минуты: запиши исходное положение и один вопрос по технике.",
      "7 minutes: read one exercise guide in MARKOVGYM. 3 minutes: note the starting position and one technique question.",
    ],
  ],
  nutrition: [
    [
      "7 минут: запиши один обычный приём пищи и время. 3 минуты: отметь голод и сытость рядом с записью.",
      "7 minutes: record one typical meal and its time. 3 minutes: note your hunger and fullness alongside it.",
    ],
    [
      "5 минут: запиши время последних приёмов пищи. 5 минут: выбери удобное время одного приёма пищи на завтра.",
      "5 minutes: note when you last ate. 5 minutes: choose a practical time for one meal tomorrow.",
    ],
    [
      "7 минут: введи данные в калькулятор MARKOVMADE. 3 минуты: запиши полученную оценку энергозатрат и исходные данные.",
      "7 minutes: enter your data in a MARKOVMADE calculator. 3 minutes: note the energy estimate and the inputs you used.",
    ],
    [
      "7 минут: внеси один показатель в MARKOVMADE. 3 минуты: запиши условия измерения, чтобы повторить их позже.",
      "7 minutes: enter one measurement in MARKOVMADE. 3 minutes: note the measurement conditions so you can repeat them.",
    ],
  ],
  system: [
    [
      "5 минут: назови результат с ближайшим сроком. 5 минут: запиши одну угрозу сроку и действие для её проверки.",
      "5 minutes: name the deliverable with the nearest deadline. 5 minutes: note one threat to the deadline and an action to investigate it.",
    ],
    [
      "5 минут: выпиши ближайшие задачи. 5 минут: выбери одну и запиши следующее конкретное действие.",
      "5 minutes: list upcoming tasks. 5 minutes: choose one and write its next specific action.",
    ],
    [
      "5 минут: назови один результат проекта. 5 минут: запиши вопрос, который нужно уточнить у предполагаемого ответственного.",
      "5 minutes: name one project deliverable. 5 minutes: write a question to clarify with its proposed owner.",
    ],
    [
      "5 минут: опиши ближайший результат. 5 минут: запиши первое действие, срок и то, что нужно для начала.",
      "5 minutes: describe the next deliverable. 5 minutes: note the first action, its deadline and what you need to start.",
    ],
  ],
  mind: [
    [
      "5 минут: запиши желаемый результат своими словами. 5 минут: уточни, по какому наблюдению поймёшь, что получилось.",
      "5 minutes: describe your desired outcome in your own words. 5 minutes: name something observable that would show it worked.",
    ],
    [
      "5 минут: открой незавершённую работу и найди место остановки. 5 минут: выполни один небольшой фрагмент и сохрани результат.",
      "5 minutes: reopen unfinished work and find where you stopped. 5 minutes: complete one small part and save it.",
    ],
    [
      "5 минут: выбери одно небольшое действие. 5 минут: привяжи его к привычному событию и подготовь место.",
      "5 minutes: choose one small action. 5 minutes: attach it to an existing routine and prepare your space.",
    ],
    [
      "5 минут: выпиши то, что занимает внимание. 5 минут: выбери один приоритет и сформулируй ближайшее действие.",
      "5 minutes: list what is on your mind. 5 minutes: choose one priority and define the next action.",
    ],
  ],
};
