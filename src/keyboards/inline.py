from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

def main_keyboard(lang: str) -> InlineKeyboardMarkup:
    if lang == "fa":
        return InlineKeyboardMarkup(inline_keyboard=[
            [
                InlineKeyboardButton(text="📖 راهنمای Markdown", callback_data="fa_help_md"),
                InlineKeyboardButton(text="🌐 راهنمای HTML", callback_data="fa_help_html")
            ],
            [InlineKeyboardButton(text="🖼 راهنمای مدیا", callback_data="fa_help_media")],
            [
                InlineKeyboardButton(text="🎨 دمو کامل", callback_data="fa_demo"),
                InlineKeyboardButton(text="ℹ️ درباره بات", callback_data="fa_about")
            ],
            [InlineKeyboardButton(text="🇬🇧 Switch to English", callback_data="en_start")]
        ])

    return InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="📖 Markdown Guide", callback_data="en_help_md"),
            InlineKeyboardButton(text="🌐 HTML Guide", callback_data="en_help_html")
        ],
        [InlineKeyboardButton(text="🖼 Media Guide", callback_data="en_help_media")],
        [
            InlineKeyboardButton(text="🎨 Full Demo", callback_data="en_demo"),
            InlineKeyboardButton(text="ℹ️ About", callback_data="en_about")
        ],
        [InlineKeyboardButton(text="🇮🇷 تغییر به فارسی", callback_data="fa_start")]
    ])

def back_keyboard(lang: str) -> InlineKeyboardMarkup:
    if lang == "fa":
        return InlineKeyboardMarkup(inline_keyboard=[[
            InlineKeyboardButton(text="⬅️ بازگشت به منو", callback_data="fa_back"),
            InlineKeyboardButton(text="🇬🇧 English", callback_data="en_start")
        ]])

    return InlineKeyboardMarkup(inline_keyboard=[[
        InlineKeyboardButton(text="⬅️ Back to Menu", callback_data="en_back"),
        InlineKeyboardButton(text="🇮🇷 فارسی", callback_data="fa_start")
    ]])

LANG_SELECT_KEYBOARD = InlineKeyboardMarkup(inline_keyboard=[[
    InlineKeyboardButton(text="🇮🇷 فارسی", callback_data="fa_start"),
    InlineKeyboardButton(text="🇬🇧 English", callback_data="en_start")
]])