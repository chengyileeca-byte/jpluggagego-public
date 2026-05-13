// Geographic query points covering Japan for Yamato branch scraping.
//
// Strategy: 47 prefecture centroids (rad=100km should cover most) +
// extra fill-in points for large prefectures (Hokkaido, Tohoku, 岐阜).
// Overlap is intentional — dedupe happens at the branch_code level.

export interface GridPoint {
  label: string; // debug label, e.g. "東京都 都心"
  lat: number;
  lon: number;
  radius_m: number; // query radius in meters
}

export const JAPAN_GRID: readonly GridPoint[] = [
  // Hokkaido — split into 4 points because it's 83,000 km²
  { label: "北海道 札幌",         lat: 43.0642, lon: 141.3469, radius_m: 100_000 },
  { label: "北海道 函館",         lat: 41.7688, lon: 140.7288, radius_m: 100_000 },
  { label: "北海道 旭川",         lat: 43.7707, lon: 142.3650, radius_m: 100_000 },
  { label: "北海道 釧路",         lat: 42.9849, lon: 144.3820, radius_m: 100_000 },
  { label: "北海道 帯広",         lat: 42.9237, lon: 143.1965, radius_m: 100_000 },

  // Tohoku
  { label: "青森県",              lat: 40.8244, lon: 140.7400, radius_m: 100_000 },
  { label: "岩手県 盛岡",         lat: 39.7036, lon: 141.1527, radius_m: 100_000 },
  { label: "岩手県 沿岸",         lat: 39.4000, lon: 141.9000, radius_m: 80_000 },
  { label: "宮城県 仙台",         lat: 38.2682, lon: 140.8694, radius_m: 100_000 },
  { label: "秋田県",              lat: 39.7186, lon: 140.1024, radius_m: 100_000 },
  { label: "山形県",              lat: 38.2404, lon: 140.3633, radius_m: 100_000 },
  { label: "福島県 福島",         lat: 37.7500, lon: 140.4676, radius_m: 80_000 },
  { label: "福島県 いわき",       lat: 37.0544, lon: 140.8876, radius_m: 80_000 },

  // Kanto
  { label: "茨城県",              lat: 36.3418, lon: 140.4468, radius_m: 80_000 },
  { label: "栃木県 宇都宮",       lat: 36.5658, lon: 139.8836, radius_m: 80_000 },
  { label: "群馬県 前橋",         lat: 36.3911, lon: 139.0608, radius_m: 80_000 },
  { label: "埼玉県 さいたま",     lat: 35.8617, lon: 139.6455, radius_m: 60_000 },
  { label: "千葉県 千葉",         lat: 35.6074, lon: 140.1065, radius_m: 80_000 },
  { label: "東京都 都心",         lat: 35.6895, lon: 139.6917, radius_m: 60_000 },
  { label: "東京都 多摩",         lat: 35.6828, lon: 139.4000, radius_m: 40_000 },
  { label: "神奈川県 横浜",       lat: 35.4437, lon: 139.6380, radius_m: 60_000 },

  // Chubu
  { label: "新潟県 新潟",         lat: 37.9024, lon: 139.0232, radius_m: 100_000 },
  { label: "新潟県 上越",         lat: 37.1477, lon: 138.2360, radius_m: 80_000 },
  { label: "富山県",              lat: 36.6953, lon: 137.2113, radius_m: 80_000 },
  { label: "石川県 金沢",         lat: 36.5944, lon: 136.6256, radius_m: 80_000 },
  { label: "福井県",              lat: 35.9436, lon: 136.1881, radius_m: 80_000 },
  { label: "山梨県",              lat: 35.6640, lon: 138.5683, radius_m: 80_000 },
  { label: "長野県 北",           lat: 36.6514, lon: 138.1812, radius_m: 80_000 },
  { label: "長野県 南",           lat: 35.8613, lon: 137.9545, radius_m: 80_000 },
  { label: "岐阜県 岐阜",         lat: 35.3912, lon: 136.7223, radius_m: 80_000 },
  { label: "岐阜県 高山",         lat: 36.1430, lon: 137.2531, radius_m: 80_000 },
  { label: "静岡県 静岡",         lat: 34.9769, lon: 138.3830, radius_m: 80_000 },
  { label: "静岡県 浜松",         lat: 34.7108, lon: 137.7261, radius_m: 80_000 },
  { label: "愛知県 名古屋",       lat: 35.1815, lon: 136.9066, radius_m: 60_000 },

  // Kansai
  { label: "三重県 津",           lat: 34.7303, lon: 136.5086, radius_m: 80_000 },
  { label: "滋賀県",              lat: 35.0045, lon: 135.8686, radius_m: 80_000 },
  { label: "京都府 京都",         lat: 35.0116, lon: 135.7681, radius_m: 60_000 },
  { label: "京都府 北部",         lat: 35.5393, lon: 135.2265, radius_m: 80_000 },
  { label: "大阪府",              lat: 34.6937, lon: 135.5023, radius_m: 60_000 },
  { label: "兵庫県 神戸",         lat: 34.6901, lon: 135.1956, radius_m: 80_000 },
  { label: "兵庫県 北部",         lat: 35.4800, lon: 134.8300, radius_m: 80_000 },
  { label: "奈良県",              lat: 34.6851, lon: 135.8050, radius_m: 60_000 },
  { label: "和歌山県",            lat: 34.2260, lon: 135.1675, radius_m: 80_000 },

  // Chugoku
  { label: "鳥取県",              lat: 35.5039, lon: 134.2377, radius_m: 80_000 },
  { label: "島根県 松江",         lat: 35.4723, lon: 133.0505, radius_m: 80_000 },
  { label: "島根県 隠岐",         lat: 36.1884, lon: 133.3222, radius_m: 60_000 },
  { label: "岡山県",              lat: 34.6617, lon: 133.9350, radius_m: 80_000 },
  { label: "広島県 広島",         lat: 34.3853, lon: 132.4553, radius_m: 80_000 },
  { label: "山口県",              lat: 34.1858, lon: 131.4714, radius_m: 80_000 },

  // Shikoku
  { label: "徳島県",              lat: 34.0658, lon: 134.5593, radius_m: 80_000 },
  { label: "香川県 高松",         lat: 34.3401, lon: 134.0434, radius_m: 80_000 },
  { label: "愛媛県 松山",         lat: 33.8416, lon: 132.7657, radius_m: 80_000 },
  { label: "高知県",              lat: 33.5597, lon: 133.5311, radius_m: 80_000 },

  // Kyushu
  { label: "福岡県 福岡",         lat: 33.5902, lon: 130.4017, radius_m: 80_000 },
  { label: "福岡県 北九州",       lat: 33.8833, lon: 130.8833, radius_m: 60_000 },
  { label: "佐賀県",              lat: 33.2494, lon: 130.2989, radius_m: 80_000 },
  { label: "長崎県 長崎",         lat: 32.7503, lon: 129.8779, radius_m: 80_000 },
  { label: "長崎県 五島/対馬",    lat: 32.9500, lon: 128.8300, radius_m: 80_000 },
  { label: "熊本県",              lat: 32.7898, lon: 130.7417, radius_m: 80_000 },
  { label: "大分県",              lat: 33.2382, lon: 131.6126, radius_m: 80_000 },
  { label: "宮崎県",              lat: 31.9111, lon: 131.4239, radius_m: 80_000 },
  { label: "鹿児島県 本土",       lat: 31.5602, lon: 130.5581, radius_m: 80_000 },
  { label: "鹿児島県 種子/屋久",  lat: 30.4000, lon: 130.7500, radius_m: 60_000 },
  { label: "鹿児島県 奄美",       lat: 28.3777, lon: 129.4946, radius_m: 50_000 },

  // Okinawa
  { label: "沖縄県 本島",         lat: 26.2124, lon: 127.6792, radius_m: 80_000 },
  { label: "沖縄県 宮古/石垣",    lat: 24.5000, lon: 125.3000, radius_m: 80_000 },
];
