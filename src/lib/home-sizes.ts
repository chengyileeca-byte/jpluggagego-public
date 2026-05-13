export const HOME_SIZES = [
  { code: "60", label: "60 サイズ · ~2kg 手提袋" },
  { code: "80", label: "80 サイズ · ~5kg 後背包" },
  { code: "100", label: "100 サイズ · ~10kg 21吋" },
  { code: "120", label: "120 サイズ · ~15kg 24吋" },
  { code: "140", label: "140 サイズ · ~20kg 26吋" },
  { code: "160", label: "160 サイズ · ~25kg 29吋" },
] as const;

export type HomeSizeCode = (typeof HOME_SIZES)[number]["code"];
