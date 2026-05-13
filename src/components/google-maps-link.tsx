// 點擊在 Google Maps 開搜尋結果(手機會自動跳 Google Maps App)。
// 使用 Universal URLs API,不需要 Maps Embed 也不用 Places API key。
// Doc: https://developers.google.com/maps/documentation/urls/get-started
//
// 若有 title_ja → 優先用日文(Maps 在日本對日文匹配較準)。
// 加 municipality_ja 當 disambiguator(例:札幌「すみれ」店名常見,加區名才不混)。
// lat/lon 暫不放 — 經測試,單純用名稱 + 區域比 LAT,LON 在搜尋結果更可讀。

export function GoogleMapsLink({
  titleJa,
  titleZh,
  municipalityJa,
  variant = "pill",
}: {
  titleJa?: string | null;
  titleZh: string;
  municipalityJa?: string | null;
  variant?: "pill" | "inline";
}) {
  // title 末尾の括弧説明を除去:
  //   「信玄餅(山梨銘菓 + 桔梗屋 + 金精軒)」→「信玄餅」
  //   「横浜駅(JR 東日本 + 私鉄 6 社接続 + 国内屈指乗換駅)」→「横浜駅」
  // Google Maps の検索品質が向上する。
  const strip = (s: string | null | undefined) =>
    (s ?? "").replace(/\s*[(（].*$/u, "").trim();
  const name = strip(titleJa) || strip(titleZh) || titleZh;
  const query = municipalityJa ? `${name} ${municipalityJa}` : name;
  const href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  if (variant === "inline") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="inline-flex items-center gap-1 text-xs text-sky-700 dark:text-sky-400 hover:underline"
      >
        📍 Google Maps
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-3 py-1 text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 transition"
    >
      📍 Google Maps 開啟
    </a>
  );
}
