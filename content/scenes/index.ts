export type Level = 'N5' | 'N4-light' | 'N4-core' | 'N3'
export type Theme = 'station' | 'rain' | 'cafe' | 'books' | 'animals' | 'night' | 'design' | 'path'

export interface Scene {
  id: string
  level: Level
  theme: Theme
  title: string
  titleEn?: string
  text: string
  textEn?: string
  jp_text: string
  jp_translation: string
  words: [string, string, string][] // [kanji, reading, translation]
  wordsEn?: [string, string, string][] // [kanji, reading, en_translation]
  phrase: [string, string, string]  // [jp, reading, translation]
  phraseEn?: string
  question: { text: string; textEn?: string; options: string[]; optionsEn?: string[]; correct: number; explanation?: string; explanationEn?: string }
  reflection: string
  reflectionEn?: string
  michi_state: 'night_watcher' | 'traveler' | 'reader' | 'coffee' | 'explorer'
}

const scenes: Scene[] = [
  {
    id: 'n5_1',
    level: 'N5',
    theme: 'station',
    title: 'Последний поезд',
    text: 'Поезд ушёл несколько минут назад. На платформе стало тихо. Только свет табло мигает где-то вдалеке.',
    jp_text: '終電が出たあと、ホームには静けさが残っていました。',
    jp_translation: 'После того как ушёл последний поезд, на платформе осталась тишина.',
    words: [
      ['終電', 'しゅうでん', 'последний поезд'],
      ['静か', 'しずか', 'тихий'],
      ['ホーム', 'ほーむ', 'платформа'],
    ],
    phrase: ['電車が来ます。', 'でんしゃがきます', 'Поезд приезжает.'],
    question: {
      text: 'Как сказать «тихая платформа»?',
      options: ['静かなホーム', '静かホーム', '静かのホーム'],
      correct: 0,
    },
    reflection: 'Сегодня обрати внимание на один момент тишины в городе.',
    michi_state: 'night_watcher',
  },
  {
    id: 'n5_2',
    level: 'N5',
    theme: 'rain',
    title: 'Дождь у магазина',
    text: 'Небольшой магазин на углу. Снаружи идёт дождь. Внутри тепло и пахнет кофе из автомата.',
    jp_text: 'コンビニの前で雨が降っています。自動販売機のコーヒーはあたたかいです。',
    jp_translation: 'Перед магазином идёт дождь. Кофе из автомата тёплый.',
    words: [
      ['雨', 'あめ', 'дождь'],
      ['コンビニ', 'こんびに', 'круглосуточный магазин'],
      ['あたたかい', 'あたたかい', 'тёплый'],
    ],
    phrase: ['雨が降っています。', 'あめがふっています', 'Идёт дождь.'],
    question: {
      text: 'Что означает 雨？',
      options: ['снег', 'дождь', 'ветер'],
      correct: 1,
    },
    reflection: 'Посмотри на небо сегодня. Какое оно?',
    michi_state: 'coffee',
  },
  {
    id: 'n5_3',
    level: 'N5',
    theme: 'cafe',
    title: 'Утреннее кафе',
    text: 'Маленькое кафе открывается в семь утра. Первый посетитель всегда заказывает один и тот же кофе.',
    jp_text: '朝七時にカフェが開きます。毎朝、同じコーヒーを飲みます。',
    jp_translation: 'Кафе открывается в семь утра. Каждое утро пьют один и тот же кофе.',
    words: [
      ['朝', 'あさ', 'утро'],
      ['毎朝', 'まいあさ', 'каждое утро'],
      ['開く', 'ひらく', 'открываться'],
    ],
    phrase: ['コーヒーをください。', 'こーひーをください', 'Дайте, пожалуйста, кофе.'],
    question: {
      text: 'Как сказать «утро» по-японски?',
      options: ['夜', '朝', '昼'],
      correct: 1,
    },
    reflection: 'Что ты делаешь каждое утро, не задумываясь?',
    michi_state: 'coffee',
  },
  {
    id: 'n4l_1',
    level: 'N4-light',
    theme: 'books',
    title: 'Книжная улица',
    text: 'В районе Дзинбочо стоят десятки старых книжных магазинов. Здесь можно провести целый день, не заметив, как прошло время.',
    jp_text: '神保町には古い本屋がたくさんあります。時間を忘れて、ずっとここにいたくなります。',
    jp_translation: 'В Дзинбочо много старых книжных магазинов. Хочется забыть о времени и оставаться здесь подолгу.',
    words: [
      ['古い', 'ふるい', 'старый'],
      ['時間を忘れる', 'じかんをわすれる', 'забыть о времени'],
      ['本屋', 'ほんや', 'книжный магазин'],
    ],
    phrase: ['この本を読んでみたいです。', 'このほんをよんでみたいです', 'Хочу попробовать прочитать эту книгу.'],
    question: {
      text: 'Что означает 時間を忘れる？',
      options: ['найти время', 'забыть о времени', 'купить часы'],
      correct: 1,
    },
    reflection: 'Когда ты последний раз забывал о времени, делая что-то приятное?',
    michi_state: 'reader',
  },
  {
    id: 'n4l_2',
    level: 'N4-light',
    theme: 'animals',
    title: 'Кошка у стены',
    text: 'Уличная кошка сидит у старой каменной стены. Она смотрит на прохожих спокойно, как будто давно знает этот город.',
    jp_text: '野良猫が古い石の壁のそばに座っています。まるで長い間、この街を知っているかのようです。',
    jp_translation: 'Бездомная кошка сидит у старой каменной стены. Как будто она давно знает этот город.',
    words: [
      ['野良猫', 'のらねこ', 'бездомная кошка'],
      ['石の壁', 'いしのかべ', 'каменная стена'],
      ['まるで', 'まるで', 'как будто'],
    ],
    phrase: ['猫が好きですか？', 'ねこがすきですか', 'Вы любите кошек?'],
    question: {
      text: 'Что означает 野良猫？',
      options: ['домашняя кошка', 'бездомная кошка', 'маленький котёнок'],
      correct: 1,
    },
    reflection: 'Если увидишь сегодня животное — понаблюдай за ним минуту.',
    michi_state: 'night_watcher',
  },
  {
    id: 'n4l_3',
    level: 'N4-light',
    theme: 'night',
    title: 'Ночной автомат',
    text: 'Светящийся автомат с напитками — единственный источник света на тёмной улице. Хо Хорошо, что он всегда здесь.',
    jp_text: '暗い路地に自動販売機の光だけが輝いていました。いつでもそこにあってよかった。',
    jp_translation: 'В тёмном переулке светился только свет автомата с напитками. Хорошо, что он всегда там.',
    words: [
      ['路地', 'ろじ', 'переулок'],
      ['輝く', 'かがやく', 'светиться, сиять'],
      ['いつでも', 'いつでも', 'всегда, в любое время'],
    ],
    phrase: ['何か飲みますか？', 'なにかのみますか', 'Вы что-нибудь выпьете?'],
    question: {
      text: 'Что означает 路地？',
      options: ['широкая дорога', 'переулок', 'станция'],
      correct: 1,
    },
    reflection: 'Найди сегодня маленькую вещь, которая всегда на месте, но на которую ты не обращаешь внимания.',
    michi_state: 'coffee',
  },
  {
    id: 'n4c_1',
    level: 'N4-core',
    theme: 'station',
    title: 'Пригородный поезд',
    text: 'Все в вагоне молчат. Кто-то смотрит в телефон, кто-то дремлет. За окном — серые здания, потом вдруг рисовые поля.',
    jp_text: '車内では誰も話しません。窓の外には、灰色のビルが続き、突然田んぼが現れます。',
    jp_translation: 'В вагоне никто не разговаривает. За окном тянутся серые здания, а потом вдруг появляются рисовые поля.',
    words: [
      ['車内', 'しゃない', 'внутри вагона'],
      ['突然', 'とつぜん', 'вдруг, внезапно'],
      ['田んぼ', 'たんぼ', 'рисовое поле'],
    ],
    phrase: ['次の駅はどこですか？', 'つぎのえきはどこですか', 'Где следующая станция?'],
    question: {
      text: 'Что означает 突然？',
      options: ['медленно', 'вдруг', 'тихо'],
      correct: 1,
    },
    reflection: 'Что видно из окна, когда ты едешь куда-нибудь?',
    michi_state: 'traveler',
  },
  {
    id: 'n4c_2',
    level: 'N4-core',
    theme: 'design',
    title: 'Японская упаковка',
    text: 'Японские магазины известны упаковкой. Иногда коробка так красива, что её жаль выбрасывать. В ней — уважение к получателю.',
    jp_text: '日本の包装は丁寧さで知られています。箱が美しすぎて、捨てるのがもったいない気がします。',
    jp_translation: 'Японская упаковка известна своей тщательностью. Коробка настолько красива, что жаль выбрасывать.',
    words: [
      ['包装', 'ほうそう', 'упаковка'],
      ['丁寧', 'ていねい', 'аккуратный, тщательный'],
      ['もったいない', 'もったいない', 'жаль (тратить/выбрасывать)'],
    ],
    phrase: ['丁寧に包んでもらえますか？', 'ていねいにつつんでもらえますか', 'Можете завернуть аккуратно?'],
    question: {
      text: 'Что означает もったいない？',
      options: ['красиво', 'жаль тратить/выбрасывать', 'слишком дорого'],
      correct: 1,
    },
    reflection: 'Посмотри на предмет рядом. Есть ли в нём что-то сделанное с уважением к пользователю?',
    michi_state: 'explorer',
  },
  {
    id: 'n4c_3',
    level: 'N4-core',
    theme: 'rain',
    title: 'Туман над горами',
    text: 'Утренний туман над горами Хаконе. Фудзи скрыта облаками. Говорят, что видеть её — удача.',
    jp_text: '箱根の山々には朝霧がかかっていました。富士山は雲に隠れています。見えたら幸運だと言われています。',
    jp_translation: 'На горах Хаконе лежал утренний туман. Фудзи скрыта облаками. Говорят, увидеть её — удача.',
    words: [
      ['朝霧', 'あさぎり', 'утренний туман'],
      ['隠れる', 'かくれる', 'прятаться, скрываться'],
      ['幸運', 'こううん', 'удача, везение'],
    ],
    phrase: ['今日は富士山が見えますか？', 'きょうはふじさんがみえますか', 'Сегодня видна Фудзи?'],
    question: {
      text: 'Что означает 朝霧？',
      options: ['вечерний дождь', 'утренний туман', 'горный ветер'],
      correct: 1,
    },
    reflection: 'Что в твоей жизни сейчас скрыто туманом, но чувствуется рядом?',
    michi_state: 'traveler',
  },
  {
    id: 'n3_1',
    level: 'N3',
    theme: 'night',
    title: 'Последний рейс',
    text: 'В 23:50 отходит последний автобус. Водитель знает всех постоянных пассажиров по имени. Это маршрут, который никогда не отменяли.',
    jp_text: '終バスは23時50分発です。運転手は常連の乗客を名前で知っています。このルートは一度も廃止されたことがありません。',
    jp_translation: 'Последний автобус отходит в 23:50. Водитель знает постоянных пассажиров по именам. Этот маршрут никогда не отменяли.',
    words: [
      ['終バス', 'しゅうばす', 'последний автобус'],
      ['常連', 'じょうれん', 'постоянный клиент/посетитель'],
      ['廃止', 'はいし', 'отмена, упразднение'],
    ],
    phrase: ['このバスはどこまで行きますか？', 'このばすはどこまでいきますか', 'До какой остановки идёт этот автобус?'],
    question: {
      text: 'Что означает 常連？',
      options: ['случайный прохожий', 'постоянный клиент', 'водитель автобуса'],
      correct: 1,
    },
    reflection: 'Есть ли место, куда ты возвращаешься снова и снова?',
    michi_state: 'night_watcher',
  },
  {
    id: 'n3_2',
    level: 'N3',
    theme: 'cafe',
    title: 'Разговор через стекло',
    text: 'Два старика играют в сёги в углу кафе. Они почти не разговаривают. Но кажется, им и не нужно.',
    jp_text: '二人の老人が喫茶店の隅で将棋を指していました。ほとんど言葉を交わしませんが、それで十分なようです。',
    jp_translation: 'Двое стариков играли в сёги в углу кофейни. Почти не обменивались словами, но, казалось, этого было достаточно.',
    words: [
      ['将棋', 'しょうぎ', 'сёги (японские шахматы)'],
      ['言葉を交わす', 'ことばをかわす', 'обменяться словами'],
      ['十分', 'じゅうぶん', 'достаточно'],
    ],
    phrase: ['将棋を指せますか？', 'しょうぎをさせますか', 'Вы умеете играть в сёги?'],
    question: {
      text: 'Что означает 言葉を交わす？',
      options: ['молчать', 'обменяться словами', 'изучать язык'],
      correct: 1,
    },
    reflection: 'С кем тебе хорошо даже в молчании?',
    michi_state: 'reader',
  },
  {
    id: 'n3_3',
    level: 'N3',
    theme: 'path',
    title: 'Письмо будущему себе',
    text: 'В некоторых японских школах ученики пишут письма себе в будущее. Их запечатывают и передают через 10 лет.',
    jp_text: '日本のある学校では、生徒たちが未来の自分に手紙を書きます。封をして、10年後に渡されます。',
    jp_translation: 'В некоторых японских школах ученики пишут письма будущему себе. Их запечатывают и передают через 10 лет.',
    words: [
      ['未来', 'みらい', 'будущее'],
      ['封をする', 'ふうをする', 'запечатать'],
      ['渡す', 'わたす', 'передать, вручить'],
    ],
    phrase: ['将来の夢は何ですか？', 'しょうらいのゆめはなんですか', 'Какова твоя мечта о будущем?'],
    question: {
      text: 'Что означает 未来？',
      options: ['прошлое', 'настоящее', 'будущее'],
      correct: 2,
    },
    reflection: 'Что бы ты написал себе сегодня — письмо на 5 лет вперёд?',
    michi_state: 'reader',
  },
  // === ИЗ СТАРОГО ПРОЕКТА (с объяснениями) ===
  {
    id: 'n5-bookshop',
    level: 'N5',
    theme: 'books',
    title: 'Тёплый книжный магазин',
    titleEn: 'A warm bookshop',
    text: 'Маленький книжный магазин ещё открыт. Снаружи прохладный вечер, а внутри — жёлтый свет и запах бумаги.',
    textEn: 'A small bookshop is still open. Outside, the evening is cool; inside, there is warm light and the scent of paper.',
    jp_text: '小さい本屋はまだ開いています。外は少し寒いですが、中はあたたかいです。',
    jp_translation: 'Маленький книжный магазин ещё открыт. Снаружи немного холодно, но внутри тепло.',
    words: [['本屋', 'ほんや', 'книжный магазин'], ['外', 'そと', 'снаружи'], ['寒い', 'さむい', 'холодный']],
    wordsEn: [['本屋', 'ほんや', 'bookshop'], ['外', 'そと', 'outside'], ['寒い', 'さむい', 'cold']],
    phrase: ['外は少し寒いです。', 'そとはすこしさむいです', 'Снаружи немного холодно.'],
    phraseEn: 'It is a little cold outside.',
    question: {
      text: 'Что значит 本屋?', textEn: 'What does 本屋 mean?',
      options: ['библиотека', 'книжный магазин', 'школа'],
      optionsEn: ['library', 'bookshop', 'school'],
      correct: 1,
      explanation: '本屋 — это книжный магазин. Библиотека — 図書館. Маленький языковой ниндзя спрятался именно здесь.',
      explanationEn: '本屋 means bookshop. Library is 図書館. A tiny language ninja was hiding here.',
    },
    reflection: 'Найди сегодня предмет, который выглядел бы уместно в тихом книжном магазине.',
    reflectionEn: 'Find one object today that would look natural inside a quiet bookshop.',
    michi_state: 'reader',
  },
  {
    id: 'n5-rain-station',
    level: 'N5',
    theme: 'station',
    title: 'Станция после дождя',
    titleEn: 'Station after the rain',
    text: 'Поезд уже ушёл. На платформе тихо, и в лужах дрожит свет автомата с кофе.',
    textEn: 'The train has already left. The platform is quiet, and the light from a coffee vending machine trembles in puddles.',
    jp_text: '夜の電車はもう行きました。ホームは静かです。',
    jp_translation: 'Ночной поезд уже ушёл. Платформа тихая.',
    words: [['静か', 'しずか', 'тихий'], ['駅', 'えき', 'станция'], ['雨', 'あめ', 'дождь']],
    wordsEn: [['静か', 'しずか', 'quiet'], ['駅', 'えき', 'station'], ['雨', 'あめ', 'rain']],
    phrase: ['ホームは静かです。', 'ほーむはしずかです', 'Платформа тихая.'],
    phraseEn: 'The platform is quiet.',
    question: {
      text: 'Как правильно сказать «тихая улица»?', textEn: 'How do you say "quiet street"?',
      options: ['静かな道', '静か道', '静かの道'],
      optionsEn: ['静かな道', '静か道', '静かの道'],
      correct: 0,
      explanation: 'Для な-прилагательных перед существительным нужен な: 静かな道.',
      explanationEn: 'For な-adjectives before a noun, you need な: 静かな道.',
    },
    reflection: 'Заметь сегодня один тихий звук, который обычно проходит мимо внимания.',
    reflectionEn: 'Notice one quiet sound today that people usually miss.',
    michi_state: 'night_watcher',
  },
  {
    id: 'n4-cafe-river',
    level: 'N4-light',
    theme: 'cafe',
    title: 'Кафе у реки',
    titleEn: 'A café by the river',
    text: 'В маленьком кафе у реки кто-то рисует в блокноте, а за окном медленно проходит поезд. Такие вечера ничего не объясняют, но почему-то успокаивают.',
    textEn: 'In a small café by the river, someone sketches in a notebook while a train moves slowly beyond the window. Evenings like this explain nothing, yet calm you anyway.',
    jp_text: '川の近くのカフェで、だれかがノートに絵を描いていました。',
    jp_translation: 'В кафе у реки кто-то рисовал в блокноте.',
    words: [['川', 'かわ', 'река'], ['描く', 'かく', 'рисовать'], ['近く', 'ちかく', 'поблизости']],
    wordsEn: [['川', 'かわ', 'river'], ['描く', 'かく', 'to draw'], ['近く', 'ちかく', 'nearby']],
    phrase: ['ノートに絵を描いていました。', 'のーとにえをかいていました', 'Кто-то рисовал в блокноте.'],
    phraseEn: 'Someone was drawing in a notebook.',
    question: {
      text: 'Как перевести 近く?', textEn: 'How do you translate 近く?',
      options: ['поблизости', 'далеко', 'быстро'],
      optionsEn: ['nearby', 'far away', 'fast'],
      correct: 0,
      explanation: '近く — рядом, поблизости. Полезное слово, когда хочется найти хорошее место без лишней экспедиции.',
      explanationEn: '近く means nearby. Useful when you want something good without launching a full expedition.',
    },
    reflection: 'Найди сегодня красивую композицию: свет, предмет и пустое пространство рядом с ним.',
    reflectionEn: 'Find a beautiful composition today: light, an object, and a bit of empty space.',
    michi_state: 'coffee',
  },
  {
    id: 'n4-cat-konbini',
    level: 'N4-light',
    theme: 'animals',
    title: 'Кошка у конбини',
    titleEn: 'A cat near the konbini',
    text: 'У круглосуточного магазина свет от автомата падает на мокрый асфальт. Рядом сидит кошка и смотрит так, будто всё про тебя знает.',
    textEn: "Outside the convenience store, light from a vending machine spills over the wet pavement. Nearby sits a cat with the expression of someone who knows all your secrets.",
    jp_text: 'コンビニの前で、猫が静かに座っていました。自動販売機の光が道を明るくしていました。',
    jp_translation: 'Перед конбини тихо сидела кошка. Свет автомата освещал дорогу.',
    words: [['自動販売機', 'じどうはんばいき', 'автомат'], ['光', 'ひかり', 'свет'], ['座る', 'すわる', 'сидеть']],
    wordsEn: [['自動販売機', 'じどうはんばいき', 'vending machine'], ['光', 'ひかり', 'light'], ['座る', 'すわる', 'to sit']],
    phrase: ['猫が静かに座っていました。', 'ねこがしずかにすわっていました', 'Кошка тихо сидела.'],
    phraseEn: 'The cat was sitting quietly.',
    question: {
      text: 'Какое слово лучше подходит к этой сцене?', textEn: 'Which word fits this scene best?',
      options: ['速い', '静か', '重い'],
      optionsEn: ['fast', 'quiet', 'heavy'],
      correct: 1,
      explanation: '静か — тихий, спокойный. Именно он собирает настроение этой сцены.',
      explanationEn: '静か means quiet or calm. It is the word that holds this scene together.',
    },
    reflection: 'Если сегодня увидишь животное, понаблюдай за ним минуту. Просто спокойно, без спешки.',
    reflectionEn: 'If you see an animal today, watch it for a minute. Calmly, without rushing.',
    michi_state: 'night_watcher',
  },
  {
    id: 'n3-quiet-quarter',
    level: 'N3',
    theme: 'night',
    title: 'Тихий квартал',
    titleEn: 'A quiet quarter',
    text: 'В этом квартале даже шум кажется вежливым. Велосипед проезжает мимо, вывеска слегка качается на ветру, и вдруг становится ясно, что тишина тоже может быть дизайном.',
    textEn: 'In this quarter, even noise feels polite. A bicycle passes by, a sign sways in the wind, and suddenly it becomes clear that silence can be a kind of design too.',
    jp_text: 'この通りでは、音さえも遠慮がちに感じられた。風に揺れる看板を見ながら、静けさにも形があるのだと思った。',
    jp_translation: 'На этой улице даже звуки казались сдержанными. Глядя на вывеску, качающуюся на ветру, я подумал: у тишины тоже есть форма.',
    words: [['遠慮がち', 'えんりょがち', 'сдержанный'], ['揺れる', 'ゆれる', 'качаться'], ['看板', 'かんばん', 'вывеска']],
    wordsEn: [['遠慮がち', 'えんりょがち', 'reserved'], ['揺れる', 'ゆれる', 'to sway'], ['看板', 'かんばん', 'signboard']],
    phrase: ['静けさにも形がある。', 'しずけさにもかたちがある', 'Даже у тишины есть форма.'],
    phraseEn: 'Even silence has a shape.',
    question: {
      text: 'Что ближе по смыслу к 遠慮がち?', textEn: 'Which meaning is closer to 遠慮がち?',
      options: ['нахальный', 'сдержанный', 'яркий'],
      optionsEn: ['pushy', 'reserved', 'bright'],
      correct: 1,
      explanation: '遠慮がち — сдержанный, робкий. Красивое слово для тонких состояний.',
      explanationEn: '遠慮がち means reserved or hesitant. A beautiful word for subtle states.',
    },
    reflection: 'Найди сегодня предмет, в котором есть ощущение японского ма — пространства и паузы.',
    reflectionEn: 'Find an object today that carries a sense of Japanese ma — space and pause.',
    michi_state: 'explorer',
  },
  {
    id: 'n4l_4',
    level: 'N4-light',
    theme: 'design',
    title: 'Пустое пространство',
    text: 'В японском искусстве есть понятие «ма» — пустое пространство между вещами. Оно не пустое. Оно даёт дышать остальному.',
    jp_text: '日本の美学には「間（ま）」という概念があります。ものとものの間の空間のことです。その空間があるから、他のものが際立ちます。',
    jp_translation: 'В японской эстетике есть понятие «ма». Это пространство между предметами. Именно оно позволяет остальному выделяться.',
    words: [
      ['間', 'ま', 'пространство/пауза (ма)'],
      ['空間', 'くうかん', 'пространство'],
      ['際立つ', 'きわだつ', 'выделяться, быть заметным'],
    ],
    phrase: ['シンプルなデザインが好きです。', 'しんぷるなでざいんがすきです', 'Мне нравится простой дизайн.'],
    question: {
      text: 'Что такое «ма»?',
      options: ['украшение', 'пустое пространство между вещами', 'японская живопись'],
      correct: 1,
    },
    reflection: 'Посмотри на комнату вокруг. Есть ли в ней место для «ма»?',
    michi_state: 'explorer',
  },
  {
    id: 'n4l_5',
    level: 'N4-light',
    theme: 'animals',
    title: 'Олени в Нара',
    text: 'В Наре олени гуляют прямо по улицам. Они знают, что туристы приносят специальные крекеры. И они не боятся.',
    jp_text: '奈良では鹿が街の中を歩いています。観光客が鹿せんべいを持ってくると知っているのか、全然怖がりません。',
    jp_translation: 'В Наре олени ходят прямо по улицам. Они знают, что туристы приносят оленьи крекеры, и совсем не боятся.',
    words: [
      ['鹿', 'しか', 'олень'],
      ['観光客', 'かんこうきゃく', 'турист'],
      ['怖がる', 'こわがる', 'бояться'],
    ],
    phrase: ['動物が怖くないですか？', 'どうぶつがこわくないですか', 'Вы не боитесь животных?'],
    question: {
      text: 'Что означает 鹿？',
      options: ['кошка', 'олень', 'лиса'],
      correct: 1,
    },
    reflection: 'Когда ты в последний раз смотрел на животное и думал — что оно чувствует?',
    michi_state: 'explorer',
  },
]

export default scenes

export function getSceneForDay(userId: number, level: Level): Scene {
  const filtered = scenes.filter(s => s.level === level)
  const available = filtered.length > 0 ? filtered : scenes
  const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
  const idx = (dayOfYear + userId) % available.length
  return available[idx]
}

export function getNextLevel(current: Level): Level {
  const order: Level[] = ['N5', 'N4-light', 'N4-core', 'N3']
  const i = order.indexOf(current)
  return order[Math.min(i + 1, order.length - 1)]
}

export function getPrevLevel(current: Level): Level {
  const order: Level[] = ['N5', 'N4-light', 'N4-core', 'N3']
  const i = order.indexOf(current)
  return order[Math.max(i - 1, 0)]
}
