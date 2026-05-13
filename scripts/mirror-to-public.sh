#!/usr/bin/env bash
# 把 private repo 的 code-only 鏡像同步到 sibling 目錄 ../jpluggagego-public,
# 然後 force-push 到 github.com/chengyileeca-byte/jpluggagego-public。
#
# 排除:public/data/、TODO.md、docs/japan-*、docs/roadmap.md、
#       docs/wiki-bulk-cleanup.md、scripts/lodging-rewrite-*.ts
#       (內部策略 + scraped data + 內容 audit script 含 wiki 樣本)。
#
# 用法:
#   bash scripts/mirror-to-public.sh                 # dry-run(只 sync 不 push)
#   bash scripts/mirror-to-public.sh --push          # 真的 force push
#
# 第一次使用前必須:
#   1) gh repo create chengyileeca-byte/jpluggagego-public --public
#   2) cd ../ && git clone https://github.com/chengyileeca-byte/jpluggagego-public.git
#   3) 回 private repo 跑此 script

set -euo pipefail

SRC="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$(cd "$SRC/.." && pwd)/jpluggagego-public"
PUSH=0

for arg in "$@"; do
  case "$arg" in
    --push) PUSH=1 ;;
    *) echo "unknown arg: $arg" >&2; exit 1 ;;
  esac
done

if [[ ! -d "$DEST/.git" ]]; then
  echo "❌ destination $DEST is not a git repo"
  echo "   first run:"
  echo "     gh repo create chengyileeca-byte/jpluggagego-public --public --description '日本宅配比價 OSS mirror'"
  echo "     cd ../ && git clone https://github.com/chengyileeca-byte/jpluggagego-public.git"
  exit 1
fi

echo "▶ sync $SRC → $DEST"

# rsync with explicit excludes. delete = 確保 destination 反映 source 移除。
# 注意:不刪 destination 自己的 .git。
rsync -av --delete \
  --exclude '.git/' \
  --exclude 'node_modules/' \
  --exclude '.next/' \
  --exclude '.vercel/' \
  --exclude 'public/data/' \
  --exclude '.env.local' \
  --exclude '.env.*.local' \
  --exclude 'TODO.md' \
  --exclude 'SUNSET.md' \
  --exclude 'VERIFICATION.md' \
  --exclude 'docs/japan-*.md' \
  --exclude 'docs/roadmap.md' \
  --exclude 'docs/wiki-bulk-cleanup.md' \
  --exclude 'docs/to-taiwan-plan.md' \
  --exclude 'scripts/lodging-rewrite-*.ts' \
  --exclude 'scripts/lodging-title-cleanup-*.ts' \
  --exclude 'scripts/audit-*.ts' \
  --exclude '.claude/' \
  --exclude '*.log' \
  --exclude 'tsconfig.tsbuildinfo' \
  "$SRC/" "$DEST/"

# 確保 destination 有空 public/data 目錄(讓 dev 跑 scrapers 後有地方放)
mkdir -p "$DEST/public/data"
touch "$DEST/public/data/.gitkeep"

# .gitignore 補一行 public/data/*(防止使用者誤 commit)
if ! grep -q '^public/data/\*$' "$DEST/.gitignore" 2>/dev/null; then
  printf '\n# data files are not redistributed in this public mirror\npublic/data/*\n!public/data/.gitkeep\n' >> "$DEST/.gitignore"
fi

cd "$DEST"

# 確認沒漏排除任何敏感檔案
echo "▶ verify excludes"
LEAKS=$(find . -type f \( \
  -path './public/data/*' -not -name '.gitkeep' -o \
  -name 'TODO.md' -o \
  -name 'SUNSET.md' -o \
  -name 'VERIFICATION.md' -o \
  -path './docs/japan-*.md' -o \
  -path './docs/roadmap.md' -o \
  -path './docs/wiki-bulk-cleanup.md' -o \
  -path './docs/to-taiwan-plan.md' -o \
  -name 'tsconfig.tsbuildinfo' -o \
  -name '.env.local' \
\) 2>/dev/null | grep -v '^./\.git/' || true)
if [[ -n "$LEAKS" ]]; then
  echo "❌ leaked files (should have been excluded):"
  echo "$LEAKS"
  exit 1
fi
echo "✓ no leaked files"

git add -A
if git diff --cached --quiet; then
  echo "✓ nothing changed"
  exit 0
fi

DATE="$(date +%Y-%m-%d)"
git commit -m "sync from upstream private repo ($DATE)"

if [[ $PUSH -eq 1 ]]; then
  echo "▶ force push"
  git push origin main --force
  echo "✓ pushed to chengyileeca-byte/jpluggagego-public"
else
  echo "✓ committed locally (dry-run, no push)"
  echo "  to publish:  bash scripts/mirror-to-public.sh --push"
fi
