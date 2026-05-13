import { cookies } from "next/headers";
import { resolveLang, type Lang } from "./i18n";

export const LANG_COOKIE = "lang";

export async function getLang(): Promise<Lang> {
  const store = await cookies();
  return resolveLang(store.get(LANG_COOKIE)?.value);
}
