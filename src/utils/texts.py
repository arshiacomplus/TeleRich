LANG_SELECT_MESSAGE = "🌐 Please choose your language / زبان خود را انتخاب کنید:"

WELCOME = {
    "fa": r"""# 🤖 Rich Markdown Bot

هر متن **Markdown** یا **HTML** بفرستید، به صورت Rich Message رندر میشه.

[Rich Markdown Telegram](https://core.telegram.org/bots/api#rich-message-formatting-options)

از دکمه‌های زیر برای دیدن راهنما و دمو استفاده کنید 👇""",

    "en": r"""# 🤖 Rich Markdown Bot

Send any **Markdown** or **HTML** text and it will be echoed back as a rendered Rich Message.

[Rich Markdown Telegram](https://core.telegram.org/bots/api#rich-message-formatting-options)

Use the buttons below to explore 👇""",
}

ABOUT = {
    "fa": r"""# ÐΛɌ₭ᑎΞ𐒡𐒡|𓄂𓆃

[ÐΛɌ₭ᑎΞ𐒡𐒡](https://darkness-web.pages.dev/)

---

🗽 [GitHub](https://github.com/DarknessShade)

🗽 [Paradise Of Freedom](https://t.me/Paradise_Of_Freedom)

🗽 [ConfigWireguard](https://t.me/ConfigWireguard)""",

    "en": r"""# ÐΛɌ₭ᑎΞ𐒡𐒡|𓄂𓆃

[ÐΛɌ₭ᑎΞ𐒡𐒡](https://darkness-web.pages.dev/)

---

🗽 [GitHub](https://github.com/DarknessShade)

🗽 [Paradise Of Freedom](https://t.me/Paradise_Of_Freedom)

🗽 [ConfigWireguard](https://t.me/ConfigWireguard)""",
}

HELP_MD = {
    "fa": r"""# 📖 راهنمای Markdown

متن Markdown بفرستید، رندر شده برمیگرده.
کادر خاکستری = چیزی که تایپ میکنید ↓ نتیجه بعدشه.

[Rich Markdown Telegram](https://core.telegram.org/bots/api#rich-message-formatting-options)

---

## Text Styles

```
**bold**  *italic*  ~~strike~~  `code`  ==marked==  ||spoiler||
```

**bold** *italic* ~~strike~~ `code` ==marked== ||spoiler||

---

## Headings

```
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

---

## Lists

```
- milk
- eggs
- [ ] todo
- [x] done

1. wake up
2. ship it
```

- milk
- eggs
- [ ] todo
- [x] done

1. wake up
2. ship it

---

## Links & Quotes

```
[Telegram](https://telegram.org)

>To be, or not to be.
```

[Telegram](https://telegram.org)

>To be, or not to be.

---

## Block Quote (چند خط)

```
>Block quotation started
>
>Block quotation continued on the next line
>Block quotation continued on the same line

>The last line of the block quotation
```

>Block quotation started
>
>Block quotation continued on the next line
>Block quotation continued on the same line

>The last line of the block quotation

---

## Unordered List (علامت‌های مختلف)

```
- unordered list item
* unordered list item
+ unordered list item
```

- unordered list item
* unordered list item
+ unordered list item

---

## Divider

```
---
```

---

## Code Blocks

````
```python
print("hello")
```
````

```python
print("hello")
```

---

## Tables

````
| Lang | Speed |
|:-----|------:|
| Rust | fast  |
| Py   | comfy |
````

| Lang | Speed |
|:-----|------:|
| Rust | fast  |
| Py   | comfy |

---

## Math

````
Inline $E = mc^2$ and a block:
$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$
````

Inline $E = mc^2$ and a block:

$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$

---

## Details

````
<details><summary>**کلیک کن**</summary>
محتوای مخفی!
</details>
````

<details><summary>**کلیک کن**</summary>
محتوای مخفی!
</details>

---

*محدودیت: تا 32,768 کاراکتر در هر پیام* ✨""",

    "en": r"""# 📖 Markdown Guide

Send Markdown text and get it echoed back rendered.
Grey box = what you type ↓ result comes right after.

[Rich Markdown Telegram](https://core.telegram.org/bots/api#rich-message-formatting-options)
---

## Text Styles

```
**bold**  *italic*  ~~strike~~  `code`  ==marked==  ||spoiler||
```

**bold** *italic* ~~strike~~ `code` ==marked== ||spoiler||

---

## Headings

```
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

---

## Lists

```
- milk
- eggs
- [ ] todo
- [x] done

1. wake up
2. ship it
```

- milk
- eggs
- [ ] todo
- [x] done

1. wake up
2. ship it

---

## Unordered List (all markers)

```
- unordered list item
* unordered list item
+ unordered list item
```

- unordered list item
* unordered list item
+ unordered list item

---

## Links & Quotes

```
[Telegram](https://telegram.org)

>To be, or not to be.
```

[Telegram](https://telegram.org)

>To be, or not to be.

---

## Block Quote (multi-line)

```
>Block quotation started
>
>Block quotation continued on the next line
>Block quotation continued on the same line

>The last line of the block quotation
```

>Block quotation started
>
>Block quotation continued on the next line
>Block quotation continued on the same line

>The last line of the block quotation

---

## Divider

```
---
```

---

## Code Blocks

````
```python
print("hello")
```
````

```python
print("hello")
```

---

## Tables

```
| Lang | Speed |
|:-----|------:|
| Rust | fast  |
| Py   | comfy |
```

| Lang | Speed |
|:-----|------:|
| Rust | fast  |
| Py   | comfy |

---

## Math

```
Inline $E = mc^2$ and a block:
$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$
```

Inline $E = mc^2$ and a block:

$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$

---

## Details (Collapsible)

```
<details><summary>**Click me**</summary>
Hidden content!
</details>
```

<details><summary>**Click me**</summary>
Hidden content!
</details>

---

*Limit: up to 32,768 characters per message* ✨""",
}

HELP_HTML = {
    "fa": r"""# 🌐 راهنمای HTML

اگه پیامت با `<\` شروع بشه، بات به عنوان HTML رندر میکنه.

[Rich Markdown Telegram](https://core.telegram.org/bots/api#rich-message-formatting-options)

---

## Text Styles

```
<b>bold</b> <i>italic</i> <u>underline</u>
<s>strike</s> <code>code</code> <mark>marked</mark>
<tg-spoiler>spoiler</tg-spoiler>
<sup>superscript</sup> <sub>subscript</sub>
```

<b>bold</b> <i>italic</i> <u>underline</u> <s>strike</s> <code>code</code> <mark>marked</mark> <tg-spoiler>spoiler</tg-spoiler> <sup>sup</sup> <sub>sub</sub>

---

## Headings

```
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 3</h5>
```

<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 3</h5>

---

## Lists

```
<ul><li>milk</li><li>eggs</li></ul>
<ol><li>wake up</li><li>ship it</li></ol>
<ul>
  <li><input type="checkbox" checked>done</li>
  <li><input type="checkbox">todo</li>
</ul>
```

<ul><li>milk</li><li>eggs</li></ul>
<ol><li>wake up</li><li>ship it</li></ol>
<ul><li><input type="checkbox" checked>done</li><li><input type="checkbox">todo</li></ul>

---

## Links & Quotes

```
<a href="https://telegram.org">Telegram</a>
<blockquote>متن نقل‌قول<cite>نویسنده</cite></blockquote>
<aside>Pull quote<cite>The Author</cite></aside>
```

<a href="https://telegram.org">Telegram</a>
<blockquote>متن نقل‌قول<cite>نویسنده</cite></blockquote>
<aside>Pull quote<cite>The Author</cite></aside>

---

## Superscript & Subscript

```
<sub>subscript text</sub>
<sup>superscript text</sup>
```

متن نرمال با <sub>subscript text</sub> و <sup>superscript text</sup>

---

## Footnotes

```
Text with a reference[^id1] and another one[^id2].

[^id1]: Definition of the first footnote.
[^id2]: Definition of the second footnote.
```

Text with a reference[^id1] and another one[^id2].

[^id1]: Definition of the first footnote.
[^id2]: Definition of the second footnote.

---

## Code

```
<pre><code class="language-python">print("hello")</code></pre>
```

<pre><code class="language-python">print("hello")</code></pre>

---

## Table

```
<table>
  <tr><th>Lang</th><th>Speed</th></tr>
  <tr><td>Rust</td><td>fast</td></tr>
  <tr><td>Py</td><td>comfy</td></tr>
</table>
```

<table><tr><th>Lang</th><th>Speed</th></tr><tr><td>Rust</td><td>fast</td></tr><tr><td>Py</td><td>comfy</td></tr></table>

---

## Math

```
<tg-math>x^2 + y^2</tg-math>
<tg-math-block>E = mc^2</tg-math-block>
```

<tg-math>x^2 + y^2</tg-math>

<tg-math-block>E = mc^2</tg-math-block>

---

## Details

```
<details open><summary>عنوان</summary>محتوا</details>
```

<details open><summary>عنوان</summary>محتوا</details>

---

*یه HTML بفرست و ببین چطور رندر میشه* ✨""",

    "en": r"""# 🌐 HTML Guide

If your message starts with `<`, the bot renders it as HTML.

[Rich Markdown Telegram](https://core.telegram.org/bots/api#rich-message-formatting-options)

---

## Text Styles

```
<b>bold</b> <i>italic</i> <u>underline</u>
<s>strike</s> <code>code</code> <mark>marked</mark>
<tg-spoiler>spoiler</tg-spoiler>
<sup>superscript</sup> <sub>subscript</sub>
```

<b>bold</b> <i>italic</i> <u>underline</u> <s>strike</s> <code>code</code> <mark>marked</mark> <tg-spoiler>spoiler</tg-spoiler> <sup>sup</sup> <sub>sub</sub>

---

## Headings

```
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 3</h5>
```

<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 3</h5>

---

## Lists

```
<ul><li>milk</li><li>eggs</li></ul>
<ol><li>wake up</li><li>ship it</li></ol>
<ul>
  <li><input type="checkbox" checked>done</li>
  <li><input type="checkbox">todo</li>
</ul>
```

<ul><li>milk</li><li>eggs</li></ul>
<ol><li>wake up</li><li>ship it</li></ol>
<ul><li><input type="checkbox" checked>done</li><li><input type="checkbox">todo</li></ul>

---

## Links & Quotes

```
<a href="https://telegram.org">Telegram</a>
<blockquote>Quote text<cite>Author</cite></blockquote>
<aside>Pull quote<cite>The Author</cite></aside>
```

<a href="https://telegram.org">Telegram</a>
<blockquote>Quote text<cite>Author</cite></blockquote>
<aside>Pull quote<cite>The Author</cite></aside>

---

## Superscript & Subscript

```
<sub>subscript text</sub>
<sup>superscript text</sup>
```

Normal text with <sub>subscript text</sub> and <sup>superscript text</sup>

---

## Footnotes

```
Text with a reference[^id1] and another one[^id2].

[^id1]: Definition of the first footnote.
[^id2]: Definition of the second footnote.
```

Text with a reference[^id1] and another one[^id2].

[^id1]: Definition of the first footnote.
[^id2]: Definition of the second footnote.

---

## Code

```
<pre><code class="language-python">print("hello")</code></pre>
```

<pre><code class="language-python">print("hello")</code></pre>

---

## Table

```
<table>
  <tr><th>Lang</th><th>Speed</th></tr>
  <tr><td>Rust</td><td>fast</td></tr>
  <tr><td>Py</td><td>comfy</td></tr>
</table>
```

<table><tr><th>Lang</th><th>Speed</th></tr><tr><td>Rust</td><td>fast</td></tr><tr><td>Py</td><td>comfy</td></tr></table>

---

## Math

```
<tg-math>x^2 + y^2</tg-math>
<tg-math-block>E = mc^2</tg-math-block>
```

<tg-math>x^2 + y^2</tg-math>

<tg-math-block>E = mc^2</tg-math-block>

---

## Details (Collapsible)

```
<details open><summary>Title</summary>Content here</details>
```

<details open><summary>Title</summary>Content here</details>

---

*Send some HTML and watch it render* ✨""",
}

HELP_MEDIA = {
    "fa": r"""# 🖼 راهنمای مدیا

برای ارسال مدیا در Rich Message از سینتکس تصویر Markdown استفاده کنید.
URL پسوند فایل تعیین می‌کنه چه نوع مدیایی نمایش داده بشه.

[Rich Markdown Telegram](https://core.telegram.org/bots/api#rich-message-formatting-options)

---

## نقشه

```
<tg-map lat="41.9" long="12.5" zoom="14"/>
```

<tg-map lat="41.9" long="12.5" zoom="14"/>

---

## عکس

```
![](https://telegram.org/example/photo.jpg)
```

![](https://telegram.org/example/photo.jpg)

---

## ویدیو

```
![](https://telegram.org/example/video.mp4)
```

![](https://telegram.org/example/video.mp4)

---

## فایل صوتی

```
![](https://telegram.org/example/audio.mp3)
```

![](https://telegram.org/example/audio.mp3)

---

## ویس نوت (ogg)

```
![](https://telegram.org/example/audio.ogg)
```

![](https://telegram.org/example/audio.ogg)

---

## انیمیشن (gif)

```
![](https://telegram.org/example/animation.gif)
```

![](https://telegram.org/example/animation.gif)

---

## مدیا با کپشن

```
![](https://telegram.org/example/photo.jpg "Photo caption")
![](https://telegram.org/example/video.mp4 "Video caption")
![](https://telegram.org/example/audio.mp3 "Audio caption")
![](https://telegram.org/example/audio.ogg "Voice note caption")
![](https://telegram.org/example/animation.gif "Animation caption")
```

![](https://telegram.org/example/photo.jpg "Photo caption")
![](https://telegram.org/example/video.mp4 "Video caption")
![](https://telegram.org/example/audio.mp3 "Audio caption")
![](https://telegram.org/example/audio.ogg "Voice note caption")
![](https://telegram.org/example/animation.gif "Animation caption")

---

## اسلایدشو (ترکیبی)

```
<tg-slideshow>
<img src="https://telegram.org/example/photo.jpg"/>
<img src="https://telegram.org/example/animation.gif"/>
<video src="https://telegram.org/example/video.mp4"/><figcaption>Slideshow caption<cite>The Author</cite></figcaption>
</tg-slideshow>
```

<tg-slideshow>
<img src="https://telegram.org/example/photo.jpg"/>
<img src="https://telegram.org/example/animation.gif"/>
<video src="https://telegram.org/example/video.mp4"/><figcaption>Slideshow caption<cite>The Author</cite></figcaption>
</tg-slideshow>

---

*پسوند URL = نوع مدیا: jpg/png=عکس · mp4=ویدیو · mp3=صوت · ogg=ویس · gif=انیمیشن* ✨""",

    "en": r"""# 🖼 Media Guide

Use Markdown image syntax to embed media in Rich Messages.
The URL file extension determines the media type rendered.

[Rich Markdown Telegram](https://core.telegram.org/bots/api#rich-message-formatting-options)

---

## Map

```
<tg-map lat="41.9" long="12.5" zoom="14"/>
```

<tg-map lat="41.9" long="12.5" zoom="14"/>

---

## Photo

```
![](https://telegram.org/example/photo.jpg)
```

![](https://telegram.org/example/photo.jpg)

---

## Video

```
![](https://telegram.org/example/video.mp4)
```

![](https://telegram.org/example/video.mp4)

---

## Audio

```
![](https://telegram.org/example/audio.mp3)
```

![](https://telegram.org/example/audio.mp3)

---

## Voice Note (ogg)

```
![](https://telegram.org/example/audio.ogg)
```

![](https://telegram.org/example/audio.ogg)

---

## Animation (gif)

```
![](https://telegram.org/example/animation.gif)
```

![](https://telegram.org/example/animation.gif)

---

## Media with Captions

```
![](https://telegram.org/example/photo.jpg "Photo caption")
![](https://telegram.org/example/video.mp4 "Video caption")
![](https://telegram.org/example/audio.mp3 "Audio caption")
![](https://telegram.org/example/audio.ogg "Voice note caption")
![](https://telegram.org/example/animation.gif "Animation caption")
```

![](https://telegram.org/example/photo.jpg "Photo caption")
![](https://telegram.org/example/video.mp4 "Video caption")
![](https://telegram.org/example/audio.mp3 "Audio caption")
![](https://telegram.org/example/audio.ogg "Voice note caption")
![](https://telegram.org/example/animation.gif "Animation caption")

---

## Slideshow (Combined)

```
<tg-slideshow>
<img src="https://telegram.org/example/photo.jpg"/>
<img src="https://telegram.org/example/animation.gif"/>
<video src="https://telegram.org/example/video.mp4"/><figcaption>Slideshow caption<cite>The Author</cite></figcaption>
</tg-slideshow>
```

<tg-slideshow>
<img src="https://telegram.org/example/photo.jpg"/>
<img src="https://telegram.org/example/animation.gif"/>
<video src="https://telegram.org/example/video.mp4"/><figcaption>Slideshow caption<cite>The Author</cite></figcaption>
</tg-slideshow>

---

*URL extension = media type: jpg/png=photo · mp4=video · mp3=audio · ogg=voice · gif=animation* ✨""",
}

DEMO = {
    "fa": r"""# 🎨 دمو کامل — نمونه خروجی

این پیام نمونه خروجی واقعی همه قابلیت‌هاست.

[Rich Markdown Telegram](https://core.telegram.org/bots/api#rich-message-formatting-options)

---

## Text Styles

**bold** *italic* ~~strike~~ `code` ==marked== ||spoiler||
<u>underline</u> <sup>super</sup> <sub>sub</sub>

---

## Nested Formatting

**Bold _italic <u>underlined italic bold</u> italic_ bold**

>نقل‌قول با **bold**، ~~strikethrough~~، و ||spoiler||، و [لینک](https://t.me/).

---

## Lists

- آیتم با `inline code` و **bold**
- آیتم با ~~strikethrough~~ و ==highlight==
- [ ] کار انجام نشده
- [x] کار انجام شده

1. اول
2. دوم
3. سوم

---

## Code Block

```python
def greet(name: str) -> str:
    return f"سلام، {name}!"

print(greet("تلگرام"))
```

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

$$\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$

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

```js
console.log("inside details!");
```

</details>

---

## Media — اسلایدشو ترکیبی

<tg-slideshow>
<img src="https://telegram.org/example/photo.jpg"/>
<img src="https://telegram.org/example/animation.gif"/>
<video src="https://telegram.org/example/video.mp4"/><figcaption>Slideshow caption<cite>The Author</cite></figcaption>
</tg-slideshow>

---

🗽 [GitHub](https://github.com/DarknessShade) •|• 🗽 [Paradise Of Freedom](https://t.me/Paradise_Of_Freedom) •|• 🗽 [ConfigWireguard](https://t.me/ConfigWireguard)""",

    "en": r"""# 🎨 Full Demo — Live Output Sample

This message demonstrates every supported feature rendered live.

[Rich Markdown Telegram](https://core.telegram.org/bots/api#rich-message-formatting-options)

---

## Text Styles

**bold** *italic* ~~strike~~ `code` ==marked== ||spoiler||
<u>underline</u> <sup>super</sup> <sub>sub</sub>

---

## Nested Formatting

**Bold _italic <u>underlined italic bold</u> italic_ bold**

>Quote with **bold**, ~~strikethrough**, and ||spoiler||, plus [a link](https://t.me/).

---

## Lists

- Item with `inline code` and **bold**
- Item with ~~strikethrough~~ and ==highlight==
- [ ] Task todo
- [x] Task done

1. First
2. Second
3. Third

---

## Code Block

```python
def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("Telegram"))
```

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

$$\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$

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

```js
console.log("inside details!");
```

</details>

---

## Media — Combined Slideshow

<tg-slideshow>
<img src="https://telegram.org/example/photo.jpg"/>
<img src="https://telegram.org/example/animation.gif"/>
<video src="https://telegram.org/example/video.mp4"/><figcaption>Slideshow caption<cite>The Author</cite></figcaption>
</tg-slideshow>

---

🗽 [GitHub](https://github.com/DarknessShade) •|• 🗽 [Paradise Of Freedom](https://t.me/Paradise_Of_Freedom) •|• 🗽 [ConfigWireguard](https://t.me/ConfigWireguard)""",
}