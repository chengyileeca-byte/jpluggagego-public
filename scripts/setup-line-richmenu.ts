// Set up (or refresh) the LINE Bot rich menu.
//
// What it does:
//   1. Renders a 2500×1686 PNG with four quadrants (試算 / 櫃台 / 網站 / 說明).
//   2. Deletes all existing rich menus on the account.
//   3. Creates the new rich menu definition.
//   4. Uploads the PNG as its image.
//   5. Sets it as the default menu for all users.
//
// Flags:
//   --dry-run        render the image to /tmp/jpluggagego-richmenu.png and exit
//   --no-cleanup     keep existing rich menus (don't delete)
//
// Usage:
//   npm run setup:line-richmenu:dry    # preview PNG only
//   npm run setup:line-richmenu        # push to LINE

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
if (!TOKEN) {
  console.error("LINE_CHANNEL_ACCESS_TOKEN not set in .env.local");
  process.exit(1);
}

const API = "https://api.line.me/v2/bot";
const DATA_API = "https://api-data.line.me/v2/bot";
const auth = { Authorization: `Bearer ${TOKEN}` };

const DRY = process.argv.includes("--dry-run");
const NO_CLEANUP = process.argv.includes("--no-cleanup");

const WIDTH = 2500;
const HEIGHT = 1686;
const HW = WIDTH / 2;
const HH = HEIGHT / 2;

// ---- image ----

function cellSvg(
  x: number,
  y: number,
  bg: string,
  icon: string,
  iconColor: string,
  title: string,
  sub1: string,
  sub2: string,
): string {
  const cx = x + HW / 2;
  return `
    <rect x="${x}" y="${y}" width="${HW}" height="${HH}" fill="${bg}"/>
    <text x="${cx}" y="${y + 310}" text-anchor="middle" font-family="Noto Sans CJK JP, sans-serif" font-size="200" font-weight="700" fill="${iconColor}">${icon}</text>
    <text x="${cx}" y="${y + 500}" text-anchor="middle" font-family="Noto Sans CJK JP, sans-serif" font-size="130" font-weight="700" fill="#111111">${title}</text>
    <text x="${cx}" y="${y + 610}" text-anchor="middle" font-family="Noto Sans CJK JP, sans-serif" font-size="60" font-weight="400" fill="#555555">${sub1}</text>
    <text x="${cx}" y="${y + 710}" text-anchor="middle" font-family="Noto Sans CJK JP, sans-serif" font-size="54" font-weight="400" fill="#888888">${sub2}</text>
  `;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  ${cellSvg(0, 0, "#dbeafe", "¥", "#1e3a8a", "試算比價", "機場 → 飯店料金", "範例：NRT 東京都 160")}
  ${cellSvg(HW, 0, "#fef3c7", "✈", "#92400e", "空港櫃台", "Yamato 發送地點", "範例：櫃台 NRT")}
  ${cellSvg(0, HH, "#d1fae5", "🌐", "#065f46", "全部路線", "完整比價頁面", "jpluggagego.com/quote")}
  ${cellSvg(HW, HH, "#f3f4f6", "？", "#3f3f46", "使用說明", "指令格式", "輸入「說明」")}
  <line x1="${HW}" y1="0" x2="${HW}" y2="${HEIGHT}" stroke="#ffffff" stroke-width="10"/>
  <line x1="0" y1="${HH}" x2="${WIDTH}" y2="${HH}" stroke="#ffffff" stroke-width="10"/>
</svg>`;

async function renderPng(): Promise<Buffer> {
  return await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

// ---- rich menu definition ----

const menu = {
  size: { width: WIDTH, height: HEIGHT },
  selected: true,
  name: "JPLuggageGo main",
  chatBarText: "開啟選單",
  areas: [
    {
      bounds: { x: 0, y: 0, width: HW, height: HH },
      action: { type: "message", text: "試算 NRT 東京都 160" },
    },
    {
      bounds: { x: HW, y: 0, width: HW, height: HH },
      action: { type: "message", text: "櫃台 NRT" },
    },
    {
      bounds: { x: 0, y: HH, width: HW, height: HH },
      action: { type: "uri", uri: "https://jpluggagego.com/quote" },
    },
    {
      bounds: { x: HW, y: HH, width: HW, height: HH },
      action: { type: "message", text: "說明" },
    },
  ],
};

// ---- main ----

async function main(): Promise<void> {
  console.log("rendering rich menu PNG (%d×%d)...", WIDTH, HEIGHT);
  const png = await renderPng();
  console.log("  png size:", (png.length / 1024).toFixed(1), "KB");
  if (png.length > 1024 * 1024) {
    throw new Error(`PNG exceeds 1 MB LINE limit (${png.length} bytes)`);
  }

  const outPath = "/tmp/jpluggagego-richmenu.png";
  await writeFile(outPath, png);
  console.log("  wrote preview to", outPath);

  if (DRY) {
    console.log("dry run — not touching LINE API. Open the preview to verify.");
    return;
  }

  if (!NO_CLEANUP) {
    console.log("listing existing rich menus...");
    const listRes = await fetch(`${API}/richmenu/list`, { headers: auth });
    if (!listRes.ok) {
      throw new Error(`list failed: ${listRes.status} ${await listRes.text()}`);
    }
    const { richmenus = [] } = (await listRes.json()) as { richmenus?: Array<{ richMenuId: string; name: string }> };
    for (const m of richmenus) {
      console.log("  deleting", m.richMenuId, `(${m.name})`);
      const delRes = await fetch(`${API}/richmenu/${m.richMenuId}`, { method: "DELETE", headers: auth });
      if (!delRes.ok) {
        console.warn(`  delete failed: ${delRes.status} ${await delRes.text()}`);
      }
    }
  }

  console.log("creating new rich menu...");
  const createRes = await fetch(`${API}/richmenu`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify(menu),
  });
  if (!createRes.ok) {
    throw new Error(`create failed: ${createRes.status} ${await createRes.text()}`);
  }
  const { richMenuId } = (await createRes.json()) as { richMenuId: string };
  console.log("  created", richMenuId);

  console.log("uploading image...");
  const uploadRes = await fetch(`${DATA_API}/richmenu/${richMenuId}/content`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "image/png" },
    body: new Uint8Array(png),
  });
  if (!uploadRes.ok) {
    throw new Error(`upload failed: ${uploadRes.status} ${await uploadRes.text()}`);
  }
  console.log("  uploaded");

  console.log("setting as default for all users...");
  const defaultRes = await fetch(`${API}/user/all/richmenu/${richMenuId}`, {
    method: "POST",
    headers: auth,
  });
  if (!defaultRes.ok) {
    throw new Error(`set default failed: ${defaultRes.status} ${await defaultRes.text()}`);
  }
  console.log("done. menu id:", richMenuId);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
