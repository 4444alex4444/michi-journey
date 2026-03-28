export type MichiState = 'night_watcher' | 'traveler' | 'reader' | 'coffee' | 'explorer'
export type MichiSituation = 'correct' | 'wrong' | 'too_easy' | 'too_hard' | 'tired' | 'returning' | 'level_up' | 'greeting' | 'reflection'

export interface MichiLine {
  state: MichiState
  situation: MichiSituation
  lines: string[]
}

const michiLines: MichiLine[] = [
  // CORRECT
  { state: 'night_watcher', situation: 'correct', lines: [
    'Тихо и правильно. Именно так.',
    'Этот ответ был как последний поезд — точно в срок.',
    'Кажется, ты знаешь этот язык лучше, чем думаешь.',
  ]},
  { state: 'traveler', situation: 'correct', lines: [
    'Ещё один шаг по карте. Хорошо.',
    'Правильно. Где-то в Японии прямо сейчас кто-то сказал то же самое.',
    'Отлично. Я делаю пометку в дорожном дневнике.',
  ]},
  { state: 'reader', situation: 'correct', lines: [
    'Верно. Слова сложились, как страница книги.',
    'Именно. Именно это и написано на 47-й странице моего словаря.',
    'Правильно. Кофе в честь этого.',
  ]},
  { state: 'coffee', situation: 'correct', lines: [
    'Верно. Отмечаю в уме.',
    'Правильно. Это заслуживает отдельного глотка.',
  ]},
  { state: 'explorer', situation: 'correct', lines: [
    'Точно. Продолжаем исследование.',
    'Именно так. Я добавляю это слово в свою карту.',
  ]},

  // WRONG
  { state: 'night_watcher', situation: 'wrong', lines: [
    'Не совсем. Но ночь длинная — попробуем ещё.',
    'Почти. Это слово любит, когда к нему возвращаются.',
    'Не то. Ничего — поезда иногда ходят по другому расписанию.',
  ]},
  { state: 'reader', situation: 'wrong', lines: [
    'Нет, но это нормально. Я тоже перечитываю одни страницы дважды.',
    'Не совсем. Некоторые слова приходят со второго раза.',
  ]},
  { state: 'coffee', situation: 'wrong', lines: [
    'Неверно. Но кофе это не отменяет.',
    'Не то. Зато теперь оно запомнится лучше.',
  ]},
  { state: 'traveler', situation: 'wrong', lines: [
    'Немного не туда. Зато интереснее.',
    'Не совсем верно. Карта не всегда совпадает с дорогой.',
  ]},

  // TOO EASY
  { state: 'night_watcher', situation: 'too_easy', lines: [
    'Хм. Кажется, ты уже давно вышел за пределы этой станции.',
    'Слишком легко? Признаю — я немного недооценил.',
    'Понял. Ночь была короткой — переходим на следующий уровень.',
  ]},
  { state: 'traveler', situation: 'too_easy', lines: [
    'Ладно, признаю — это был разминочный маршрут.',
    'Слишком легко? Тогда открываем следующую карту.',
    'Если так пойдёт, мне придётся найти более сложную дорогу.',
  ]},
  { state: 'reader', situation: 'too_easy', lines: [
    'Похоже, это было предисловие. Перейдём к основной части.',
    'Слишком просто? Подожди — у меня есть более интересная глава.',
    'Понятно. Мой словарь начинает немного нервничать.',
  ]},
  { state: 'coffee', situation: 'too_easy', lines: [
    'Это было легче, чем сделать кофе. Попробуем что-нибудь серьёзнее.',
    'Ладно, это был эспрессо. Теперь — двойной.',
  ]},

  // TOO HARD
  { state: 'night_watcher', situation: 'too_hard', lines: [
    'Сложновато? Это нормально. Некоторые улицы нужно пройти несколько раз.',
    'Ничего страшного. Даже я иногда перечитываю это слово.',
    'Давай немного замедлимся. Торопиться некуда.',
  ]},
  { state: 'reader', situation: 'too_hard', lines: [
    'Трудно? Так бывает. Лучшие книги не читаются с первого раза.',
    'Это сложно — признаю. Вернёмся к более простым страницам.',
  ]},
  { state: 'coffee', situation: 'too_hard', lines: [
    'Слишком крепко? Разбавим немного.',
    'Трудно? Ладно, шаг назад. Без спешки.',
  ]},

  // TIRED
  { state: 'night_watcher', situation: 'tired', lines: [
    'Устал? Тогда просто посмотри на сцену. Одно слово и всё.',
    'Сегодня можно сделать один маленький шаг. Этого достаточно.',
    'Ночь всё равно будет. Одно слово — и можно отдыхать.',
  ]},
  { state: 'coffee', situation: 'tired', lines: [
    'Устал? Бывает. Тогда просто кофе и одно слово.',
    'Один маленький шаг сегодня лучше, чем ничего.',
  ]},
  { state: 'reader', situation: 'tired', lines: [
    'Устал? Тогда просто прочитай сцену. Без вопросов.',
    'Сегодня можно только посмотреть. Это тоже учёба.',
  ]},

  // RETURNING (after absence)
  { state: 'traveler', situation: 'returning', lines: [
    'Ты вернулся. Я уже подумывал сменить маршрут.',
    'О, долгожданный гость. Япония никуда не делась.',
    'Ждал тебя. Не спрашиваю, где был — главное, что снова здесь.',
  ]},
  { state: 'night_watcher', situation: 'returning', lines: [
    'Несколько ночей тебя не было на платформе. Но поезд всё ещё ходит.',
    'Рад, что ты снова здесь. Начнём с того места, где остановились.',
  ]},
  { state: 'coffee', situation: 'returning', lines: [
    'Давно не заходил. Кофе немного остыл, но рад тебя видеть.',
    'Вернулся! Я заварил свежий кофе. Почти.',
  ]},

  // LEVEL UP
  { state: 'traveler', situation: 'level_up', lines: [
    'Новый уровень открыт. Карта стала больше.',
    'Ты вышел за пределы предыдущей станции. Это хороший знак.',
    'Поздравляю. Теперь дорога немного сложнее — и интереснее.',
  ]},
  { state: 'reader', situation: 'level_up', lines: [
    'Глава закончена. Начинается следующая.',
    'Ты перешёл на новый уровень. Новые слова ждут.',
  ]},

  // GREETING
  { state: 'night_watcher', situation: 'greeting', lines: [
    'Привет. Сегодня тихая ночь. Хорошее время для японского.',
    'Привет. Я здесь. Начнём?',
  ]},
  { state: 'traveler', situation: 'greeting', lines: [
    'Привет. Сегодня открывается новая сцена на пути к Японии.',
    'Привет. Карта готова. Куда сегодня?',
  ]},
  { state: 'coffee', situation: 'greeting', lines: [
    'Привет. Кофе уже готов. И сцена тоже.',
    'О, привет. Я как раз думал о тебе. Почти.',
  ]},
  { state: 'explorer', situation: 'greeting', lines: [
    'Привет! Сегодня есть кое-что интересное.',
    'Привет. Я нашёл новую сцену. Думаю, тебе понравится.',
  ]},

  // REFLECTION
  { state: 'night_watcher', situation: 'reflection', lines: [
    'Иногда язык приходит тихо. Как поезд, который проезжает ночью.',
    'Один иероглиф — уже движение.',
    'Не нужно всё сразу. Достаточно одного наблюдения в день.',
  ]},
  { state: 'reader', situation: 'reflection', lines: [
    'Иногда новый язык — это просто новый способ смотреть на тот же дождь.',
    'Слова — как коробки. Я всегда хочу залезть в новую.',
  ]},
  { state: 'traveler', situation: 'reflection', lines: [
    'Иногда лучший способ понять язык — просто идти по незнакомой улице.',
    'Путь большой. Но сегодня можно сделать один шаг.',
  ]},
]

export function getMichiLine(state: MichiState, situation: MichiSituation): string {
  const matching = michiLines.filter(m => m.state === state && m.situation === situation)
  const fallback = michiLines.filter(m => m.situation === situation)
  const pool = matching.length > 0 ? matching : fallback
  if (pool.length === 0) return 'Продолжаем.'
  const group = pool[Math.floor(Math.random() * pool.length)]
  return group.lines[Math.floor(Math.random() * group.lines.length)]
}
