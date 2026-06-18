from aiogram import Router
from aiogram.types import CallbackQuery
from src.utils.api import edit_rich_markdown
from src.keyboards.inline import main_keyboard, back_keyboard
from src.utils.texts import WELCOME, HELP_MD, HELP_HTML, HELP_MEDIA, DEMO, ABOUT

router = Router()

@router.callback_query()
async def callback_handler(callback: CallbackQuery):
    await callback.answer()

    data = callback.data
    lang = "fa" if data.startswith("fa_") else "en"
    action = data[3:]

    kb = back_keyboard(lang).model_dump(exclude_none=True)
    main = main_keyboard(lang).model_dump(exclude_none=True)

    chat_id = callback.message.chat.id
    msg_id = callback.message.message_id

    if action in ["start", "back"]:
        await edit_rich_markdown(chat_id, msg_id, WELCOME[lang], main)
    elif action == "help_md":
        await edit_rich_markdown(chat_id, msg_id, HELP_MD[lang], kb)
    elif action == "help_html":
        await edit_rich_markdown(chat_id, msg_id, HELP_HTML[lang], kb)
    elif action == "help_media":
        await edit_rich_markdown(chat_id, msg_id, HELP_MEDIA[lang], kb)
    elif action == "demo":
        await edit_rich_markdown(chat_id, msg_id, DEMO[lang], kb)
    elif action == "about":
        await edit_rich_markdown(chat_id, msg_id, ABOUT[lang], kb)