#!/usr/bin/env python3
"""
Phase 2h-A: 對 1,625 件無 URL の LLM entries 用 aggressive normalize 重搜。
  - 多版本 title variants(strip 跡/まつり/フェス/料理/湯/温泉/通り 等)
  - 各 variant batch wiki lookup
  - 仍無 match → Nominatim geocode for coord + osm URL
  - 最後寫回 external_urls.wikipedia_ja / .osm + lat/lon
"""
import urllib.request
import urllib.parse
import json
import time
import re

UA = "jpluggagego-phase2h/1.0"
MAIN = "public/data/japan_entries.json"

# strip 後にも別 entry 名と一致しそうな suffix (アグレッシブ trim)
SUFFIXES = [
    "跡", "まつり", "フェス", "フェスティバル", "大会", "祭",
    "料理", "蕎麦", "うどん", "ラーメン",
    "本店", "支店",
    "案内", "ガイド", "利用ガイド", "リムジンバス", "観光",
    "通り", "商店街", "横丁", "アーケード", "本通", "新道",
    "公園", "庭園",
]

# strip 前綴 prefecture/city words
PREFIX_KILLERS = re.compile(r"^(東京都|大阪府|京都府|北海道|.{1,3}県|.{1,4}市|.{1,4}町|.{1,4}村)\s*")


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


def gen_variants(title, pref):
    """各種 normalize variant を生成。"""
    base = title.strip()
    variants = {base}

    # Remove half-width spaces
    variants.add(base.replace(" ", "").replace("　", ""))

    # Strip suffixes (1 つずつ)
    for sfx in SUFFIXES:
        if base.endswith(sfx) and len(base) > len(sfx) + 1:
            variants.add(base[: -len(sfx)].rstrip("　 "))

    # Strip prefix prefecture/city
    pre_stripped = PREFIX_KILLERS.sub("", base).strip()
    if pre_stripped and pre_stripped != base:
        variants.add(pre_stripped)

    # 半角→全角数字 (国道 17 号 → 国道17号)
    table = str.maketrans("0123456789", "0123456789")
    variants.add(base.translate(table).replace(" ", ""))

    # 全角→半角
    rev = str.maketrans("0123456789", "0123456789")
    variants.add(base.translate(rev))

    # Strip 半角 space 全部
    variants.add(re.sub(r"\s+", "", base))

    return [v for v in variants if v and len(v) >= 2]


def batch_wiki_lookup(titles):
    """Wiki batch (50 titles) → {input_title: {url, lat, lon}}"""
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


def nominatim_geocode(title, pref):
    """OSM Nominatim — 1 req/sec hard limit."""
    q = f"{title}, {pref}, Japan"
    url = f"https://nominatim.openstreetmap.org/search?q={urllib.parse.quote(q)}&format=json&limit=1&countrycodes=jp"
    d = http_get_json(url)
    if not d or not isinstance(d, list) or not d:
        return None
    item = d[0]
    lat = float(item["lat"])
    lon = float(item["lon"])
    # Japan bbox sanity
    if not (24 <= lat <= 46 and 122 <= lon <= 146):
        return None
    osm_url = f"https://www.openstreetmap.org/{item['osm_type']}/{item['osm_id']}"
    return {"lat": lat, "lon": lon, "osm": osm_url, "name": item.get("display_name", "")}


def main():
    data = json.load(open(MAIN))
    targets = [r for r in data if not r.get("external_urls")]
    print(f"Phase 2h-A targets: {len(targets)}", flush=True)

    # Step 1: build variants + collect unique titles
    print("\n=== Step 1: collect variants ===", flush=True)
    row_to_variants = {}
    all_variants = set()
    for r in targets:
        vs = gen_variants(r["title_ja"], r["prefecture_ja"])
        row_to_variants[id(r)] = vs
        all_variants.update(vs)
    print(f"  unique variants: {len(all_variants)}", flush=True)

    # Step 2: batch wiki lookup all variants
    print("\n=== Step 2: wiki batch lookup ===", flush=True)
    title_to_data = {}
    titles = list(all_variants)
    for i in range(0, len(titles), 50):
        batch = titles[i : i + 50]
        result = batch_wiki_lookup(batch)
        title_to_data.update(result)
        if i % 500 == 0:
            print(f"  [wiki] {i + len(batch)}/{len(titles)}", flush=True)
        time.sleep(1.0)
    print(f"  wiki hits (variants): {len(title_to_data)}", flush=True)

    # Step 3: pick best variant per row
    print("\n=== Step 3: pick best variant ===", flush=True)
    wiki_matched = 0
    coord_added = 0
    for r in targets:
        vs = row_to_variants.get(id(r), [])
        for v in vs:
            info = title_to_data.get(v)
            if info and info.get("url"):
                r["external_urls"] = {"wikipedia_ja": info["url"]}
                wiki_matched += 1
                if info.get("lat"):
                    r["lat"] = info["lat"]
                    r["lon"] = info["lon"]
                    coord_added += 1
                break

    print(f"  wiki matched: {wiki_matched} / {len(targets)}", flush=True)
    print(f"  coord added: {coord_added}", flush=True)

    # Save intermediate (after wiki step)
    with open(MAIN, "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("  saved (intermediate).", flush=True)

    # Step 4: Nominatim fallback for remaining
    remaining = [r for r in targets if not r.get("external_urls")]
    print(f"\n=== Step 4: Nominatim fallback ({len(remaining)} remaining) ===", flush=True)

    osm_added = 0
    coord_from_osm = 0
    start = time.time()
    for i, r in enumerate(remaining, 1):
        # OSM nominatim with 1 req/sec
        osm = nominatim_geocode(r["title_ja"], r["prefecture_ja"])
        if osm:
            r["external_urls"] = {"osm": osm["osm"]}
            osm_added += 1
            if not r.get("lat") or r["lat"] == 0:
                r["lat"] = osm["lat"]
                r["lon"] = osm["lon"]
                coord_from_osm += 1
        if i % 50 == 0:
            elapsed = time.time() - start
            eta = elapsed / i * (len(remaining) - i)
            print(f"  [osm {i}/{len(remaining)}] hits={osm_added} eta={eta:.0f}s", flush=True)
            with open(MAIN, "w") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        time.sleep(1.1)  # Nominatim 1 req/sec hard limit

    print(f"  osm hits: {osm_added} / {len(remaining)}", flush=True)
    print(f"  coord from osm: {coord_from_osm}", flush=True)

    # Final save
    final_url = sum(1 for r in data if r.get("external_urls"))
    print(f"\n=== Final coverage: {final_url}/{len(data)} ({final_url/len(data)*100:.2f}%) ===", flush=True)
    with open(MAIN, "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Saved.", flush=True)


if __name__ == "__main__":
    main()
