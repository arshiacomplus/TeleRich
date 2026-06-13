/**
 * Telegram Rich Markdown Bot — Cloudflare Worker
 * ÐΛɌ₭ᑎΞ𐒡𐒡 https://github.com/DarknessShade
 * Bot API 10.1
 */

const BOT_TOKEN = "Enter your Telegram bot token";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export default {
  async fetch(request) {
    if (request.method === "GET") return new Response("✅ Bot is running!", { status: 200 });
    if (request.method !== "POST") return new Response("OK");
    let update;
    try { update = await request.json(); } catch { return new Response("Bad JSON", { status: 400 }); }
    const message       = update.message;
    const callbackQuery = update.callback_query;
    if (callbackQuery) await handleCallback(callbackQuery);
    else if (message?.text) await handleMessage(message);
    return new Response("OK", { status: 200 });
  },
};

// ─── Keyboards ────────────────────────────────────────────────────────────────
function mainKeyboard(lang) {
  if (lang === "fa") return {
    inline_keyboard: [
      [
        { text: "📖 راهنمای Markdown", callback_data: "fa_help_md"   },
        { text: "🌐 راهنمای HTML",     callback_data: "fa_help_html" },
      ],
      [
        { text: "🎨 دمو کامل",   callback_data: "fa_demo"  },
        { text: "ℹ️ درباره بات", callback_data: "fa_about" },
      ],
      [
        { text: "🇬🇧 Switch to English", callback_data: "en_start" },
      ],
    ],
  };
  return {
    inline_keyboard: [
      [
        { text: "📖 Markdown Guide", callback_data: "en_help_md"   },
        { text: "🌐 HTML Guide",     callback_data: "en_help_html" },
      ],
      [
        { text: "🎨 Full Demo", callback_data: "en_demo"  },
        { text: "ℹ️ About",     callback_data: "en_about" },
      ],
      [
        { text: "🇮🇷 تغییر به فارسی", callback_data: "fa_start" },
      ],
    ],
  };
}

function backKeyboard(lang) {
  return {
    inline_keyboard: [
      [
        lang === "fa"
          ? { text: "⬅️ بازگشت به منو", callback_data: "fa_back" }
          : { text: "⬅️ Back to Menu",  callback_data: "en_back" },
        lang === "fa"
          ? { text: "🇬🇧 English", callback_data: "en_start" }
          : { text: "🇮🇷 فارسی",  callback_data: "fa_start" },
      ],
    ],
  };
}

// ─── Handlers ─────────────────────────────────────────────────────────────────
async function handleMessage(message) {
  const chatId = message.chat.id;
  const text   = message.text.trim();

  if (text === "/start" || text === "/help") {
    // Show language selection first
    await sendPlain(chatId, LANG_SELECT_MESSAGE, LANG_SELECT_KEYBOARD);
    return;
  }

  if (text.startsWith("<") || /<\/?\w/.test(text)) {
    await sendRichHtml(chatId, text);
  } else {
    await sendRichMarkdown(chatId, text);
  }
}

async function handleCallback(cb) {
  const chatId = cb.message.chat.id;
  const msgId  = cb.message.message_id;
  const data   = cb.data;

  await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: cb.id }),
  });

  // Parse lang prefix: "fa_help_md" → lang="fa", action="help_md"
  const lang   = data.startsWith("fa_") ? "fa" : "en";
  const action = data.slice(3); // remove "fa_" or "en_"

  const kb   = backKeyboard(lang);
  const main = mainKeyboard(lang);

  if (action === "start" || action === "back") {
    await editRichMarkdown(chatId, msgId, WELCOME[lang], main);
  } else if (action === "help_md") {
    await editRichMarkdown(chatId, msgId, HELP_MD[lang], kb);
  } else if (action === "help_html") {
    await editRichMarkdown(chatId, msgId, HELP_HTML[lang], kb);
  } else if (action === "demo") {
    await editRichMarkdown(chatId, msgId, DEMO[lang], kb);
  } else if (action === "about") {
    await editRichMarkdown(chatId, msgId, ABOUT[lang], kb);
  }
}

// ─── Language select (plain sendMessage so it's always fresh) ─────────────────
const LANG_SELECT_MESSAGE = "🌐 Please choose your language / زبان خود را انتخاب کنید:";
const LANG_SELECT_KEYBOARD = {
  inline_keyboard: [[
    { text: "🇮🇷 فارسی", callback_data: "fa_start" },
    { text: "🇬🇧 English", callback_data: "en_start" },
  ]],
};

// ─── API helpers ──────────────────────────────────────────────────────────────
async function sendPlain(chatId, text, replyMarkup) {
  const body = { chat_id: chatId, text };
  if (replyMarkup) body.reply_markup = replyMarkup;
  await callApi("sendMessage", body);
}

async function sendRichMarkdown(chatId, markdown, replyMarkup) {
  const body = { chat_id: chatId, rich_message: { markdown } };
  if (replyMarkup) body.reply_markup = replyMarkup;
  await callApi("sendRichMessage", body);
}

async function sendRichHtml(chatId, html, replyMarkup) {
  const body = { chat_id: chatId, rich_message: { html } };
  if (replyMarkup) body.reply_markup = replyMarkup;
  await callApi("sendRichMessage", body);
}

async function editRichMarkdown(chatId, messageId, markdown, replyMarkup) {
  const body = { chat_id: chatId, message_id: messageId, rich_message: { markdown } };
  if (replyMarkup) body.reply_markup = replyMarkup;
  await callApi("editMessageText", body);
}

async function callApi(method, body) {
  const res = await fetch(`${TELEGRAM_API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`[${method}] ${res.status}: ${err}`);
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: body.chat_id, text: `⚠️ Error (${res.status}): ${err}` }),
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT
// ═══════════════════════════════════════════════════════════════════════════════

const WELCOME = {
  fa: `# 🤖 Rich Markdown Bot

هر متن **Markdown** یا **HTML** بفرستید، به صورت Rich Message رندر میشه.

از دکمه‌های زیر برای دیدن راهنما و دمو استفاده کنید 👇`,

  en: `# 🤖 Rich Markdown Bot

Send any **Markdown** or **HTML** text and it will be echoed back as a rendered Rich Message.

Use the buttons below to explore 👇`,
};

// ─── About ────────────────────────────────────────────────────────────────────
const ABOUT = {
  fa: `# ÐΛɌ₭ᑎΞ𐒡𐒡|𓄂𓆃

[ÐΛɌ₭ᑎΞ𐒡𐒡](https://darkness-web.pages.dev/)

---

🗽 [GitHub](https://github.com/DarknessShade)

🗽 [Paradise Of Freedom](https://t.me/Paradise_Of_Freedom)

🗽 [ConfigWireguard](https://t.me/ConfigWireguard)`,

  en: `# ÐΛɌ₭ᑎΞ𐒡𐒡|𓄂𓆃

[ÐΛɌ₭ᑎΞ𐒡𐒡](https://darkness-web.pages.dev/)

---

🗽 [GitHub](https://github.com/DarknessShade)

🗽 [Paradise Of Freedom](https://t.me/Paradise_Of_Freedom)

🗽 [ConfigWireguard](https://t.me/ConfigWireguard)`,
};

// ─── Markdown Help ────────────────────────────────────────────────────────────
const HELP_MD = {
  fa: `# 📖 راهنمای Markdown

متن Markdown بفرستید، رندر شده برمیگرده.
کادر خاکستری = چیزی که تایپ میکنید ↓ نتیجه بعدشه.

---

## Text Styles

\`\`\`
**bold**  *italic*  ~~strike~~  \`code\`  ==marked==  ||spoiler||
\`\`\`

**bold** *italic* ~~strike~~ \`code\` ==marked== ||spoiler||

---

## Headings

\`\`\`
# Big title
## Section
### Subsection
\`\`\`

# Big title
## Section
### Subsection

---

## Lists

\`\`\`
- milk
- eggs
- [ ] todo
- [x] done

1. wake up
2. ship it
\`\`\`

- milk
- eggs
- [ ] todo
- [x] done

1. wake up
2. ship it

---

## Links & Quotes

\`\`\`
[Telegram](https://telegram.org)

>To be, or not to be.
\`\`\`

[Telegram](https://telegram.org)

>To be, or not to be.

---

## Code Blocks

\`\`\`
\`\`\`python
print("hello")
\`\`\`
\`\`\`

\`\`\`python
print("hello")
\`\`\`

---

## Tables

\`\`\`
| Lang | Speed |
|:-----|------:|
| Rust | fast  |
| Py   | comfy |
\`\`\`

| Lang | Speed |
|:-----|------:|
| Rust | fast  |
| Py   | comfy |

---

## Math

\`\`\`
Inline $E = mc^2$ and a block:
$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$
\`\`\`

Inline $E = mc^2$ and a block:

$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$

---

## Details

\`\`\`
<details><summary>**کلیک کن**</summary>
محتوای مخفی!
</details>
\`\`\`

<details><summary>**کلیک کن**</summary>
محتوای مخفی!
</details>

---

*محدودیت: تا 32,768 کاراکتر در هر پیام* ✨`,

  en: `# 📖 Markdown Guide

Send Markdown text and get it echoed back rendered.
Grey box = what you type ↓ result comes right after.

---

## Text Styles

\`\`\`
**bold**  *italic*  ~~strike~~  \`code\`  ==marked==  ||spoiler||
\`\`\`

**bold** *italic* ~~strike~~ \`code\` ==marked== ||spoiler||

---

## Headings

\`\`\`
# Big title
## Section
### Subsection
\`\`\`

# Big title
## Section
### Subsection

---

## Lists

\`\`\`
- milk
- eggs
- [ ] todo
- [x] done

1. wake up
2. ship it
\`\`\`

- milk
- eggs
- [ ] todo
- [x] done

1. wake up
2. ship it

---

## Links & Quotes

\`\`\`
[Telegram](https://telegram.org)

>To be, or not to be.
\`\`\`

[Telegram](https://telegram.org)

>To be, or not to be.

---

## Code Blocks

\`\`\`
\`\`\`python
print("hello")
\`\`\`
\`\`\`

\`\`\`python
print("hello")
\`\`\`

---

## Tables

\`\`\`
| Lang | Speed |
|:-----|------:|
| Rust | fast  |
| Py   | comfy |
\`\`\`

| Lang | Speed |
|:-----|------:|
| Rust | fast  |
| Py   | comfy |

---

## Math

\`\`\`
Inline $E = mc^2$ and a block:
$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$
\`\`\`

Inline $E = mc^2$ and a block:

$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$

---

## Details (Collapsible)

\`\`\`
<details><summary>**Click me**</summary>
Hidden content!
</details>
\`\`\`

<details><summary>**Click me**</summary>
Hidden content!
</details>

---

*Limit: up to 32,768 characters per message* ✨`,
};

// ─── HTML Help ────────────────────────────────────────────────────────────────
const HELP_HTML = {
  fa: `# 🌐 راهنمای HTML

اگه پیامت با \`<\` شروع بشه، بات به عنوان HTML رندر میکنه.

---

## Text Styles

\`\`\`
<b>bold</b> <i>italic</i> <u>underline</u>
<s>strike</s> <code>code</code> <mark>marked</mark>
<tg-spoiler>spoiler</tg-spoiler>
<sup>superscript</sup> <sub>subscript</sub>
\`\`\`

<b>bold</b> <i>italic</i> <u>underline</u> <s>strike</s> <code>code</code> <mark>marked</mark> <tg-spoiler>spoiler</tg-spoiler> <sup>sup</sup> <sub>sub</sub>

---

## Headings

\`\`\`
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
\`\`\`

<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>

---

## Lists

\`\`\`
<ul><li>milk</li><li>eggs</li></ul>
<ol><li>wake up</li><li>ship it</li></ol>
<ul>
  <li><input type="checkbox" checked>done</li>
  <li><input type="checkbox">todo</li>
</ul>
\`\`\`

<ul><li>milk</li><li>eggs</li></ul>
<ol><li>wake up</li><li>ship it</li></ol>
<ul><li><input type="checkbox" checked>done</li><li><input type="checkbox">todo</li></ul>

---

## Links & Quotes

\`\`\`
<a href="https://telegram.org">Telegram</a>
<blockquote>متن نقل‌قول<cite>نویسنده</cite></blockquote>
<aside>Pull quote<cite>Author</cite></aside>
\`\`\`

<a href="https://telegram.org">Telegram</a>
<blockquote>متن نقل‌قول<cite>نویسنده</cite></blockquote>
<aside>Pull quote<cite>Author</cite></aside>

---

## Code

\`\`\`
<pre><code class="language-python">print("hello")</code></pre>
\`\`\`

<pre><code class="language-python">print("hello")</code></pre>

---

## Table

\`\`\`
<table>
  <tr><th>Lang</th><th>Speed</th></tr>
  <tr><td>Rust</td><td>fast</td></tr>
  <tr><td>Py</td><td>comfy</td></tr>
</table>
\`\`\`

<table><tr><th>Lang</th><th>Speed</th></tr><tr><td>Rust</td><td>fast</td></tr><tr><td>Py</td><td>comfy</td></tr></table>

---

## Math

\`\`\`
<tg-math>x^2 + y^2</tg-math>
<tg-math-block>E = mc^2</tg-math-block>
\`\`\`

<tg-math>x^2 + y^2</tg-math>

<tg-math-block>E = mc^2</tg-math-block>

---

## Details

\`\`\`
<details open><summary>عنوان</summary>محتوا</details>
\`\`\`

<details open><summary>عنوان</summary>محتوا</details>

---

*یه HTML بفرست و ببین چطور رندر میشه* ✨`,

  en: `# 🌐 HTML Guide

If your message starts with \`<\`, the bot renders it as HTML.

---

## Text Styles

\`\`\`
<b>bold</b> <i>italic</i> <u>underline</u>
<s>strike</s> <code>code</code> <mark>marked</mark>
<tg-spoiler>spoiler</tg-spoiler>
<sup>superscript</sup> <sub>subscript</sub>
\`\`\`

<b>bold</b> <i>italic</i> <u>underline</u> <s>strike</s> <code>code</code> <mark>marked</mark> <tg-spoiler>spoiler</tg-spoiler> <sup>sup</sup> <sub>sub</sub>

---

## Headings

\`\`\`
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
\`\`\`

<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>

---

## Lists

\`\`\`
<ul><li>milk</li><li>eggs</li></ul>
<ol><li>wake up</li><li>ship it</li></ol>
<ul>
  <li><input type="checkbox" checked>done</li>
  <li><input type="checkbox">todo</li>
</ul>
\`\`\`

<ul><li>milk</li><li>eggs</li></ul>
<ol><li>wake up</li><li>ship it</li></ol>
<ul><li><input type="checkbox" checked>done</li><li><input type="checkbox">todo</li></ul>

---

## Links & Quotes

\`\`\`
<a href="https://telegram.org">Telegram</a>
<blockquote>Quote text<cite>Author</cite></blockquote>
<aside>Pull quote<cite>Author</cite></aside>
\`\`\`

<a href="https://telegram.org">Telegram</a>
<blockquote>Quote text<cite>Author</cite></blockquote>
<aside>Pull quote<cite>Author</cite></aside>

---

## Code

\`\`\`
<pre><code class="language-python">print("hello")</code></pre>
\`\`\`

<pre><code class="language-python">print("hello")</code></pre>

---

## Table

\`\`\`
<table>
  <tr><th>Lang</th><th>Speed</th></tr>
  <tr><td>Rust</td><td>fast</td></tr>
  <tr><td>Py</td><td>comfy</td></tr>
</table>
\`\`\`

<table><tr><th>Lang</th><th>Speed</th></tr><tr><td>Rust</td><td>fast</td></tr><tr><td>Py</td><td>comfy</td></tr></table>

---

## Math

\`\`\`
<tg-math>x^2 + y^2</tg-math>
<tg-math-block>E = mc^2</tg-math-block>
\`\`\`

<tg-math>x^2 + y^2</tg-math>

<tg-math-block>E = mc^2</tg-math-block>

---

## Details (Collapsible)

\`\`\`
<details open><summary>Title</summary>Content here</details>
\`\`\`

<details open><summary>Title</summary>Content here</details>

---

*Send some HTML and watch it render* ✨`,
};

// ─── Demo ─────────────────────────────────────────────────────────────────────
const DEMO = {
  fa: `# 🎨 دمو کامل — نمونه خروجی

این پیام نمونه خروجی واقعی همه قابلیت‌هاست.

---

## Text Styles

**bold** *italic* ~~strike~~ \`code\` ==marked== ||spoiler||
<u>underline</u> <sup>super</sup> <sub>sub</sub>

---

## Nested Formatting

**Bold _italic <u>underlined italic bold</u> italic_ bold**

>نقل‌قول با **bold**، ~~strikethrough~~، و ||spoiler||، و [لینک](https://t.me/).

---

## Lists

- آیتم با \`inline code\` و **bold**
- آیتم با ~~strikethrough~~ و ==highlight==
- [ ] کار انجام نشده
- [x] کار انجام شده

1. اول
2. دوم
3. سوم

---

## Code Block

\`\`\`python
def greet(name: str) -> str:
    return f"سلام، {name}!"

print(greet("تلگرام"))
\`\`\`

---

## Table

| متریک  | مقدار     | وضعیت    |
|:--------|:---------:|---------:|
| سرعت   | **42** ms | ==fast== |
| حافظه  | 128 MB    | ==ok==   |
| آپتایم | 99.9%     | ~~down~~ |

---

## Math

Inline: $E = mc^2$ و $x^2 + y^2 = r^2$

$$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$

---

## Details

<details open><summary>**جزئیات بیشتر — کلیک کن**</summary>

### داخل Details

- **Markdown** داخل details کار میکنه
- جدول، کد، لیست همه سازگارن

| Key | Value |
|:----|------:|
| A   | 1     |
| B   | 2     |

\`\`\`js
console.log("inside details!");
\`\`\`

</details>

---

[ConfigWireguard](https://t.me/ConfigWireguard) • [GitHub](https://github.com/DarknessShade) • [ÐΛɌ₭ᑎΞ𐒡𐒡](https://darkness-web.pages.dev/)`,

  en: `# 🎨 Full Demo — Live Output Sample

This message demonstrates every supported feature rendered live.

---

## Text Styles

**bold** *italic* ~~strike~~ \`code\` ==marked== ||spoiler||
<u>underline</u> <sup>super</sup> <sub>sub</sub>

---

## Nested Formatting

**Bold _italic <u>underlined italic bold</u> italic_ bold**

>Quote with **bold**, ~~strikethrough~~, and ||spoiler||, plus [a link](https://t.me/).

---

## Lists

- Item with \`inline code\` and **bold**
- Item with ~~strikethrough~~ and ==highlight==
- [ ] Task todo
- [x] Task done

1. First
2. Second
3. Third

---

## Code Block

\`\`\`python
def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("Telegram"))
\`\`\`

---

## Table

| Metric  | Value      | Status    |
|:--------|:----------:|---------:|
| Speed   | **42** ms  | ==fast==  |
| Memory  | 128 MB     | ==ok==    |
| Uptime  | 99.9%      | ~~down~~  |

---

## Math

Inline: $E = mc^2$ and $x^2 + y^2 = r^2$

$$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$

---

## Details (Collapsible)

<details open><summary>**More details — click me**</summary>

### Inside Details

- **Markdown** works inside details
- Tables, code, lists all supported

| Key | Value |
|:----|------:|
| A   | 1     |
| B   | 2     |

\`\`\`js
console.log("inside details!");
\`\`\`

</details>

---

[ConfigWireguard](https://t.me/ConfigWireguard) • [GitHub](https://github.com/DarknessShade) • [ÐΛɌ₭ᑎΞ𐒡𐒡](https://darkness-web.pages.dev/)`,
};
