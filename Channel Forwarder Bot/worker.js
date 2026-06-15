/**
 * Telegram Rich Markdown Bot — Cloudflare Worker
 * ÐΛɌ₭ᑎΞ𐒡𐒡 https://github.com/DarknessShade
 * Bot API 10.1
 */
 // The original owner of the bot — is always the admin and cannot be deleted.
 
 // ─── This Worker requires a KV Namespace called BOT_DB to work ──────
// In Cloudflare Dashboard: Workers & Pages → Project → Settings → Variables →
// KV Namespace Bindings → Add binding → Variabl
 

const BOT_TOKEN = "8677708225:AAHOTXiIwI627RtMmeAMqMcck6rVJ84T-BU";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

const OWNER_ID = 102026299;

export default {
  async fetch(request, env) {
    if (request.method === "GET") return new Response("✅ Bot is running!", { status: 200 });
    if (request.method !== "POST") return new Response("OK");

    let update;
    try { update = await request.json(); } catch { return new Response("Bad JSON", { status: 400 }); }

    try {
      const message       = update.message;
      const callbackQuery = update.callback_query;
      if (callbackQuery) await handleCallback(callbackQuery, env);
      else if (message?.text) await handleMessage(message, env);
    } catch (err) {
      console.error("Handler error:", err && err.stack ? err.stack : err);
      try {
        const chatId = update.message?.chat?.id || update.callback_query?.message?.chat?.id;
        if (chatId) {
          await fetch(`${TELEGRAM_API}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text: `⚠️ Internal error: ${err?.message || err}` }),
          });
        }
      } catch {}
    }

    return new Response("OK", { status: 200 });
  },
};

// ─── KV Storage Helpers ─────────────────────────────────────────────────────
// Keys:
// - "admins" → JSON array of admin user IDs (always includes OWNER_ID)
// - "channels" → JSON array of { id, title }
// - "state:<userId>" → JSON temporary user state (while creating post)

async function getAdmins(env) {
  try {
    const raw = await env.BOT_DB.get("admins");
    let list = raw ? JSON.parse(raw) : [];
    if (!list.includes(OWNER_ID)) list = [OWNER_ID, ...list];
    return list;
  } catch {
    return [OWNER_ID];
  }
}

async function setAdmins(env, list) {
  if (!list.includes(OWNER_ID)) list = [OWNER_ID, ...list];
  // Remove duplicates
  list = [...new Set(list)];
  await env.BOT_DB.put("admins", JSON.stringify(list));
  return list;
}

async function isAdmin(env, userId) {
  const admins = await getAdmins(env);
  return admins.includes(userId);
}

async function getChannels(env) {
  try {
    const raw = await env.BOT_DB.get("channels");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function setChannels(env, list) {
  await env.BOT_DB.put("channels", JSON.stringify(list));
  return list;
}

async function getState(env, userId) {
  try {
    const raw = await env.BOT_DB.get(`state:${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function setState(env, userId, state) {
  if (state === null) {
    await env.BOT_DB.delete(`state:${userId}`);
  } else {
    await env.BOT_DB.put(`state:${userId}`, JSON.stringify(state));
  }
}

// ─── Keyboards ────────────────────────────────────────────────────────────────
function mainKeyboard(lang, admin) {
  const adminRow = admin
    ? (lang === "fa"
        ? [
            { text: "📝 ساخت پست", callback_data: "fa_newpost" },
            { text: "⚙️ پنل ادمین", callback_data: "fa_admin_panel" },
          ]
        : [
            { text: "📝 New Post", callback_data: "en_newpost" },
            { text: "⚙️ Admin Panel", callback_data: "en_admin_panel" },
          ])
    : null;

  if (lang === "fa") {
    const rows = [
      [
        { text: "📖 راهنمای Markdown", callback_data: "fa_help_md"   },
        { text: "🌐 راهنمای HTML",     callback_data: "fa_help_html" },
      ],
      [
        { text: "🖼 راهنمای مدیا", callback_data: "fa_help_media" },
      ],
      [
        { text: "🎨 دمو کامل",   callback_data: "fa_demo"  },
        { text: "ℹ️ درباره بات", callback_data: "fa_about" },
      ],
      [{ text: "🇬🇧 Switch to English", callback_data: "en_start" }],
    ];
    if (adminRow) rows.push(adminRow);
    return { inline_keyboard: rows };
  }

  const rows = [
    [
      { text: "📖 Markdown Guide", callback_data: "en_help_md"   },
      { text: "🌐 HTML Guide",     callback_data: "en_help_html" },
    ],
    [
      { text: "🖼 Media Guide", callback_data: "en_help_media" },
    ],
    [
      { text: "🎨 Full Demo", callback_data: "en_demo"  },
      { text: "ℹ️ About",     callback_data: "en_about" },
    ],
    [{ text: "🇮🇷 تغییر به فارسی", callback_data: "fa_start" }],
  ];
  if (adminRow) rows.push(adminRow);
  return { inline_keyboard: rows };
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

// ─── Admin Panel ──────────────────────────────────────────────────────────────
function adminPanelKeyboard(lang) {
  if (lang === "fa") return {
    inline_keyboard: [
      [
        { text: "👤 مدیریت ادمین‌ها", callback_data: "fa_admins_menu" },
        { text: "📡 مدیریت کانال‌ها", callback_data: "fa_channels_menu" },
      ],
      [{ text: "📝 ساخت پست", callback_data: "fa_newpost" }],
      [{ text: "⬅️ بازگشت به منو", callback_data: "fa_back" }],
    ],
  };
  return {
    inline_keyboard: [
      [
        { text: "👤 Manage Admins", callback_data: "en_admins_menu" },
        { text: "📡 Manage Channels", callback_data: "en_channels_menu" },
      ],
      [{ text: "📝 New Post", callback_data: "en_newpost" }],
      [{ text: "⬅️ Back to Menu", callback_data: "en_back" }],
    ],
  };
}

function adminsMenuKeyboard(lang) {
  if (lang === "fa") return {
    inline_keyboard: [
      [{ text: "➕ افزودن ادمین", callback_data: "fa_admin_add" }],
      [{ text: "➖ حذف ادمین", callback_data: "fa_admin_remove" }],
      [{ text: "📋 لیست ادمین‌ها", callback_data: "fa_admin_list" }],
      [{ text: "⬅️ بازگشت", callback_data: "fa_admin_panel" }],
    ],
  };
  return {
    inline_keyboard: [
      [{ text: "➕ Add Admin", callback_data: "en_admin_add" }],
      [{ text: "➖ Remove Admin", callback_data: "en_admin_remove" }],
      [{ text: "📋 List Admins", callback_data: "en_admin_list" }],
      [{ text: "⬅️ Back", callback_data: "en_admin_panel" }],
    ],
  };
}

function channelsMenuKeyboard(lang) {
  if (lang === "fa") return {
    inline_keyboard: [
      [{ text: "➕ افزودن کانال", callback_data: "fa_channel_add" }],
      [{ text: "➖ حذف کانال", callback_data: "fa_channel_remove" }],
      [{ text: "📋 لیست کانال‌ها", callback_data: "fa_channel_list" }],
      [{ text: "⬅️ بازگشت", callback_data: "fa_admin_panel" }],
    ],
  };
  return {
    inline_keyboard: [
      [{ text: "➕ Add Channel", callback_data: "en_channel_add" }],
      [{ text: "➖ Remove Channel", callback_data: "en_channel_remove" }],
      [{ text: "📋 List Channels", callback_data: "en_channel_list" }],
      [{ text: "⬅️ Back", callback_data: "en_admin_panel" }],
    ],
  };
}

function cancelKeyboard(lang) {
  if (lang === "fa") return { inline_keyboard: [[{ text: "❌ لغو", callback_data: "fa_cancel" }]] };
  return { inline_keyboard: [[{ text: "❌ Cancel", callback_data: "en_cancel" }]] };
}

// آیا برای پست دکمه اضافه شود؟
function askButtonsKeyboard(lang) {
  if (lang === "fa") return {
    inline_keyboard: [
      [
        { text: "✅ آره", callback_data: "fa_post_btn_yes" },
        { text: "❌ نه",  callback_data: "fa_post_btn_no" },
      ],
      [{ text: "❌ لغو", callback_data: "fa_cancel" }],
    ],
  };
  return {
    inline_keyboard: [
      [
        { text: "✅ Yes", callback_data: "en_post_btn_yes" },
        { text: "❌ No",  callback_data: "en_post_btn_no" },
      ],
      [{ text: "❌ Cancel", callback_data: "en_cancel" }],
    ],
  };
}

// پیش‌نمایش: تایید / ویرایش / لغو
function previewKeyboard(lang) {
  if (lang === "fa") return {
    inline_keyboard: [
      [{ text: "✅ تایید و ادامه", callback_data: "fa_post_confirm" }],
      [
        { text: "✏️ ویرایش متن", callback_data: "fa_post_edit_text" },
        { text: "✏️ ویرایش دکمه‌ها", callback_data: "fa_post_edit_btns" },
      ],
      [{ text: "❌ لغو", callback_data: "fa_cancel" }],
    ],
  };
  return {
    inline_keyboard: [
      [{ text: "✅ Confirm & Continue", callback_data: "en_post_confirm" }],
      [
        { text: "✏️ Edit Text", callback_data: "en_post_edit_text" },
        { text: "✏️ Edit Buttons", callback_data: "en_post_edit_btns" },
      ],
      [{ text: "❌ Cancel", callback_data: "en_cancel" }],
    ],
  };
}

// Select channels to send (multiple selection)
function channelSelectKeyboard(lang, channels, selected) {
  const rows = channels.map(ch => {
    const checked = selected.includes(String(ch.id)) ? "✅ " : "▫️ ";
    return [{ text: `${checked}${ch.title}`, callback_data: `${lang}_post_ch_${ch.id}` }];
  });
  if (lang === "fa") {
    rows.push([{ text: "📤 ارسال به موارد انتخاب شده", callback_data: "fa_post_send" }]);
    rows.push([{ text: "❌ لغو", callback_data: "fa_cancel" }]);
  } else {
    rows.push([{ text: "📤 Send to Selected", callback_data: "en_post_send" }]);
    rows.push([{ text: "❌ Cancel", callback_data: "en_cancel" }]);
  }
  return { inline_keyboard: rows };
}

// ─── Handlers ─────────────────────────────────────────────────────────────────
async function handleMessage(message, env) {
  const chatId  = message.chat.id;
  const userId  = message.from?.id;
  const rawText = message.text;
  const trimmed = rawText.trim();

  if (trimmed === "/start" || trimmed === "/help") {
    // Show language selection first
    await sendPlain(chatId, LANG_SELECT_MESSAGE, LANG_SELECT_KEYBOARD);
    return;
  }

  // ── Stateful admin flows (add admin, add channel, post builder, etc.) ─────
  const state = await getState(env, userId);
  if (state) {
    const handled = await handleStateInput(env, message, state);
    if (handled) return;
  }

  // Telegram clients auto-format `**bold**`, ```code```, etc. typed by the user
  // into formatting entities and STRIP the raw markdown syntax from message.text.
  // Reconstruct the original Markdown/HTML from text + entities before echoing it.
  let text = entitiesToMarkdown(rawText, message.entities).trim();
  if (!text) text = trimmed;

  if (text.startsWith("<") || /<\/?\w/.test(text)) {
    await sendRichHtml(chatId, text);
  } else {
    await sendRichMarkdown(chatId, text);
  }
}

// ─── Managing text inputs in different modes (add admin, channel, create post) ──
async function handleStateInput(env, message, state) {
  const chatId  = message.chat.id;
  const userId  = message.from?.id;
  const rawText = message.text;
  const trimmed = rawText.trim();
  const lang    = state.lang || "fa";

  // Cancel with /cancel
  if (trimmed === "/cancel") {
    await setState(env, userId, null);
    await sendPlain(chatId, lang === "fa" ? "❌ عملیات لغو شد." : "❌ Operation cancelled.");
    return true;
  }

  // ── Add admin ──────────────────────────────────────────────────────
  if (state.action === "admin_add") {
    const newId = parseInt(trimmed, 10);
    if (!Number.isFinite(newId)) {
      await sendPlain(chatId, lang === "fa"
        ? "⚠️ آیدی عددی معتبر نیست. یک آیدی عددی تلگرام بفرستید یا /cancel کنید."
        : "⚠️ Invalid numeric ID. Send a numeric Telegram user ID or /cancel.");
      return true;
    }
    const admins = await getAdmins(env);
    if (admins.includes(newId)) {
      await sendPlain(chatId, lang === "fa" ? "ℹ️ این کاربر از قبل ادمین است." : "ℹ️ This user is already an admin.");
    } else {
      const updated = await setAdmins(env, [...admins, newId]);
      await sendPlain(chatId, (lang === "fa" ? `✅ ادمین جدید اضافه شد: \`${newId}\`\n\nلیست فعلی: ` : `✅ New admin added: \`${newId}\`\n\nCurrent list: `) + updated.map(a => `\`${a}\``).join(", "));
    }
    await setState(env, userId, null);
    return true;
  }

  // ── Remove admin ────────────────────────────────────────────────────────
  if (state.action === "admin_remove") {
    const remId = parseInt(trimmed, 10);
    if (!Number.isFinite(remId)) {
      await sendPlain(chatId, lang === "fa"
        ? "⚠️ آیدی عددی معتبر نیست. یک آیدی عددی تلگرام بفرستید یا /cancel کنید."
        : "⚠️ Invalid numeric ID. Send a numeric Telegram user ID or /cancel.");
      return true;
    }
    if (remId === OWNER_ID) {
      await sendPlain(chatId, lang === "fa" ? "⛔️ مالک اصلی ربات قابل حذف نیست." : "⛔️ The bot owner cannot be removed.");
      await setState(env, userId, null);
      return true;
    }
    const admins = await getAdmins(env);
    if (!admins.includes(remId)) {
      await sendPlain(chatId, lang === "fa" ? "ℹ️ این کاربر ادمین نبود." : "ℹ️ This user wasn't an admin.");
    } else {
      const updated = await setAdmins(env, admins.filter(a => a !== remId));
      await sendPlain(chatId, (lang === "fa" ? `✅ ادمین حذف شد: \`${remId}\`\n\nلیست فعلی: ` : `✅ Admin removed: \`${remId}\`\n\nCurrent list: `) + updated.map(a => `\`${a}\``).join(", "));
    }
    await setState(env, userId, null);
    return true;
  }

  // ── Add channel ─────────────────────────────────────────────────────
  if (state.action === "channel_add") {
    // ورودی می‌تواند آیدی عددی (مثل -1001234567890) یا یوزرنیم (@channel) باشد
    let channelId = trimmed;
    if (!channelId.startsWith("@") && !/^-?\d+$/.test(channelId)) {
      await sendPlain(chatId, lang === "fa"
        ? "⚠️ فرمت نامعتبر است. آیدی عددی کانال (مثل -1001234567890) یا یوزرنیم (@channel) بفرستید، یا /cancel کنید."
        : "⚠️ Invalid format. Send the channel's numeric ID (e.g. -1001234567890) or @username, or /cancel.");
      return true;
    }
    if (/^-?\d+$/.test(channelId)) channelId = parseInt(channelId, 10);

    // بررسی اینکه ربات در کانال ادمین است
    const chatInfo = await callApiResult("getChat", { chat_id: channelId });
    if (!chatInfo || !chatInfo.ok) {
      await sendPlain(chatId, lang === "fa"
        ? `⚠️ نتوانستم اطلاعات این کانال را بگیرم. مطمئن شوید:\n1) ربات در کانال عضو و **ادمین** است.\n2) آیدی/یوزرنیم درست است.\n\nخطا: ${chatInfo?.description || "نامشخص"}`
        : `⚠️ Couldn't fetch chat info. Make sure:\n1) The bot is a member and **admin** of the channel.\n2) The ID/username is correct.\n\nError: ${chatInfo?.description || "unknown"}`);
      return true;
    }
    const title = chatInfo.result.title || chatInfo.result.username || String(channelId);
    const realId = chatInfo.result.id;

    const channels = await getChannels(env);
    if (channels.some(c => String(c.id) === String(realId))) {
      await sendPlain(chatId, lang === "fa" ? "ℹ️ این کانال از قبل ثبت شده است." : "ℹ️ This channel is already registered.");
    } else {
      const updated = await setChannels(env, [...channels, { id: realId, title }]);
      await sendPlain(chatId, (lang === "fa" ? `✅ کانال اضافه شد: **${title}** (\`${realId}\`)\n\nتعداد کانال‌های ثبت شده: ${updated.length}` : `✅ Channel added: **${title}** (\`${realId}\`)\n\nTotal registered channels: ${updated.length}`));
    }
    await setState(env, userId, null);
    return true;
  }

  // ── Delete channel (by numeric ID or username) ─────────────────────────────────
  if (state.action === "channel_remove") {
    let channelId = trimmed;
    if (/^-?\d+$/.test(channelId)) channelId = parseInt(channelId, 10);
    else if (channelId.startsWith("@")) channelId = channelId; // keep as username
    const channels = await getChannels(env);
    const found = channels.find(c => String(c.id) === String(channelId) || c.title === channelId);
    if (!found) {
      await sendPlain(chatId, lang === "fa" ? "⚠️ کانالی با این مشخصات پیدا نشد." : "⚠️ Channel not found.");
      return true;
    }
    const updated = await setChannels(env, channels.filter(c => String(c.id) !== String(found.id)));
    await sendPlain(chatId, (lang === "fa" ? `✅ کانال حذف شد: **${found.title}**\n\nتعداد کانال‌های ثبت شده: ${updated.length}` : `✅ Channel removed: **${found.title}**\n\nTotal registered channels: ${updated.length}`));
    await setState(env, userId, null);
    return true;
  }

  // ── Creating a Post: Step 1 — Getting the Post Text ───────────────────────────────
  if (state.action === "post_await_text") {
    let text = entitiesToMarkdown(rawText, message.entities).trim();
    if (!text) text = trimmed;

    const isHtml = text.startsWith("<") || /<\/?\w/.test(text);
    const newState = {
      action: "post_await_buttons_choice",
      lang,
      text,
      isHtml,
      buttons: null,
    };
    await setState(env, userId, newState);

    // Show converted post (preview)
    if (isHtml) await sendRichHtml(chatId, text);
    else await sendRichMarkdown(chatId, text);

    await sendPlain(chatId,
      lang === "fa"
        ? "آیا می‌خواهید برای این پست دکمه قرار دهید؟"
        : "Would you like to add buttons to this post?",
      askButtonsKeyboard(lang)
    );
    return true;
  }

  // ── Post Creation: Step 2 — Get Button Text ────────────────────────────
  if (state.action === "post_await_buttons_text") {
    const parsed = parseButtonsInput(trimmed);
    if (!parsed || parsed.length === 0) {
      await sendPlain(chatId, lang === "fa"
        ? "⚠️ فرمت دکمه‌ها نامعتبر است. لطفاً مطابق نمونه ارسال کنید یا /cancel بزنید.\n\nنمونه:\nButton💠 - https://link.com\n\nButton🩵 - http://a.ai | Button💙 - http://b.ai\n\nButton🟣 - http://d.ai | Button🟠 - http://c.ai | Button💚 - http://e.ai"
        : "⚠️ Invalid button format. Please follow the example or /cancel.\n\nExample:\nButton💠 - https://link.com\n\nButton🩵 - http://a.ai | Button💙 - http://b.ai\n\nButton🟣 - http://d.ai | Button🟠 - http://c.ai | Button💚 - http://e.ai");
      return true;
    }

    const newState = { ...state, action: "post_preview", buttons: parsed };
    await setState(env, userId, newState);
    await sendPostPreview(env, chatId, newState);
    return true;
  }

  return false;
}

// ─── inline_keyboard ────────────────────────────
function parseButtonsInput(text) {
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return null;

  const rows = [];
  for (const line of lines) {
    const cells = line.split("|").map(c => c.trim()).filter(c => c.length > 0);
    const row = [];
    for (const cell of cells) {
      const sepIdx = cell.lastIndexOf(" - ");
      if (sepIdx === -1) return null;
      const label = cell.slice(0, sepIdx).trim();
      const url    = cell.slice(sepIdx + 3).trim();
      if (!label || !url) return null;
      if (!/^https?:\/\//i.test(url) && !/^tg:\/\//i.test(url)) return null;
      row.push({ text: label, url });
    }
    if (row.length === 0) return null;
    rows.push(row);
  }
  return rows;
}

// ─── Send a post preview with approve/edit/cancel buttons and options ────────
async function sendPostPreview(env, chatId, state) {
  const lang = state.lang || "fa";
  const replyMarkup = state.buttons ? { inline_keyboard: state.buttons } : undefined;

  if (state.isHtml) await sendRichHtml(chatId, state.text, replyMarkup);
  else await sendRichMarkdown(chatId, state.text, replyMarkup);

  await sendPlain(chatId,
    lang === "fa"
      ? "👆 این پیش‌نمایش پست شماست. در صورت تایید، در مرحله بعد کانال‌های ارسال را انتخاب کنید."
      : "👆 This is your post preview. If confirmed, you'll choose channels to send to next.",
    previewKeyboard(lang)
  );
}

// ─── Convert Telegram message entities back into Markdown/HTML source ─────────
function entitiesToMarkdown(text, entities) {
  if (!entities || !entities.length) return text;

  const items = entities.map((e, idx) => ({ e, idx, start: e.offset, end: e.offset + e.length }));

  function isTopLevel(item, pool) {
    return !pool.some(other => {
      if (other.idx === item.idx) return false;
      const strictlyLarger =
        other.start <= item.start && other.end >= item.end &&
        (other.start < item.start || other.end > item.end);
      const sameSpanOuter =
        other.start === item.start && other.end === item.end && other.idx < item.idx;
      return strictlyLarger || sameSpanOuter;
    });
  }

  function render(start, end, pool) {
    const inRange = pool.filter(it => it.start >= start && it.end <= end);
    const top = inRange.filter(it => isTopLevel(it, inRange)).sort((a, b) => a.start - b.start);

    let out = "";
    let pos = start;
    for (const item of top) {
      out += text.slice(pos, item.start);
      // Exclude this item itself to avoid infinite recursion on its own range
      const innerPool = pool.filter(p => p.idx !== item.idx);
      const inner = render(item.start, item.end, innerPool);
      out += wrapEntity(item.e, inner);
      pos = item.end;
    }
    out += text.slice(pos, end);
    return out;
  }

  return render(0, text.length, items);
}

function wrapEntity(e, content) {
  switch (e.type) {
    case "bold":          return `**${content}**`;
    case "italic":        return `*${content}*`;
    case "underline":     return `<u>${content}</u>`;
    case "strikethrough": return `~~${content}~~`;
    case "spoiler":       return `||${content}||`;
    case "code":          return `\`${content}\``;
    case "pre": {
      const lang = e.language || "";
      return "```" + lang + "\n" + content + "\n```";
    }
    case "text_link":
      return `[${content}](${e.url})`;
    case "text_mention":
      return e.user ? `[${content}](tg://user?id=${e.user.id})` : content;
    case "blockquote":
    case "expandable_blockquote":
      return content.split("\n").map(l => `>${l}`).join("\n");
    default:
      // mention, hashtag, cashtag, bot_command, url, email, phone_number, custom_emoji, etc.
      return content;
  }
}

async function handleCallback(cb, env) {
  const chatId = cb.message.chat.id;
  const msgId  = cb.message.message_id;
  const userId = cb.from?.id;
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
  const admin = await isAdmin(env, userId);
  const main = mainKeyboard(lang, admin);

  // ── General menu  ────────────────────────────────────────────────────────
  if (action === "start" || action === "back") {
    await setState(env, userId, null);
    await editRichMarkdown(chatId, msgId, WELCOME[lang], main);
    return;
  } else if (action === "help_md") {
    await editRichMarkdown(chatId, msgId, HELP_MD[lang], kb);
    return;
  } else if (action === "help_html") {
    await editRichMarkdown(chatId, msgId, HELP_HTML[lang], kb);
    return;
  } else if (action === "help_media") {
    await editRichMarkdown(chatId, msgId, HELP_MEDIA[lang], kb);
    return;
  } else if (action === "demo") {
    await editRichMarkdown(chatId, msgId, DEMO[lang], kb);
    return;
  } else if (action === "about") {
    await editRichMarkdown(chatId, msgId, ABOUT[lang], kb);
    return;
  } else if (action === "cancel") {
    await setState(env, userId, null);
    const txt = lang === "fa" ? "❌ عملیات لغو شد." : "❌ Operation cancelled.";
    await editRichMarkdown(chatId, msgId, txt, main);
    return;
  }

  if (!admin) {
    await editRichMarkdown(chatId, msgId,
      lang === "fa" ? "⛔️ شما دسترسی ادمین ندارید." : "⛔️ You don't have admin access.",
      main);
    return;
  }

  // ── Main admin panel ───────────────────────────────────────────────────
  if (action === "admin_panel") {
    await setState(env, userId, null);
    const txt = lang === "fa" ? ADMIN_PANEL_TEXT.fa : ADMIN_PANEL_TEXT.en;
    await editRichMarkdown(chatId, msgId, txt, adminPanelKeyboard(lang));
    return;
  }

  // ── Admin management──────────────────────────────────────────────────
  if (action === "admins_menu") {
    const admins = await getAdmins(env);
    const txt = (lang === "fa"
      ? `👤 **مدیریت ادمین‌ها**\n\nتعداد ادمین‌های فعلی: ${admins.length}\n\nاز دکمه‌های زیر استفاده کنید 👇`
      : `👤 **Manage Admins**\n\nCurrent admin count: ${admins.length}\n\nUse the buttons below 👇`);
    await editRichMarkdown(chatId, msgId, txt, adminsMenuKeyboard(lang));
    return;
  }

  if (action === "admin_add") {
    await setState(env, userId, { action: "admin_add", lang });
    const txt = lang === "fa"
      ? "➕ **افزودن ادمین**\n\nآیدی عددی تلگرام کاربر مورد نظر را ارسال کنید.\nبرای گرفتن آیدی عددی می‌توانید از بات‌هایی مثل @userinfobot استفاده کنید.\n\nبرای لغو /cancel را ارسال کنید."
      : "➕ **Add Admin**\n\nSend the numeric Telegram user ID of the user.\nYou can use bots like @userinfobot to get a user's numeric ID.\n\nSend /cancel to abort.";
    await editRichMarkdown(chatId, msgId, txt, cancelKeyboard(lang));
    return;
  }

  if (action === "admin_remove") {
    await setState(env, userId, { action: "admin_remove", lang });
    const admins = await getAdmins(env);
    const txt = (lang === "fa"
      ? `➖ **حذف ادمین**\n\nآیدی عددی ادمینی که می‌خواهید حذف کنید را ارسال کنید.\n(مالک اصلی \`${OWNER_ID}\` قابل حذف نیست.)\n\nلیست فعلی: `
      : `➖ **Remove Admin**\n\nSend the numeric ID of the admin to remove.\n(Owner \`${OWNER_ID}\` cannot be removed.)\n\nCurrent list: `) + admins.map(a => `\`${a}\``).join(", ") + (lang === "fa" ? "\n\nبرای لغو /cancel را ارسال کنید." : "\n\nSend /cancel to abort.");
    await editRichMarkdown(chatId, msgId, txt, cancelKeyboard(lang));
    return;
  }

  if (action === "admin_list") {
    const admins = await getAdmins(env);
    const txt = (lang === "fa"
      ? `📋 **لیست ادمین‌ها** (${admins.length})\n\n`
      : `📋 **Admin List** (${admins.length})\n\n`) +
      admins.map(a => `• \`${a}\`${a === OWNER_ID ? (lang === "fa" ? " (مالک)" : " (owner)") : ""}`).join("\n");
    await editRichMarkdown(chatId, msgId, txt, adminsMenuKeyboard(lang));
    return;
  }

  // ── Channel management──────────────────────────────────────────────────
  if (action === "channels_menu") {
    const channels = await getChannels(env);
    const txt = (lang === "fa"
      ? `📡 **مدیریت کانال‌ها**\n\nتعداد کانال‌های ثبت‌شده: ${channels.length}\n\nاز دکمه‌های زیر استفاده کنید 👇`
      : `📡 **Manage Channels**\n\nRegistered channels: ${channels.length}\n\nUse the buttons below 👇`);
    await editRichMarkdown(chatId, msgId, txt, channelsMenuKeyboard(lang));
    return;
  }

  if (action === "channel_add") {
    await setState(env, userId, { action: "channel_add", lang });
    const txt = lang === "fa"
      ? "➕ **افزودن کانال**\n\n1. ربات را به کانال مورد نظر اضافه کنید.\n2. ربات را **ادمین کانال** کنید (با دسترسی ارسال پیام).\n3. آیدی عددی کانال (مثل `-1001234567890`) یا یوزرنیم آن (مثل `@mychannel`) را اینجا ارسال کنید.\n\nبرای لغو /cancel را ارسال کنید."
      : "➕ **Add Channel**\n\n1. Add the bot to the channel.\n2. Make the bot a **channel admin** (with post permission).\n3. Send the channel's numeric ID (e.g. `-1001234567890`) or username (e.g. `@mychannel`) here.\n\nSend /cancel to abort.";
    await editRichMarkdown(chatId, msgId, txt, cancelKeyboard(lang));
    return;
  }

  if (action === "channel_remove") {
    const channels = await getChannels(env);
    if (channels.length === 0) {
      const txt = lang === "fa" ? "ℹ️ هیچ کانالی ثبت نشده است." : "ℹ️ No channels registered.";
      await editRichMarkdown(chatId, msgId, txt, channelsMenuKeyboard(lang));
      return;
    }
    await setState(env, userId, { action: "channel_remove", lang });
    const txt = (lang === "fa"
      ? "➖ **حذف کانال**\n\nآیدی عددی یا یوزرنیم کانالی که می‌خواهید حذف کنید را ارسال کنید.\n\nلیست فعلی:\n"
      : "➖ **Remove Channel**\n\nSend the numeric ID or username of the channel to remove.\n\nCurrent list:\n") +
      channels.map(c => `• **${c.title}** — \`${c.id}\``).join("\n") +
      (lang === "fa" ? "\n\nبرای لغو /cancel را ارسال کنید." : "\n\nSend /cancel to abort.");
    await editRichMarkdown(chatId, msgId, txt, cancelKeyboard(lang));
    return;
  }

  if (action === "channel_list") {
    const channels = await getChannels(env);
    const txt = channels.length === 0
      ? (lang === "fa" ? "ℹ️ هیچ کانالی ثبت نشده است." : "ℹ️ No channels registered.")
      : (lang === "fa" ? `📋 **لیست کانال‌ها** (${channels.length})\n\n` : `📋 **Channel List** (${channels.length})\n\n`) +
        channels.map(c => `• **${c.title}** — \`${c.id}\``).join("\n");
    await editRichMarkdown(chatId, msgId, txt, channelsMenuKeyboard(lang));
    return;
  }

  // ── Post creation ─────────────────────────────────────────────────────────
  if (action === "newpost") {
    await setState(env, userId, { action: "post_await_text", lang });
    const txt = lang === "fa"
      ? "📝 **ساخت پست**\n\nمتن پست خود را ارسال کنید (Markdown یا HTML پشتیبانی می‌شود).\n\nبرای لغو /cancel را ارسال کنید."
      : "📝 **New Post**\n\nSend the text of your post (Markdown or HTML supported).\n\nSend /cancel to abort.";
    await editRichMarkdown(chatId, msgId, txt, cancelKeyboard(lang));
    return;
  }

  if (action === "post_btn_yes") {
    const state = await getState(env, userId);
    if (!state || state.action !== "post_await_buttons_choice") return;
    await setState(env, userId, { ...state, action: "post_await_buttons_text" });
    const txt = lang === "fa"
      ? `⛓ **افزودن دکمه به پست**\n\nدکمه‌ها را به فرمت زیر ارسال کنید:\n\nButton💠 - https://link.com\n\nButton🩵 - http://a.ai | Button💙 - http://b.ai\n\nButton🟣 - http://d.ai | Button🟠 - http://c.ai | Button💚 - http://e.ai\n\n— هر خط = یک ردیف دکمه\n— با \`|\` چند دکمه را در یک ردیف قرار دهید\n\nبرای لغو /cancel را ارسال کنید.`
      : `⛓ **Add Buttons to Post**\n\nSend the buttons in the following format:\n\nButton💠 - https://link.com\n\nButton🩵 - http://a.ai | Button💙 - http://b.ai\n\nButton🟣 - http://d.ai | Button🟠 - http://c.ai | Button💚 - http://e.ai\n\n— each line = one button row\n— use \`|\` to put multiple buttons in one row\n\nSend /cancel to abort.`;
    await editRichMarkdown(chatId, msgId, txt, cancelKeyboard(lang));
    return;
  }

  if (action === "post_btn_no") {
    const state = await getState(env, userId);
    if (!state || state.action !== "post_await_buttons_choice") return;
    const newState = { ...state, action: "post_preview", buttons: null };
    await setState(env, userId, newState);
    await sendPostPreview(env, chatId, newState);
    return;
  }

  if (action === "post_edit_text") {
    const state = await getState(env, userId);
    if (!state) return;
    await setState(env, userId, { lang, action: "post_await_text" });
    const txt = lang === "fa"
      ? "📝 متن جدید پست را ارسال کنید.\n\nبرای لغو /cancel را ارسال کنید."
      : "📝 Send the new post text.\n\nSend /cancel to abort.";
    await editRichMarkdown(chatId, msgId, txt, cancelKeyboard(lang));
    return;
  }

  if (action === "post_edit_btns") {
    const state = await getState(env, userId);
    if (!state) return;
    await setState(env, userId, { ...state, action: "post_await_buttons_text" });
    const txt = lang === "fa"
      ? `⛓ دکمه‌های جدید را به فرمت زیر ارسال کنید:\n\nButton💠 - https://link.com\n\nButton🩵 - http://a.ai | Button💙 - http://b.ai\n\nButton🟣 - http://d.ai | Button🟠 - http://c.ai | Button💚 - http://e.ai\n\nبرای لغو /cancel را ارسال کنید.`
      : `⛓ Send the new buttons in the following format:\n\nButton💠 - https://link.com\n\nButton🩵 - http://a.ai | Button💙 - http://b.ai\n\nButton🟣 - http://d.ai | Button🟠 - http://c.ai | Button💚 - http://e.ai\n\nSend /cancel to abort.`;
    await editRichMarkdown(chatId, msgId, txt, cancelKeyboard(lang));
    return;
  }

  if (action === "post_confirm") {
    const state = await getState(env, userId);
    if (!state) return;
    const channels = await getChannels(env);
    if (channels.length === 0) {
      await setState(env, userId, null);
      const txt = lang === "fa"
        ? "⚠️ هیچ کانالی ثبت نشده است. ابتدا از پنل ادمین یک کانال اضافه کنید."
        : "⚠️ No channels registered. Add a channel from the admin panel first.";
      await editRichMarkdown(chatId, msgId, txt, adminPanelKeyboard(lang));
      return;
    }
    const newState = { ...state, action: "post_select_channels", selected: [] };
    await setState(env, userId, newState);
    const txt = lang === "fa"
      ? "📡 کانال‌(های) مورد نظر برای ارسال این پست را انتخاب کنید:"
      : "📡 Select the channel(s) to send this post to:";
    await sendPlain(chatId, txt, channelSelectKeyboard(lang, channels, []));
    return;
  }

  // ── Channel selection (tick/untick) ────────────────────────────────
  if (action.startsWith("post_ch_")) {
    const chId = action.slice("post_ch_".length);
    const state = await getState(env, userId);
    if (!state || state.action !== "post_select_channels") return;
    let selected = state.selected || [];
    if (selected.includes(chId)) selected = selected.filter(c => c !== chId);
    else selected = [...selected, chId];
    const newState = { ...state, selected };
    await setState(env, userId, newState);
    const channels = await getChannels(env);
    await editKeyboardOnly(chatId, msgId, channelSelectKeyboard(lang, channels, selected));
    return;
  }

  // ── Final posting to selected channels ─────────────────────────────
  if (action === "post_send") {
    const state = await getState(env, userId);
    if (!state || state.action !== "post_select_channels") return;
    const selected = state.selected || [];
    if (selected.length === 0) {
      await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callback_query_id: cb.id,
          text: lang === "fa" ? "⚠️ حداقل یک کانال انتخاب کنید." : "⚠️ Select at least one channel.",
          show_alert: true,
        }),
      });
      return;
    }

    const channels = await getChannels(env);
    const replyMarkup = state.buttons ? { inline_keyboard: state.buttons } : undefined;

    const results = [];
    for (const chId of selected) {
      const ch = channels.find(c => String(c.id) === String(chId));
      if (!ch) continue;
      let res;
      if (state.isHtml) res = await sendRichHtmlResult(ch.id, state.text, replyMarkup);
      else res = await sendRichMarkdownResult(ch.id, state.text, replyMarkup);
      results.push({ title: ch.title, ok: res?.ok });
    }

    await setState(env, userId, null);

    const lines = results.map(r =>
      r.ok
        ? (lang === "fa" ? `✅ با موفقیت در کانال **${r.title}** ارسال شد.` : `✅ Successfully sent to channel **${r.title}**.`)
        : (lang === "fa" ? `❌ ارسال به کانال **${r.title}** ناموفق بود.` : `❌ Failed to send to channel **${r.title}**.`)
    );
    const txt = (lang === "fa" ? "📤 **نتیجه ارسال پست:**\n\n" : "📤 **Post send result:**\n\n") + lines.join("\n");
    await sendRichMarkdown(chatId, txt, adminPanelKeyboard(lang));
    return;
  }
}

// ─── Admin panel text ──────────────────────────────────────────────────────────
const ADMIN_PANEL_TEXT = {
  fa: `⚙️ **پنل ادمین**

از این بخش می‌توانید:
— ادمین‌های ربات را مدیریت کنید
— کانال‌ها را اضافه/حذف کنید
— پست جدید برای کانال‌ها بسازید و ارسال کنید

یکی از گزینه‌های زیر را انتخاب کنید 👇`,

  en: `⚙️ **Admin Panel**

From here you can:
— Manage bot admins
— Add/remove channels
— Create and send new posts to channels

Choose an option below 👇`,
};

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

// ─── API call that returns a result (JSON) without sending an error message to the chat ──────────
async function callApiResult(method, body) {
  try {
    const res = await fetch(`${TELEGRAM_API}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (err) {
    return { ok: false, description: String(err) };
  }
}

// Send Rich Markdown/HTML message and return result (for sending to channels)
async function sendRichMarkdownResult(chatId, markdown, replyMarkup) {
  const body = { chat_id: chatId, rich_message: { markdown } };
  if (replyMarkup) body.reply_markup = replyMarkup;
  return await callApiResult("sendRichMessage", body);
}

async function sendRichHtmlResult(chatId, html, replyMarkup) {
  const body = { chat_id: chatId, rich_message: { html } };
  if (replyMarkup) body.reply_markup = replyMarkup;
  return await callApiResult("sendRichMessage", body);
}

// Just update the keyboard of a message (to check channels without changing the text)Just update the keyboard of a message (to check channels without changing the text)
async function editKeyboardOnly(chatId, messageId, replyMarkup) {
  await callApi("editMessageReplyMarkup", {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: replyMarkup,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT
// ═══════════════════════════════════════════════════════════════════════════════

const WELCOME = {
  fa: `# 🤖 Rich Markdown Bot

هر متن **Markdown** یا **HTML** بفرستید، به صورت Rich Message رندر میشه.

[Rich Markdown Telegram](https://core.telegram.org/bots/api#rich-message-formatting-options)

از دکمه‌های زیر برای دیدن راهنما و دمو استفاده کنید 👇`,

  en: `# 🤖 Rich Markdown Bot

Send any **Markdown** or **HTML** text and it will be echoed back as a rendered Rich Message.

[Rich Markdown Telegram](https://core.telegram.org/bots/api#rich-message-formatting-options)

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

[Rich Markdown Telegram](https://core.telegram.org/bots/api#rich-message-formatting-options)

---

## Text Styles

\`\`\`
**bold**  *italic*  ~~strike~~  \`code\`  ==marked==  ||spoiler||
\`\`\`

**bold** *italic* ~~strike~~ \`code\` ==marked== ||spoiler||

---

## Headings

\`\`\`
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
\`\`\`

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

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

## Block Quote (چند خط)

\`\`\`
>Block quotation started
>
>Block quotation continued on the next line
>Block quotation continued on the same line

>The last line of the block quotation
\`\`\`

>Block quotation started
>
>Block quotation continued on the next line
>Block quotation continued on the same line

>The last line of the block quotation

---

## Unordered List (علامت‌های مختلف)

\`\`\`
- unordered list item
* unordered list item
+ unordered list item
\`\`\`

- unordered list item
* unordered list item
+ unordered list item

---

## Divider

\`\`\`
---
\`\`\`

---

## Code Blocks

\`\`\`\`
\`\`\`python
print("hello")
\`\`\`
\`\`\`\`

\`\`\`python
print("hello")
\`\`\`

---

## Tables

\`\`\`\`
| Lang | Speed |
|:-----|------:|
| Rust | fast  |
| Py   | comfy |
\`\`\`\`

| Lang | Speed |
|:-----|------:|
| Rust | fast  |
| Py   | comfy |

---

## Math

\`\`\`\`
Inline $E = mc^2$ and a block:
$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$
\`\`\`\`

Inline $E = mc^2$ and a block:

$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$

---

## Details

\`\`\`\`
<details><summary>**کلیک کن**</summary>
محتوای مخفی!
</details>
\`\`\`\`

<details><summary>**کلیک کن**</summary>
محتوای مخفی!
</details>

---

*محدودیت: تا 32,768 کاراکتر در هر پیام* ✨`,

  en: `# 📖 Markdown Guide

Send Markdown text and get it echoed back rendered.
Grey box = what you type ↓ result comes right after.

[Rich Markdown Telegram](https://core.telegram.org/bots/api#rich-message-formatting-options)
---

## Text Styles

\`\`\`
**bold**  *italic*  ~~strike~~  \`code\`  ==marked==  ||spoiler||
\`\`\`

**bold** *italic* ~~strike~~ \`code\` ==marked== ||spoiler||

---

## Headings

\`\`\`
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
\`\`\`

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

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

## Unordered List (all markers)

\`\`\`
- unordered list item
* unordered list item
+ unordered list item
\`\`\`

- unordered list item
* unordered list item
+ unordered list item

---

## Links & Quotes

\`\`\`
[Telegram](https://telegram.org)

>To be, or not to be.
\`\`\`

[Telegram](https://telegram.org)

>To be, or not to be.

---

## Block Quote (multi-line)

\`\`\`
>Block quotation started
>
>Block quotation continued on the next line
>Block quotation continued on the same line

>The last line of the block quotation
\`\`\`

>Block quotation started
>
>Block quotation continued on the next line
>Block quotation continued on the same line

>The last line of the block quotation

---

## Divider

\`\`\`
---
\`\`\`

---

## Code Blocks

\`\`\`\`
\`\`\`python
print("hello")
\`\`\`
\`\`\`\`

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

[Rich Markdown Telegram](https://core.telegram.org/bots/api#rich-message-formatting-options)

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
<h4>Heading 4</h4>
<h5>Heading 3</h5>
\`\`\`

<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 3</h5>

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
<aside>Pull quote<cite>The Author</cite></aside>
\`\`\`

<a href="https://telegram.org">Telegram</a>
<blockquote>متن نقل‌قول<cite>نویسنده</cite></blockquote>
<aside>Pull quote<cite>The Author</cite></aside>

---

## Superscript & Subscript

\`\`\`
<sub>subscript text</sub>
<sup>superscript text</sup>
\`\`\`

متن نرمال با <sub>subscript text</sub> و <sup>superscript text</sup>

---

## Footnotes

\`\`\`
Text with a reference[^id1] and another one[^id2].

[^id1]: Definition of the first footnote.
[^id2]: Definition of the second footnote.
\`\`\`

Text with a reference[^id1] and another one[^id2].

[^id1]: Definition of the first footnote.
[^id2]: Definition of the second footnote.

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

[Rich Markdown Telegram](https://core.telegram.org/bots/api#rich-message-formatting-options)

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
<h4>Heading 4</h4>
<h5>Heading 3</h5>
\`\`\`

<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 3</h5>

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
<aside>Pull quote<cite>The Author</cite></aside>
\`\`\`

<a href="https://telegram.org">Telegram</a>
<blockquote>Quote text<cite>Author</cite></blockquote>
<aside>Pull quote<cite>The Author</cite></aside>

---

## Superscript & Subscript

\`\`\`
<sub>subscript text</sub>
<sup>superscript text</sup>
\`\`\`

Normal text with <sub>subscript text</sub> and <sup>superscript text</sup>

---

## Footnotes

\`\`\`
Text with a reference[^id1] and another one[^id2].

[^id1]: Definition of the first footnote.
[^id2]: Definition of the second footnote.
\`\`\`

Text with a reference[^id1] and another one[^id2].

[^id1]: Definition of the first footnote.
[^id2]: Definition of the second footnote.

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

// ─── Media Help ───────────────────────────────────────────────────────────────
const HELP_MEDIA = {
  fa: `# 🖼 راهنمای مدیا

برای ارسال مدیا در Rich Message از سینتکس تصویر Markdown استفاده کنید.
URL پسوند فایل تعیین می‌کنه چه نوع مدیایی نمایش داده بشه.

[Rich Markdown Telegram](https://core.telegram.org/bots/api#rich-message-formatting-options)

---

## نقشه

\`\`\`
<tg-map lat="41.9" long="12.5" zoom="14"/>
\`\`\`

<tg-map lat="41.9" long="12.5" zoom="14"/>

---

## عکس

\`\`\`
![](https://telegram.org/example/photo.jpg)
\`\`\`

![](https://telegram.org/example/photo.jpg)

---

## ویدیو

\`\`\`
![](https://telegram.org/example/video.mp4)
\`\`\`

![](https://telegram.org/example/video.mp4)

---

## فایل صوتی

\`\`\`
![](https://telegram.org/example/audio.mp3)
\`\`\`

![](https://telegram.org/example/audio.mp3)

---

## ویس نوت (ogg)

\`\`\`
![](https://telegram.org/example/audio.ogg)
\`\`\`

![](https://telegram.org/example/audio.ogg)

---

## انیمیشن (gif)

\`\`\`
![](https://telegram.org/example/animation.gif)
\`\`\`

![](https://telegram.org/example/animation.gif)

---

## مدیا با کپشن

\`\`\`
![](https://telegram.org/example/photo.jpg "Photo caption")
![](https://telegram.org/example/video.mp4 "Video caption")
![](https://telegram.org/example/audio.mp3 "Audio caption")
![](https://telegram.org/example/audio.ogg "Voice note caption")
![](https://telegram.org/example/animation.gif "Animation caption")
\`\`\`

![](https://telegram.org/example/photo.jpg "Photo caption")
![](https://telegram.org/example/video.mp4 "Video caption")
![](https://telegram.org/example/audio.mp3 "Audio caption")
![](https://telegram.org/example/audio.ogg "Voice note caption")
![](https://telegram.org/example/animation.gif "Animation caption")

---

## اسلایدشو (ترکیبی)

\`\`\`
<tg-slideshow>
<img src="https://telegram.org/example/photo.jpg"/>
<img src="https://telegram.org/example/animation.gif"/>
<video src="https://telegram.org/example/video.mp4"/><figcaption>Slideshow caption<cite>The Author</cite></figcaption>
</tg-slideshow>
\`\`\`

<tg-slideshow>
<img src="https://telegram.org/example/photo.jpg"/>
<img src="https://telegram.org/example/animation.gif"/>
<video src="https://telegram.org/example/video.mp4"/><figcaption>Slideshow caption<cite>The Author</cite></figcaption>
</tg-slideshow>

---

*پسوند URL = نوع مدیا: jpg/png=عکس · mp4=ویدیو · mp3=صوت · ogg=ویس · gif=انیمیشن* ✨`,

  en: `# 🖼 Media Guide

Use Markdown image syntax to embed media in Rich Messages.
The URL file extension determines the media type rendered.

[Rich Markdown Telegram](https://core.telegram.org/bots/api#rich-message-formatting-options)

---

## Map

\`\`\`
<tg-map lat="41.9" long="12.5" zoom="14"/>
\`\`\`

<tg-map lat="41.9" long="12.5" zoom="14"/>

---

## Photo

\`\`\`
![](https://telegram.org/example/photo.jpg)
\`\`\`

![](https://telegram.org/example/photo.jpg)

---

## Video

\`\`\`
![](https://telegram.org/example/video.mp4)
\`\`\`

![](https://telegram.org/example/video.mp4)

---

## Audio

\`\`\`
![](https://telegram.org/example/audio.mp3)
\`\`\`

![](https://telegram.org/example/audio.mp3)

---

## Voice Note (ogg)

\`\`\`
![](https://telegram.org/example/audio.ogg)
\`\`\`

![](https://telegram.org/example/audio.ogg)

---

## Animation (gif)

\`\`\`
![](https://telegram.org/example/animation.gif)
\`\`\`

![](https://telegram.org/example/animation.gif)

---

## Media with Captions

\`\`\`
![](https://telegram.org/example/photo.jpg "Photo caption")
![](https://telegram.org/example/video.mp4 "Video caption")
![](https://telegram.org/example/audio.mp3 "Audio caption")
![](https://telegram.org/example/audio.ogg "Voice note caption")
![](https://telegram.org/example/animation.gif "Animation caption")
\`\`\`

![](https://telegram.org/example/photo.jpg "Photo caption")
![](https://telegram.org/example/video.mp4 "Video caption")
![](https://telegram.org/example/audio.mp3 "Audio caption")
![](https://telegram.org/example/audio.ogg "Voice note caption")
![](https://telegram.org/example/animation.gif "Animation caption")

---

## Slideshow (Combined)

\`\`\`
<tg-slideshow>
<img src="https://telegram.org/example/photo.jpg"/>
<img src="https://telegram.org/example/animation.gif"/>
<video src="https://telegram.org/example/video.mp4"/><figcaption>Slideshow caption<cite>The Author</cite></figcaption>
</tg-slideshow>
\`\`\`

<tg-slideshow>
<img src="https://telegram.org/example/photo.jpg"/>
<img src="https://telegram.org/example/animation.gif"/>
<video src="https://telegram.org/example/video.mp4"/><figcaption>Slideshow caption<cite>The Author</cite></figcaption>
</tg-slideshow>

---

*URL extension = media type: jpg/png=photo · mp4=video · mp3=audio · ogg=voice · gif=animation* ✨`,
};

// ─── Demo ─────────────────────────────────────────────────────────────────────
const DEMO = {
  fa: `# 🎨 دمو کامل — نمونه خروجی

این پیام نمونه خروجی واقعی همه قابلیت‌هاست.

[Rich Markdown Telegram](https://core.telegram.org/bots/api#rich-message-formatting-options)

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

## Media — اسلایدشو ترکیبی

<tg-slideshow>
<img src="https://telegram.org/example/photo.jpg"/>
<img src="https://telegram.org/example/animation.gif"/>
<video src="https://telegram.org/example/video.mp4"/><figcaption>Slideshow caption<cite>The Author</cite></figcaption>
</tg-slideshow>

---

🗽 [GitHub](https://github.com/DarknessShade) •|• 🗽 [Paradise Of Freedom](https://t.me/Paradise_Of_Freedom) •|• 🗽 [ConfigWireguard](https://t.me/ConfigWireguard)`,

  en: `# 🎨 Full Demo — Live Output Sample

This message demonstrates every supported feature rendered live.

[Rich Markdown Telegram](https://core.telegram.org/bots/api#rich-message-formatting-options)

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

## Media — Combined Slideshow

<tg-slideshow>
<img src="https://telegram.org/example/photo.jpg"/>
<img src="https://telegram.org/example/animation.gif"/>
<video src="https://telegram.org/example/video.mp4"/><figcaption>Slideshow caption<cite>The Author</cite></figcaption>
</tg-slideshow>

---

🗽 [GitHub](https://github.com/DarknessShade) •|• 🗽 [Paradise Of Freedom](https://t.me/Paradise_Of_Freedom) •|• 🗽 [ConfigWireguard](https://t.me/ConfigWireguard)`,
};