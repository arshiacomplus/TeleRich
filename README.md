<div align="center">
   
# 🤖 Telegram Rich Markdown & HTML Bot (Python)

<a href="#english-version">🇺🇸 English</a> | <a href="#نسخه-فارسی">🇮🇷 فارسی</a>

[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Aiogram](https://img.shields.io/badge/Aiogram-3.x-26A5E4?style=flat-square&logo=telegram&logoColor=white)](https://docs.aiogram.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen?style=flat-square)](https://github.com/arshiacomplus/TeleRich/blob/main/LICENSE)

</div>

---
<a id="english-version"></a>
## 🇬🇧 English

### ✨ Overview
A lightweight and fast Telegram bot written in Python (`aiogram`). It instantly renders any **Markdown** or **HTML** text into Telegram's standard Rich Message format (Bot API 10.1). 

*This is a Python rewrite and extension of the original Cloudflare Worker project.*

### 🚀 Features
- **Live Rendering:** Send raw Markdown/HTML and get a beautifully formatted response.
- **⚡️ Inline Mode:** Type `@YourBotName <text>` in any chat to render and send messages on the fly.
- **Bilingual:** Full English and Persian support.
- **Format Reconstruction:** Intelligently reconstructs and preserves formatting despite Telegram's native parsing limits.

### 🛠 Deployment (Linux VPS)

```bash
# 1. Clone the repository
git clone https://github.com/arshiacomplus/TeleRich.git
cd TeleRich

# 2. Setup virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. Configure the bot
cp .env.example .env
nano .env # Insert your BOT_TOKEN

# 4. Run
python -m src.main
```
*Note: Enable "Inline Mode" via [@BotFather](https://t.me/BotFather) for the inline feature to work.*

### 👨‍💻 Developers & Credits
This project is a Python fork and extension of the original TeleRich bot.

- **Arshia** (Python Rewrite & Inline Feature)
  [GitHub](https://github.com/arshiacomplus) • [Channel](https://t.me/acplus_channel)

- **ÐΛɌ₭ᑎΞ𐒡𐒡 | 𓄂𓆃** (Original JS Creator)
  [Original Repo](https://github.com/DarknessShade/TeleRich) • [Channel](https://t.me/Paradise_Of_Freedom)

---
---
<a id="نسخه-فارسی"></a>
## 🇮🇷 فارسی

### ✨ معرفی
یک ربات تلگرامی سریع و مینیمال نوشته شده با پایتون (`aiogram`). این ربات هر متن **Markdown** یا **HTML** را دریافت کرده و فوراً آن را به صورت یک پیام رندر شده (Rich Message بر اساس Bot API 10.1) برمی‌گرداند.

*این پروژه نسخه بازنویسی‌شده و توسعه‌یافته با پایتون از سورس اصلی جاوا اسکریپت است.*

### 🚀 ویژگی‌ها
- **رندر آنی:** ارسال متن خام Markdown/HTML و دریافت خروجی استاندارد.
- **⚡️ حالت اینلاین (Inline):** قابلیت استفاده در تمامی چت‌ها با تایپ `@YourBotName <text>` بدون نیاز به افزودن ربات به گروه.
- **دوزبانه:** پشتیبانی یکپارچه از فارسی و انگلیسی.
- **بازسازی فرمت:** حفظ دقیق استایل‌ها و سینتکس‌ها پس از پردازش‌های اولیه تلگرام.

### 🛠 راه‌اندازی (سرور لینوکس)

```bash
# ۱. دریافت کد
git clone https://github.com/arshiacomplus/TeleRich.git
cd TeleRich

# ۲. ساخت محیط مجازی
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# ۳. تنظیمات
cp .env.example .env
nano .env # توکن ربات خود را قرار دهید

# ۴. اجرا
python -m src.main
```
*نکته: برای فعال‌سازی حالت اینلاین، قابلیت "Inline Mode" را در [@BotFather](https://t.me/BotFather) روشن کنید.*

### 👨‍💻 توسعه‌دهندگان و منابع
این پروژه فورک و بازنویسی پایتون از ربات TeleRich است.

- **Arshia** (بازنویسی پایتون و توسعه اینلاین)
  [گیت‌هاب](https://github.com/arshiacomplus) • [کانال تلگرام](https://t.me/acplus_channel)  •  [ربات](https://t.me/mdrich_bot)


- **ÐΛɌ₭ᑎΞ𐒡𐒡 | 𓄂𓆃** (خالق نسخه اصلی جاوا اسکریپت)
  [سورس اصلی](https://github.com/DarknessShade/TeleRich) • [کانال تلگرام](https://t.me/Paradise_Of_Freedom) •  [ربات](https://t.me/MarkdownRenderBot)