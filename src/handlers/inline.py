import re
import asyncio
from aiogram import Router
from aiogram.types import InlineQuery, InlineQueryResultArticle, InputTextMessageContent, ChosenInlineResult
from src.utils.api import call_api

router = Router()

@router.inline_query()
async def inline_handler(inline_query: InlineQuery):
    text = inline_query.query.strip()
    if not text:
        return

    result = InlineQueryResultArticle(
        id="1",
        title= "Rich Message",
        description= "inline render",
        input_message_content=InputTextMessageContent(
            message_text="wait .."
        )
    )

    await inline_query.answer([result], cache_time=0)

@router.chosen_inline_result()
async def chosen_inline_handler(chosen: ChosenInlineResult):
    text = chosen.query.strip()
    inline_message_id = chosen.inline_message_id

    if not inline_message_id:
        return

    is_html = text.startswith("<") or re.search(r'<\/?\w', text)

    await asyncio.sleep(0.5)


    body = {
        "inline_message_id": inline_message_id,
        "text": text[:4000],
        "rich_message": {"html": text} if is_html else {"markdown": text}
    }

    await call_api("editMessageText", body)