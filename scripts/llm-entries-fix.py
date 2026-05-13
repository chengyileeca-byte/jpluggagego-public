#!/usr/bin/env python3
"""
Phase 2f: 對 LLM-generated entries (source=manual, no URL) 解析真實名稱
  - title_ja 格式:「諏訪上社本宮+ 古代式内(諏訪市・...派生・参拝無料)」
  - 解析:取 + ( ・ 之前的部分 = 「諏訪上社本宮」
  - 用 normalized name 查 Wikipedia
  - 若找到:寫 wikipedia_ja URL + 真實 coordinates
  - 若沒找到:用 Nominatim 至少修正座標

用法:python3 llm-entries-fix.py
"""
import urllib.request
import urllib.parse
import json
import time
import re

UA = "jpluggagego-llmfix/1.0"
MAIN = "public/data/japan_entries.json"


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


def normalize_title(title):
    """Strip LLM-generated suffix to get real entity name."""
    # 「諏訪上社本宮+ 古代式内(...」→ 「諏訪上社本宮」
    # 「赤福本店+ 1707 創業(...」→ 「赤福本店」
    for sep in ["+", "(", "（", "・"]:
        if sep in title:
            title = title.split(sep)[0]
    return title.strip()


def batch_wiki_lookup(titles):
    """Batch fetch Wikipedia page info (URL + coords)."""
    if not titles:
        return {}
    url = (
        "https://ja.wikipedia.org/w/api.php"
        "?action=query"
        "&prop=info|coordinates|pageprops"
        "&inprop=url"
        "&ppprop=wikibase_item"
        f"&titles={urllib.parse.quote('|'.join(titles[:50]))}"
        "&format=json&redirects=1"
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
        coords = p.get("coordinates")
        coord_pt = coords[0] if isinstance(coords, list) and coords else None
        canon_to_data[p["title"]] = {
            "url": p.get("fullurl"),
            "lat": coord_pt["lat"] if coord_pt else None,
            "lon": coord_pt["lon"] if coord_pt else None,
            "qid": p.get("pageprops", {}).get("wikibase_item"),
        }
    result = {}
    for t in titles:
        canon = title_map.get(t, t)
        if canon in canon_to_data:
            result[t] = canon_to_data[canon]
    return result


def main():
    data = json.load(open(MAIN))
    targets = [
        r for r in data
        if r.get("source") != "wikipedia"
        and not r.get("external_urls")
    ]
    print(f"Target LLM-only entries: {len(targets)}", flush=True)

    # Build normalized titles (parse "+" "(" 等)
    norm_map = {}
    for r in targets:
        original = r["title_ja"]
        normalized = normalize_title(original)
        if normalized and len(normalized) >= 2 and normalized != original:
            r["_norm"] = normalized
        elif normalized:
            r["_norm"] = normalized

    # Get unique normalized titles
    unique = list({r["_norm"] for r in targets if r.get("_norm")})
    print(f"Unique normalized titles: {len(unique)}", flush=True)

    # Batch fetch (50 at a time)
    title_to_data = {}
    for i in range(0, len(unique), 50):
        batch = unique[i:i + 50]
        result = batch_wiki_lookup(batch)
        title_to_data.update(result)
        if i % 500 == 0:
            print(f"  [wiki] {i + len(batch)}/{len(unique)}", flush=True)
        time.sleep(1.2)

    # Write back
    updated = 0
    coord_changed = 0
    for r in targets:
        nm = r.get("_norm")
        if not nm:
            continue
        data_r = title_to_data.get(nm)
        if not data_r or not data_r.get("url"):
            continue
        # Found Wikipedia match
        r["external_urls"] = {"wikipedia_ja": data_r["url"]}
        updated += 1
        # Update coords if Wikipedia has them
        if data_r.get("lat"):
            old_lat = r.get("lat") or 0
            if abs(old_lat - data_r["lat"]) > 0.01:  # > ~1 km
                coord_changed += 1
            r["lat"] = data_r["lat"]
            r["lon"] = data_r["lon"]

    # Clean up _norm
    for r in targets:
        if "_norm" in r:
            del r["_norm"]

    print(f"\n=== Updated: {updated} rows ({coord_changed} with coord fix) ===", flush=True)
    with open(MAIN, "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Saved.", flush=True)


if __name__ == "__main__":
    main()
