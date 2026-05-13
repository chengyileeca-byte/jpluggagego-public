-- 配送遅延 alerts(主頁の跑馬燈)— 天候による Yamato / ゆうパック 遅延の警告。
--
-- データ源は将来的に JMA(気象庁)warning JSON + 配送会社公式 遅延ページ scrape を想定。
-- 今は admin による手動投入 + SQL insert で運用。
--
-- 現用要件:
--   - 主頁で「{地域} 因 {天候} 可能延誤」式 marquee
--   - 期間外(expires_at < now())は自動非表示
--   - 「沒有就不用」= ゼロ件なら component が null 返却 → 跑馬燈消失

CREATE TABLE IF NOT EXISTS delivery_alerts (
  id BIGSERIAL PRIMARY KEY,
  -- 影響地域(複数可)— display 用 zh string と、機械可読 prefecture_ja[] 両方
  regions_zh TEXT NOT NULL, -- 例:"北海道、青森"
  regions_ja TEXT[] NOT NULL DEFAULT '{}', -- 例:{"北海道","青森県"}
  -- 天候・原因(zh display)
  weather_zh TEXT NOT NULL, -- 例:"暴雪"・"颱風 21 號"・"地震 (M6.5) 復原中"
  weather_type TEXT, -- 機械可読:"snow"・"typhoon"・"earthquake"・"rain"・"other"
  -- 影響対象配送(複数可)
  carriers TEXT[] NOT NULL DEFAULT '{}', -- {"yamato","yuu"}
  -- 重要度
  severity TEXT NOT NULL DEFAULT 'warning', -- "info" / "warning" / "danger"
  -- 期間
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  -- 出典(JMA・配送会社公式・admin 手動)
  source_url TEXT,
  source_label TEXT, -- 例:"気象庁 大雪警報"・"ヤマト運輸 配送遅延のお詫び"
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Active alert の高速検索(NOW() は STABLE で partial index 不可なので
-- predicate なしの普通 index にする。実用上問題なし — alert 件数は数十程度)
CREATE INDEX IF NOT EXISTS delivery_alerts_expires_at_idx
  ON delivery_alerts (expires_at);

CREATE INDEX IF NOT EXISTS delivery_alerts_starts_at_idx
  ON delivery_alerts (starts_at DESC);

-- 重要度 check 制約
ALTER TABLE delivery_alerts
  ADD CONSTRAINT delivery_alerts_severity_check
  CHECK (severity IN ('info', 'warning', 'danger'));

-- 公開 select(read-only)— anon でも見える(主頁 marquee 用)
ALTER TABLE delivery_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY delivery_alerts_select_public
  ON delivery_alerts FOR SELECT
  USING (true);

COMMENT ON TABLE delivery_alerts IS
  'Yamato/ゆうパック 等の配送遅延 alerts(主頁 marquee 表示)。手動投入 + 将来 JMA API 連携想定';
