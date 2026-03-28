"""
Michi Journey — Telegram Bot
Отправляет ежедневное сообщение и открывает Mini App.

Запуск:
1. pip install python-telegram-bot==21.10 schedule
2. export BOT_TOKEN=ваш_токен_от_BotFather
3. export MINI_APP_URL=https://ваш-сайт.vercel.app
4. python michi_bot.py

Бесплатный хостинг для бота: Railway.app или Render.com
"""

import os
import sys
import asyncio
import logging
from datetime import datetime

logging.basicConfig(format="%(asctime)s | %(levelname)s | %(message)s", level=logging.INFO)
logger = logging.getLogger("michi")

BOT_TOKEN = os.environ.get("BOT_TOKEN", "")
MINI_APP_URL = os.environ.get("MINI_APP_URL", "https://michi-journey.vercel.app")

# Атмосферные ежедневные сообщения
DAILY_MESSAGES = [
    ("🌙", "Сегодня открылась новая сцена.\nТихая, как ночная станция после последнего поезда."),
    ("🌧", "Дождь в Токио звучит иначе, когда понимаешь язык.\nСегодня — один шаг ближе."),
    ("📖", "Где-то в Дзинбочо старый книжный магазин только что открылся.\nМы тоже начинаем."),
    ("☕", "Утро. Кофе. Один новый японский вопрос.\nЭтого достаточно."),
    ("🐱", "Я немного скучал.\nСегодняшняя сцена уже ждёт."),
    ("🌸", "Весна в Киото — это сакура и спокойствие.\nСегодня немного того и другого."),
    ("🚃", "Поезд уходит в 23:50.\nУспеем на сегодняшнюю сцену?"),
]


def _load_deps():
    try:
        from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update
        from telegram.ext import Application, CommandHandler, ContextTypes
        return InlineKeyboardButton, InlineKeyboardMarkup, Update, Application, CommandHandler, ContextTypes
    except ModuleNotFoundError:
        raise RuntimeError("pip install python-telegram-bot==21.10")


async def cmd_start(update, context, Button, Markup):
    keyboard = [[Button("Открыть Michi Journey 🐱", web_app={"url": MINI_APP_URL})]]
    reply_markup = Markup(keyboard)
    await update.message.reply_text(
        "Привет. Я Мичи — твой тихий проводник на пути к японскому языку и Японии.\n\n"
        "Каждый день я буду присылать короткую атмосферную сцену: японское слово, небольшой вопрос и наблюдение на день.\n\n"
        "Без давления. Один маленький шаг — уже движение.",
        reply_markup=reply_markup,
    )


async def cmd_today(update, context, Button, Markup):
    now = datetime.now()
    idx = (now.timetuple().tm_yday + now.hour) % len(DAILY_MESSAGES)
    emoji, text = DAILY_MESSAGES[idx]
    keyboard = [[Button("Открыть сцену дня", web_app={"url": MINI_APP_URL})]]
    await update.message.reply_text(f"{emoji} {text}", reply_markup=Markup(keyboard))


async def cmd_path(update, context, Button, Markup):
    keyboard = [[Button("Путь в Японию →", web_app={"url": f"{MINI_APP_URL}?screen=path"})]]
    await update.message.reply_text(
        "🗺 Раздел «Путь в Японию»: гранты, программы обмена, визы, жизнь студентов, советы по адаптации.",
        reply_markup=Markup(keyboard),
    )


def main():
    if not BOT_TOKEN:
        print("❌ Установи переменную BOT_TOKEN")
        print("   export BOT_TOKEN=токен_от_BotFather")
        sys.exit(1)

    if "--self-test" in sys.argv:
        print("✅ Self-test OK")
        print(f"   BOT_TOKEN: {'задан' if BOT_TOKEN else 'не задан'}")
        print(f"   MINI_APP_URL: {MINI_APP_URL}")
        sys.exit(0)

    Button, Markup, Update, Application, CommandHandler, ContextTypes = _load_deps()

    app = Application.builder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", lambda u, c: cmd_start(u, c, Button, Markup)))
    app.add_handler(CommandHandler("today", lambda u, c: cmd_today(u, c, Button, Markup)))
    app.add_handler(CommandHandler("path", lambda u, c: cmd_path(u, c, Button, Markup)))

    logger.info("🐱 Michi Bot запущен")
    logger.info(f"   Mini App URL: {MINI_APP_URL}")
    app.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
    main()
