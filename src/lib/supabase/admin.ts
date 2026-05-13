import { createStubClient } from "./stub";

/**
 * Sunset shim: Supabase 已停用。前端與 script 共用此 stub。
 * scripts/* 若仍依賴此 helper,寫入會回 503 disabled error;
 * seed 流程應改成直接讀寫 public/data/*.json。
 */
export function createAdminClient() {
  return createStubClient();
}
