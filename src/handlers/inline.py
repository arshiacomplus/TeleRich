import re
import asyncio
from aiogram import Router
from aiogram.types import (
    InlineQuery,
    InlineQueryResultArticle,
    InputTextMessageContent,
    ChosenInlineResult,
    InlineKeyboardMarkup,
    InlineKeyboardButton
)
from src.utils.api import call_api

router = Router()

@router.inline_query()
async def inline_handler(inline_query: InlineQuery):
    text = inline_query.query.strip()
    if not text:
        return

    print(f"👀 [STEP 1] User typed in inline: {text[:20]}...")

    temp_keyboard = InlineKeyboardMarkup(inline_keyboard=[[
        InlineKeyboardButton(text="rendering ...", callback_data="ignore")
    ]])

    result = InlineQueryResultArticle(
        id="1",
        title= "Rich Message",
        description= "inline render",
        input_message_content=InputTextMessageContent(
            message_text="wait .."
        ),
        reply_markup=temp_keyboard
    )


    await inline_query.answer([result], cache_time=0)

@router.chosen_inline_result()
async def chosen_inline_handler(chosen: ChosenInlineResult):
    print("🚀 [STEP 2] Telegram sent 'ChosenInlineResult' event!")

    text = chosen.query.strip()
    inline_message_id = chosen.inline_message_id

    print(f"ℹ️ [INFO] Inline Message ID: {inline_message_id}")

    if not inline_message_id:
        print("❌ [ERROR] Telegram didn't send 'inline_message_id'!")
        return

    is_html = text.startswith("<") or re.search(r'<\/?\w', text)

    await asyncio.sleep(0.5)

    body = {
        "inline_message_id": inline_message_id,
        "text": text[:4000],
        "rich_message": {"html": text} if is_html else {"markdown": text}
    }

    print("🌐 [STEP 3] Sending editMessageText API call...")
    try:
        await call_api("editMessageText", body)
        print("✅ [SUCCESS] API call finished successfully.")
    except Exception as e:
        print(f"❌ [CRITICAL ERROR] Python crashed during API call: {e}")