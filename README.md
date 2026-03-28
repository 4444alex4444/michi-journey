# Michi Journey · 道

Атмосферный Telegram Mini App для изучения японского и пути в Японию.

## Что внутри

- 15 сцен (N5, N4-light, N4-core, N3) с атмосферными текстами, словами и вопросами
- Адаптация сложности по обратной связи пользователя
- 12 карточек «Путь в Японию» (гранты, визы, университеты, жизнь)
- Маскот Мичи с реакциями и состояниями
- AI-чат (работает при наличии OpenAI API Key)
- Telegram Bot для уведомлений

## Деплой на Vercel (5 минут)

### 1. Создать GitHub репозиторий

1. Зайди на github.com → New repository
2. Имя: `michi-journey`, Public
3. Создать репозиторий

### 2. Загрузить код

```bash
# Если есть git
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ТВОЙ_НИК/michi-journey.git
git push -u origin main
```

Или через браузер: нажми «Upload files» и загрузи все файлы из папки.

### 3. Задеплоить на Vercel

1. Зайди на vercel.com → Add New Project
2. Выбери GitHub репозиторий `michi-journey`
3. Framework preset: **Next.js**
4. Нажми Deploy

Сайт появится по адресу `https://michi-journey-xxx.vercel.app`

### 4. Добавить OpenAI API (опционально, для живого чата)

В Vercel → Settings → Environment Variables:
```
OPENAI_API_KEY = sk-...ваш_ключ
```
Нажми Redeploy.

### 5. Настроить Telegram Bot

1. Открой @BotFather в Telegram
2. `/newbot` → придумай имя и username
3. Скопируй токен
4. `/setmenubutton` → выбери бота → вставь URL сайта

Бот будет открывать Mini App по кнопке Menu.

## Запуск бота для уведомлений (опционально)

```bash
pip install python-telegram-bot==21.10
export BOT_TOKEN=твой_токен
export MINI_APP_URL=https://твой-сайт.vercel.app
python michi_bot.py
```

Для постоянной работы: задеплой на Railway.app (бесплатный tier).

## Разработка локально

```bash
npm install
npm run dev
# открой http://localhost:3000
```

---

🐱 Michi Journey — тихий путь к японскому языку и Японии.
