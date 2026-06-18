import aiohttp
from src.config import BOT_TOKEN

TELEGRAM_API = f"https://api.telegram.org/bot{BOT_TOKEN}"

async def call_api(method: str, body: dict):
    async with aiohttp.ClientSession() as session:
        async with session.post(f"{TELEGRAM_API}/{method}", json=body) as res:
            if not res.ok:
                err = await res.text()
                print(f"[{method}] {res.status}: {err}")
                await session.post(f"{TELEGRAM_API}/sendMessage", json={
                    "chat_id": body.get("chat_id"),
                    "text": f"⚠️ Error ({res.status}): {err}"
                })

async def send_rich_markdown(chat_id: int, markdown: str, reply_markup=None):
    body = {"chat_id": chat_id, "rich_message": {"markdown": markdown}}
    if reply_markup: body["reply_markup"] = reply_markup
    await call_api("sendRichMessage", body)

async def send_rich_html(chat_id: int, html: str, reply_markup=None):
    body = {"chat_id": chat_id, "rich_message": {"html": html}}
    if reply_markup: body["reply_markup"] = reply_markup
    await call_api("sendRichMessage", body)

async def edit_rich_markdown(chat_id: int, message_id: int, markdown: str, reply_markup=None):
    body = {"chat_id": chat_id, "message_id": message_id, "rich_message": {"markdown": markdown}}
    if reply_markup: body["reply_markup"] = reply_markup
    await call_api("editMessageText", body)