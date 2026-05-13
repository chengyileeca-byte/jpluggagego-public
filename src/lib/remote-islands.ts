import "server-only";

/**
 * 離島交期警示資料。Yamato + ゆうパック 兩家官方皆無離島加算,
 * 但交期會因海運/空運轉接而延長。小笠原諸島更是 Yamato 原則
 * 不配送(使用者若堅持用 Yamato 會退單),所以額外標註 refused。
 *
 * 偵測以 display_name / city 字串比對。Nominatim 在日本通常會
 * 在 city 欄位寫市町村(例:「石垣市」「小笠原村」),display_name
 * 裡也會含同名,所以兩欄合併比對穩定性最佳。
 */

export interface RemoteIslandLeg {
  status: "delayed" | "refused";
  note: string;
}

export interface RemoteIslandAdvisory {
  id: "ishigaki" | "miyako" | "ogasawara" | "sado";
  name: string;
  yamato: RemoteIslandLeg;
  yuu: RemoteIslandLeg;
}

const RULES: Array<{
  match: RegExp;
  advisory: RemoteIslandAdvisory;
}> = [
  {
    // 小笠原村(父島・母島)は Yamato 原則不配達。おがさわら丸週 1 便。
    match: /小笠原村/,
    advisory: {
      id: "ogasawara",
      name: "小笠原諸島(父島・母島)",
      yamato: {
        status: "refused",
        note: "Yamato 原則不配送小笠原。請改用ゆうパック,或由本島自行帶上おがさわら丸。",
      },
      yuu: {
        status: "delayed",
        note: "ゆうパック走おがさわら丸(週 1 班),交期約 7~14 天,颱風季可能更久。",
      },
    },
  },
  {
    match: /佐渡市/,
    advisory: {
      id: "sado",
      name: "佐渡島",
      yamato: {
        status: "delayed",
        note: "Yamato 經カーフェリー轉運,交期比新潟本土多約 +1 天。",
      },
      yuu: {
        status: "delayed",
        note: "ゆうパック 同樣走船運,交期約 +1 天。",
      },
    },
  },
  {
    // 宮古島市 + 多良間村(宮古諸島)
    match: /(宮古島市|多良間村)/,
    advisory: {
      id: "miyako",
      name: "宮古諸島",
      yamato: {
        status: "delayed",
        note: "Yamato 空運轉運,交期比沖縄本島多約 +1~2 天。",
      },
      yuu: {
        status: "delayed",
        note: "ゆうパック 空便,交期比沖縄本島多約 +1~2 天。",
      },
    },
  },
  {
    // 石垣市(八重山諸島本島)+ 竹富町(竹富・西表・小浜等)+ 与那国町
    match: /(石垣市|竹富町|与那国町|八重山郡)/,
    advisory: {
      id: "ishigaki",
      name: "八重山諸島(石垣・竹富・西表・与那国)",
      yamato: {
        status: "delayed",
        note: "Yamato 空運轉運,交期比沖縄本島多約 +2 天;離島間再轉船 +1 天。",
      },
      yuu: {
        status: "delayed",
        note: "ゆうパック 空便,交期比沖縄本島多約 +2 天;離島間再轉船 +1 天。",
      },
    },
  },
];

export function detectRemoteIsland(
  displayName: string | null | undefined,
  city: string | null | undefined,
): RemoteIslandAdvisory | null {
  const hay = `${displayName ?? ""} ${city ?? ""}`;
  if (!hay.trim()) return null;
  for (const r of RULES) {
    if (r.match.test(hay)) return r.advisory;
  }
  return null;
}
