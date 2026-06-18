from aiogram import Router
from aiogram.types import InlineQuery, InlineQueryResultArticle, InputTextMessageContent

router = Router()

@router.inline_query()
async def inline_handler(inline_query: InlineQuery):
    text = inline_query.query.strip()
    if not text:
        return

    result = InlineQueryResultArticle(
        id="1",
        title="ارسال با فرمت (Rich Message)",
        description=text[:50],
        input_message_content=InputTextMessageContent(
            message_text=text
        )
    )

    await inline_query.answer([result], cache_time=0)