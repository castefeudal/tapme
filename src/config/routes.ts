import type { Pair } from "./profile";
export const routeKeys = ["body", "nutrition", "system", "mind"] as const;
export type RouteKey = (typeof routeKeys)[number];
export type Goal = {
  name: Pair;
  today: Pair;
  practice: Pair;
  review: Pair;
  metric: Pair;
};
export type Route = {
  label: Pair;
  code: string;
  intro: Pair;
  goals: Goal[];
  barriers: { name: Pair; action: Pair; minimum: Pair }[];
  product: number;
};
export const routes: Record<RouteKey, Route> = {
  body: {
    label: ["Физическая форма", "Physical fitness"],
    code: "BODY",
    intro: [
      "Тренировки, которые помещаются в твою неделю.",
      "Training that fits into your week.",
    ],
    product: 1,
    goals: [
      {
        name: ["Стать сильнее", "Get stronger"],
        today: [
          "Выбери знакомое упражнение. Запиши рабочий вес, повторы и самочувствие без попытки поставить рекорд.",
          "Choose a familiar exercise. Record your usual load, repetitions and how it feels, without testing a maximum.",
        ],
        practice: [
          "Повтори знакомое движение с комфортной нагрузкой и запиши подходы.",
          "Repeat the familiar movement at a comfortable load and log your sets.",
        ],
        review: [
          "Сравни записи: удалось ли повторить технику и нагрузку без ухудшения самочувствия?",
          "Compare the logs: could you repeat the technique and load comfortably?",
        ],
        metric: [
          "Количество записанных занятий и повторяемость техники; не обещание прироста силы.",
          "Logged sessions and repeatable technique; not a promise of strength gains.",
        ],
      },
      {
        name: ["Изменить состав тела", "Change body composition"],
        today: [
          "Зафиксируй исходные наблюдения в одинаковых условиях и выбери знакомый вид активности. Один замер не показывает тенденцию.",
          "Record baseline observations under consistent conditions and choose a familiar activity. One measurement is not a trend.",
        ],
        practice: [
          "Выполни знакомую активность и отметь время. Наблюдения записывай в одинаковых условиях.",
          "Do your familiar activity and record the time. Keep observation conditions consistent.",
        ],
        review: [
          "Посмотри на несколько наблюдений вместе. Не меняй весь план из-за одного измерения.",
          "Review several observations together. Do not overhaul the plan because of one measurement.",
        ],
        metric: [
          "Выполненные занятия и несколько сопоставимых наблюдений за неделю.",
          "Completed sessions and several comparable observations over the week.",
        ],
      },
      {
        name: ["Вернуться к регулярности", "Build consistency"],
        today: [
          "Подготовь одежду и место. Выбери одно знакомое движение, с которого легко начать.",
          "Prepare your clothes and space. Choose one familiar movement that is easy to start.",
        ],
        practice: [
          "Повтори короткое знакомое занятие в том же контексте и отметь выполнение.",
          "Repeat a short familiar session in the same setting and record completion.",
        ],
        review: [
          "Сравни запланированные и выполненные занятия. Сохрани график, который удалось выдержать.",
          "Compare planned and completed sessions. Keep the schedule you could sustain.",
        ],
        metric: [
          "Выполненные занятия / запланированные занятия.",
          "Completed sessions / planned sessions.",
        ],
      },
      {
        name: ["Разобраться с техникой", "Understand technique"],
        today: [
          "Выбери одно упражнение и прочитай инструкцию в библиотеке MARKOVGYM. Отметь один вопрос по технике.",
          "Choose one exercise and read its MARKOVGYM instructions. Write down one technique question.",
        ],
        practice: [
          "Повтори изученное движение с лёгкой знакомой нагрузкой. При боли остановись; спорные моменты обсуди со специалистом.",
          "Revisit the movement with a light familiar load. Stop if it hurts; discuss uncertain technique with a professional.",
        ],
        review: [
          "Проверь, можешь ли объяснить исходное положение и контролируемую амплитуду.",
          "Check whether you can explain the starting position and controlled range of motion.",
        ],
        metric: [
          "Разобранные упражнения и вопросы, на которые найден ответ.",
          "Exercises reviewed and technique questions answered.",
        ],
      },
    ],
    barriers: [
      {
        name: ["Не хватает времени", "Not enough time"],
        action: [
          "Собери одежду заранее и убери дорогу из первого шага: начни с доступного места.",
          "Prepare clothes in advance and remove travel from the first step: use an accessible location.",
        ],
        minimum: [
          "Оставь одно знакомое движение вместо длинного занятия.",
          "Keep one familiar movement instead of a long session.",
        ],
      },
      {
        name: ["Не понимаю, что делать", "Not sure what to do"],
        action: [
          "Не меняй всю программу. Выбери одно знакомое упражнение и проверь инструкцию.",
          "Do not replace your entire routine. Pick one familiar exercise and check its instructions.",
        ],
        minimum: [
          "Сегодня только изучи одно упражнение и запиши вопрос по технике.",
          "Today, review one exercise and note a technique question.",
        ],
      },
      {
        name: ["Сложно быть последовательным", "Hard to stay consistent"],
        action: [
          "Привяжи подготовку к привычному событию и отмечай даже короткие занятия.",
          "Attach preparation to an existing event and record even short sessions.",
        ],
        minimum: [
          "Начни с подготовки места и одного комфортного подхода.",
          "Start by preparing the space and doing one comfortable set.",
        ],
      },
      {
        name: ["Слишком много нагрузки", "Too much load"],
        action: [
          "Убери дополнительную нагрузку из первой недели. Не тренируйся через боль; при стойких симптомах обратись к специалисту.",
          "Remove extra load from the first week. Do not train through pain; seek professional advice for persistent symptoms.",
        ],
        minimum: [
          "Начни с записи текущей нагрузки и самочувствия, без дополнительного занятия.",
          "Start by recording your current load and how you feel, without an extra session.",
        ],
      },
    ],
  },
  nutrition: {
    label: ["Питание и привычки", "Nutrition & habits"],
    code: "NUTRITION",
    intro: [
      "Наблюдение прежде поспешных изменений.",
      "Observe before making rushed changes.",
    ],
    product: 0,
    goals: [
      {
        name: ["Организовать рацион", "Organise meals"],
        today: [
          "Запиши, какие продукты уже есть дома, и собери один простой приём пищи из привычных продуктов.",
          "List the food you already have and plan one simple meal using familiar ingredients.",
        ],
        practice: [
          "Подготовь один следующий приём пищи и отметь, что получилось без лишних усилий.",
          "Prepare one upcoming meal and note what was manageable.",
        ],
        review: [
          "Выбери один вариант еды, который удобно повторить на следующей неделе.",
          "Choose one meal option you can repeat next week.",
        ],
        metric: [
          "Количество заранее организованных приёмов пищи.",
          "Number of meals arranged in advance.",
        ],
      },
      {
        name: ["Наладить режим", "Build a meal routine"],
        today: [
          "Выбери один приём пищи и примерный временной ориентир, который подходит твоему дню.",
          "Choose one meal and an approximate time that fits your day.",
        ],
        practice: [
          "Отметь время выбранного приёма пищи и причину, если режим не подошёл.",
          "Record the chosen meal time and why it did not fit, if applicable.",
        ],
        review: [
          "Найди временной ориентир, который получалось повторять чаще всего.",
          "Identify the time cue you could repeat most often.",
        ],
        metric: [
          "Дни, в которые удалось сохранить выбранный ориентир.",
          "Days when the chosen time cue worked.",
        ],
      },
      {
        name: ["Понять калорийность", "Understand energy intake"],
        today: [
          "Запиши один обычный приём пищи с примерными порциями. Посмотри оценку в MARKOVMADE как ориентир, а не точное измерение.",
          "Record a typical meal with approximate portions. Use MARKOVMADE estimates as a guide, not an exact measurement.",
        ],
        practice: [
          "Запиши обычное питание без попытки немедленно сократить рацион. Отмечай неопределённые порции.",
          "Log usual meals without immediately restricting intake. Note uncertain portions.",
        ],
        review: [
          "Выдели повторяющиеся блюда и источники погрешности в оценке.",
          "Identify recurring meals and sources of estimation uncertainty.",
        ],
        metric: [
          "Записанные дни питания с указанными примерными порциями.",
          "Logged eating days with approximate portions noted.",
        ],
      },
      {
        name: ["Отследить динамику", "Track trends"],
        today: [
          "Выбери один показатель наблюдения и одинаковые условия записи. Не делай вывод по одному дню.",
          "Choose one observation and consistent recording conditions. Do not judge a trend from one day.",
        ],
        practice: [
          "Запиши наблюдение в выбранных условиях и контекст: режим, сон, необычный день.",
          "Record an observation under the chosen conditions and note context such as sleep or an unusual day.",
        ],
        review: [
          "Сравни записи вместе с контекстом. Если данных мало, продолжи наблюдение.",
          "Compare records alongside their context. If data is limited, keep observing.",
        ],
        metric: [
          "Количество сопоставимых наблюдений, а не обязательное изменение веса.",
          "Number of comparable observations, not a required weight change.",
        ],
      },
    ],
    barriers: [
      {
        name: ["Нет времени готовить", "No time to prepare meals"],
        action: [
          "Выбери простое привычное блюдо и подготовь только один приём пищи, а не меню на всю неделю.",
          "Choose a simple familiar meal and prepare just one meal, not an entire weekly menu.",
        ],
        minimum: [
          "Составь список продуктов для одного простого блюда.",
          "List ingredients for one simple meal.",
        ],
      },
      {
        name: ["Много противоречивых советов", "Too much conflicting advice"],
        action: [
          "На этой неделе собирай собственные наблюдения. Не вводи новые ограничения по случайным советам.",
          "Collect your own observations this week. Do not introduce restrictions from random advice.",
        ],
        minimum: [
          "Запиши один обычный приём пищи без оценки «хорошо» или «плохо».",
          "Record one usual meal without judging it as good or bad.",
        ],
      },
      {
        name: ["Режим постоянно меняется", "An unpredictable routine"],
        action: [
          "Используй событие дня как ориентир вместо строгого часа; отметь, когда это не сработало.",
          "Use a daily event as a cue instead of a rigid time; note when it does not work.",
        ],
        minimum: [
          "Привяжи один приём пищи к самому устойчивому событию дня.",
          "Attach one meal to your most consistent daily event.",
        ],
      },
      {
        name: ["Забываю вести записи", "I forget to keep records"],
        action: [
          "Держи заметку рядом с привычным действием и записывай сразу, а не восстанавливай весь день вечером.",
          "Keep a note beside a regular activity and record immediately rather than reconstructing the day at night.",
        ],
        minimum: [
          "Сделай одну короткую запись сразу после еды.",
          "Write one short note immediately after eating.",
        ],
      },
    ],
  },
  system: {
    label: ["Работа и проекты", "Work & projects"],
    code: "SYSTEM",
    intro: [
      "Короткий Action Brief вместо списка тревог.",
      "A short Action Brief instead of a list of worries.",
    ],
    product: 2,
    goals: [
      {
        name: ["Сроки под угрозой", "A deadline is at risk"],
        today: [
          "Назови ближайший результат и крайний срок. Выдели зависимость, которая сейчас блокирует движение.",
          "Name the next deliverable and its deadline. Identify the dependency currently blocking progress.",
        ],
        practice: [
          "Проверь одну блокирующую зависимость и обнови следующий шаг с ответственным.",
          "Check one blocking dependency and update the next action with its owner.",
        ],
        review: [
          "Сверь ближайший этап со сроком. Если риск сохраняется, явно зафиксируй решение о приоритете или объёме.",
          "Compare the next milestone with the deadline. If risk remains, record a scope or priority decision.",
        ],
        metric: [
          "У ближайшего этапа есть срок, ответственный и зафиксированный следующий шаг.",
          "The next milestone has a deadline, an owner and a recorded next action.",
        ],
      },
      {
        name: ["Слишком много задач", "Too many tasks"],
        today: [
          "Выгрузи открытые задачи в один список. Выбери одну, которая двигает ближайший результат.",
          "Collect open tasks in one list. Choose one that moves the nearest deliverable forward.",
        ],
        practice: [
          "Работай только над выбранным следующим шагом; новые задачи сначала фиксируй в списке.",
          "Work on the chosen next action; record new tasks in the list first.",
        ],
        review: [
          "Проверь, что завершено. Осознанно отложи или передай то, что не помещается в ресурс.",
          "Review what is done. Deliberately defer or delegate what exceeds your capacity.",
        ],
        metric: [
          "Одна задача в работе; завершённый результат или явно обновлённый следующий шаг.",
          "One task in progress; a completed deliverable or an explicitly updated next action.",
        ],
      },
      {
        name: ["Неясно, кто отвечает", "Unclear ownership"],
        today: [
          "Выбери один результат без владельца. Запиши, с кем нужно согласовать ответственность, не назначая её заочно.",
          "Choose one deliverable without an owner. Note who needs to agree on ownership; do not assign it without discussion.",
        ],
        practice: [
          "Уточни владельца результата и отдельно того, кто принимает решение. Зафиксируй договорённость.",
          "Clarify the deliverable owner and the decision maker separately. Record the agreement.",
        ],
        review: [
          "Проверь, знают ли участники, кто делает следующий шаг и кто принимает результат.",
          "Check whether participants know who takes the next action and who accepts the result.",
        ],
        metric: [
          "Владелец и критерий приёмки явно согласованы, а не предположены.",
          "Ownership and acceptance criteria are explicitly agreed, not assumed.",
        ],
      },
      {
        name: ["Нет понятного плана", "No clear plan"],
        today: [
          "Опиши один проверяемый результат. Разложи его на три ближайших этапа и выбери первый.",
          "Describe one verifiable deliverable. Split it into three near-term milestones and choose the first.",
        ],
        practice: [
          "Уточни входные данные для ближайшего этапа и зафиксируй один следующий шаг.",
          "Clarify the inputs for the next milestone and record one next action.",
        ],
        review: [
          "Проверь ближайший этап по критерию готовности, затем обнови план с учётом фактов.",
          "Check the next milestone against its completion criterion, then update the plan using the facts.",
        ],
        metric: [
          "Три этапа, один следующий шаг и видимый критерий готовности.",
          "Three milestones, one next action and a visible completion criterion.",
        ],
      },
    ],
    barriers: [
      {
        name: ["Зависимость от других", "Dependent on others"],
        action: [
          "Отправь конкретный вопрос о блокере и обозначь, к какому сроку нужен ответ. Не считай ожидание выполненной работой.",
          "Ask a specific question about the blocker and state when the answer is needed. Do not count waiting as completed work.",
        ],
        minimum: [
          "Сформулируй один вопрос, который снимет блокировку.",
          "Write one question that would remove the blocker.",
        ],
      },
      {
        name: ["Постоянные переключения", "Constant context switching"],
        action: [
          "Закрой уведомления на выбранный интервал и оставь открытой только текущую задачу.",
          "Mute notifications for the chosen interval and keep only the current task open.",
        ],
        minimum: [
          "Выдели один непрерывный интервал без переключений.",
          "Reserve one uninterrupted interval.",
        ],
      },
      {
        name: ["Не хватает информации", "Missing information"],
        action: [
          "Запиши одно допущение и один факт, который нужно проверить до следующего решения.",
          "Record one assumption and one fact that must be checked before the next decision.",
        ],
        minimum: [
          "Уточни один недостающий факт вместо попытки сразу решить весь проект.",
          "Clarify one missing fact instead of trying to solve the entire project.",
        ],
      },
      {
        name: ["Недостаточно ресурса", "Not enough capacity"],
        action: [
          "Сократи объём ближайшего этапа или явно перенеси срок. Не скрывай нехватку ресурса в плане.",
          "Reduce the next milestone scope or explicitly move its deadline. Do not hide the capacity gap in the plan.",
        ],
        minimum: [
          "Определи самый маленький проверяемый результат текущего этапа.",
          "Define the smallest verifiable outcome of the current milestone.",
        ],
      },
    ],
  },
  mind: {
    label: ["Личная эффективность", "Personal effectiveness"],
    code: "MIND",
    intro: [
      "Одно действие, привязанное к твоему дню.",
      "One action anchored to your day.",
    ],
    product: 0,
    goals: [
      {
        name: ["Продвинуть личную цель", "Move a personal goal forward"],
        today: [
          "Назови один видимый результат недели и открой материалы для первого действия.",
          "Name one visible result for the week and open the materials for the first action.",
        ],
        practice: [
          "Продвинь выбранный результат на один небольшой законченный шаг.",
          "Move the chosen result forward by one small completed step.",
        ],
        review: [
          "Сравни результат с тем, что хотел увидеть в начале недели.",
          "Compare the result with what you wanted to see at the start of the week.",
        ],
        metric: [
          "Один видимый результат и записи о сделанных шагах.",
          "One visible result and records of actions taken.",
        ],
      },
      {
        name: ["Довести начатое", "Finish something I started"],
        today: [
          "Открой незавершённую работу и запиши, что именно осталось до готовности.",
          "Open the unfinished work and write down exactly what remains before it is done.",
        ],
        practice: [
          "Заверши один пункт из списка оставшегося, не расширяя задачу.",
          "Finish one remaining item without expanding the task.",
        ],
        review: [
          "Проверь критерий готовности. Если работа не закончена, назови один конкретный остаток.",
          "Check the completion criterion. If unfinished, name one specific remaining item.",
        ],
        metric: [
          "Закрытые пункты списка оставшегося; критерий готовности проверен.",
          "Closed remaining items; completion criterion checked.",
        ],
      },
      {
        name: ["Закрепить привычку", "Build a habit"],
        today: [
          "Выбери привычное событие и поставь рядом минимальное новое действие.",
          "Choose an existing daily event and attach a minimal new action to it.",
        ],
        practice: [
          "Повтори минимальное действие после выбранного события и поставь отметку.",
          "Repeat the minimal action after the chosen event and mark completion.",
        ],
        review: [
          "Проверь, работал ли выбранный триггер. Если нет, замени событие, а не обвиняй себя.",
          "Check whether the cue worked. If not, change the cue rather than blaming yourself.",
        ],
        metric: [
          "Повторения после выбранного события / запланированные повторения.",
          "Repetitions after the chosen event / planned repetitions.",
        ],
      },
      {
        name: ["Определить приоритет", "Choose a priority"],
        today: [
          "Запиши три текущих обязательства. Выбери одно, которое важно продвинуть именно на этой неделе.",
          "List three current commitments. Choose one that matters most this week.",
        ],
        practice: [
          "Проверь выбранный приоритет перед действием и отложи одну конкурирующую задачу.",
          "Check the chosen priority before acting and defer one competing task.",
        ],
        review: [
          "Посмотри, шёл ли ресурс в выбранный приоритет, и скорректируй обязательства.",
          "Review whether your time went to the chosen priority and adjust your commitments.",
        ],
        metric: [
          "Запланированный ресурс потрачен на выбранный приоритет.",
          "Planned time was used for the chosen priority.",
        ],
      },
    ],
    barriers: [
      {
        name: ["Откладываю начало", "I postpone starting"],
        action: [
          "Снизь порог старта: открой файл или подготовь место до выбранного времени.",
          "Lower the starting threshold: open the file or prepare the space before the chosen time.",
        ],
        minimum: [
          "Открой нужный материал и сделай первый пункт, даже если на этом остановишься.",
          "Open the material and complete the first item, even if you stop there.",
        ],
      },
      {
        name: ["Неясно, чего хочу", "I am not sure what I want"],
        action: [
          "Опиши один наблюдаемый признак результата. Не пытайся спланировать сразу всю жизнь.",
          "Describe one observable sign of success. Do not try to plan your whole life at once.",
        ],
        minimum: [
          "Запиши одно предложение: «На этой неделе я увижу…».",
          "Write one sentence: “This week I will see…”",
        ],
      },
      {
        name: ["Теряю последовательность", "I lose consistency"],
        action: [
          "Свяжи действие с устойчивым событием дня и держи отметки выполнения в одном месте.",
          "Link the action to a consistent daily event and keep completion marks in one place.",
        ],
        minimum: [
          "Сделай короткую версию после выбранного события и поставь отметку.",
          "Do a short version after the chosen event and mark completion.",
        ],
      },
      {
        name: ["Перегружен обязательствами", "Too many commitments"],
        action: [
          "Убери одно необязательное действие из недели прежде, чем добавлять новое.",
          "Remove one optional commitment from the week before adding a new one.",
        ],
        minimum: [
          "Зафиксируй одно обязательство, от которого временно откажешься.",
          "Record one commitment you will temporarily step back from.",
        ],
      },
    ],
  },
};
