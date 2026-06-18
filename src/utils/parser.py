def wrap_entity(e_type: str, content: str, url: str = None, user_id: int = None, lang: str = None) -> str:
    if e_type == "bold": return f"**{content}**"
    elif e_type == "italic": return f"*{content}*"
    elif e_type == "underline": return f"<u>{content}</u>"
    elif e_type == "strikethrough": return f"~~{content}~~"
    elif e_type == "spoiler": return f"||{content}||"
    elif e_type == "code": return f"`{content}`"
    elif e_type == "pre": return f"```{lang or ''}\n{content}\n```"
    elif e_type == "text_link": return f"[{content}]({url})"
    elif e_type == "text_mention": return f"[{content}](tg://user?id={user_id})" if user_id else content
    elif e_type in ["blockquote", "expandable_blockquote"]:
        return "\n".join(f">{line}" for line in content.split("\n"))
    return content

def entities_to_markdown(text: str, entities: list) -> str:
    if not entities:
        return text

    items = [{"e": e, "idx": i, "start": e.offset, "end": e.offset + e.length} for i, e in enumerate(entities)]

    def is_top_level(item, pool):
        for other in pool:
            if other["idx"] == item["idx"]: continue
            if other["start"] <= item["start"] and other["end"] >= item["end"] and (other["start"] < item["start"] or other["end"] > item["end"]):
                return False
            if other["start"] == item["start"] and other["end"] == item["end"] and other["idx"] < item["idx"]:
                return False
        return True

    def render(start, end, pool):
        in_range = [it for it in pool if it["start"] >= start and it["end"] <= end]
        top = sorted([it for it in in_range if is_top_level(it, in_range)], key=lambda x: x["start"])

        out = ""
        pos = start
        for item in top:
            out += text[pos:item["start"]]
            inner_pool = [p for p in pool if p["idx"] != item["idx"]]
            inner_content = render(item["start"], item["end"], inner_pool)

            e = item["e"]
            url = e.url if hasattr(e, "url") else None
            user_id = e.user.id if hasattr(e, "user") and e.user else None
            language = e.language if hasattr(e, "language") else None

            out += wrap_entity(e.type, inner_content, url, user_id, language)
            pos = item["end"]
        out += text[pos:end]
        return out

    return render(0, len(text), items)