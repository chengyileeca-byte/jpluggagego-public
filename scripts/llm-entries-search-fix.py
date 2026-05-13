#!/usr/bin/env python3
"""
Phase 2g v2: 2-stage approach
  Stage 1: Wikipedia search → collect (entry_id, top_title) pairs (4879 calls)
  Stage 2: Batch fetch info+coords for unique titles (50/batch)
  Total: ~83 minutes instead of 10 hours
"""
import urllib.request
import urllib.parse
import json
import time
import re

UA = "jpluggagego-llmsearchfix/2.0"
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
    for sep in ["+", "(", "（", "・"]:
        if sep in title:
            title = title.split(sep)[0]
    return title.strip()


def wiki_search_top(query, prefecture):
    """Return only top title of search, no info call."""
    url = (
        "https://ja.wikipedia.org/w/api.php"
        "?action=query"
        "&list=search"
        f"&srsearch={urllib.parse.quote(query)}+{urllib.parse.quote(prefecture)}"
        "&srlimit=1"
        "&format=json"
    )
    d = http_get_json(url)
    if not d:
        return None
    results = d.get("query", {}).get("search", [])
    if not results:
        return None
    return results[0]["title"]


def batch_fetch_info(titles):
    """Batch fetch info+coords for up to 50 titles."""
    if not titles:
        return {}
    url = (
        "https://ja.wikipedia.org/w/api.php"
        "?action=query"
        "&prop=info|coordinates"
        "&inprop=url"
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
    print(f"Targets: {len(targets)}", flush=True)

    # Resume from stage1 checkpoint if exists
    STAGE1_CACHE = "/tmp/phase2g-stage1.json"
    slug_to_top = {}
    try:
        slug_to_top = json.load(open(STAGE1_CACHE))
        print(f"Resumed from cache: {len(slug_to_top)} hits", flush=True)
    except Exception:
        pass

    # Stage 1: search → collect top titles (with checkpoint)
    print("\n=== Stage 1: search ===", flush=True)
    entry_to_top = {}
    # First load existing matches
    for r in targets:
        if r["slug"] in slug_to_top:
            entry_to_top[id(r)] = slug_to_top[r["slug"]]

    start = time.time()
    skipped = 0
    new_hits = 0
    pending_done = set(slug_to_top.keys())
    for i, r in enumerate(targets, 1):
        if r["slug"] in pending_done:
            continue
        normalized = normalize_title(r["title_ja"])
        if not normalized or len(normalized) < 2:
            skipped += 1
            slug_to_top[r["slug"]] = None  # mark as tried
            continue
        if "補完" in normalized or "総覧" in normalized:
            skipped += 1
            slug_to_top[r["slug"]] = None
            continue
        top = wiki_search_top(normalized, r["prefecture_ja"])
        if top:
            entry_to_top[id(r)] = top
            slug_to_top[r["slug"]] = top
            new_hits += 1
        else:
            slug_to_top[r["slug"]] = None
        if i % 100 == 0:
            elapsed = time.time() - start
            eta = elapsed / max(i, 1) * (len(targets) - i)
            print(f"  [{i}/{len(targets)}] hits={len(entry_to_top)} new={new_hits} skip={skipped} eta={eta:.0f}s", flush=True)
            # Save checkpoint every 100
            with open(STAGE1_CACHE, "w") as f:
                json.dump(slug_to_top, f, ensure_ascii=False)
        time.sleep(1.0)  # 更慢 to avoid throttle

    with open(STAGE1_CACHE, "w") as f:
        json.dump(slug_to_top, f, ensure_ascii=False)
    print(f"\nStage 1 done: {len(entry_to_top)} hits / {len(targets)} targets (new {new_hits})", flush=True)

    # Stage 2: batch fetch info for unique titles
    print("\n=== Stage 2: batch fetch info ===", flush=True)
    unique_titles = list(set(entry_to_top.values()))
    print(f"Unique titles to fetch: {len(unique_titles)}", flush=True)
    title_to_data = {}
    for i in range(0, len(unique_titles), 50):
        batch = unique_titles[i:i + 50]
        data_b = batch_fetch_info(batch)
        title_to_data.update(data_b)
        if i % 500 == 0:
            print(f"  [info] {i + len(batch)}/{len(unique_titles)}", flush=True)
        time.sleep(1.0)

    # Stage 3: write back
    print("\n=== Stage 3: write back ===", flush=True)
    updated = 0
    coord_fixed = 0
    for r in targets:
        top = entry_to_top.get(id(r))
        if not top:
            continue
        info = title_to_data.get(top)
        if not info or not info.get("url"):
            continue
        r["external_urls"] = {"wikipedia_ja": info["url"]}
        updated += 1
        if info.get("lat"):
            old_lat = r.get("lat") or 0
            if abs(old_lat - info["lat"]) > 0.01:
                coord_fixed += 1
            r["lat"] = info["lat"]
            r["lon"] = info["lon"]

    print(f"\n=== Updated: {updated} (coord-fixed: {coord_fixed}) ===", flush=True)
    with open(MAIN, "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Saved.", flush=True)


if __name__ == "__main__":
    main()
