#!/usr/bin/env python3
"""
Phase 2d: 從 Wikipedia 文章抓 Wikidata QID,然後查 Wikidata 取:
  - P856 公式サイト (official website)
  - P625 座標 (fallback if wiki didn't have)
  - P1329 電話番号
  - P18 画像
  - P571 創立日 (節句日期/event_start)
  - P3417 Quora topic ID -> 知識補助
完全程序化,$0 token

用法:python3 wikidata-enrich.py [prefecture_ja|all]
"""
import urllib.request
import urllib.parse
import json
import time
import sys
import re

UA = "jpluggagego-wikidata/1.0"
MAIN = "public/data/japan_entries.json"

ARG_PREF = sys.argv[1] if len(sys.argv) > 1 else "all"


def http_get_json(url, retries=3):
    for i in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=15) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = (i + 1) * 3
                print(f"   429, wait {wait}s", flush=True)
                time.sleep(wait)
            else:
                return None
        except Exception:
            time.sleep(2)
    return None


def batch_wiki_to_wikidata(titles):
    """
    Get wikidata QID for each Wikipedia title (up to 50/batch).
    """
    if not titles:
        return {}
    url = (
        "https://ja.wikipedia.org/w/api.php"
        "?action=query"
        "&prop=pageprops"
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
    canon_to_qid = {}
    for p in pages.values():
        if int(p.get("pageid", -1)) < 0:
            continue
        qid = p.get("pageprops", {}).get("wikibase_item")
        if qid:
            canon_to_qid[p["title"]] = qid
    result = {}
    for t in titles:
        canon = title_map.get(t, t)
        if canon in canon_to_qid:
            result[t] = canon_to_qid[canon]
    return result


def batch_wikidata_entities(qids):
    """
    Get properties for up to 50 wikidata QIDs.
    Returns: {qid: {P856: url, P625: (lat,lon), P571: yyyy-mm-dd, P1329: phone, ...}}
    """
    if not qids:
        return {}
    url = (
        "https://www.wikidata.org/w/api.php"
        f"?action=wbgetentities"
        f"&ids={'|'.join(qids[:50])}"
        "&props=claims"
        "&format=json"
    )
    d = http_get_json(url)
    if not d:
        return {}
    entities = d.get("entities", {})
    out = {}
    for qid, e in entities.items():
        claims = e.get("claims", {})
        info = {}
        # P856: official website
        if "P856" in claims:
            try:
                info["official"] = claims["P856"][0]["mainsnak"]["datavalue"]["value"]
            except Exception:
                pass
        # P625: coordinates (lat, lon)
        if "P625" in claims:
            try:
                v = claims["P625"][0]["mainsnak"]["datavalue"]["value"]
                info["lat"] = v["latitude"]
                info["lon"] = v["longitude"]
            except Exception:
                pass
        # P571: inception (year/date)
        if "P571" in claims:
            try:
                info["inception"] = claims["P571"][0]["mainsnak"]["datavalue"]["value"]["time"]
            except Exception:
                pass
        # P1329: phone number
        if "P1329" in claims:
            try:
                info["phone"] = claims["P1329"][0]["mainsnak"]["datavalue"]["value"]
            except Exception:
                pass
        # P18: image filename
        if "P18" in claims:
            try:
                fname = claims["P18"][0]["mainsnak"]["datavalue"]["value"]
                info["image"] = f"https://commons.wikimedia.org/wiki/File:{urllib.parse.quote(fname)}"
            except Exception:
                pass
        # P973: described at URL (additional)
        if "P973" in claims:
            try:
                info["described_at"] = claims["P973"][0]["mainsnak"]["datavalue"]["value"]
            except Exception:
                pass
        # P3782: official Twitter/X
        if "P2002" in claims:
            try:
                handle = claims["P2002"][0]["mainsnak"]["datavalue"]["value"]
                info["twitter"] = f"https://twitter.com/{handle}"
            except Exception:
                pass
        # P2003: Instagram
        if "P2003" in claims:
            try:
                handle = claims["P2003"][0]["mainsnak"]["datavalue"]["value"]
                info["instagram"] = f"https://instagram.com/{handle}"
            except Exception:
                pass
        out[qid] = info
    return out


def main():
    data = json.load(open(MAIN))
    print(f"Total entries: {len(data)}", flush=True)

    if ARG_PREF != "all":
        targets = [r for r in data if r["prefecture_ja"] == ARG_PREF]
    else:
        targets = data

    # Only process rows with wikipedia URL but no official
    queue = [
        r for r in targets
        if r.get("external_urls", {}).get("wikipedia_ja")
        and not r.get("external_urls", {}).get("official")
    ]
    print(f"Queue (has wiki, no official): {len(queue)}", flush=True)

    # Step 1: extract wiki titles from URLs
    title_for_row = {}
    for r in queue:
        url = r["external_urls"]["wikipedia_ja"]
        # https://ja.wikipedia.org/wiki/<urlencoded_title>
        m = re.search(r"/wiki/(.+?)(?:\?|$|#)", url)
        if m:
            title = urllib.parse.unquote(m.group(1))
            title_for_row[id(r)] = title

    titles = list(set(title_for_row.values()))
    print(f"Unique wiki titles: {len(titles)}", flush=True)

    # Step 2: batch-fetch QIDs (50 at a time)
    title_to_qid = {}
    for i in range(0, len(titles), 50):
        batch = titles[i:i + 50]
        result = batch_wiki_to_wikidata(batch)
        title_to_qid.update(result)
        if i % 200 == 0:
            print(f"  [QID] {i + len(batch)}/{len(titles)}", flush=True)
        time.sleep(1.2)
    print(f"Got QIDs for {len(title_to_qid)}/{len(titles)} titles", flush=True)

    # Step 3: batch-fetch wikidata entities (50 at a time)
    qids = list(set(title_to_qid.values()))
    qid_to_info = {}
    for i in range(0, len(qids), 50):
        batch = qids[i:i + 50]
        result = batch_wikidata_entities(batch)
        qid_to_info.update(result)
        if i % 200 == 0:
            print(f"  [entity] {i + len(batch)}/{len(qids)}", flush=True)
        time.sleep(1.2)

    # Step 4: write back to rows
    updated = 0
    stats = {"official": 0, "coord": 0, "inception": 0, "image": 0, "twitter": 0, "instagram": 0, "phone": 0}
    for r in queue:
        title = title_for_row.get(id(r))
        if not title:
            continue
        qid = title_to_qid.get(title)
        if not qid:
            continue
        info = qid_to_info.get(qid, {})
        if not info:
            continue
        urls = r["external_urls"]
        changed = False
        if "official" in info and "official" not in urls:
            urls["official"] = info["official"]
            stats["official"] += 1
            changed = True
        if "image" in info and "image" not in urls:
            urls["image"] = info["image"]
            stats["image"] += 1
            changed = True
        if "twitter" in info and "twitter" not in urls:
            urls["twitter"] = info["twitter"]
            stats["twitter"] += 1
            changed = True
        if "instagram" in info and "instagram" not in urls:
            urls["instagram"] = info["instagram"]
            stats["instagram"] += 1
            changed = True
        if "described_at" in info and "described_at" not in urls:
            urls["described_at"] = info["described_at"]
            changed = True
        # Coord (fallback if missing)
        if "lat" in info and (not r.get("lat") or r["lat"] == 0):
            r["lat"] = info["lat"]
            r["lon"] = info["lon"]
            stats["coord"] += 1
            changed = True
        if "inception" in info and not r.get("inception"):
            r["inception"] = info["inception"]
            stats["inception"] += 1
            changed = True
        if "phone" in info:
            r["phone"] = info["phone"]
            stats["phone"] += 1
            changed = True
        if changed:
            updated += 1

    print(f"\n=== Updated: {updated} rows ===", flush=True)
    print(f"stats: {json.dumps(stats, indent=2)}", flush=True)

    with open(MAIN, "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Saved.", flush=True)


if __name__ == "__main__":
    main()
