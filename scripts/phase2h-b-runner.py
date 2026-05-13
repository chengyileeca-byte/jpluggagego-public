#!/usr/bin/env python3
"""
Phase 2h-B helper for Claude WebSearch loop.

Usage:
  python3 scripts/phase2h-b-runner.py next [N]  → print next N JSON entries needing URL
  python3 scripts/phase2h-b-runner.py save <slug>=<url> [...]  → save URLs
  python3 scripts/phase2h-b-runner.py skip <slug> [...]  → mark slugs as tried-but-no-url
  python3 scripts/phase2h-b-runner.py stats  → print coverage
"""
import json
import sys
import re

MAIN = "public/data/japan_entries.json"
SKIPPED_FILE = "/tmp/phase2h-b-skipped.json"


def load_skipped():
    try:
        return set(json.load(open(SKIPPED_FILE)))
    except Exception:
        return set()


def save_skipped(s):
    json.dump(sorted(s), open(SKIPPED_FILE, "w"))


def cmd_next(n):
    data = json.load(open(MAIN))
    skipped = load_skipped()
    out = []
    for r in data:
        if r.get("external_urls"):
            continue
        if r["slug"] in skipped:
            continue
        out.append({
            "slug": r["slug"],
            "title_ja": r["title_ja"],
            "prefecture_ja": r["prefecture_ja"],
        })
        if len(out) >= n:
            break
    print(json.dumps(out, ensure_ascii=False))


def cmd_save(args):
    """args: ['slug1=url1', 'slug2=url2', ...]"""
    data = json.load(open(MAIN))
    slug_to_url = {}
    for a in args:
        if "=" not in a:
            print(f"skip bad arg: {a}", file=sys.stderr)
            continue
        slug, _, url = a.partition("=")
        slug_to_url[slug.strip()] = url.strip()
    updated = 0
    for r in data:
        if r["slug"] in slug_to_url:
            url = slug_to_url[r["slug"]]
            if url:
                r["external_urls"] = {"web": url}
                updated += 1
    with open(MAIN, "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"saved: {updated} / {len(slug_to_url)}", file=sys.stderr)


def cmd_skip(slugs):
    """Mark slugs as tried-but-no-url. They won't appear in 'next' anymore."""
    skipped = load_skipped()
    for s in slugs:
        skipped.add(s.strip())
    save_skipped(skipped)
    print(f"skipped: +{len(slugs)} (total {len(skipped)})", file=sys.stderr)


def cmd_stats():
    data = json.load(open(MAIN))
    skipped = load_skipped()
    total = len(data)
    has_url = sum(1 for r in data if r.get("external_urls"))
    no_url = [r for r in data if not r.get("external_urls")]
    pending = [r for r in no_url if r["slug"] not in skipped]
    print(f"total: {total}")
    print(f"has URL: {has_url} ({has_url/total*100:.2f}%)")
    print(f"no URL: {len(no_url)}")
    print(f"  skipped (tried, no result): {len(no_url) - len(pending)}")
    print(f"  pending: {len(pending)}")


def main():
    if len(sys.argv) < 2:
        print("usage: next [N] | save slug=url [...] | skip slug [...] | stats", file=sys.stderr)
        sys.exit(1)
    cmd = sys.argv[1]
    if cmd == "next":
        n = int(sys.argv[2]) if len(sys.argv) > 2 else 5
        cmd_next(n)
    elif cmd == "save":
        cmd_save(sys.argv[2:])
    elif cmd == "skip":
        cmd_skip(sys.argv[2:])
    elif cmd == "stats":
        cmd_stats()
    else:
        print(f"unknown: {cmd}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
