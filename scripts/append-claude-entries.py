#!/usr/bin/env python3
"""
Phase 3 (post-Supabase) — append Claude curated entries 直接到 japan_entries.json。

絕對禁用「程序生成 N 件 stub」pattern (= zombie 來源)。
每件 entry 必須 hand-researched + WebSearch verify + 真 URL。

用法:
  python3 scripts/append-claude-entries.py < entries.json

entries.json 為 JSON list,每件需含 slug/title_ja/title_zh/summary_zh/category/sub_type/
prefecture_ja/municipality_ja/lg_code/lat/lon/external_urls/source='manual' 等欄位。
"""
import json
import os
import sys
import urllib.parse
from datetime import datetime, timezone

MAIN = "public/data/japan_entries.json"
BY_PREF = "public/data/by-pref"


def sync_by_pref(new_rows):
    """Append new rows to by-pref shards (urlencoded prefecture dirs)."""
    by_pref_count = 0
    for r in new_rows:
        pref = r["prefecture_ja"]
        pref_enc = urllib.parse.quote(pref, safe="")
        shard_dir = os.path.join(BY_PREF, pref_enc)
        shard_file = os.path.join(shard_dir, "japan_entries.json")
        if not os.path.exists(shard_file):
            print(f"warn: shard not found for {pref}, skip sync", file=sys.stderr)
            continue
        shard = json.load(open(shard_file))
        shard.append(r)
        with open(shard_file, "w") as f:
            json.dump(shard, f, ensure_ascii=False, indent=2)
        by_pref_count += 1
    if by_pref_count:
        print(f"synced {by_pref_count} rows to by-pref shards", file=sys.stderr)

REQUIRED = [
    "slug", "title_ja", "title_zh", "summary_zh",
    "category", "sub_type", "region", "prefecture_ja",
    "municipality_ja", "lg_code", "lat", "lon",
    "external_urls",
]


def main():
    new_entries = json.load(sys.stdin)
    if not isinstance(new_entries, list):
        print("input must be a JSON list", file=sys.stderr)
        sys.exit(1)

    data = json.load(open(MAIN))
    existing_slugs = {r["slug"] for r in data}
    max_id = max(r.get("id", 0) for r in data)
    now_iso = datetime.now(timezone.utc).isoformat()

    added = 0
    dup = 0
    bad = 0
    appended_rows = []
    for e in new_entries:
        missing = [k for k in REQUIRED if k not in e]
        if missing:
            print(f"skip {e.get('slug','?')}: missing {missing}", file=sys.stderr)
            bad += 1
            continue
        if e["source"] != "manual":
            print(f"skip {e['slug']}: source must be 'manual' (got {e['source']!r})", file=sys.stderr)
            bad += 1
            continue
        if e["slug"] in existing_slugs:
            print(f"skip {e['slug']}: duplicate", file=sys.stderr)
            dup += 1
            continue
        max_id += 1
        # Fill defaults for optional fields
        row = {
            "id": max_id,
            "slug": e["slug"],
            "category": e["category"],
            "sub_type": e["sub_type"],
            "title_zh": e["title_zh"],
            "title_ja": e["title_ja"],
            "romaji": e.get("romaji"),
            "summary_zh": e["summary_zh"],
            "content_md": e.get("content_md"),
            "region": e["region"],
            "prefecture_ja": e["prefecture_ja"],
            "gun_ja": e.get("gun_ja"),
            "municipality_ja": e["municipality_ja"],
            "lg_code": e["lg_code"],
            "area_types": e.get("area_types", []),
            "lat": e["lat"],
            "lon": e["lon"],
            "season_start": e.get("season_start"),
            "season_end": e.get("season_end"),
            "event_start": e.get("event_start"),
            "event_end": e.get("event_end"),
            "price_tier": e.get("price_tier"),
            "booking_window_days": e.get("booking_window_days"),
            "closed_days": e.get("closed_days", []),
            "external_urls": e["external_urls"],
            "tags": e.get("tags", []),
            "source": "manual",
            "feature_rank": e.get("feature_rank", 0),
            "google_place_id": None,
            "business_status": None,
            "business_status_checked_at": None,
            "last_verified_at": now_iso,
            "created_at": now_iso,
            "updated_at": now_iso,
        }
        data.append(row)
        appended_rows.append(row)
        existing_slugs.add(e["slug"])
        added += 1

    with open(MAIN, "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    sync_by_pref(appended_rows)

    total = len(data)
    print(f"added {added} / dup {dup} / bad {bad}", file=sys.stderr)
    print(f"DB total: {total}", file=sys.stderr)


if __name__ == "__main__":
    main()
