import re
from aiogram import Router
from aiogram.filters import Command
from aiogram.types import Message
from src.utils.parser import entities_to_markdown
from src.utils.api import send_rich_html, send_rich_markdown
from src.utils.texts import LANG_SELECT_MESSAGE
from src.keyboards.inline import LANG_SELECT_KEYBOARD

router = Router()

@router.message(Command("start", "help"))
async def start_handler(message: Message):
    await message.answer(LANG_SELECT_MESSAGE, reply_markup=LANG_SELECT_KEYBOARD)

@router.message()
async def text_handler(message: Message):
    if not message.text:
        return

    text = entities_to_markdown(message.text, message.entities or []).strip()
    if not text:
        text = message.text.strip()

    if text.startswith("<") or re.search(r'<\/?\w', text):
        await send_rich_html(message.chat.id, text)
    else:
        await send_rich_markdown(message.chat.id, text)