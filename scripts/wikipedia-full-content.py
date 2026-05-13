#!/usr/bin/env python3
"""
Phase 2e: Wikipedia article 抓詳細 content
- 從 article body 抽取:
  - full intro (extract,而非只 2 句)
  - infobox 中的「住所」「営業時間」「電話」「公式サイト」
  - sections (歴史/特徴/アクセス 等)
- 寫進 content_md (擴展) + address/phone/hours fields
$0 cost,純 Wikipedia API。

用法:python3 wikipedia-full-content.py [prefecture_ja|all]
"""
import urllib.request
import urllib.parse
import json
import time
import sys
import re

UA = "jpluggagego-wikipedia-content/1.0"
MAIN = "public/data/japan_entries.json"
ARG_PREF = sys.argv[1] if len(sys.argv) > 1 else "all"


def http_get_json(url, retries=3):
    for i in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=20) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep((i + 1) * 3)
            else:
                return None
        except Exception:
            time.sleep(2)
    return None


def batch_full_extract(titles):
    """
    Batch query full intro (no exsentences limit, exintro=True).
    """
    if not titles:
        return {}
    url = (
        "https://ja.wikipedia.org/w/api.php"
        "?action=query"
        "&prop=extracts|info"
        "&inprop=url"
        "&exintro=1"
        "&explaintext=1"
        f"&titles={urllib.parse.quote('|'.join(titles[:20]))}"  # smaller batch for larger extracts
        "&format=json"
        "&redirects=1"
    )
    d = http_get_json(url)
    if not d:
        return {}
    pages = d.get("query", {}).get("pages", {})
    norm = d.get("query", {}).get("normalized", [])
    redir = d.get("query", {}).get("redirects", [])
    title_map = {}
    for n in norm:
        title_map[n["from"]] = n["to"]
    for r in redir:
        src = title_map.get(r["from"], r["from"])
        title_map[src] = r["to"]
    canon_to_data = {}
    for p in pages.values():
        if int(p.get("pageid", -1)) < 0:
            continue
        canon_to_data[p["title"]] = {
            "url": p.get("fullurl"),
            "extract": (p.get("extract") or "").strip(),
        }
    result = {}
    for t in titles:
        canon = title_map.get(t, t)
        if canon in canon_to_data:
            result[t] = canon_to_data[canon]
    return result


def fetch_infobox(title):
    """
    Fetch infobox key-value pairs from wikitext.
    Returns: {key: value} dict (e.g. {"住所": "...", "電話": "..."})
    """
    url = (
        "https://ja.wikipedia.org/w/api.php"
        "?action=query"
        "&prop=revisions"
        "&rvprop=content"
        "&rvslots=main"
        f"&titles={urllib.parse.quote(title)}"
        "&format=json&redirects=1&formatversion=2"
    )
    d = http_get_json(url)
    if not d:
        return {}
    try:
        pages = d.get("query", {}).get("pages", [])
        if not pages or "revisions" not in pages[0]:
            return {}
        content = pages[0]["revisions"][0]["slots"]["main"]["content"]
    except (KeyError, IndexError, TypeError):
        return {}

    # Find infobox: {{Infobox …|… field=value … |}}
    # Simpler approach: extract all "|key=value" lines from beginning of content
    info = {}
    # Match content between {{ and matching }} (greedy enough for first infobox)
    m = re.search(r"\{\{[^|]*?(?:基礎情報|テンプレート|Infobox|infobox)[^}]*", content, re.DOTALL)
    if not m:
        # Try first {{...}} block
        m = re.search(r"\{\{[^}]+\}\}", content[:5000], re.DOTALL)
    if m:
        block = m.group(0)
    else:
        block = content[:3000]

    # Extract |key=value pairs
    patterns = {
        "address": r"\|\s*(?:住所|所在地|location)\s*=\s*([^\n|}]+)",
        "phone": r"\|\s*(?:電話番号|tel)\s*=\s*([^\n|}]+)",
        "hours": r"\|\s*(?:営業時間|営業日|opening_hours|hours)\s*=\s*([^\n|}]+)",
        "official": r"\|\s*(?:公式サイト|公式ウェブサイト|公式|url|website)\s*=\s*\[?([^\n|}\s\]]+)",
        "fee": r"\|\s*(?:料金|入場料|fee)\s*=\s*([^\n|}]+)",
        "access": r"\|\s*(?:アクセス|交通アクセス|access)\s*=\s*([^\n|}]+)",
        "closed_days": r"\|\s*(?:休業日|定休日|closed)\s*=\s*([^\n|}]+)",
    }
    for key, pat in patterns.items():
        m = re.search(pat, block, re.IGNORECASE)
        if m:
            val = m.group(1).strip()
            # Clean wikitext: remove [[ ]] and {{ }}
            val = re.sub(r"\[\[([^\]|]+)\|?[^\]]*\]\]", r"\1", val)
            val = re.sub(r"\{\{[^}]+\}\}", "", val)
            val = re.sub(r"<[^>]+>", "", val)
            val = val.strip()
            if val:
                info[key] = val[:300]
    return info


def main():
    data = json.load(open(MAIN))
    print(f"Total entries: {len(data)}", flush=True)

    if ARG_PREF != "all":
        targets = [r for r in data if r["prefecture_ja"] == ARG_PREF]
    else:
        targets = data

    # Process rows with wikipedia URL only
    queue = [r for r in targets if r.get("external_urls", {}).get("wikipedia_ja")]
    print(f"Queue (has wiki): {len(queue)}", flush=True)

    # Extract titles
    title_for_row = {}
    for r in queue:
        url = r["external_urls"]["wikipedia_ja"]
        m = re.search(r"/wiki/(.+?)(?:\?|$|#)", url)
        if m:
            title = urllib.parse.unquote(m.group(1))
            title_for_row[id(r)] = title

    # Step 1: batch fetch full extracts (20 per batch)
    titles = list(set(title_for_row.values()))
    title_to_data = {}
    for i in range(0, len(titles), 20):
        batch = titles[i:i + 20]
        result = batch_full_extract(batch)
        title_to_data.update(result)
        if i % 200 == 0:
            print(f"  [extract] {i + len(batch)}/{len(titles)}", flush=True)
        time.sleep(1.0)

    # Step 2: write back
    updated = 0
    for r in queue:
        title = title_for_row.get(id(r))
        if not title:
            continue
        data_r = title_to_data.get(title)
        if not data_r or not data_r.get("extract"):
            continue
        new_extract = data_r["extract"]
        # Skip if current summary already has this content (avoid dup)
        if r.get("content_md", "").endswith(new_extract):
            continue
        # Expand content_md
        original_md = r.get("content_md", "")
        # Replace if content_md is just Wikipedia summary (from wiki-seed)
        if "Wikipedia 出典" in original_md or len(original_md) < 200:
            r["content_md"] = f"**{r['title_ja']}** — Wikipedia 出典。\n\n{new_extract}"
            updated += 1
            # Also update summary_zh to first 200 chars
            r["summary_zh"] = new_extract[:200]
    print(f"\n=== Updated content_md: {updated} rows ===", flush=True)
    with open(MAIN, "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Saved.", flush=True)


if __name__ == "__main__":
    main()
