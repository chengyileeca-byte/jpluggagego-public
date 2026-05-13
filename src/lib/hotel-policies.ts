// 日本主要飯店連鎖的行李代收 / 寄送政策概覽。
//
// 用途:在 /quote 的 pref mode 顯示「如果你是從某連鎖飯店寄出/收件,預期能做什麼」。
//
// 注意:
//   - 此為**連鎖總部層級**的常見政策,**個別分店**可能不同,尤其老店、位置偏遠、民宿轉營者。
//   - 以下欄位皆基於 2026-04 時點的一般認知 + 部分官方 FAQ,不保證即時準確。
//   - 有疑慮請在入住前 email 或電話直接問飯店。
//
// 資料源:
//   - 各連鎖官網 Q&A / FAQ 頁 (手動抽樣)
//   - PTT Japan_Travel 板 多筆心得文 (痛點 P1-5, P1-6)
//   - Tripadvisor 旅客回饋

export type Capability = "yes" | "case-by-case" | "check";

export interface HotelChainPolicy {
  /** 穩定 slug,用於 DB 關聯(hotel_chain_reports.chain_code) */
  code: string;
  /** 顯示名 (proper noun, shared across all locales) */
  name: string;
  /** 日文正式品牌 */
  nameJp: string;
  /** 是否代收(寄到飯店等住客) */
  canReceive: Capability;
  /** 是否代寄(住客寄到機場/其他飯店) */
  canSend: Capability;
  /** 入住前代收(還沒 check-in 就寄到) */
  preCheckinHold: Capability;
  /** 官方 FAQ / 宅配説明頁 (選填) */
  url?: string;
  /** i18n key for per-chain note */
  noteKey?: string;
  /** 小寫/去空白後的 substring,命中即視為此連鎖 */
  matchPatterns: string[];
}

export const HOTEL_CHAIN_POLICIES: HotelChainPolicy[] = [
  {
    code: "apa",
    name: "APA ホテル",
    nameJp: "アパホテル",
    canReceive: "yes",
    canSend: "yes",
    preCheckinHold: "check",
    url: "https://www.apahotel.com/information/",
    noteKey: "hotel.note.apa",
    matchPatterns: ["アパホテル", "アパ", "apahotel", "apaホテル", "apa"],
  },
  {
    code: "toyoko_inn",
    name: "東横 INN",
    nameJp: "東横イン",
    canReceive: "yes",
    canSend: "yes",
    preCheckinHold: "check",
    url: "https://www.toyoko-inn.com/",
    noteKey: "hotel.note.toyoko_inn",
    matchPatterns: ["東横イン", "東横inn", "東横 inn", "toyokoinn", "toyoko inn", "toyoko", "東橫"],
  },
  {
    code: "super_hotel",
    name: "Super Hotel",
    nameJp: "スーパーホテル",
    canReceive: "yes",
    canSend: "yes",
    preCheckinHold: "check",
    url: "https://www.superhotel.co.jp/",
    matchPatterns: ["スーパーホテル", "superhotel", "super hotel"],
  },
  {
    code: "route_inn",
    name: "ルート イン (Route Inn)",
    nameJp: "ルートインホテルズ",
    canReceive: "yes",
    canSend: "yes",
    preCheckinHold: "check",
    url: "https://www.route-inn.co.jp/",
    matchPatterns: ["ルートイン", "routeinn", "route inn", "route-inn"],
  },
  {
    code: "dormy_inn",
    name: "ドーミー イン (Dormy Inn)",
    nameJp: "ドーミーイン",
    canReceive: "yes",
    canSend: "yes",
    preCheckinHold: "yes",
    url: "https://www.hotespa.net/dormyinn/",
    noteKey: "hotel.note.dormy_inn",
    matchPatterns: ["ドーミーイン", "dormyinn", "dormy inn", "dormy"],
  },
  {
    code: "richmond",
    name: "リッチモンド (Richmond)",
    nameJp: "リッチモンドホテル",
    canReceive: "yes",
    canSend: "yes",
    preCheckinHold: "check",
    url: "https://richmondhotel.jp/",
    matchPatterns: ["リッチモンド", "richmondhotel", "richmond hotel", "richmond", "里士滿"],
  },
  {
    code: "mitsui_garden",
    name: "三井 ガーデン",
    nameJp: "三井ガーデンホテルズ",
    canReceive: "yes",
    canSend: "yes",
    preCheckinHold: "yes",
    url: "https://www.gardenhotels.co.jp/",
    noteKey: "hotel.note.mitsui_garden",
    matchPatterns: ["三井ガーデン", "mitsuigarden", "mitsui garden", "三井花園"],
  },
  {
    code: "comfort",
    name: "Comfort Hotel",
    nameJp: "コンフォートホテル",
    canReceive: "yes",
    canSend: "yes",
    preCheckinHold: "check",
    url: "https://www.choice-hotels.jp/",
    matchPatterns: ["コンフォートホテル", "コンフォート ホテル", "comforthotel", "comfort hotel"],
  },
  {
    code: "tokyu_stay",
    name: "東急 Stay / REI",
    nameJp: "東急ステイ / 東急REIホテル",
    canReceive: "yes",
    canSend: "yes",
    preCheckinHold: "check",
    url: "https://www.tokyustay.co.jp/",
    matchPatterns: ["東急ステイ", "東急rei", "東急 stay", "tokyustay", "tokyu stay", "tokyurei", "tokyu rei"],
  },
  {
    code: "daiwa_roynet",
    name: "Daiwa Roynet",
    nameJp: "ダイワロイネット",
    canReceive: "yes",
    canSend: "yes",
    preCheckinHold: "check",
    url: "https://www.daiwaroynet.jp/",
    matchPatterns: ["ダイワロイネット", "daiwaroynet", "daiwa roynet"],
  },
  {
    code: "nishitetsu_inn",
    name: "Nishitetsu Inn",
    nameJp: "西鉄イン / ソラリア西鉄",
    canReceive: "yes",
    canSend: "yes",
    preCheckinHold: "check",
    url: "https://www.n-inn.jp/",
    noteKey: "hotel.note.nishitetsu",
    matchPatterns: ["西鉄イン", "ソラリア西鉄", "nishitetsuinn", "nishitetsu inn", "solaria", "nishitetsu", "西鐵"],
  },
  {
    code: "monterey",
    name: "Hotel Monterey",
    nameJp: "ホテルモントレ",
    canReceive: "yes",
    canSend: "yes",
    preCheckinHold: "yes",
    url: "https://www.hotelmonterey.co.jp/",
    matchPatterns: ["ホテルモントレ", "モントレ", "hotelmonterey", "hotel monterey", "monterey", "蒙特利"],
  },
  {
    code: "prince",
    name: "Prince Hotel",
    nameJp: "プリンスホテル",
    canReceive: "yes",
    canSend: "yes",
    preCheckinHold: "check",
    url: "https://www.princehotels.co.jp/",
    matchPatterns: ["プリンスホテル", "princehotel", "prince hotel", "王子大飯店", "王子飯店", "王子酒店"],
  },
  {
    code: "hoshino",
    name: "星野リゾート",
    nameJp: "星野リゾート",
    canReceive: "yes",
    canSend: "yes",
    preCheckinHold: "yes",
    url: "https://www.hoshinoresorts.com/",
    matchPatterns: ["星野リゾート", "星のや", "界", "リゾナーレ", "hoshino", "hoshinoya", "虹夕諾雅"],
  },
  {
    code: "mystays",
    name: "ホテル マイステイズ",
    nameJp: "ホテルマイステイズ",
    canReceive: "yes",
    canSend: "yes",
    preCheckinHold: "check",
    url: "https://www.mystays.com/",
    matchPatterns: ["マイステイズ", "mystays", "my stays"],
  },
  {
    code: "sotetsu_fresa",
    name: "相鉄フレッサイン",
    nameJp: "相鉄フレッサイン",
    canReceive: "yes",
    canSend: "yes",
    preCheckinHold: "check",
    url: "https://fresa-inn.sotetsu-hotels.com/",
    matchPatterns: ["相鉄フレッサイン", "フレッサイン", "sotetsufresa", "sotetsu fresa", "fresainn", "fresa inn", "相鐵"],
  },
];

export const HOTEL_POLICY_GENERAL_NOTE_KEY = "hotel.section.general_note";
export const HOTEL_POLICY_DISCLAIMER_KEY = "hotel.section.disclaimer";

// Normalize for matcher: lowercase + strip ASCII/全形 whitespace + fold
// 全形 Latin (ＡＢ…ａｂ…０１…) into ASCII. The fold is load-bearing for
// Rakuten-sourced data: the 東横 INN chain is stored as "東横ＩＮＮ..." with
// full-width Latin in Rakuten's DB, and without this fold our katakana
// pattern "東横イン" never meets the stored form. Japanese kana/kanji pass
// through unchanged — script differences stay as signal, not noise.
function normalizeForMatch(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\uff01-\uff5e]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) - 0xfee0),
    )
    .replace(/[\s　]+/g, "");
}

// Char is "Latin-letter or ASCII digit" — bare "apa" matching "napa" = false
// positive, but "apa" matching "apa新宿" is fine (新 is CJK, boundary OK).
function isLatinAlnum(code: number): boolean {
  return (code >= 97 && code <= 122) || (code >= 48 && code <= 57);
}

// Substring match with a light word-boundary guard: a romaji pattern like
// "apa" must not sit flush against another latin letter (avoid "napa").
// CJK/kana patterns skip the guard entirely — they are distinctive enough on
// their own, and the guard would wrongly block "東橫" inside "東橫inn" because
// the trailing "i" happens to be latin.
function hasBrandPattern(haystack: string, pattern: string): boolean {
  if (!pattern) return false;
  const idx = haystack.indexOf(pattern);
  if (idx < 0) return false;
  if (!/^[a-z0-9]+$/.test(pattern)) return true;
  if (idx > 0 && isLatinAlnum(haystack.charCodeAt(idx - 1))) return false;
  const end = idx + pattern.length;
  if (end < haystack.length && isLatinAlnum(haystack.charCodeAt(end)))
    return false;
  return true;
}

// Best-effort brand match against a user-entered hotel name. First-match-wins
// — patterns should be distinctive enough that brand overlap is rare.
export function matchHotelBrand(name: string): HotelChainPolicy | null {
  const q = normalizeForMatch(name);
  if (!q) return null;
  for (const policy of HOTEL_CHAIN_POLICIES) {
    for (const pat of policy.matchPatterns) {
      if (hasBrandPattern(q, normalizeForMatch(pat))) return policy;
    }
  }
  return null;
}
