-- 把 japan_entry 加入 location_reports.entity_type 白名單
--
-- 背景:
--   Sprint 9 已累積 328 筆北海道 japan_entries,需開放 UGC 回報資料錯誤 / 變更。
--   沿用 0015 的 polymorphic 表,只擴 CHECK constraint;view、index、trigger 不動。
--
-- entity_id for japan_entry = japan_entries.slug
--   (slug 穩定、人讀,且符合 entity_id text(120) 限制)
--
-- Auto-apply 設計:japan_entry 不做自動套用,全部人工 review。
--   理由:japan_entries 沒乾淨的 phone/address 欄位,update payload 的 field
--   (address/phone/hours/...) 對應到 japan_entry 是「事件時段 / 票價 / 場所」等,
--   每個 case 編輯該決定改哪一欄,不適合 generic auto-apply。

alter table public.location_reports
  drop constraint if exists location_reports_entity_type_check;

alter table public.location_reports
  add constraint location_reports_entity_type_check
  check (
    entity_type in (
      'yamato_branch',
      'yuu_post_office',
      'yamato_airport',
      'yuu_pack_airport',
      'hotel_chain',
      'japan_entry'
    )
  );
