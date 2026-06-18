import asyncio
from aiogram import Bot, Dispatcher
from src.config import BOT_TOKEN
from src.handlers import messages, callbacks, inline

async def main():
    bot = Bot(token=BOT_TOKEN)
    dp = Dispatcher()

    dp.include_router(messages.router)
    dp.include_router(callbacks.router)
    dp.include_router(inline.router)

    print("Bot is running...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())