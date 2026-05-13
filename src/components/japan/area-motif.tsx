// 47卷地誌 — 各 prefecture の朱印 motif。viewBox 100x100,size は親で width/height で指定。
//
// motifType ごとに別 SVG を返す純粋表示 component。
// 落款風(seal-like)に見せるため、stroke ではなく fill ベース、
// 余白(viewBox 内 padding)も控えめにして「印を押した」感を出す。

import type { MotifType } from "@/lib/japan-area-styles";

interface MotifProps {
  motifType: MotifType;
  className?: string;
  /** ink color — 通常 area accent を渡す */
  color?: string;
  /** title for a11y */
  title?: string;
}

export function AreaMotif({
  motifType,
  className,
  color = "currentColor",
  title,
}: MotifProps) {
  switch (motifType) {
    case "hokkaido_star":
      return <HokkaidoStar className={className} color={color} title={title} />;
    case "kyoto_shippo":
      return <KyotoShippo className={className} color={color} title={title} />;
    case "ryukyu_mitsudomoe":
      return (
        <RyukyuMitsudomoe
          className={className}
          color={color}
          title={title}
        />
      );
    case "nara_deer":
      return <NaraDeer className={className} color={color} title={title} />;
    case "osaka_sennari":
      return <OsakaSennari className={className} color={color} title={title} />;
    case "hyogo_anchor":
      return <HyogoAnchor className={className} color={color} title={title} />;
    case "shizuoka_fuji":
      return <ShizuokaFuji className={className} color={color} title={title} />;
    case "nagasaki_dejima_fan":
      return (
        <NagasakiDejimaFan className={className} color={color} title={title} />
      );
    case "hiroshima_torii":
      return (
        <HiroshimaTorii className={className} color={color} title={title} />
      );
    case "ishikawa_umebachi":
      return (
        <IshikawaUmebachi className={className} color={color} title={title} />
      );
    case "kumamoto_jano":
      return <KumamotoJano className={className} color={color} title={title} />;
    case "aomori_nebuta":
      return <AomoriNebuta className={className} color={color} title={title} />;
    case "iwate_tetsubin":
      return <IwateTetsubin className={className} color={color} title={title} />;
    case "akita_namahage":
      return <AkitaNamahage className={className} color={color} title={title} />;
    case "miyagi_sendai_bamboo":
      return (
        <MiyagiSendaiBamboo className={className} color={color} title={title} />
      );
    case "yamagata_benibana":
      return (
        <YamagataBeniHana className={className} color={color} title={title} />
      );
    case "fukushima_tsurugajou":
      return (
        <FukushimaTsurugajou
          className={className}
          color={color}
          title={title}
        />
      );
    case "ibaraki_baika":
      return <IbarakiBaiKa className={className} color={color} title={title} />;
    case "tochigi_toushou":
      return (
        <TochigiToushou className={className} color={color} title={title} />
      );
    case "gunma_daruma":
      return <GunmaDaruma className={className} color={color} title={title} />;
    case "saitama_bushu_ai":
      return (
        <SaitamaBushuAi className={className} color={color} title={title} />
      );
    case "chiba_tsukihoshi":
      return (
        <ChibaTsukihoshi className={className} color={color} title={title} />
      );
    case "edo_kiriko":
      return <EdoKiriko className={className} color={color} title={title} />;
    case "kanagawa_nami":
      return (
        <KanagawaNami className={className} color={color} title={title} />
      );
    case "kagawa_olive":
      return <KagawaOlive className={className} color={color} title={title} />;
    case "naruto_uzu":
      return <NarutoUzu className={className} color={color} title={title} />;
    case "ehime_dogo_yu":
      return <EhimeDogoYu className={className} color={color} title={title} />;
    case "tosa_yosakoi":
      return <TosaYosakoi className={className} color={color} title={title} />;
    case "echigo_yuki_kome":
      return <EchigoYukiKome className={className} color={color} title={title} />;
    case "etchu_tateyama":
      return <EtchuTateyama className={className} color={color} title={title} />;
    case "echizen_eihei":
      return <EchizenEihei className={className} color={color} title={title} />;
    case "kai_takeda_grape":
      return <KaiTakedaGrape className={className} color={color} title={title} />;
    case "shinano_zenkoji":
      return <ShinanoZenkoji className={className} color={color} title={title} />;
    case "mino_hida_gassho":
      return <MinoHidaGassho className={className} color={color} title={title} />;
    case "owari_kinshachi":
      return <OwariKinshachi className={className} color={color} title={title} />;
    case "ise_jingu_torii":
      return <IseJinguTorii className={className} color={color} title={title} />;
    case "shiga_biwa_omi":
      return <ShigaBiwaOmi className={className} color={color} title={title} />;
    case "kii_kumano_kuma":
      return <KiiKumanoKuma className={className} color={color} title={title} />;
    case "tottori_sakyu_dai":
      return <TottoriSakyuDai className={className} color={color} title={title} />;
    case "izumo_ooyashiro_shime":
      return <IzumoOoyashiroShime className={className} color={color} title={title} />;
    case "okayama_momotaro_shiro":
      return <OkayamaMomotaroShiro className={className} color={color} title={title} />;
    case "yamaguchi_kintaikyo_fugu":
      return <YamaguchiKintaikyoFugu className={className} color={color} title={title} />;
    case "fukuoka_yamakasa_dazaifu":
      return <FukuokaYamakasaDazaifu className={className} color={color} title={title} />;
    case "saga_arita_karatsu":
      return <SagaAritaKaratsu className={className} color={color} title={title} />;
    case "oita_beppu_yufuin":
      return <OitaBeppuYufuin className={className} color={color} title={title} />;
    case "miyazaki_takachiho_obi":
      return <MiyazakiTakachihoObi className={className} color={color} title={title} />;
    case "kagoshima_sakurajima_satsuma":
      return <KagoshimaSakurajimaSatsuma className={className} color={color} title={title} />;
    default:
      return <DefaultMark className={className} color={color} title={title} />;
  }
}

// 北辰章 — Kaitakushi 開拓使 1869 の五光星(red star, polar/北辰).
// 屯田兵帽章・北海道庁旧本庁舎にも残る象徴。
function HokkaidoStar({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 北辰五光星 */}
      <polygon
        points="50,12 60.6,42.5 92.7,42.5 66.5,61.4 77.1,91.9 50,73 22.9,91.9 33.5,61.4 7.3,42.5 39.4,42.5"
        fill={color}
      />
    </svg>
  );
}

// 七宝文様 — 4 つの円が交わる平安以来の吉祥文。
// 京都の和文様代表(西陣・友禅でも常用)。
function KyotoShippo({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 4 つ重なる円輪 — 七宝(輪違い) */}
      <g
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      >
        <circle cx="50" cy="22" r="22" />
        <circle cx="22" cy="50" r="22" />
        <circle cx="78" cy="50" r="22" />
        <circle cx="50" cy="78" r="22" />
      </g>
      {/* 中央点 — 七宝の交点を強調 */}
      <circle cx="50" cy="50" r="2.4" fill={color} />
    </svg>
  );
}

// 琉球三巴(ひだりみつどもえ)— 琉球王国の御紋(尚氏王統)。
// 首里城・守禮門・琉球王朝の正章。3 つの勾玉が回転する形は南方系の太陽紋象徴。
function RyukyuMitsudomoe({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 3 つの巴(勾玉)— 左回り、120 度回転で配置 */}
      <g fill={color}>
        {/* 0 度位置 — 上 */}
        <path d="M 50 16 C 64 16 74 28 74 42 C 74 52 66 60 56 60 C 64 56 68 50 68 42 C 68 32 60 24 50 24 C 46 24 42 26 39 28 C 41 21 45 16 50 16 Z" />
        {/* 120 度回転 — 右下 */}
        <g transform="rotate(120 50 50)">
          <path d="M 50 16 C 64 16 74 28 74 42 C 74 52 66 60 56 60 C 64 56 68 50 68 42 C 68 32 60 24 50 24 C 46 24 42 26 39 28 C 41 21 45 16 50 16 Z" />
        </g>
        {/* 240 度回転 — 左下 */}
        <g transform="rotate(240 50 50)">
          <path d="M 50 16 C 64 16 74 28 74 42 C 74 52 66 60 56 60 C 64 56 68 50 68 42 C 68 32 60 24 50 24 C 46 24 42 26 39 28 C 41 21 45 16 50 16 Z" />
        </g>
      </g>
    </svg>
  );
}

// 神鹿 — 春日大社神紋・正倉院 Tang 様式の伏鹿。
// 春日大社の御使い・奈良公園 1,200 頭の野生神鹿を seal stamp 化。
// 側面 profile・stylized antlers・stamp ink fill で「正倉院鏡背の神獣」感を出す。
// 上方の小円は神鏡(春日鹿曼荼羅で鹿の背に乗る神宝の暗示)。
function NaraDeer({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 神鏡 — 鹿の上方・春日鹿曼荼羅に乗る神宝の暗示。faint ring. */}
      <circle
        cx="38"
        cy="28"
        r="6"
        fill="none"
        stroke={color}
        strokeWidth="1.1"
        opacity="0.55"
      />
      {/* 神鹿 — 側面 profile, facing right. 全部 fill で stamp ink 感. */}
      <g fill={color}>
        {/* 胴体(torso)— 丸みのある rect で stamp 風に */}
        <rect x="26" y="50" width="36" height="14" rx="5" />
        {/* 頸 + 頭 — 一筆 path で chest から snout まで */}
        <path
          d="M 58 53
             L 63 50
             L 67 45
             L 70 41
             L 72 37
             L 76 35
             L 80 35
             L 83 38
             L 83 42
             L 80 44
             L 76 45
             L 71 47
             L 65 50
             L 60 53
             Z"
        />
        {/* 尾 — rear flick, triangular */}
        <path d="M 24 51 L 19 46 L 22 53 Z" />
        {/* 前肢 ×2 */}
        <rect x="56" y="62" width="2.4" height="22" rx="1.2" />
        <rect x="60" y="62" width="2.4" height="22" rx="1.2" />
        {/* 後肢 ×2 */}
        <rect x="28" y="62" width="2.4" height="22" rx="1.2" />
        <rect x="32" y="62" width="2.4" height="22" rx="1.2" />
      </g>
      {/* 角 — 線で枝分かれ。Tang 様式の stylized 4 本枝 */}
      <g
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* 主軸:頭頂から上へ */}
        <path d="M 76 34 L 76 22 L 74 16" />
        {/* 前枝(眉枝)— 額から forward へ */}
        <path d="M 76 33 L 82 31" />
        {/* 中枝 — 側面外へ */}
        <path d="M 76 28 L 81 24" />
        {/* 後枝 — 上方背面へ */}
        <path d="M 76 22 L 71 18" />
      </g>
    </svg>
  );
}

// 千成瓢箪(せんなりひょうたん)— 豐臣秀吉 馬印(軍旗 emblem).
// 大阪城・浪花の象徴。瓢箪が「成る」(生る・収穫)= 商業繁栄の縁起物として
// 大坂町人にも愛された。ここでは 7 個の瓢箪をクラスター(房)状に配置し、
// 上端に小さな旗竿(staff + finial)を立てて 馬印 のシルエット。
// 各瓢箪は 2 円(上 r=3・下 r=4・cy間隔 6)を重ねた fig-8 fill で
// 自然な瓢箪のクビレを表現(rect 不要・stamp ink ベタ塗で stamp seal 感)。
function OsakaSennari({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 馬印の旗竿(staff)— 上端 finial + 縦線 */}
      <circle cx="50" cy="11" r="1.6" fill={color} />
      <line
        x1="50"
        y1="13"
        x2="50"
        y2="22"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* 7 つの瓢箪 — teardrop cluster(1 + 2 + 3 + 1) */}
      <g fill={color}>
        {/* row 1 — 上端 1 個(staff 直下) */}
        <g transform="translate(50, 30)">
          <circle cy="-3" r="3" />
          <circle cy="3" r="4" />
        </g>
        {/* row 2 — 2 個 */}
        <g transform="translate(36, 47)">
          <circle cy="-3" r="3" />
          <circle cy="3" r="4" />
        </g>
        <g transform="translate(64, 47)">
          <circle cy="-3" r="3" />
          <circle cy="3" r="4" />
        </g>
        {/* row 3 — 3 個 */}
        <g transform="translate(28, 65)">
          <circle cy="-3" r="3" />
          <circle cy="3" r="4" />
        </g>
        <g transform="translate(50, 65)">
          <circle cy="-3" r="3" />
          <circle cy="3" r="4" />
        </g>
        <g transform="translate(72, 65)">
          <circle cy="-3" r="3" />
          <circle cy="3" r="4" />
        </g>
        {/* row 4 — 末端 1 個(房の下端) */}
        <g transform="translate(50, 84)">
          <circle cy="-3" r="3" />
          <circle cy="3" r="4" />
        </g>
      </g>
    </svg>
  );
}

// 錨(いかり)— 神戸開港 1868・港町兵庫の象徴。
// 5 国(摂津・播磨・但馬・丹波・淡路)を含む兵庫県の海玄関を表す。
// 古典船舶錨の形(top eye + horizontal stock + central shank + curved arms + flukes)
// を seal stamp 化。中央の縦線(shank)を太く取り、左右対称の curved arms で
// 「正対した錨」の図案性を出す。北野異人館の鋳鉄装飾・神戸海軍兵学寮の
// 錨章にも通じる意匠。
function HyogoAnchor({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 上部 ring(eye)— 錨環・縄を通す部分 */}
      <circle
        cx="50"
        cy="20"
        r="5"
        fill="none"
        stroke={color}
        strokeWidth="2.6"
      />
      {/* 横木(stock)— 上部水平棒。錨が正立する為のバランス棒 */}
      <line
        x1="34"
        y1="32"
        x2="66"
        y2="32"
        stroke={color}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      {/* 横木の小さなボタン(stock end caps)— 古典様式 */}
      <circle cx="34" cy="32" r="2.2" fill={color} />
      <circle cx="66" cy="32" r="2.2" fill={color} />
      {/* 主軸(shank)— 中央縦棒。eye → arms 結合点まで */}
      <line
        x1="50"
        y1="25"
        x2="50"
        y2="68"
        stroke={color}
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      {/* 左右の腕(arms)— shank 下端から外向きに弧を描く */}
      <g
        fill="none"
        stroke={color}
        strokeWidth="3.4"
        strokeLinecap="round"
      >
        {/* 左腕 — 中央 (50,68) から下外向きに弧 → 左下 (22,82) */}
        <path d="M 50 68 Q 38 80 22 82" />
        {/* 右腕 — 中央 (50,68) から下外向きに弧 → 右下 (78,82) */}
        <path d="M 50 68 Q 62 80 78 82" />
      </g>
      {/* 左右の爪(flukes)— 腕の先端三角 stamp ink */}
      <g fill={color}>
        {/* 左爪 — 三角:外側に尖る */}
        <path d="M 22 82 L 18 76 L 26 78 Z" />
        {/* 右爪 — 三角:外側に尖る */}
        <path d="M 78 82 L 82 76 L 74 78 Z" />
      </g>
    </svg>
  );
}

// 富士山 — 静岡県の象徴。葛飾北斎・歌川広重 以来の三角山シルエット + 雪冠 +
// 三本筋(snow streaks)+ 駿河湾の波(横線)で「東海道五十三次」凝縮。
// 線描中心の seal stamp(線で構成された印章 — fill triangle にすると
// 線描の snow streaks が同色で見えなくなるため、stroked outline に統一)。
// 北斎『神奈川沖浪裏』の遠景富士・広重『東海道五十三次』の画題を踏襲。
function ShizuokaFuji({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      <g
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* 富士山 outline — 左裾 → 山頂(微円弧)→ 右裾 */}
        <path
          d="M 16 80 L 46 26 Q 50 20 54 26 L 84 80"
          strokeWidth="2.8"
        />
        {/* 雪冠 zigzag — 山頂下の雪線(凸凹で立体感) */}
        <path
          d="M 35 44 L 39 40 L 43 43 L 47 38 L 50 36 L 53 38 L 57 43 L 61 40 L 65 44"
          strokeWidth="1.8"
        />
        {/* 三本筋 — 山頂から下る三本の雪 streaks(北斎構図の名残) */}
        <line x1="46" y1="32" x2="43" y2="46" strokeWidth="1.5" />
        <line x1="50" y1="30" x2="50" y2="44" strokeWidth="1.5" />
        <line x1="54" y1="32" x2="57" y2="46" strokeWidth="1.5" />
        {/* 駿河湾の波 / 雲海 — 山麓下の横帯(2 本の波線) */}
        <path
          d="M 10 87 Q 18 84 26 87 T 42 87 T 58 87 T 74 87 T 90 87"
          strokeWidth="1.4"
          opacity="0.75"
        />
        <path
          d="M 22 92 Q 30 89 38 92 T 54 92 T 70 92 T 78 92"
          strokeWidth="1.2"
          opacity="0.55"
        />
      </g>
    </svg>
  );
}

// 出島の扇形 — 長崎県の象徴。1641-1859 鎖国期に蘭学唯一の対外窓だった
// 人工島「出島」(2.13 ha・扇形/D 字形・国指定史跡 1922)を seal stamp 化。
// 上に「町側 anchor + 出島橋」、下に「扇形の出島本体」、さらに下に「港の波」の
// 3 層構造で、「町と海を繋ぐ唯一の出口」という出島のアイコン的な構成を表現。
// オランダ商館のあった 230 年間 + 中華街・カトリック・原爆を含む長崎の
// 多層的「異国窓」文化を1つの figure に集約。
function NagasakiDejimaFan({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 町側 anchor(長崎の街)— 上方の小さな水平棒 */}
      <rect x="40" y="14" width="20" height="3" fill={color} />
      {/* 出島橋 — 町から出島への唯一の連絡橋 */}
      <rect x="48.5" y="17" width="3" height="14" fill={color} />
      {/* 出島本体 — D 字形(扇形)・straight chord 上 + curved arc 下 */}
      <path
        d="M 22 31
           L 78 31
           A 30 32 0 0 1 22 31
           Z"
        fill={color}
        opacity="0.92"
      />
      {/* 出島内部の建物群を示唆する細線(蘭学倉庫のシルエット) */}
      <g
        fill="none"
        stroke={color}
        strokeWidth="0.6"
        opacity="0"
      >
        {/* 内部線・color 同色のため hidden(視覚的な装飾予備) */}
      </g>
      {/* 港の波 — 出島下方・長崎港の海を表す 2 重の波線 */}
      <g
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.65"
      >
        <path d="M 8 80 Q 16 78 24 80 T 40 80 T 56 80 T 72 80 T 92 80" />
        <path d="M 16 87 Q 24 85 32 87 T 48 87 T 64 87 T 80 87" />
      </g>
    </svg>
  );
}

// 厳島大鳥居 — 593 創建・1875 現存鳥居完成・世界文化遺産 1996。
// 平清盛(1146-1168)が安芸守在任時に整備、海上に建つ鳥居は満潮時に「浮かぶ」独特の景観。
// 高さ 16 m × 笠木 24 m の楠材製、海中に「置いている」だけで自立する重力建築。
// 厳島(宮島)= 神の島で土に足をつけずに参拝する伝統、鳥居も「島と参拝者の境界」として
// 海上に置かれる文化的位置付け。広島の「平和+ 千年文化」を象徴する motif。
function HiroshimaTorii({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 海面の波線 — 鳥居の足元 */}
      <g
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.4"
      >
        <path d="M 10 78 Q 20 76 30 78 T 50 78 T 70 78 T 90 78" />
        <path d="M 14 84 Q 24 82 34 84 T 54 84 T 74 84 T 90 84" />
      </g>
      {/* 笠木(上の横木) — 両端少し反り上がる伝統形状 */}
      <path
        d="M 12 22 Q 50 16 88 22 L 86 28 Q 50 22 14 28 Z"
        fill={color}
      />
      {/* 島木(笠木下の横木) */}
      <rect x="18" y="30" width="64" height="5" fill={color} />
      {/* 貫(中段の横木) */}
      <rect x="22" y="50" width="56" height="3.5" fill={color} />
      {/* 主柱 左 */}
      <rect x="26" y="22" width="6" height="56" fill={color} />
      {/* 主柱 右 */}
      <rect x="68" y="22" width="6" height="56" fill={color} />
      {/* 副柱 左(両部鳥居の特徴) */}
      <rect x="20" y="42" width="3.5" height="36" fill={color} opacity="0.85" />
      {/* 副柱 右(両部鳥居の特徴) */}
      <rect x="76.5" y="42" width="3.5" height="36" fill={color} opacity="0.85" />
      {/* 額束(中央の縦木・「嚴島神社」額) */}
      <rect x="48" y="35" width="4" height="15" fill={color} />
    </svg>
  );
}

// 加賀剣梅鉢(かがけんうめばち)— 前田家家紋・加賀百万石の正紋。
// 中央梅蕊 + 5 弁の梅花(72 度等間隔)+ 5 本の剣(花弁の隙間に外向き)。
// 前田利家(1583 加賀入封)以来の藩主家紋、現代でも金沢市紋・石川県警紋に継承。
// 単純な「梅鉢」ではなく剣を組合せた「剣梅鉢」が前田家固有の意匠。
// 武家の威 + 工芸の精緻 + 加賀百万石の集約 figure。
function IshikawaUmebachi({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 5 本の剣 — 梅花弁の隙間に外向き(36/108/180/252/324 度) */}
      {/* 上向きの剣を base として、5 方向に rotate(中心 50,50) */}
      <g fill={color}>
        <g transform="rotate(36 50 50)">
          <path d="M 48.5 35 L 51.5 35 L 50 8 Z" />
        </g>
        <g transform="rotate(108 50 50)">
          <path d="M 48.5 35 L 51.5 35 L 50 8 Z" />
        </g>
        <g transform="rotate(180 50 50)">
          <path d="M 48.5 35 L 51.5 35 L 50 8 Z" />
        </g>
        <g transform="rotate(252 50 50)">
          <path d="M 48.5 35 L 51.5 35 L 50 8 Z" />
        </g>
        <g transform="rotate(324 50 50)">
          <path d="M 48.5 35 L 51.5 35 L 50 8 Z" />
        </g>
      </g>
      {/* 5 弁の梅花 — 中心から 23 離れた小円(0/72/144/216/288 度・上 12 時開始) */}
      <g fill={color}>
        <circle cx="50" cy="27" r="7.2" />
        <circle cx="71.88" cy="42.89" r="7.2" />
        <circle cx="63.52" cy="68.61" r="7.2" />
        <circle cx="36.48" cy="68.61" r="7.2" />
        <circle cx="28.12" cy="42.89" r="7.2" />
      </g>
      {/* 中央 梅蕊(花心)— 全体の中心点・印章感を強める */}
      <circle cx="50" cy="50" r="4.5" fill={color} />
    </svg>
  );
}

// 加藤清正蛇の目紋(かとうきよまさじゃのめもん)— 熊本城築城藩主 加藤家の家紋。
// 同心円(蛇の目=蛇の眼)で、武家の威 + 火の国の象徴を集約。
// 加藤清正(1562-1611)は 1599 肥後北半 19 万石入封→ 1607 熊本城完成、火の国の祖と
// される存在。蛇の目紋は加藤家定紋の 1 つで、現代でも熊本城・加藤神社で見られる。
// 大胆な同心円で「印を押した」感を最大化。京都七宝(4 重ね円)と差別化:こちらは 1 環 + 中心。
function KumamotoJano({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 主環 — 蛇の目環(太い stroke で「目」のリングを表現) */}
      <circle
        cx="50"
        cy="50"
        r="32"
        fill="none"
        stroke={color}
        strokeWidth="8"
      />
      {/* 中心(目) — filled circle */}
      <circle cx="50" cy="50" r="11" fill={color} />
    </svg>
  );
}

// ねぶた山車燈籠(青森ねぶた・国指定無形民俗 1980)— 青森三大ねぶた(青森ねぶた・
// 弘前ねぷた・五所川原立佞武多)を集約した motif。八角灯籠 silhouette + 上部に跳人(haneto)
// の三扇 + 内部の燈火 + 横筋(竹輪枠)+ 下部に山車車輪 2 つ + 横軸の cart-base。
// 既存 motif と被らない構成:
//   ・北辰星(polygon)・七宝(円輪 4)・三巴(回転)・神鹿(動物)・千成瓢箪(房)・
//     錨(海具)・富士(山)・出島(D 字)・厳島鳥居(門)・梅鉢(花弁)・蛇の目(同心円)
//   と、本 motif は「車輪付きの祭り山車」という動的構図で識別性高い。
// ねぶた = 「眠流し」(七夕の睡魔流し)由来説と「灯籠流し」由来説。1722 弘前藩四代藩主
// 信寿の供奉行列に「ねふた灯籠」が出たのが文献初出、起源は江戸初期に遡る民俗芸能。
function AomoriNebuta({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 跳人(はねと)の三扇 — 灯籠上方に立つ羽根冠・3 個の三角扇で festival 感 */}
      <g fill={color}>
        {/* 左扇 */}
        <path d="M 30 22 L 33 10 L 38 22 Z" />
        {/* 中央扇 — 一回り大きく */}
        <path d="M 44 21 L 50 6 L 56 21 Z" />
        {/* 右扇 */}
        <path d="M 62 22 L 67 10 L 70 22 Z" />
      </g>
      {/* 灯籠 silhouette — 八角輪郭(stroke で「紙を竹枠に張った灯籠」感) */}
      <polygon
        points="32,24 68,24 78,34 78,62 68,72 32,72 22,62 22,34"
        fill="none"
        stroke={color}
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      {/* 灯籠内部の燈火(火) — 中央 filled disk・燈籠の内に燃える火 */}
      <circle cx="50" cy="48" r="6" fill={color} />
      {/* 灯籠の竹輪枠 — 上下 2 本の横筋(紙灯籠の構造線) */}
      <g
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.9"
      >
        <line x1="26" y1="38" x2="74" y2="38" />
        <line x1="26" y1="58" x2="74" y2="58" />
      </g>
      {/* 山車の cart-base 横軸 + 2 車輪 — ねぶたの曳き山車を表す */}
      <line
        x1="36"
        y1="80"
        x2="64"
        y2="80"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <g fill={color}>
        <circle cx="36" cy="86" r="4.5" />
        <circle cx="64" cy="86" r="4.5" />
      </g>
    </svg>
  );
}

// 南部鉄瓶(なんぶてつびん)— 国指定伝統的工芸品 1975・盛岡 + 水沢の鋳鉄文化。
// 原型は 17 世紀盛岡藩主 南部信直が京都から鋳物師招聘して茶釜製造を始めたのが起源。
// 「あられ」(鉄瓶表面の格子状突起紋)が独特の意匠で、鉄分を活かす柔らかい湯と
// 共に世界的に評価される。形状:丸い胴体 + 取手(つる弓形)+ 注口 + 蓋 + つまみ。
// 既存 motif と被らない構成:鋳鉄黒に銀光・茶器という他県にない category。
function IwateTetsubin({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 取手(つる)— 上部の弓形 */}
      <path
        d="M 30 25 Q 50 10 70 25"
        fill="none"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* 蓋つまみ — 取手下中央の小円 */}
      <circle cx="50" cy="27" r="2.4" fill={color} />
      {/* 蓋 — 横帯 */}
      <rect x="40" y="29" width="20" height="3" fill={color} />
      {/* 鉄瓶 胴体(丸み + 末広)— 上口広 + 中央膨らみ + 底狭) */}
      <path
        d="M 30 33
           Q 25 50 30 67
           L 33 76
           L 67 76
           L 70 67
           Q 75 50 70 33
           Z"
        fill="none"
        stroke={color}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      {/* 注口 — 右上の三角注ぎ口 */}
      <path d="M 70 38 L 82 36 L 80 43 L 70 43 Z" fill={color} />
      {/* あられ模様(突起紋)— 胴体表面に格子状ドット 5 列 × 3 行 */}
      <g fill={color}>
        {/* 行 1(上段) */}
        <circle cx="38" cy="46" r="1.4" />
        <circle cx="44" cy="46" r="1.4" />
        <circle cx="50" cy="46" r="1.4" />
        <circle cx="56" cy="46" r="1.4" />
        <circle cx="62" cy="46" r="1.4" />
        {/* 行 2(中段) */}
        <circle cx="36" cy="55" r="1.4" />
        <circle cx="43" cy="55" r="1.4" />
        <circle cx="50" cy="55" r="1.4" />
        <circle cx="57" cy="55" r="1.4" />
        <circle cx="64" cy="55" r="1.4" />
        {/* 行 3(下段) */}
        <circle cx="38" cy="64" r="1.4" />
        <circle cx="44" cy="64" r="1.4" />
        <circle cx="50" cy="64" r="1.4" />
        <circle cx="56" cy="64" r="1.4" />
        <circle cx="62" cy="64" r="1.4" />
      </g>
    </svg>
  );
}

// なまはげ面(秋田男鹿半島・国指定重要無形民俗文化財 1978 + UNESCO 無形文化遺産 2018)。
// 男鹿半島の小正月(1/15)に「ナマハゲ」と呼ばれる赤鬼/青鬼面をかぶった若者が家々を
// 訪問し、子供達に「泣ぐ子はいねがー」と威嚇する伝統民俗。秋田の最も国際認知度高い文化。
// 形状:逆三角顔 + 大円目 2 つ + 角 2 本(top)+ 牙 2 本(下)+ 鼻 + 横口。
// 既存 motif と被らない構成:鬼面という他県にない category。
function AkitaNamahage({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 角(つの) 2 本 — 顔の上に外向き突出 */}
      <path d="M 32 22 L 26 8 L 38 18 Z" fill={color} />
      <path d="M 68 22 L 74 8 L 62 18 Z" fill={color} />
      {/* 顔 silhouette — 逆三角(menacing)で広額狭顎 */}
      <path
        d="M 22 24
           Q 22 22 25 22
           L 75 22
           Q 78 22 78 24
           L 70 70
           Q 68 78 64 82
           L 50 88
           L 36 82
           Q 32 78 30 70
           Z"
        fill="none"
        stroke={color}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      {/* 大円目 2 つ — 怖い表情の中心要素 */}
      <circle cx="38" cy="42" r="6.5" fill={color} />
      <circle cx="62" cy="42" r="6.5" fill={color} />
      {/* 鼻 — 三角小・顔中央 */}
      <path d="M 47 54 L 53 54 L 50 62 Z" fill={color} />
      {/* 牙 2 本 — 口の両端から下に突出 */}
      <path d="M 41 65 L 43 75 L 45 65 Z" fill={color} />
      <path d="M 55 65 L 57 75 L 59 65 Z" fill={color} />
      {/* 口 — 横線(歯食いしばり感) */}
      <line
        x1="40"
        y1="68"
        x2="60"
        y2="68"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 仙台藩伊達家「竹に雀」家紋(たけにすずめ)— 仙台藩伊達政宗以来の正紋。
// 1601 仙台開府以来の藩主家紋で、青葉城 + 瑞鳳殿 + 仙台市紋にも継承。
// 構造:2 本竹で円輪(竹環)を作り、輪の中央に向かい合う雀 2 羽 — 但し小サイズ
// 識別性のため中央に 1 羽の飛雀シルエットに簡約。竹節の tick + 笹葉 4 方向で
// 「杜の都」(City of Trees)のニュアンスを補強。
function MiyagiSendaiBamboo({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 竹環 — 内側の主環(stroke で「竹を環状に組んだ」表現) */}
      <circle
        cx="50"
        cy="50"
        r="32"
        fill="none"
        stroke={color}
        strokeWidth="2.4"
      />
      {/* 竹節 — 主環上の 4 方向 + 4 斜の短い tick(竹の節目) */}
      <g fill={color}>
        <rect x="49" y="14" width="2" height="6" />
        <rect x="49" y="80" width="2" height="6" />
        <rect x="14" y="49" width="6" height="2" />
        <rect x="80" y="49" width="6" height="2" />
      </g>
      {/* 笹葉 — 4 斜方向に小さな竹葉(細長い菱形) */}
      <g fill={color} opacity="0.7">
        <path d="M 25 22 L 22 19 L 28 17 L 31 20 Z" />
        <path d="M 75 22 L 78 19 L 72 17 L 69 20 Z" />
        <path d="M 25 78 L 22 81 L 28 83 L 31 80 Z" />
        <path d="M 75 78 L 78 81 L 72 83 L 69 80 Z" />
      </g>
      {/* 中央 飛雀 — 横向き silhouette(伊達家紋の核) */}
      <g fill={color}>
        {/* 胴体 — 横長楕円 */}
        <ellipse cx="48" cy="52" rx="9" ry="6" />
        {/* 頭 — 胴の右上に小円 */}
        <circle cx="56" cy="48" r="4" />
        {/* 嘴 — 頭右 small triangle */}
        <path d="M 60 48 L 65 47 L 60 50 Z" />
        {/* 翼 — 上向きに開く三角(羽ばたき) */}
        <path d="M 47 47 L 40 38 L 44 51 Z" />
        {/* 尾 — 後方に向ける三角 */}
        <path d="M 40 53 L 34 55 L 39 57 Z" />
        {/* 目 — 頭の小白点(中心 stamp 感) */}
        <circle cx="56" cy="47" r="0.9" fill={color === "currentColor" ? "white" : color} opacity="0" />
      </g>
    </svg>
  );
}

// 紅花(べにばな)— 山形最上紅花は江戸期に染料生産日本一、「最上千両」と呼ばれた。
// 紅花染は加賀友禅・京紅・江戸紅型の朱赤源料・口紅 + 化粧紅 + 食紅にも使用。
// 構造:6 弁の花 60 度等分 + 中央花心 + 樹氷(蔵王の冬の樹氷原)を 6 角形で暗示。
// 6 弁(蜂の巣 hex 構造)で蔵王樹氷の冬+紅花の夏を 1 印に集約。
function YamagataBeniHana({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 樹氷 — 6 方向の angular accent(蔵王冬の rime ice 暗示・faint) */}
      <g fill={color} opacity="0.4">
        <path d="M 50 12 L 47 19 L 53 19 Z" />
        <g transform="rotate(60 50 50)">
          <path d="M 50 12 L 47 19 L 53 19 Z" />
        </g>
        <g transform="rotate(120 50 50)">
          <path d="M 50 12 L 47 19 L 53 19 Z" />
        </g>
        <g transform="rotate(180 50 50)">
          <path d="M 50 12 L 47 19 L 53 19 Z" />
        </g>
        <g transform="rotate(240 50 50)">
          <path d="M 50 12 L 47 19 L 53 19 Z" />
        </g>
        <g transform="rotate(300 50 50)">
          <path d="M 50 12 L 47 19 L 53 19 Z" />
        </g>
      </g>
      {/* 紅花 6 弁 — teardrop 弁を 60 度等分(中央花心から外向き) */}
      <g fill={color}>
        <path d="M 50 50 Q 44 40 50 24 Q 56 40 50 50 Z" />
        <g transform="rotate(60 50 50)">
          <path d="M 50 50 Q 44 40 50 24 Q 56 40 50 50 Z" />
        </g>
        <g transform="rotate(120 50 50)">
          <path d="M 50 50 Q 44 40 50 24 Q 56 40 50 50 Z" />
        </g>
        <g transform="rotate(180 50 50)">
          <path d="M 50 50 Q 44 40 50 24 Q 56 40 50 50 Z" />
        </g>
        <g transform="rotate(240 50 50)">
          <path d="M 50 50 Q 44 40 50 24 Q 56 40 50 50 Z" />
        </g>
        <g transform="rotate(300 50 50)">
          <path d="M 50 50 Q 44 40 50 24 Q 56 40 50 50 Z" />
        </g>
      </g>
      {/* 中央花心 — 紅花の蕊(stamp) */}
      <circle cx="50" cy="50" r="6" fill={color} />
      {/* 中央 inner ring — 花心の細部・stamp seal の depth */}
      <circle
        cx="50"
        cy="50"
        r="3"
        fill="none"
        stroke={color}
        strokeWidth="0.9"
        opacity="0.55"
      />
    </svg>
  );
}

// 鶴ヶ城(つるがじょう)— 会津若松城・1593 蒲生氏郷築造・葦名祖先葦名直盛 1384 黒川城前身。
// 1868 戊辰戦争で白虎隊隊士 16-17 歳 19 名自刃の地、戦後修復で天守復元 1965。
// 5 重 5 階の天守は会津のシンボルで、福島県内最も認知度高い城。
// 構造:5 重 silhouette を upward-narrowing で積層、各層に屋根 eaves 突出、
// 最上層に finial spire、基底に石垣 band。stamp 感のため fill ベタ塗。
function FukushimaTsurugajou({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 5 重天守 — 上層から下層へ、各層 trapezoid + eaves */}
      <g fill={color}>
        {/* 第 5 層 finial — 鯱鉾 spire */}
        <path d="M 49 14 L 50 9 L 51 14 Z" />
        <rect x="48" y="14" width="4" height="2" />
        {/* 第 5 層(最上)body */}
        <rect x="44" y="17" width="12" height="5" />
        {/* 第 5 層 eaves — 屋根 trapezoid */}
        <path d="M 40 22 L 60 22 L 58 26 L 42 26 Z" />
        {/* 第 4 層 body */}
        <rect x="40" y="27" width="20" height="5" />
        {/* 第 4 層 eaves */}
        <path d="M 35 32 L 65 32 L 63 36 L 37 36 Z" />
        {/* 第 3 層 body */}
        <rect x="35" y="37" width="30" height="5" />
        {/* 第 3 層 eaves */}
        <path d="M 30 42 L 70 42 L 67 47 L 33 47 Z" />
        {/* 第 2 層 body */}
        <rect x="30" y="48" width="40" height="6" />
        {/* 第 2 層 eaves */}
        <path d="M 25 54 L 75 54 L 71 60 L 29 60 Z" />
        {/* 第 1 層 body — 最下層・最大 */}
        <rect x="24" y="61" width="52" height="8" />
        {/* 第 1 層 eaves */}
        <path d="M 18 69 L 82 69 L 77 76 L 23 76 Z" />
      </g>
      {/* 石垣 — 基底の faint band(城の土台暗示) */}
      <rect
        x="20"
        y="78"
        width="60"
        height="6"
        fill={color}
        opacity="0.5"
      />
      {/* 石垣 corner ticks — 切石積みの 2 縦線 */}
      <g stroke={color} strokeWidth="0.9" opacity="0.5">
        <line x1="36" y1="78" x2="36" y2="84" />
        <line x1="64" y1="78" x2="64" y2="84" />
      </g>
    </svg>
  );
}

// 三つ葉葵(みつばあおい)+ 偕楽園梅 — 水戸徳川家(徳川御三家・水戸藩 35 万石)
// 支家紋 + 偕楽園 1842 徳川斉昭築・3000 本梅林日本三名園・現代水戸の象徴 2 大シンボル。
// 構造:中央に三つ葉葵 3 枚 120 度配置(ハート形葉 + 中心軸)、外周に偕楽園梅 5 弁
// faint 配置(opacity 0.5)で「徳川 + 梅」の二重織り。
// 水戸黄門光圀公 1628-1700 隠居の地・「梅花の大義」が水戸学の理念。
function IbarakiBaiKa({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 偕楽園梅 — 外周 5 弁(72 度等分・faint で背景的に) */}
      <g fill={color} opacity="0.5">
        <circle cx="50" cy="14" r="4.5" />
        <circle cx="84.24" cy="38.87" r="4.5" />
        <circle cx="71.16" cy="79.13" r="4.5" />
        <circle cx="28.84" cy="79.13" r="4.5" />
        <circle cx="15.76" cy="38.87" r="4.5" />
      </g>
      {/* 三つ葉葵 — 中央・3 葉 120 度配置(徳川支家紋) */}
      <g fill={color}>
        {/* 葉 1 — 12 時方向(上向き) heart-leaf shape */}
        <path
          d="M 50 50
             Q 44 50 41 44
             Q 41 36 47 32
             Q 50 28 53 32
             Q 59 36 59 44
             Q 56 50 50 50 Z"
        />
        {/* 葉 2 — 4 時方向(120 度) */}
        <g transform="rotate(120 50 50)">
          <path
            d="M 50 50
               Q 44 50 41 44
               Q 41 36 47 32
               Q 50 28 53 32
               Q 59 36 59 44
               Q 56 50 50 50 Z"
          />
        </g>
        {/* 葉 3 — 8 時方向(240 度) */}
        <g transform="rotate(240 50 50)">
          <path
            d="M 50 50
               Q 44 50 41 44
               Q 41 36 47 32
               Q 50 28 53 32
               Q 59 36 59 44
               Q 56 50 50 50 Z"
          />
        </g>
      </g>
      {/* 中央集約点 — 三つ葉葵の蕾蘂 */}
      <circle cx="50" cy="50" r="3.2" fill={color} />
    </svg>
  );
}

// 三猿(さんざる)— 日光東照宮 1636 神厩舎彫刻・「見ざる聞かざる言わざる」。
// 中国「論語」の「礼にあらざれば視ること勿れ、聴くこと勿れ、言うこと勿れ」由来、
// 日本江戸期に 3 匹の猿として固定。東照宮の世遺彫刻として全国認知度高い。
// 構造:3 匹の猿頭を 120 度配置 + 中央集約点。各猿頭は内側に hollow eye 2 つ
// (覆われた目を「stroke ring」で表現)+ 隠された輪郭(silent state の暗示)。
function TochigiToushou({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 中央集約点 — 三猿の中心(stamp seal) */}
      <circle cx="50" cy="50" r="3.6" fill={color} />
      {/* 3 猿の頭 — 120 度配置 */}
      <g fill={color}>
        {/* 上(見ざる)— filled head + hollow eyes + 両手覆い */}
        <circle cx="50" cy="22" r="11" />
        {/* 120 度(聞かざる)*/}
        <g transform="rotate(120 50 50)">
          <circle cx="50" cy="22" r="11" />
        </g>
        {/* 240 度(言わざる)*/}
        <g transform="rotate(240 50 50)">
          <circle cx="50" cy="22" r="11" />
        </g>
      </g>
      {/* 各猿の hollow eyes(覆われた目) + 耳 — outline で「閉じた感覚」を表現 */}
      <g fill="none" stroke={color} strokeWidth="1.4">
        {/* 上 */}
        <circle cx="46" cy="22" r="1.6" />
        <circle cx="54" cy="22" r="1.6" />
        {/* 120 度 */}
        <g transform="rotate(120 50 50)">
          <circle cx="46" cy="22" r="1.6" />
          <circle cx="54" cy="22" r="1.6" />
        </g>
        {/* 240 度 */}
        <g transform="rotate(240 50 50)">
          <circle cx="46" cy="22" r="1.6" />
          <circle cx="54" cy="22" r="1.6" />
        </g>
      </g>
      {/* 各猿の小耳 — 頭の左右上方に小三角(faint)*/}
      <g fill={color} opacity="0.65">
        <path d="M 41 14 L 39 11 L 43 12 Z" />
        <path d="M 59 14 L 61 11 L 57 12 Z" />
        <g transform="rotate(120 50 50)">
          <path d="M 41 14 L 39 11 L 43 12 Z" />
          <path d="M 59 14 L 61 11 L 57 12 Z" />
        </g>
        <g transform="rotate(240 50 50)">
          <path d="M 41 14 L 39 11 L 43 12 Z" />
          <path d="M 59 14 L 61 11 L 57 12 Z" />
        </g>
      </g>
    </svg>
  );
}

// 高崎達磨(たかさきだるま)— 群馬高崎市の縁起物・1697 高崎少林山達磨寺起源・
// 全国生産シェア 80%・厄除け開運祈願の郷土玩具・「願掛けの両眼」が独特の文化。
// 願事を立てて左眼(向かって右)を墨で塗り、達成時に右眼(向かって左)を入れる。
// 構造:卵形 silhouette + 願掛けの両眼(片方 filled・片方 hollow ring)+
// 横筋(腹巻き)+ 「福」印(篆刻風)で 高崎達磨の特徴を集約。
function GunmaDaruma({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 達磨 silhouette — 卵形(下重・上窄)を fill で */}
      <path
        d="M 50 14
           C 32 14 26 30 26 48
           C 26 64 32 84 50 84
           C 68 84 74 64 74 48
           C 74 30 68 14 50 14 Z"
        fill="none"
        stroke={color}
        strokeWidth="2.8"
      />
      {/* 願掛けの両眼 — 左眼 filled(願をかけた時に塗る)*/}
      <circle cx="42" cy="40" r="5.5" fill={color} />
      {/* 右眼 — hollow ring(願達成時に入れる・現在は未入れ)*/}
      <circle
        cx="58"
        cy="40"
        r="5.5"
        fill="none"
        stroke={color}
        strokeWidth="2.4"
      />
      {/* 鬚 ヒゲ — 短い 2 弧(達磨の朱髭)*/}
      <g
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        <path d="M 40 54 Q 44 58 48 56" />
        <path d="M 60 54 Q 56 58 52 56" />
      </g>
      {/* 福 印 — body 下部に篆刻風 small frame(達磨腹に貼る朱札の暗示)*/}
      <rect
        x="44"
        y="65"
        width="12"
        height="12"
        fill="none"
        stroke={color}
        strokeWidth="1.2"
      />
      {/* 福 字を暗示する内部 strokes(縦 + 横で抽象化)*/}
      <g stroke={color} strokeWidth="0.9" opacity="0.7">
        <line x1="50" y1="67" x2="50" y2="75" />
        <line x1="46" y1="71" x2="54" y2="71" />
      </g>
    </svg>
  );
}

// 武州井桁紋(ぶしゅういげたもん)+ 4 角藍渦 — 武州正藍染ギルド標 + 葉藍醗酵の渦。
// 武州正藍染は埼玉北部(羽生・加須・行田・騎西)江戸期からの染色業、
// 武州織物工業協同組合 1949 創立 14 軒のうち 11 軒が羽生に所在、
// 剣道着 全国 80% シェア。井桁(井形)= 染料醗酵の桶を 4 本柱で組む構造の暗示、
// かつ井=藍染ギルド傳統の家紋 motif。4 角の小渦は 葉藍が桶の中で醗酵する渦の象徴。
// 川越時の鐘 1894 + 加須鯉のぼり 全国一 + 行田足袋 80% も含む武蔵 4 文化を
// 「井桁 + 渦」のミニマル幾何で集約。
function SaitamaBushuAi({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 4 角 藍渦 — 4 隅の小 swirl(葉藍醗酵の渦・faint)*/}
      <g fill={color} opacity="0.55">
        {/* 上左 */}
        <path d="M 22 22 Q 18 22 18 26 Q 22 30 26 26 Q 26 22 22 22 Z" />
        {/* 上右 */}
        <path d="M 78 22 Q 82 22 82 26 Q 78 30 74 26 Q 74 22 78 22 Z" />
        {/* 下左 */}
        <path d="M 22 78 Q 18 78 18 74 Q 22 70 26 74 Q 26 78 22 78 Z" />
        {/* 下右 */}
        <path d="M 78 78 Q 82 78 82 74 Q 78 70 74 74 Q 74 78 78 78 Z" />
      </g>
      {/* 中央 井桁紋 — 2 横棒 + 2 縦棒で「井」字を構成 */}
      <g fill={color}>
        {/* 横棒 上 */}
        <rect x="32" y="40" width="36" height="4.4" />
        {/* 横棒 下 */}
        <rect x="32" y="55.6" width="36" height="4.4" />
        {/* 縦棒 左 */}
        <rect x="40" y="32" width="4.4" height="36" />
        {/* 縦棒 右 */}
        <rect x="55.6" y="32" width="4.4" height="36" />
      </g>
      {/* 中央 集約点 — 井の中心(藍染桶の depth 暗示)*/}
      <circle cx="50" cy="50" r="2.6" fill={color} opacity="0.7" />
    </svg>
  );
}

// 千葉氏月星紋 — 千葉氏(平安末~戦国初)の家紋。妙見信仰由来。
// 千葉氏は北辰妙見尊星王(北極星 + 北斗七星)を氏神とし、千葉神社・妙見寺を中心に
// 房総三国(下総 + 上総 + 安房)を支配した。家紋「月星」は天空の北辰一星(中央)
// + 北斗の三日月(下方)を組み合わせた構図。
// 平面意匠としては 三日月(下凹弧)+ 上中央に大星 1 つ + 微小な周辺七星(faint)で構成。
// 房総半島の海空青 + 妙見星辰信仰 + 千葉県都の歴史軸を統合する seal motif。
function ChibaTsukihoshi({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 内側 faint ring — 妙見天空界の暗示(layering) */}
      <circle
        cx="50"
        cy="50"
        r="36"
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        opacity="0.2"
      />
      {/* 三日月 — 下方 crescent(月輪 = 下凹弧 + 内側を欠く)*/}
      {/* 外円 fill - 内円 cut で crescent を作る */}
      <path
        d="M 50 73 A 26 26 0 1 1 50 22 A 20 20 0 1 0 50 73 Z"
        fill={color}
        opacity="0.78"
      />
      {/* 中央 北辰一星 — 月の上方中央に 8 弁星(妙見尊星王) */}
      <g fill={color}>
        {/* 8 弁星 ─ 縦 + 横 + 斜め 4 軸の菱形重ね */}
        <polygon points="50,30 53.4,44 50,42 46.6,44" />
        <polygon points="50,54 53.4,40 50,42 46.6,40" />
        <polygon points="36,42 48,38.6 50,42 48,45.4" />
        <polygon points="64,42 52,38.6 50,42 52,45.4" />
        {/* 中心 round dot — 極星の核 */}
        <circle cx="50" cy="42" r="2.8" />
      </g>
      {/* 周辺 七星 faint — 北斗七星の微小暗示(opacity 0.32) */}
      <g fill={color} opacity="0.32">
        <circle cx="22" cy="36" r="1.4" />
        <circle cx="28" cy="28" r="1.4" />
        <circle cx="36" cy="22" r="1.4" />
        <circle cx="64" cy="22" r="1.4" />
        <circle cx="72" cy="28" r="1.4" />
        <circle cx="78" cy="36" r="1.4" />
        <circle cx="50" cy="14" r="1.6" />
      </g>
    </svg>
  );
}

// 江戸切子菊文様 — 1834 加賀屋久兵衛発祥 191+ 年・国指定伝統工芸品 2002・
// 江戸切子の代表 14 紋様(菊+ 麻の葉+ 矢来+ 七宝+ 蜘蛛巣+ 籠目+ 八角籠目+
// 笹の葉+ 魚子+ 米+ 八重菊+ 万華鏡+ 砂切子+ 流線)中で「菊文様」が最 family-crest 風。
// 8 弁菊(中央)+ 8 角放射(60 度斜格子・江戸切子特有のカット角)+ 中心球で構成。
// 江戸職人技を象徴・東京固有の伝統工芸 motif として識別性高い。
function EdoKiriko({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 8 角放射(60 度斜格子・江戸切子特有のカット角)*/}
      <g fill={color} opacity="0.55">
        {/* 8 弁放射 — 各弁は内尖+ 外円弧の細い菱形 */}
        <path d="M 50 8 L 53 42 L 50 46 L 47 42 Z" />
        <path d="M 50 92 L 53 58 L 50 54 L 47 58 Z" />
        <path d="M 8 50 L 42 53 L 46 50 L 42 47 Z" />
        <path d="M 92 50 L 58 53 L 54 50 L 58 47 Z" />
        <path d="M 20 20 L 44 47 L 50 50 L 47 44 Z" />
        <path d="M 80 20 L 56 47 L 50 50 L 53 44 Z" />
        <path d="M 20 80 L 44 53 L 50 50 L 47 56 Z" />
        <path d="M 80 80 L 56 53 L 50 50 L 53 56 Z" />
      </g>
      {/* 内側中央の 8 弁菊 — 江戸切子特有の細いカット菊弁 */}
      <g fill={color}>
        {/* 中央 8 弁菊(小)— 角度 0/45/90/135/180/225/270/315 */}
        <ellipse cx="50" cy="34" rx="2" ry="6" />
        <ellipse cx="50" cy="66" rx="2" ry="6" />
        <ellipse cx="34" cy="50" rx="6" ry="2" />
        <ellipse cx="66" cy="50" rx="6" ry="2" />
        {/* 斜め 4 弁(小)*/}
        <ellipse cx="38.6" cy="38.6" rx="3" ry="2" transform="rotate(-45 38.6 38.6)" />
        <ellipse cx="61.4" cy="38.6" rx="3" ry="2" transform="rotate(45 61.4 38.6)" />
        <ellipse cx="38.6" cy="61.4" rx="3" ry="2" transform="rotate(45 38.6 61.4)" />
        <ellipse cx="61.4" cy="61.4" rx="3" ry="2" transform="rotate(-45 61.4 61.4)" />
        {/* 中央球 — 切子球の核 */}
        <circle cx="50" cy="50" r="3.2" />
      </g>
      {/* 内側 faint ring — 切子球の二層構造 */}
      <circle
        cx="50"
        cy="50"
        r="28"
        fill="none"
        stroke={color}
        strokeWidth="0.7"
        opacity="0.25"
      />
    </svg>
  );
}

// 神奈川沖浪裏 — 葛飾北斎「冨嶽三十六景・神奈川沖浪裏」1830-32 の波頭を象徴。
// 北斎波は世界で最 iconic な日本美術 motif の 1+ 神奈川県観光のシンボル。
// 3 巻波頭(左右大波 + 中央小波)+ 中央富士山小三角(遠景)+ faint outer circle で構成。
// シルエット化して落款風に表現・小サイズでも識別可能。
function KanagawaNami({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 北斎風大波頭(左)— 巻波の渦+ 波頭爪 */}
      <path
        d="M 12 60
           Q 20 38 35 42
           Q 30 50 25 56
           Q 22 58 24 62
           Q 28 60 32 56
           Q 30 64 26 70
           Q 18 72 12 60 Z"
        fill={color}
        opacity="0.85"
      />
      {/* 北斎風大波頭(右)— 左右ペアで対称 */}
      <path
        d="M 88 60
           Q 80 38 65 42
           Q 70 50 75 56
           Q 78 58 76 62
           Q 72 60 68 56
           Q 70 64 74 70
           Q 82 72 88 60 Z"
        fill={color}
        opacity="0.85"
      />
      {/* 中央 富士山(遠景・小三角)*/}
      <path d="M 42 64 L 50 48 L 58 64 Z" fill={color} opacity="0.6" />
      {/* 富士山頂雪冠 — 三角頂部 white-ish faint */}
      <path
        d="M 47 54 L 50 48 L 53 54 L 51 55 L 50 53 L 49 55 Z"
        fill={color}
        opacity="0.25"
      />
      {/* 波底 base line — 海面の暗示 */}
      <path
        d="M 12 70 Q 30 76 50 72 Q 70 76 88 70"
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        opacity="0.5"
      />
      {/* 波頭散水滴 — 北斎風 splatter (3 small dots) */}
      <g fill={color} opacity="0.55">
        <circle cx="22" cy="34" r="1.4" />
        <circle cx="78" cy="34" r="1.4" />
        <circle cx="40" cy="30" r="1.2" />
        <circle cx="60" cy="30" r="1.2" />
      </g>
    </svg>
  );
}

// オリーブ枝葉+実 — 小豆島 1908 米国カリフォルニアから移植 117+ 年・
// 全国オリーブ生産首位 + 香川県の木 1968 + 県の花(オリーブ花) 1954。
// 小豆島町池田半島 1908 三浦春馬らによる試験栽培開始。
// 縦軸の枝 + 上下対称 6-8 葉 + 中央に大きなオリーブ実 1 つ + 小実 2 つ。
// シンプルなボタニカル motif として全 prefecture 唯一の緑系で識別性高い。
function KagawaOlive({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 中央枝 — 縦軸オリーブ枝 */}
      <path
        d="M 50 18 L 50 82"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        opacity="0.7"
      />
      {/* 葉 4 対(8 葉)— 楕円形オリーブ葉 上下対称 */}
      <g fill={color} opacity="0.78">
        {/* 上 1 対 */}
        <ellipse cx="36" cy="28" rx="9" ry="3.4" transform="rotate(-30 36 28)" />
        <ellipse cx="64" cy="28" rx="9" ry="3.4" transform="rotate(30 64 28)" />
        {/* 上中 1 対 */}
        <ellipse cx="32" cy="40" rx="11" ry="3.8" transform="rotate(-25 32 40)" />
        <ellipse cx="68" cy="40" rx="11" ry="3.8" transform="rotate(25 68 40)" />
        {/* 下中 1 対 */}
        <ellipse cx="32" cy="60" rx="11" ry="3.8" transform="rotate(25 32 60)" />
        <ellipse cx="68" cy="60" rx="11" ry="3.8" transform="rotate(-25 68 60)" />
        {/* 下 1 対 */}
        <ellipse cx="36" cy="72" rx="9" ry="3.4" transform="rotate(30 36 72)" />
        <ellipse cx="64" cy="72" rx="9" ry="3.4" transform="rotate(-30 64 72)" />
      </g>
      {/* 中央オリーブ実 — 大 1 つ + 小 2 つ */}
      <g fill={color}>
        <ellipse cx="50" cy="50" rx="5" ry="6.5" />
        <ellipse cx="42" cy="56" rx="3" ry="4" />
        <ellipse cx="58" cy="56" rx="3" ry="4" />
      </g>
      {/* 葉脈 highlight (faint white-ish) — 立体感 */}
      <g fill="none" stroke={color} strokeWidth="0.5" opacity="0.3">
        <path d="M 42 50 Q 50 51 58 50" />
      </g>
    </svg>
  );
}

// 鳴門の渦潮 — 鳴門海峡 直径 30m 世界最大級渦潮 + 大鳴門橋 1985(全長 1629m)。
// 瀬戸内海と太平洋(紀伊水道)の潮位差で 1 日 4 回大渦が発生・春秋大潮時に最大渦。
// 二重スパイラル(渦潮の左右回転)+ 中央渦核+ 外周大鳴門橋の橋脚 silhouette。
// 阿波踊り装束色とも調和する朱橙色 motif。落款風で識別性高い。
function NarutoUzu({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 大鳴門橋 上部 silhouette — 主塔 2 本 + 桁 */}
      <g fill={color} opacity="0.35">
        <rect x="22" y="12" width="2.4" height="14" />
        <rect x="76" y="12" width="2.4" height="14" />
        <rect x="14" y="22" width="72" height="1.4" />
        <path d="M 14 24 Q 50 14 86 24 L 86 26 Q 50 16 14 26 Z" />
      </g>
      {/* 渦潮メイン — 左巻スパイラル(中心点から外へ) */}
      <path
        d="M 50 50
           Q 56 50 56 56
           Q 56 64 48 64
           Q 38 64 38 54
           Q 38 40 52 40
           Q 70 40 70 58
           Q 70 78 46 78"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* 渦中央核 — 渦の中心 */}
      <circle cx="50" cy="50" r="2.8" fill={color} />
      {/* 副渦 — 左右の小渦(faint) */}
      <g fill="none" stroke={color} strokeWidth="1.4" opacity="0.45">
        {/* 左小渦 */}
        <path d="M 22 60 Q 26 56 30 60 Q 30 66 24 66" />
        {/* 右小渦 */}
        <path d="M 78 60 Q 74 56 70 60 Q 70 66 76 66" />
      </g>
      {/* 波頭水滴 — 渦周辺の白波(faint) */}
      <g fill={color} opacity="0.4">
        <circle cx="32" cy="44" r="1.2" />
        <circle cx="68" cy="44" r="1.2" />
        <circle cx="40" cy="80" r="1.4" />
        <circle cx="60" cy="80" r="1.4" />
      </g>
    </svg>
  );
}

// 道後温泉湯桁文 — 道後温泉(日本最古 3000 年伝承)+ 蜜柑(全国 2 位)+ 椿(伊予椿伝承)。
// 中央:湯壷オーバル(道後温泉本館 1894・神の湯)+ 立ち上る湯気 3 本(♨ stylized)。
// 右上:蜜柑実(円 + 葉)・左下:椿花(5 弁)。
// 落款風 outer circle r=46 faint。下部:湯桁(井桁紋・温泉場の標)。
function EhimeDogoYu({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 湯気 3 本 — 道後温泉♨マーク stylized・上方湯気・微かに揺れる線 */}
      <g fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
        <path d="M 38 32 Q 36 26 39 22 Q 42 18 38 12" opacity="0.85" />
        <path d="M 50 30 Q 48 24 51 20 Q 54 16 50 10" />
        <path d="M 62 32 Q 60 26 63 22 Q 66 18 62 12" opacity="0.85" />
      </g>
      {/* 湯壷 — 中央オーバル(道後温泉本館の神の湯) */}
      <ellipse cx="50" cy="52" rx="20" ry="7" fill={color} opacity="0.85" />
      {/* 湯壷縁 — 上部 highlight */}
      <ellipse cx="50" cy="49" rx="20" ry="2" fill={color} opacity="0.45" />
      {/* 湯桁紋 — 下部井桁(温泉場の標) */}
      <g fill="none" stroke={color} strokeWidth="2" opacity="0.7">
        <line x1="38" y1="68" x2="38" y2="82" />
        <line x1="62" y1="68" x2="62" y2="82" />
        <line x1="32" y1="72" x2="68" y2="72" />
        <line x1="32" y1="78" x2="68" y2="78" />
      </g>
      {/* 蜜柑実 — 右上(全国 2 位の蜜柑生産) */}
      <g fill={color}>
        <circle cx="78" cy="22" r="4" opacity="0.85" />
        <path
          d="M 76 18 Q 78 14 82 16 Q 80 19 78 19 Z"
          opacity="0.6"
        />
      </g>
      {/* 椿花 — 左下(伊予椿・道後椿之湯)・5 弁簡略化 */}
      <g fill={color} opacity="0.7">
        <circle cx="22" cy="78" r="1.2" />
        <ellipse cx="20" cy="74" rx="2" ry="3" transform="rotate(-30 20 74)" />
        <ellipse cx="24" cy="74" rx="2" ry="3" transform="rotate(30 24 74)" />
        <ellipse cx="18" cy="80" rx="2" ry="3" transform="rotate(-70 18 80)" />
        <ellipse cx="26" cy="80" rx="2" ry="3" transform="rotate(70 26 80)" />
        <ellipse cx="22" cy="84" rx="2" ry="3" />
      </g>
    </svg>
  );
}

// よさこい鳴子文 — よさこい祭(1954 開始 70+ 年・全国 4 大盆踊)+ 鳴子(踊り子の手持ち打楽器)。
// 中央:鳴子 3 枚(木板長方形)+ 紐で繋がった上部+ 跳ねる踊り紋。
// 上部:跳ね紋(よさこい踊り)+ 下部:太平洋波頭(桂浜+ 龍馬連動)。
// 落款風 outer circle r=46 faint。
function TosaYosakoi({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 跳ね紋 — 上部よさこい踊り跳ね(3 本放射) */}
      <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7">
        <path d="M 50 18 Q 48 14 44 14" />
        <path d="M 50 18 Q 50 13 50 11" />
        <path d="M 50 18 Q 52 14 56 14" />
      </g>
      {/* 鳴子上部紐 — 鳴子 3 枚を繋ぐ紐 */}
      <line
        x1="32"
        y1="32"
        x2="68"
        y2="32"
        stroke={color}
        strokeWidth="1.4"
        opacity="0.6"
      />
      {/* 鳴子 3 枚 — 木板長方形 + 中央が大 */}
      <g fill={color}>
        {/* 左 */}
        <rect x="28" y="34" width="10" height="22" rx="1.5" opacity="0.85" />
        {/* 中央(大) */}
        <rect x="44" y="32" width="12" height="26" rx="1.8" />
        {/* 右 */}
        <rect x="62" y="34" width="10" height="22" rx="1.5" opacity="0.85" />
      </g>
      {/* 鳴子打音 — 中央鳴子の打音波(faint) */}
      <g fill="none" stroke={color} strokeWidth="0.8" opacity="0.5">
        <path d="M 38 45 Q 40 47 38 49" />
        <path d="M 62 45 Q 60 47 62 49" />
      </g>
      {/* 太平洋波頭 — 下部 3 巻波(桂浜+ 龍馬連動) */}
      <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7">
        <path d="M 18 76 Q 24 70 30 76 Q 36 82 42 76" />
        <path d="M 42 76 Q 48 70 54 76 Q 60 82 66 76" />
        <path d="M 66 76 Q 72 70 78 76 Q 82 80 84 76" />
      </g>
      {/* 波しぶき — 下部水滴(faint) */}
      <g fill={color} opacity="0.45">
        <circle cx="26" cy="68" r="1" />
        <circle cx="50" cy="66" r="1.2" />
        <circle cx="74" cy="68" r="1" />
      </g>
    </svg>
  );
}

// 越後雪結晶+ 米穂 — 新潟豪雪 4m+ + 米生産全国首位+ 燕三条金属工芸 1700+ 年。
// 中央:雪結晶 6 角(豪雪国の象徴)+ 内 6 弁。下部:稲穂 3 本(米どころ)。
// 上部:佐渡金山(山影)+ 雪夜墨黒。落款風 outer circle r=46 faint。
function EchigoYukiKome({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {/* 落款風 outer circle (faint) */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* 雪結晶 6 角 — 中央 */}
      <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        {/* 主要 6 軸 */}
        <line x1="50" y1="20" x2="50" y2="50" />
        <line x1="76" y1="35" x2="50" y2="50" />
        <line x1="76" y1="65" x2="50" y2="50" />
        <line x1="50" y1="80" x2="50" y2="50" />
        <line x1="24" y1="65" x2="50" y2="50" />
        <line x1="24" y1="35" x2="50" y2="50" />
        {/* 結晶分岐 */}
        <path d="M 50 28 L 47 25 M 50 28 L 53 25" />
        <path d="M 70 39 L 73 36 M 70 39 L 73 42" />
        <path d="M 70 61 L 73 58 M 70 61 L 73 64" />
        <path d="M 50 72 L 47 75 M 50 72 L 53 75" />
        <path d="M 30 61 L 27 58 M 30 61 L 27 64" />
        <path d="M 30 39 L 27 36 M 30 39 L 27 42" />
      </g>
      {/* 中央コア — 結晶核 */}
      <circle cx="50" cy="50" r="2.5" fill={color} />
      {/* 上部 — 佐渡山影 (faint) */}
      <g fill={color} opacity="0.35">
        <path d="M 18 18 Q 24 14 28 17 Q 32 12 35 16 Q 38 13 40 17 L 18 17 Z" />
        <path d="M 60 16 Q 65 12 68 16 Q 72 13 75 16 Q 78 13 82 17 L 60 17 Z" />
      </g>
      {/* 稲穂 3 本 — 下部 (米どころ) */}
      <g fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.7">
        {/* 中央の穂 */}
        <line x1="50" y1="80" x2="50" y2="92" />
        <path d="M 50 82 L 47 84 M 50 82 L 53 84" />
        <path d="M 50 86 L 47 88 M 50 86 L 53 88" />
        <path d="M 50 90 L 47 92 M 50 90 L 53 92" />
        {/* 左の穂 */}
        <line x1="40" y1="82" x2="38" y2="92" />
        <path d="M 39 84 L 36 85 M 39 84 L 41 86" />
        <path d="M 38.5 88 L 35.5 89 M 38.5 88 L 40.5 90" />
        {/* 右の穂 */}
        <line x1="60" y1="82" x2="62" y2="92" />
        <path d="M 61 84 L 64 85 M 61 84 L 59 86" />
        <path d="M 61.5 88 L 64.5 89 M 61.5 88 L 59.5 90" />
      </g>
      {/* 雪片 — 余白(faint) */}
      <g fill={color} opacity="0.45">
        <circle cx="20" cy="78" r="1.2" />
        <circle cx="80" cy="78" r="1.2" />
        <circle cx="14" cy="50" r="1" />
        <circle cx="86" cy="50" r="1" />
      </g>
    </svg>
  );
}

// 越中立山三峰+ 黒部峡曲線 — 立山連峰雄山 3003m + 大汝山 3015m + 富士の折立 2999m。
// 中央:三峰 silhouette+ 黒部ダムアーチ。下部:富山湾深海曲線(ホタルイカ蛍光)。
// 落款風 outer circle r=46 faint。
function EtchuTateyama({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
      {/* 立山三峰 — 中央三峰 silhouette */}
      <g fill={color}>
        <path d="M 22 50 L 32 24 L 42 50 Z" opacity="0.85" />
        <path d="M 38 50 L 50 18 L 62 50 Z" />
        <path d="M 58 50 L 68 22 L 78 50 Z" opacity="0.85" />
      </g>
      {/* 三峰山頂雪冠 — faint white */}
      <g fill={color} opacity="0.45">
        <path d="M 30 28 L 32 24 L 34 28 Z" />
        <path d="M 47 22 L 50 18 L 53 22 Z" />
        <path d="M 66 26 L 68 22 L 70 26 Z" />
      </g>
      {/* 黒部ダム弧 — アーチ式ダム下部 */}
      <path
        d="M 22 56 Q 50 52 78 56 L 78 64 Q 50 60 22 64 Z"
        fill={color}
        opacity="0.8"
      />
      {/* 富山湾波頭 — 下部波(ホタルイカ深海) */}
      <g fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.7">
        <path d="M 18 76 Q 24 72 30 76 Q 36 80 42 76" />
        <path d="M 42 76 Q 48 72 54 76 Q 60 80 66 76" />
        <path d="M 66 76 Q 72 72 78 76 Q 82 78 84 76" />
      </g>
      {/* ホタルイカ蛍 — 蛍光点(faint) */}
      <g fill={color} opacity="0.6">
        <circle cx="28" cy="86" r="1.2" />
        <circle cx="50" cy="84" r="1.4" />
        <circle cx="72" cy="86" r="1.2" />
      </g>
      {/* 立山雪結晶アクセント — 上部 */}
      <g fill={color} opacity="0.5">
        <circle cx="20" cy="20" r="0.8" />
        <circle cx="80" cy="20" r="0.8" />
      </g>
    </svg>
  );
}

// 越前永平寺+ 越前ガニ — 永平寺 1244 道元創建+ 越前ガニ全国級+ 東尋坊国指定 1935。
// 中央:永平寺仏堂シルエット+ 越前ガニ脚 4 本(対角)+ 東尋坊岩柱。
// 上部:越前蓮華+ 下部:若狭海岸波頭。落款風 outer circle r=46 faint。
function EchizenEihei({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
      {/* 永平寺仏堂中央シルエット */}
      <g fill={color} opacity="0.85">
        <path d="M 38 36 L 50 28 L 62 36 L 62 50 L 38 50 Z" />
        <rect x="44" y="38" width="3" height="8" fill="none" stroke={color} opacity="0.6" />
        <rect x="53" y="38" width="3" height="8" fill="none" stroke={color} opacity="0.6" />
      </g>
      {/* 仏堂屋根 */}
      <path d="M 32 36 L 50 22 L 68 36" fill="none" stroke={color} strokeWidth="2" />
      {/* 越前ガニ脚 4 本 — 対角 */}
      <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7">
        <path d="M 32 56 Q 26 60 22 66" />
        <path d="M 22 66 L 24 70" />
        <path d="M 68 56 Q 74 60 78 66" />
        <path d="M 78 66 L 76 70" />
        <path d="M 36 60 Q 32 66 28 72" />
        <path d="M 64 60 Q 68 66 72 72" />
      </g>
      {/* 越前ガニ甲 + 鋏 */}
      <g fill={color} opacity="0.65">
        <ellipse cx="50" cy="60" rx="8" ry="4" />
        <ellipse cx="40" cy="62" rx="2.5" ry="3" />
        <ellipse cx="60" cy="62" rx="2.5" ry="3" />
      </g>
      {/* 東尋坊岩柱 — 下部 */}
      <g fill={color} opacity="0.5">
        <rect x="20" y="74" width="3" height="10" />
        <rect x="26" y="74" width="3" height="12" />
        <rect x="32" y="74" width="3" height="9" />
        <rect x="68" y="74" width="3" height="10" />
        <rect x="74" y="74" width="3" height="11" />
      </g>
      {/* 若狭海岸波頭 */}
      <g fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.55">
        <path d="M 38 84 Q 44 80 50 84 Q 56 88 62 84" />
      </g>
      {/* 越前蓮華 — 上部 */}
      <g fill={color} opacity="0.55">
        <circle cx="50" cy="14" r="2" />
        <ellipse cx="46" cy="12" rx="1.5" ry="2.5" transform="rotate(-30 46 12)" />
        <ellipse cx="54" cy="12" rx="1.5" ry="2.5" transform="rotate(30 54 12)" />
      </g>
    </svg>
  );
}

// 甲斐武田菱+ ぶどう — 武田信玄 1521-1573 武田菱家紋+ 甲府ぶどう全国首位+ 富士山 UNESCO 2013。
// 中央:武田菱(4 つ菱)+ ぶどう房+ 葉。下部:富士山遠景。
// 落款風 outer circle r=46 faint。
function KaiTakedaGrape({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
      {/* 武田菱 — 4 菱 + 中央点 */}
      <g fill={color} opacity="0.85">
        {/* 上 */}
        <polygon points="50,18 56,28 50,38 44,28" />
        {/* 下 */}
        <polygon points="50,46 56,56 50,66 44,56" />
        {/* 左 */}
        <polygon points="32,32 38,42 32,52 26,42" />
        {/* 右 */}
        <polygon points="68,32 74,42 68,52 62,42" />
      </g>
      {/* 武田菱中央 */}
      <circle cx="50" cy="42" r="2.5" fill={color} />
      {/* ぶどう房 — 下部右(全国首位) */}
      <g fill={color} opacity="0.7">
        <circle cx="62" cy="68" r="3" />
        <circle cx="68" cy="70" r="3" />
        <circle cx="60" cy="74" r="3" />
        <circle cx="66" cy="76" r="3" />
        <circle cx="63" cy="80" r="3" />
      </g>
      {/* ぶどう葉 */}
      <g fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.6">
        <path d="M 56 64 Q 60 60 68 62" />
      </g>
      {/* 富士山遠景 — 下部左(UNESCO 2013) */}
      <g fill={color} opacity="0.55">
        <path d="M 14 86 L 26 70 L 38 86 Z" />
        <path d="M 22 76 L 26 70 L 30 76 Z" fill={color} opacity="0.85" />
      </g>
      {/* 雲アクセント — 上部 */}
      <g fill={color} opacity="0.45">
        <ellipse cx="20" cy="22" rx="4" ry="1.5" />
        <ellipse cx="80" cy="22" rx="4" ry="1.5" />
      </g>
    </svg>
  );
}

// 信濃善光寺+ 上高地 — 善光寺 642 創建+ 上高地+ 松本城 1593 国宝。
// 中央:善光寺仏堂シルエット+ 山岳遠景。下部:お焼き+ 信州そば。落款風 outer circle r=46 faint。
function ShinanoZenkoji({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
      {/* 善光寺仏堂中央 */}
      <g fill={color} opacity="0.85">
        <path d="M 36 38 L 50 26 L 64 38 L 64 56 L 36 56 Z" />
        <rect x="44" y="44" width="3" height="10" fill="none" stroke={color} opacity="0.6" />
        <rect x="53" y="44" width="3" height="10" fill="none" stroke={color} opacity="0.6" />
      </g>
      {/* 善光寺屋根 */}
      <path d="M 30 38 L 50 22 L 70 38" fill="none" stroke={color} strokeWidth="2.4" />
      {/* 屋根中央装飾 — 七色仏 */}
      <circle cx="50" cy="32" r="2" fill={color} />
      {/* 上高地山岳遠景 */}
      <g fill={color} opacity="0.5">
        <path d="M 14 70 L 22 56 L 30 70 Z" />
        <path d="M 70 70 L 78 56 L 86 70 Z" />
      </g>
      {/* 山岳雪冠 */}
      <g fill={color} opacity="0.35">
        <path d="M 20 60 L 22 56 L 24 60 Z" />
        <path d="M 76 60 L 78 56 L 80 60 Z" />
      </g>
      {/* お焼き — 下部 */}
      <g fill={color} opacity="0.7">
        <ellipse cx="40" cy="78" rx="4" ry="2.5" />
        <ellipse cx="60" cy="78" rx="4" ry="2.5" />
      </g>
      {/* お焼き模様 */}
      <g fill="none" stroke={color} strokeWidth="0.6" opacity="0.5">
        <path d="M 38 77 L 42 79" />
        <path d="M 58 77 L 62 79" />
      </g>
      {/* 信州そば線 — 下部 */}
      <g fill="none" stroke={color} strokeWidth="1" opacity="0.55" strokeLinecap="round">
        <path d="M 30 86 L 70 86" />
        <path d="M 35 88 L 65 88" />
      </g>
    </svg>
  );
}

// 美濃飛騨合掌+ 飛騨牛 — 白川郷合掌造 UNESCO 1995+ 飛騨牛全国級+ 美濃和紙 1985 UNESCO 2014。
// 中央:合掌造シルエット+ 美濃和紙紋。下部:飛騨牛+ 朴葉。落款風 outer circle r=46 faint。
function MinoHidaGassho({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
      {/* 合掌造茅葺屋根 — 中央 */}
      <g fill={color} opacity="0.85">
        <path d="M 30 56 L 50 22 L 70 56 Z" />
      </g>
      {/* 茅葺屋根線 */}
      <g fill="none" stroke={color} strokeWidth="0.6" opacity="0.5">
        <path d="M 35 50 L 50 30" />
        <path d="M 65 50 L 50 30" />
        <path d="M 40 56 L 50 38" />
        <path d="M 60 56 L 50 38" />
      </g>
      {/* 合掌造土台 */}
      <g fill={color} opacity="0.75">
        <rect x="32" y="56" width="36" height="6" />
      </g>
      {/* 入口 */}
      <rect x="46" y="58" width="8" height="4" fill={color} opacity="0.45" />
      {/* 美濃和紙紋 — 上部 */}
      <g fill="none" stroke={color} strokeWidth="0.8" opacity="0.55">
        <circle cx="20" cy="22" r="3" />
        <circle cx="80" cy="22" r="3" />
      </g>
      {/* 飛騨牛 — 下部 */}
      <g fill={color} opacity="0.7">
        <ellipse cx="42" cy="78" rx="6" ry="3" />
        <ellipse cx="58" cy="78" rx="6" ry="3" />
      </g>
      {/* 飛騨牛足 */}
      <g fill="none" stroke={color} strokeWidth="1" opacity="0.5">
        <line x1="38" y1="80" x2="38" y2="84" />
        <line x1="46" y1="80" x2="46" y2="84" />
        <line x1="54" y1="80" x2="54" y2="84" />
        <line x1="62" y1="80" x2="62" y2="84" />
      </g>
      {/* 朴葉 — 余白 */}
      <g fill={color} opacity="0.5">
        <ellipse cx="20" cy="74" rx="3" ry="4" transform="rotate(-30 20 74)" />
        <ellipse cx="80" cy="74" rx="3" ry="4" transform="rotate(30 80 74)" />
      </g>
    </svg>
  );
}

// 尾張金鯱+ 名古屋城 — 名古屋城 1612 + 金鯱(屋根装飾)+ 八丁味噌+ 熱田神宮。
// 中央:金鯱(尾根上を泳ぐ)+ 名古屋城天守 silhouette。下部:八丁味噌+ 鳥居。
// 落款風 outer circle r=46 faint。
function OwariKinshachi({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
      {/* 名古屋城天守 silhouette */}
      <g fill={color} opacity="0.85">
        <path d="M 32 56 L 50 32 L 68 56 L 64 56 L 64 60 L 36 60 L 36 56 Z" />
      </g>
      {/* 城屋根装飾線 */}
      <g fill="none" stroke={color} strokeWidth="0.6" opacity="0.55">
        <path d="M 38 50 L 50 36" />
        <path d="M 62 50 L 50 36" />
      </g>
      {/* 金鯱左 — 屋根上 */}
      <g fill={color} opacity="0.75">
        <path d="M 40 32 Q 36 28 40 24 Q 44 26 42 30 Q 44 32 40 32 Z" />
      </g>
      {/* 金鯱右 — 屋根上 */}
      <g fill={color} opacity="0.75">
        <path d="M 60 32 Q 64 28 60 24 Q 56 26 58 30 Q 56 32 60 32 Z" />
      </g>
      {/* 城本壇土台 */}
      <rect x="32" y="60" width="36" height="6" fill={color} opacity="0.7" />
      {/* 入口 */}
      <rect x="46" y="62" width="8" height="4" fill={color} opacity="0.45" />
      {/* 八丁味噌 — 下部左(味噌樽) */}
      <g fill={color} opacity="0.6">
        <ellipse cx="22" cy="78" rx="5" ry="6" />
      </g>
      {/* 味噌樽帯 */}
      <g fill="none" stroke={color} strokeWidth="0.6" opacity="0.5">
        <ellipse cx="22" cy="76" rx="5" ry="1.5" />
        <ellipse cx="22" cy="80" rx="5" ry="1.5" />
      </g>
      {/* 熱田神宮鳥居 — 下部右 */}
      <g fill="none" stroke={color} strokeWidth="2" opacity="0.65">
        <line x1="74" y1="74" x2="74" y2="84" />
        <line x1="80" y1="74" x2="80" y2="84" />
        <line x1="71" y1="76" x2="83" y2="76" />
        <line x1="71" y1="79" x2="83" y2="79" />
      </g>
      {/* 鳥居傘 */}
      <path d="M 70 74 L 84 74 L 82 76 L 72 76 Z" fill={color} opacity="0.55" />
    </svg>
  );
}

// 伊勢神宮鳥居+ 真珠 — 伊勢神宮 古代 + 松阪牛 + 真珠御木本 1893 + 伊賀忍者。
// 中央:伊勢神宮鳥居+ 真珠+ 内宮シルエット。下部:松阪牛+ 忍者。落款風 outer circle r=46 faint。
function IseJinguTorii({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
      {/* 伊勢神宮鳥居 — 中央 */}
      <g fill="none" stroke={color} strokeWidth="2.4">
        <line x1="38" y1="38" x2="38" y2="62" />
        <line x1="62" y1="38" x2="62" y2="62" />
        <line x1="34" y1="40" x2="66" y2="40" />
        <line x1="36" y1="44" x2="64" y2="44" />
      </g>
      {/* 鳥居傘 */}
      <path d="M 32 38 L 68 38 L 64 40 L 36 40 Z" fill={color} opacity="0.85" />
      {/* 内宮 — 鳥居中央(神鏡) */}
      <circle cx="50" cy="52" r="3" fill={color} opacity="0.7" />
      {/* 真珠 — 上部 */}
      <g fill={color} opacity="0.65">
        <circle cx="22" cy="22" r="2.5" />
        <circle cx="78" cy="22" r="2.5" />
      </g>
      <g fill="none" stroke={color} strokeWidth="0.5" opacity="0.4">
        <circle cx="22" cy="22" r="3" />
        <circle cx="78" cy="22" r="3" />
      </g>
      {/* 松阪牛 — 下部左 */}
      <g fill={color} opacity="0.65">
        <ellipse cx="22" cy="78" rx="6" ry="3" />
      </g>
      <g fill="none" stroke={color} strokeWidth="0.8" opacity="0.5">
        <line x1="18" y1="80" x2="18" y2="84" />
        <line x1="22" y1="80" x2="22" y2="84" />
        <line x1="26" y1="80" x2="26" y2="84" />
      </g>
      {/* 伊賀忍者 — 下部右(手裏剣) */}
      <g fill={color} opacity="0.7">
        <polygon points="78,74 80,77 83,77 80,79 81,82 78,80 75,82 76,79 73,77 76,77" />
      </g>
      {/* 御祓串アクセント */}
      <g fill={color} opacity="0.45">
        <rect x="49" y="68" width="2" height="8" />
      </g>
    </svg>
  );
}

// 滋賀:琵琶湖+ 比叡山+ 信楽狸+ 彦根城(近江國の章)
// 構成 — 中央湖の波紋(琵琶湖最大湖)+ 上部三峰(比叡山+ 伊吹山)+
//        左下信楽狸(信楽焼)+ 右下彦根城天守(国宝・1622)
// 滋賀=琵琶湖 1/6 県土・湖国の象徴 + 比叡山延暦寺 788 + 信楽たぬき + 彦根城 1622
function ShigaBiwaOmi({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
      {/* 比叡山三峰 — 上部(比叡山+ 伊吹山) */}
      <g fill={color} opacity="0.7">
        <polygon points="32,38 40,22 48,38" />
        <polygon points="46,38 54,18 62,38" />
        <polygon points="60,38 68,24 76,38" />
      </g>
      {/* 琵琶湖湖面 — 中央楕円 */}
      <ellipse cx="50" cy="55" rx="22" ry="10" fill={color} opacity="0.55" />
      {/* 琵琶湖波紋 — 同心 */}
      <g fill="none" stroke={color} strokeWidth="0.7" opacity="0.5">
        <ellipse cx="50" cy="55" rx="16" ry="6" />
        <ellipse cx="50" cy="55" rx="10" ry="3" />
      </g>
      {/* 信楽狸 — 左下(円顔 + 笠 + 腹鼓) */}
      <g fill={color} opacity="0.7">
        <circle cx="22" cy="76" r="5" />
        <ellipse cx="22" cy="73" rx="6.5" ry="1.5" />
      </g>
      <g fill="none" stroke={color} strokeWidth="0.6" opacity="0.5">
        <circle cx="20" cy="75" r="0.8" fill={color} />
        <circle cx="24" cy="75" r="0.8" fill={color} />
      </g>
      {/* 彦根城天守 — 右下(3 重層塔) */}
      <g fill={color} opacity="0.7">
        <polygon points="76,82 76,76 80,72 84,76 84,82" />
        <polygon points="74,76 86,76 84,72 76,72" />
        <polygon points="72,72 88,72 86,68 74,68" />
        <polygon points="76,68 84,68 80,64" />
      </g>
      {/* 中央船 — 琵琶湖クルーズ */}
      <g fill={color} opacity="0.6">
        <path d="M 44 55 L 56 55 L 54 58 L 46 58 Z" />
        <line x1="50" y1="55" x2="50" y2="50" stroke={color} strokeWidth="0.7" />
      </g>
    </svg>
  );
}

// 和歌山:熊野三山八咫烏+ 高野山+ 紀州梅+ 那智の滝(紀伊國の章)
// 構成 — 中央八咫烏(熊野三山神鳥+ 三本足)+ 上部那智の滝層 + 下部紀州梅 5 弁 + 右側高野山五重塔
// 和歌山=紀伊國・熊野古道 UNESCO 2004 + 高野山金剛峯寺 816 UNESCO 2004 + 紀州梅+ 那智の滝
function KiiKumanoKuma({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
      {/* 那智の滝 — 上部(垂直三筋) */}
      <g fill={color} opacity="0.55">
        <rect x="18" y="20" width="2" height="22" />
        <rect x="22" y="18" width="2" height="24" />
        <rect x="26" y="20" width="2" height="22" />
      </g>
      {/* 滝壺霧 */}
      <ellipse cx="23" cy="44" rx="8" ry="2" fill={color} opacity="0.4" />
      {/* 中央八咫烏 — 熊野三山神鳥(三本足) */}
      <g fill={color} opacity="0.85">
        {/* 体 */}
        <ellipse cx="52" cy="50" rx="9" ry="6" />
        {/* 頭 */}
        <circle cx="60" cy="46" r="4" />
        {/* 嘴 */}
        <polygon points="64,46 67,46 64,48" />
        {/* 三本足 */}
        <line x1="48" y1="56" x2="46" y2="62" stroke={color} strokeWidth="1.3" />
        <line x1="52" y1="56" x2="52" y2="63" stroke={color} strokeWidth="1.3" />
        <line x1="56" y1="56" x2="58" y2="62" stroke={color} strokeWidth="1.3" />
      </g>
      {/* 八咫烏目 */}
      <circle cx="60" cy="45" r="0.8" fill="none" stroke={color} strokeWidth="0.5" opacity="0.4" />
      {/* 高野山五重塔 — 右上(層塔) */}
      <g fill={color} opacity="0.6">
        <polygon points="74,38 86,38 84,34 76,34" />
        <polygon points="75,34 85,34 83,30 77,30" />
        <polygon points="76,30 84,30 82,26 78,26" />
        <polygon points="77,26 83,26 80,22" />
        <rect x="79" y="38" width="2" height="6" />
      </g>
      {/* 紀州梅 — 下部(5 弁梅花) */}
      <g fill={color} opacity="0.7">
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i * 72 - 90) * (Math.PI / 180);
          const cx = 30 + Math.cos(angle) * 5;
          const cy = 76 + Math.sin(angle) * 5;
          return <circle key={i} cx={cx} cy={cy} r="2.8" />;
        })}
        <circle cx="30" cy="76" r="1.5" />
      </g>
      {/* 紀州梅 2 — 右下 */}
      <g fill={color} opacity="0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i * 72 - 90) * (Math.PI / 180);
          const cx = 76 + Math.cos(angle) * 4;
          const cy = 76 + Math.sin(angle) * 4;
          return <circle key={i} cx={cx} cy={cy} r="2.2" />;
        })}
      </g>
      {/* 熊野古道筋 — 中央下 */}
      <g fill="none" stroke={color} strokeWidth="0.7" opacity="0.4">
        <path d="M 30 84 Q 50 80 76 84" />
      </g>
    </svg>
  );
}

// 鳥取:鳥取砂丘+ 大山+ 鬼太郎+ 二十世紀梨(因幡・伯耆 2 国の章)
// 構成 — 上部大山 1729m 三峰 + 中央砂丘の波 + 左下鬼太郎下駄 + 右下二十世紀梨
// 鳥取=鳥取砂丘 1955 国立公園+ 大山 1729m + 境港鬼太郎+ 二十世紀梨
function TottoriSakyuDai({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
      {/* 大山 1729m — 上部三峰 */}
      <g fill={color} opacity="0.7">
        <polygon points="30,40 40,18 50,40" />
        <polygon points="44,40 54,16 64,40" />
        <polygon points="58,40 68,22 78,40" />
      </g>
      {/* 大山残雪 */}
      <g fill={color} opacity="0.4">
        <polygon points="46,30 50,28 54,30 50,32" />
      </g>
      {/* 鳥取砂丘の波(横線) — 中央 */}
      <g fill="none" stroke={color} strokeWidth="0.9" opacity="0.6">
        <path d="M 16 52 Q 35 48 50 52 T 84 52" />
        <path d="M 16 56 Q 35 52 50 56 T 84 56" />
        <path d="M 16 60 Q 35 56 50 60 T 84 60" />
        <path d="M 16 64 Q 35 60 50 64 T 84 64" />
      </g>
      {/* 砂粒 */}
      <g fill={color} opacity="0.55">
        <circle cx="32" cy="54" r="0.7" />
        <circle cx="50" cy="58" r="0.7" />
        <circle cx="68" cy="54" r="0.7" />
      </g>
      {/* 鬼太郎下駄 — 左下(横向き 一本歯下駄) */}
      <g fill={color} opacity="0.7">
        <rect x="16" y="78" width="14" height="2" />
        <rect x="22" y="80" width="2" height="6" />
      </g>
      {/* 二十世紀梨 — 右下(円+ 茎+ 葉) */}
      <g fill={color} opacity="0.65">
        <circle cx="78" cy="80" r="5" />
      </g>
      <g fill={color} opacity="0.5">
        <rect x="77.5" y="74" width="1" height="2" />
        <ellipse cx="80" cy="74" rx="2" ry="1" />
      </g>
      {/* ハマナス草モチーフ — 中央下 */}
      <g fill={color} opacity="0.4">
        <circle cx="50" cy="80" r="2.2" />
        <circle cx="46" cy="82" r="1.5" />
        <circle cx="54" cy="82" r="1.5" />
      </g>
    </svg>
  );
}

// 島根:出雲大社注連縄+ 松江城+ 石見銀山+ 隠岐諸島(出雲・石見・隠岐 3 国の章)
// 構成 — 中央大注連縄(出雲大社 4t 巨大注連縄)+ 上部松江城天守 + 左下銀山+ 右下隠岐諸島
// 島根=出雲大社 古代+ 松江城 国宝 1611+ 石見銀山 UNESCO 2007+ 隠岐 UNESCO 2009
function IzumoOoyashiroShime({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
      {/* 出雲大社大注連縄 — 中央(横向き 4t 巨大注連縄) */}
      <g fill={color} opacity="0.75">
        <ellipse cx="50" cy="55" rx="28" ry="6" />
      </g>
      <g fill="none" stroke={color} strokeWidth="0.6" opacity="0.45">
        <path d="M 22 53 Q 36 49 50 53 T 78 53" />
        <path d="M 22 57 Q 36 61 50 57 T 78 57" />
      </g>
      {/* 注連縄房(下垂れ) — 中央 */}
      <g fill={color} opacity="0.7">
        <polygon points="44,60 46,68 48,60" />
        <polygon points="50,60 52,72 54,60" />
        <polygon points="56,60 58,68 60,60" />
      </g>
      {/* 松江城天守 — 上部(5 重層塔) */}
      <g fill={color} opacity="0.65">
        <polygon points="42,42 58,42 56,38 44,38" />
        <polygon points="44,38 56,38 54,33 46,33" />
        <polygon points="46,33 54,33 52,28 48,28" />
        <polygon points="48,28 52,28 50,22" />
        <rect x="49" y="42" width="2" height="4" />
      </g>
      {/* 石見銀山 — 左下(山+ 坑道四角) */}
      <g fill={color} opacity="0.55">
        <polygon points="14,82 28,82 21,72" />
        <rect x="18" y="78" width="6" height="3" />
      </g>
      {/* 隠岐諸島 — 右下(三島散点) */}
      <g fill={color} opacity="0.65">
        <ellipse cx="78" cy="76" rx="5" ry="2.5" />
        <ellipse cx="86" cy="80" rx="3" ry="1.5" />
        <ellipse cx="72" cy="83" rx="3" ry="1.5" />
      </g>
      {/* 八重垣神社縁結び 紐 — 中央上 */}
      <g fill="none" stroke={color} strokeWidth="0.7" opacity="0.4">
        <path d="M 30 50 Q 50 46 70 50" />
      </g>
    </svg>
  );
}

// 岡山:岡山桃太郎+ 岡山城+ 後楽園+ 倉敷美観(備前・備中・美作 3 国の章)
// 構成 — 中央桃(桃太郎)+ 上部岡山城(烏城)+ 左下後楽園+ 右下倉敷美観
// 岡山=桃太郎+岡山城 国宝 1597+後楽園 1700 三名園+倉敷美観地区 1979 重伝建
function OkayamaMomotaroShiro({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
      {/* 岡山城天守 — 上部(烏城・5 重層塔) */}
      <g fill={color} opacity="0.7">
        <polygon points="42,38 58,38 56,33 44,33" />
        <polygon points="44,33 56,33 54,28 46,28" />
        <polygon points="46,28 54,28 52,23 48,23" />
        <polygon points="48,23 52,23 50,18" />
        <rect x="49" y="38" width="2" height="4" />
      </g>
      {/* 中央桃 — 桃太郎の桃(ハート形) */}
      <g fill={color} opacity="0.8">
        <path d="M 50 65 Q 38 50 42 45 Q 50 38 50 50 Q 50 38 58 45 Q 62 50 50 65 Z" />
      </g>
      {/* 桃の溝 */}
      <line x1="50" y1="42" x2="50" y2="62" stroke={color} strokeWidth="0.7" opacity="0.4" />
      {/* 桃の葉 */}
      <g fill={color} opacity="0.5">
        <ellipse cx="50" cy="40" rx="3" ry="1.5" transform="rotate(-30 50 40)" />
      </g>
      {/* 後楽園 — 左下(松+池) */}
      <g fill={color} opacity="0.55">
        <ellipse cx="22" cy="80" rx="6" ry="2" />
        <polygon points="20,72 24,72 22,76" />
        <polygon points="18,76 26,76 22,72" />
      </g>
      {/* 倉敷美観 — 右下(蔵屋根) */}
      <g fill={color} opacity="0.55">
        <polygon points="72,82 88,82 86,76 74,76" />
        <polygon points="74,76 86,76 84,73 76,73" />
        <rect x="78" y="79" width="4" height="3" />
      </g>
      {/* 桃太郎黍団子モチーフ — 中央下 */}
      <g fill={color} opacity="0.6">
        <circle cx="46" cy="78" r="1.8" />
        <circle cx="50" cy="78" r="1.8" />
        <circle cx="54" cy="78" r="1.8" />
      </g>
    </svg>
  );
}

// 山口:錦帯橋+ ふぐ+ 萩白壁+ 秋吉台(周防・長門 2 国の章)
// 構成 — 中央錦帯橋 5 連アーチ + 上部秋吉台ドリーネ + 左下ふぐ + 右下萩白壁
function YamaguchiKintaikyoFugu({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
      {/* 秋吉台カルスト — 上部 */}
      <g fill={color} opacity="0.5">
        <ellipse cx="20" cy="32" rx="3" ry="2" />
        <ellipse cx="32" cy="28" rx="2.5" ry="1.5" />
        <ellipse cx="44" cy="30" rx="3" ry="2" />
        <ellipse cx="58" cy="28" rx="2.5" ry="1.5" />
        <ellipse cx="72" cy="32" rx="3" ry="2" />
        <ellipse cx="84" cy="30" rx="2" ry="1.5" />
      </g>
      {/* 錦帯橋 — 中央(5 連アーチ) */}
      <g fill="none" stroke={color} strokeWidth="2" opacity="0.85">
        <path d="M 18 58 Q 26 48 34 58" />
        <path d="M 34 58 Q 42 48 50 58" />
        <path d="M 50 58 Q 58 48 66 58" />
        <path d="M 66 58 Q 74 48 82 58" />
      </g>
      <g fill={color} opacity="0.45">
        <line x1="18" y1="58" x2="18" y2="62" stroke={color} strokeWidth="1.5" />
        <line x1="34" y1="58" x2="34" y2="62" stroke={color} strokeWidth="1.5" />
        <line x1="50" y1="58" x2="50" y2="62" stroke={color} strokeWidth="1.5" />
        <line x1="66" y1="58" x2="66" y2="62" stroke={color} strokeWidth="1.5" />
        <line x1="82" y1="58" x2="82" y2="62" stroke={color} strokeWidth="1.5" />
      </g>
      {/* ふぐ — 左下(膨らんだ円形+ 尾ヒレ) */}
      <g fill={color} opacity="0.7">
        <circle cx="22" cy="78" r="5.5" />
        <polygon points="14,78 17,75 17,81" />
      </g>
      <g fill={color} opacity="0.5">
        <circle cx="24" cy="76" r="0.7" />
      </g>
      {/* 萩白壁 — 右下(町家の屋根) */}
      <g fill={color} opacity="0.6">
        <polygon points="72,82 88,82 86,76 74,76" />
        <polygon points="74,76 86,76 84,72 76,72" />
        <line x1="80" y1="76" x2="80" y2="82" stroke={color} strokeWidth="0.7" />
      </g>
      {/* 萩夏蜜柑モチーフ — 中央下 */}
      <g fill={color} opacity="0.55">
        <circle cx="50" cy="80" r="3" />
      </g>
    </svg>
  );
}

// 福岡:博多山笠+ 太宰府梅+ 屋台+ 門司港(筑前・筑後・豊前 3 国の章)
// 構成 — 中央山笠人形(博多祇園山笠)+ 上部太宰府鳥居 + 左下屋台 + 右下門司港赤煉瓦
function FukuokaYamakasaDazaifu({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
      {/* 太宰府天満宮鳥居 — 上部 */}
      <g fill={color} opacity="0.7">
        <line x1="38" y1="32" x2="38" y2="22" stroke={color} strokeWidth="2" />
        <line x1="62" y1="32" x2="62" y2="22" stroke={color} strokeWidth="2" />
        <line x1="34" y1="22" x2="66" y2="22" stroke={color} strokeWidth="2" />
        <line x1="36" y1="26" x2="64" y2="26" stroke={color} strokeWidth="2" />
      </g>
      {/* 太宰府梅 — 鳥居中央 */}
      <g fill={color} opacity="0.55">
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i * 72 - 90) * (Math.PI / 180);
          const cx = 50 + Math.cos(angle) * 3;
          const cy = 28 + Math.sin(angle) * 3;
          return <circle key={i} cx={cx} cy={cy} r="1.5" />;
        })}
      </g>
      {/* 博多山笠 — 中央(三角山形人形ピラミッド) */}
      <g fill={color} opacity="0.85">
        <polygon points="50,40 30,68 70,68" />
      </g>
      <g fill="none" stroke={color} strokeWidth="0.7" opacity="0.45">
        <line x1="50" y1="40" x2="50" y2="68" />
        <line x1="40" y1="54" x2="60" y2="54" />
      </g>
      {/* 山笠頂上飾り */}
      <g fill={color} opacity="0.6">
        <circle cx="50" cy="38" r="2" />
      </g>
      {/* 博多屋台 — 左下(屋根+ 提灯) */}
      <g fill={color} opacity="0.6">
        <rect x="14" y="78" width="14" height="6" />
        <polygon points="14,78 28,78 26,74 16,74" />
        <circle cx="20" cy="76" r="1.2" />
      </g>
      {/* 門司港レトロ — 右下(赤煉瓦時計塔) */}
      <g fill={color} opacity="0.6">
        <rect x="74" y="74" width="12" height="10" />
        <polygon points="74,74 86,74 84,71 76,71" />
        <circle cx="80" cy="78" r="1.5" fill="none" stroke={color} strokeWidth="0.7" />
      </g>
    </svg>
  );
}

// 佐賀:有田焼+ 唐津焼+ 嬉野温泉+ 吉野ヶ里(肥前 1 国・文化 3 区分)
// 構成 — 中央有田焼壺(藍染唐草文)+ 上部吉野ヶ里物見櫓 + 左下温泉湯気 + 右下唐津曳山
function SagaAritaKaratsu({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
      {/* 吉野ヶ里物見櫓 — 上部 */}
      <g fill={color} opacity="0.65">
        <polygon points="44,38 56,38 56,30 44,30" />
        <polygon points="42,30 58,30 56,26 44,26" />
        <polygon points="46,26 54,26 50,18" />
        <line x1="44" y1="38" x2="44" y2="42" stroke={color} strokeWidth="1.5" />
        <line x1="56" y1="38" x2="56" y2="42" stroke={color} strokeWidth="1.5" />
        <line x1="50" y1="38" x2="50" y2="42" stroke={color} strokeWidth="1.5" />
      </g>
      {/* 中央有田焼壺 — 染付唐草 */}
      <g fill={color} opacity="0.85">
        <ellipse cx="50" cy="58" rx="14" ry="10" />
        <rect x="46" y="44" width="8" height="6" />
      </g>
      {/* 唐草文 — 壺面 */}
      <g fill="none" stroke={color} strokeWidth="0.5" opacity="0.4">
        <path d="M 40 56 Q 50 50 60 56" />
        <path d="M 40 60 Q 50 64 60 60" />
        <circle cx="50" cy="58" r="2" />
      </g>
      {/* 嬉野温泉湯気 — 左下 */}
      <g fill="none" stroke={color} strokeWidth="1.5" opacity="0.55">
        <path d="M 18 82 Q 16 76 18 72" />
        <path d="M 22 82 Q 20 76 22 72" />
        <path d="M 26 82 Q 24 76 26 72" />
      </g>
      <g fill={color} opacity="0.55">
        <ellipse cx="22" cy="84" rx="6" ry="2" />
      </g>
      {/* 唐津曳山 — 右下(獅子舞型山車) */}
      <g fill={color} opacity="0.7">
        <ellipse cx="78" cy="78" rx="6" ry="4" />
        <circle cx="74" cy="76" r="1.2" />
        <circle cx="82" cy="76" r="1.2" />
        <polygon points="76,72 80,72 78,68" />
      </g>
      {/* 唐津曳山車輪 */}
      <g fill="none" stroke={color} strokeWidth="0.7" opacity="0.5">
        <circle cx="74" cy="84" r="1.5" />
        <circle cx="82" cy="84" r="1.5" />
      </g>
    </svg>
  );
}

// 大分:別府温泉湯けむり+ 由布院+ 関アジ+ 宇佐神宮(豊前・豊後 2 国の章)
// 構成 — 中央温泉湯桶(湯気)+ 上部由布岳 + 左下関アジ+ 右下宇佐神宮鳥居
function OitaBeppuYufuin({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
      {/* 由布岳 — 上部双峰 */}
      <g fill={color} opacity="0.55">
        <polygon points="34,38 44,22 54,38" />
        <polygon points="46,38 56,18 66,38" />
      </g>
      {/* 中央温泉湯桶 + 湯気 */}
      <g fill="none" stroke={color} strokeWidth="1.5" opacity="0.6">
        <path d="M 42 50 Q 40 44 44 40" />
        <path d="M 50 48 Q 48 42 52 38" />
        <path d="M 58 50 Q 56 44 60 40" />
      </g>
      {/* 温泉桶 */}
      <g fill={color} opacity="0.85">
        <ellipse cx="50" cy="62" rx="14" ry="4" />
        <rect x="36" y="58" width="28" height="6" />
      </g>
      {/* 桶の縁 */}
      <g fill="none" stroke={color} strokeWidth="0.7" opacity="0.5">
        <ellipse cx="50" cy="58" rx="14" ry="3" />
      </g>
      {/* 関アジ — 左下(楕円魚体+ 尾ヒレ) */}
      <g fill={color} opacity="0.7">
        <ellipse cx="22" cy="78" rx="7" ry="3" />
        <polygon points="14,78 17,75 17,81" />
        <circle cx="26" cy="77" r="0.7" />
      </g>
      {/* 宇佐神宮鳥居 — 右下 */}
      <g fill={color} opacity="0.7">
        <line x1="74" y1="82" x2="74" y2="74" stroke={color} strokeWidth="1.8" />
        <line x1="86" y1="82" x2="86" y2="74" stroke={color} strokeWidth="1.8" />
        <line x1="72" y1="74" x2="88" y2="74" stroke={color} strokeWidth="1.8" />
        <line x1="73" y1="76" x2="87" y2="76" stroke={color} strokeWidth="1.5" />
      </g>
      {/* 国東半島仏教モチーフ — 中央下 */}
      <g fill={color} opacity="0.5">
        <circle cx="50" cy="78" r="2" />
      </g>
    </svg>
  );
}

// 宮崎:高千穂神話+ 飫肥+ 青島+ 都井岬(日向 1 国・神話の章)
// 構成 — 中央高千穂峡(三つ柱状節理)+ 上部太陽 + 左下飫肥城+ 右下青島波模様
function MiyazakiTakachihoObi({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
      {/* 太陽(天照大神) — 上部 */}
      <g fill={color} opacity="0.85">
        <circle cx="50" cy="22" r="6" />
      </g>
      <g fill="none" stroke={color} strokeWidth="0.7" opacity="0.5">
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45) * (Math.PI / 180);
          const x1 = 50 + Math.cos(angle) * 8;
          const y1 = 22 + Math.sin(angle) * 8;
          const x2 = 50 + Math.cos(angle) * 11;
          const y2 = 22 + Math.sin(angle) * 11;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
      {/* 高千穂峡 — 中央(三つ柱状節理) */}
      <g fill={color} opacity="0.7">
        <rect x="30" y="40" width="6" height="22" />
        <rect x="40" y="38" width="6" height="24" />
        <rect x="50" y="36" width="6" height="26" />
        <rect x="60" y="38" width="6" height="24" />
      </g>
      {/* 高千穂峡水面 */}
      <g fill="none" stroke={color} strokeWidth="0.7" opacity="0.5">
        <path d="M 28 64 Q 36 66 50 64 T 70 64" />
      </g>
      {/* 飫肥城 — 左下(石垣+ 城門) */}
      <g fill={color} opacity="0.65">
        <rect x="14" y="78" width="14" height="6" />
        <polygon points="14,78 28,78 26,74 16,74" />
      </g>
      {/* 青島 — 右下(亜熱帯椰子+ 波) */}
      <g fill={color} opacity="0.7">
        <ellipse cx="80" cy="80" rx="8" ry="2" />
      </g>
      <g fill={color} opacity="0.55">
        <line x1="80" y1="80" x2="80" y2="73" stroke={color} strokeWidth="1.5" />
        <ellipse cx="76" cy="73" rx="2" ry="1" />
        <ellipse cx="84" cy="73" rx="2" ry="1" />
        <ellipse cx="80" cy="71" rx="2" ry="1" />
      </g>
    </svg>
  );
}

// 鹿児島:桜島活火山+ 仙巌園+ 西郷+ 屋久島(薩摩・大隅 3 国の章・全 47 卷完結)
// 構成 — 中央桜島火山(噴煙)+ 上部島津菱(○ に十字)+ 左下仙巌園+ 右下屋久杉
function KagoshimaSakurajimaSatsuma({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
      {/* 島津家紋 ○ に十字 — 上部 */}
      <g fill="none" stroke={color} strokeWidth="1.5" opacity="0.7">
        <circle cx="50" cy="22" r="6" />
        <line x1="50" y1="16" x2="50" y2="28" />
        <line x1="44" y1="22" x2="56" y2="22" />
      </g>
      {/* 桜島噴煙 — 中央上部 */}
      <g fill="none" stroke={color} strokeWidth="1.8" opacity="0.55">
        <path d="M 44 38 Q 40 32 44 28" />
        <path d="M 50 38 Q 46 30 52 26" />
        <path d="M 56 38 Q 60 32 56 28" />
      </g>
      {/* 桜島火山 — 中央(三角富士型) */}
      <g fill={color} opacity="0.85">
        <polygon points="30,62 50,38 70,62" />
      </g>
      {/* 火口溝 */}
      <g fill={color} opacity="0.45">
        <line x1="50" y1="38" x2="50" y2="62" stroke={color} strokeWidth="0.8" />
        <line x1="42" y1="50" x2="58" y2="50" stroke={color} strokeWidth="0.6" />
      </g>
      {/* 火山弾モチーフ */}
      <g fill={color} opacity="0.5">
        <circle cx="50" cy="40" r="1.5" />
      </g>
      {/* 仙巌園(磯庭園) — 左下(松+ 池) */}
      <g fill={color} opacity="0.55">
        <ellipse cx="22" cy="80" rx="6" ry="2" />
        <polygon points="20,72 24,72 22,76" />
        <polygon points="18,76 26,76 22,72" />
      </g>
      {/* 屋久杉 — 右下(縄文杉幹+ 枝) */}
      <g fill={color} opacity="0.7">
        <rect x="78" y="74" width="4" height="10" />
        <ellipse cx="80" cy="72" rx="6" ry="3" />
        <ellipse cx="76" cy="69" rx="3" ry="1.5" />
        <ellipse cx="84" cy="69" rx="3" ry="1.5" />
      </g>
    </svg>
  );
}

// fallback — 整備中の章。open diamond,謙抑な印。
function DefaultMark({
  className,
  color,
  title,
}: {
  className?: string;
  color: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
      />
      <polygon
        points="50,20 80,50 50,80 20,50"
        fill="none"
        stroke={color}
        strokeWidth="2.4"
      />
    </svg>
  );
}
