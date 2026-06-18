import re
from aiogram import Router
from aiogram.types import InlineQuery
from src.utils.api import call_api

router = Router()

@router.inline_query()
async def inline_handler(inline_query: InlineQuery):
    text = inline_query.query.strip()
    if not text:
        return

    is_html = text.startswith("<") or re.search(r'<\/?\w', text)
    rich_msg = {"html": text} if is_html else {"markdown": text}

    body = {
        "inline_query_id": inline_query.id,
        "results": [
            {
                "type": "article",
                "id": "1",
                "title": "Rich Message",
                "description": "inline render",
                "input_message_content": {
                    "rich_message": rich_msg
                }
            }
        ],
        "cache_time": 0
    }

    await call_api("answerInlineQuery", body)