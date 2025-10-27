"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search as SearchIcon, Star } from "lucide-react";

type Post = {
  id: number;
  title: string;
  content: string;
  image: string;
  region: string;
  industry: string;
  conditions: string[];
  municipality: string;
  reading?: string;
};

{/*案件仮データ*/}
const posts: Post[] = [
  { id: 1, title: "りんご収穫体験", content: "青森のりんご農園で収穫を体験", image: "/images/apple.png", region: "青森県", municipality: "青森市", industry: "第一次産業", conditions: ["未経験OK", "学生歓迎", "紅葉が見れる"], reading: "りんごしゅうかくたいけん" },
  { id: 2, title: "ビーチ清掃ボランティア", content: "沖縄の美しい海を守る活動", image: "/images/okinawa.png", region: "沖縄県", municipality: "那覇市", industry: "第三次産業", conditions: ["未経験OK", "友達参加歓迎", "海が見える"], reading: "びーちせいそうぼらんてぃあ" },
  { id: 3, title: "観光ガイド体験", content: "京都観光地で外国人向けガイド", image: "/images/kyoto.png", region: "京都府", municipality: "京都市", industry: "第三次産業", conditions: ["語学を活かせる", "初しぇあっぷ歓迎", "交流会、懇親会あり"], reading: "かんこうがいどたいけん" },
  { id: 4, title: "温泉旅館サポート", content: "客室清掃や接客の体験", image: "/images/nagano.png", region: "長野県", municipality: "白馬村", industry: "第三次産業", conditions: ["客室に泊まれる", "まかないあり", "未経験OK"], reading: "おんせんりょかんさぽーと" },
  { id: 5, title: "うどん打ち体験", content: "香川の伝統料理を学ぶ", image: "/images/udon.png", region: "香川県", municipality: "高松市", industry: "第二次産業", conditions: ["学生歓迎", "初しぇあっぷ歓迎", "服装、髪色自由"], reading: "うどんうちたいけん" },
  { id: 6, title: "桜の植樹体験", content: "地元の桜を植えて春を迎える", image: "/images/sakura.png", region: "北海道", municipality: "札幌市", industry: "第一次産業", conditions: ["初しぇあっぷ歓迎", "桜が見れる", "年齢不問"], reading: "さくらのしょくじゅたいけん" },
  { id: 7, title: "漁業体験", content: "漁船に乗って魚を獲る体験", image: "/images/fishing.png", region: "長崎県", municipality: "長崎市", industry: "第一次産業", conditions: ["未経験OK", "海が見える", "友達参加歓迎"], reading: "ぎょぎょうたいけん" },
  { id: 8, title: "ウインタースポーツ体験", content: "スキーやスノボで雪山を楽しむ", image: "/images/ski.png", region: "北海道", municipality: "ニセコ町", industry: "第三次産業", conditions: ["ウインタースポーツができる", "1日4時間以内", "複数名採用"], reading: "ういんたーすぽーつたいけん" },
  { id: 9, title: "離島生活体験", content: "瀬戸内海の離島で暮らす", image: "/images/island.png", region: "香川県", municipality: "小豆島町", industry: "第三次産業", conditions: ["離島で暮らせる", "年齢不問", "初しぇあっぷ歓迎"], reading: "りとうせいかつたいけん" },
  { id: 10, title: "自転車ツアーガイド", content: "自転車で地域を巡る観光案内", image: "/images/bike.png", region: "大阪府", municipality: "大阪市", industry: "第三次産業", conditions: ["自転車無料貸し出しあり", "交流会、懇親会あり", "学生歓迎"], reading: "じてんしゃつあーがいど" }
];

const areaToPrefecture: { [key: string]: string[] } = {
  "北海道": ["北海道"],
  "東北": ["青森県","岩手県","宮城県","秋田県","山形県","福島県"],
  "関東": ["茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県"],
  "中部": ["新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県"],
  "近畿": ["三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県"],
  "中国": ["鳥取県","島根県","岡山県","広島県","山口県"],
  "四国": ["徳島県","香川県","愛媛県","高知県"],
  "九州": ["福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"]
};

const industries = ["第一次産業", "第二次産業", "第三次産業"];

const conditionsList = [
  "日程調整可能", "日程調整不可", "学生歓迎", "年齢不問", "初しぇあっぷ歓迎",
  "未経験OK", "複数名採用", "友達参加歓迎", "1日4時間以内", "経験者限定",
  "まかないあり", "客室に泊まれる", "一人部屋に泊まれる", "服装、髪色自由", "海が見える",
  "紅葉が見れる", "桜が見れる", "離島で暮らせる", "ウインタースポーツができる", "マリンスポーツができる",
  "交流会、懇親会あり", "地域の方と触れ合う機会多め", "温泉入浴可能", "国際交流可能",
  "語学を活かせる", "自転車無料貸し出しあり"
];

function normalizeKana(str: string) {
  return str.replace(/[\u30a1-\u30f6]/g, (match) =>
    String.fromCharCode(match.charCodeAt(0) - 0x60)
  );
}

function Card({ post }: { post: Post }) {
  const [favorited, setFavorited] = useState(false);
  const toggleFavorite = () => setFavorited(!favorited);

  return (
    <div className="bg-white border rounded-lg shadow-md overflow-hidden relative cursor-pointer h-80 flex flex-col transition-transform duration-200 hover:shadow-lg hover:scale-105">
      {/* 星マーク */}
      <button
        onClick={(e) => { e.preventDefault(); toggleFavorite(); }}
        className="absolute top-2 left-2 p-1 bg-transparent border-none focus:outline-none z-10"
      >
        <Star
          size={24}
          fill={favorited ? "#facc15" : "none"}
          stroke={favorited ? "#facc15" : "white"}
          strokeWidth={2}
        />
      </button>

      <Image
        src={post.image}
        alt={post.title}
        width={300}
        height={120}
        className="w-full h-32 object-cover object-center"
      />

      <div className="p-2 flex-1 flex flex-col">
        <h3 className="font-bold text-black truncate">{post.title}</h3>
        <p className="text-sm text-black mt-1 line-clamp-2">{post.content}</p>
        <p className="text-sm text-green-600 mt-auto">{post.region} {post.municipality}</p>
      </div>
    </div>
  );
}


export default function Page() {
  // DB上の実データ（ラベンダー農園スタッフ）をモーダルで試すための固定リンク
  const demoListingId = "036e078c-bc56-4d7e-bee8-9340d39346fa";
  const [showSearch, setShowSearch] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<Post[] | null>(null);

  const toggleSelection = (list: string[], setter: (v: string[]) => void, value: string) => {
    if (list.includes(value)) setter(list.filter((v) => v !== value));
    else setter([...list, value]);
  };

  const prefecturesToShow = selectedAreas.flatMap(area => areaToPrefecture[area]);

  const handleSearch = () => {
    const normalizedKeyword = normalizeKana(keyword.toLowerCase());
    const results = posts.filter((post) => {
      const matchArea = selectedAreas.length === 0 || selectedAreas.some(area => areaToPrefecture[area].includes(post.region));
      const matchPrefecture = selectedPrefectures.length === 0 || selectedPrefectures.includes(post.region);
      const matchIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(post.industry);
      const matchConditions = selectedConditions.length === 0 || selectedConditions.every(cond => post.conditions.includes(cond));
      const matchKeyword =
        normalizedKeyword === "" ||
        normalizeKana(post.title.toLowerCase()).includes(normalizedKeyword) ||
        normalizeKana(post.content.toLowerCase()).includes(normalizedKeyword) ||
        post.conditions.some(c => normalizeKana(c.toLowerCase()).includes(normalizedKeyword)) ||
        (post.reading && post.reading.includes(normalizedKeyword));
      return matchArea && matchPrefecture && matchIndustry && matchConditions && matchKeyword;
    });
    setSearchResults(results);
  };

  return (
    <div className="p-6">
      {!showSearch && (
        <>
          <div className="mb-4 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="どこに行きたいですか？"
              className="w-full p-3 border rounded-lg pl-10 focus:ring-2 focus:ring-orange-400"
              onFocus={() => setShowSearch(true)}
            />
          </div>

        {/*データの先頭4件だけ表示*/}
          <h2 className="text-xl font-bold mb-4 text-orange-600">あなたへのおすすめ</h2>
          <div className="grid grid-cols-4 gap-4">
            {/* DB案件（モーダル用デモ） */}
            <Link href={`/search/listings/${demoListingId}`} className="no-underline text-black">
              <div className="bg-white border rounded-lg shadow-md overflow-hidden relative cursor-pointer h-80 flex flex-col transition-transform duration-200 hover:shadow-lg hover:scale-105 p-3">
                <div className="text-xs text-orange-600 font-semibold">デモ（DB）</div>
                <h3 className="font-bold text-black mt-1">ラベンダー農園スタッフ</h3>
                <p className="text-sm text-gray-700 mt-1 line-clamp-2">実データの案件詳細をモーダルで開きます</p>
                <div className="mt-auto text-xs text-gray-500">北海道・日程は詳細で確認</div>
              </div>
            </Link>
            {posts.slice(0, 4).map((post) => (
              <Link key={post.id} href={`/search/posts/${post.id}`} className="no-underline text-black">
                <Card post={post} />
              </Link>
            ))}
          </div>
        </>
      )}

      {showSearch && (
        <div className="space-y-6">
          <button
            onClick={() => setShowSearch(false)}
            className="text-orange-500 underline hover:text-orange-600"
          >
            ← 戻る
          </button>

          {/* 地方 */}
          <div>
            <label className="block text-sm font-medium">地方</label>
            <div className="flex flex-wrap gap-3">
              {Object.keys(areaToPrefecture).map(area => (
                <label key={area} className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="checkbox"
                    className="accent-orange-500 w-4 h-4"
                    checked={selectedAreas.includes(area)}
                    onChange={() => toggleSelection(selectedAreas, setSelectedAreas, area)}
                  />
                  <span>{area}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 都道府県（地方を選んだら表示される） */}
          {prefecturesToShow.length > 0 && (
            <div>
              <label className="block text-sm font-medium">都道府県</label>
              <div className="flex flex-wrap gap-3">
                {prefecturesToShow.map(pref => (
                  <label key={pref} className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-100 transition">
                    <input
                      type="checkbox"
                      className="accent-orange-500 w-4 h-4"
                      checked={selectedPrefectures.includes(pref)}
                      onChange={() => toggleSelection(selectedPrefectures, setSelectedPrefectures, pref)}
                    />
                    <span>{pref}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 業種 */}
          <div>
            <label className="block text-sm font-medium">業種</label>
            <div className="flex flex-wrap gap-3">
              {industries.map(ind => (
                <label key={ind} className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="checkbox"
                    className="accent-orange-500 w-4 h-4"
                    checked={selectedIndustries.includes(ind)}
                    onChange={() => toggleSelection(selectedIndustries, setSelectedIndustries, ind)}
                  />
                  <span>{ind}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 条件 */}
          <div>
            <label className="block text-sm font-medium">条件</label>
            <div className="flex flex-wrap gap-3">
              {conditionsList.map(cond => (
                <label key={cond} className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="checkbox"
                    className="accent-orange-500 w-4 h-4"
                    checked={selectedConditions.includes(cond)}
                    onChange={() => toggleSelection(selectedConditions, setSelectedConditions, cond)}
                  />
                  <span>{cond}</span>
                </label>
              ))}
            </div>
          </div>

          {/* フリーワード */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="フリーワード"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full p-3 border rounded-lg pl-10 focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <button
            onClick={handleSearch}
            className="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 active:scale-95 shadow-md transition"
          >
            🔍 検索！
          </button>

          {/* 検索結果 */}
          {searchResults !== null && (
            <div className="grid grid-cols-4 gap-4 mt-6">
              {searchResults.length === 0 ? (
                <p className="col-span-4 text-center text-gray-500 text-lg">
                  案件が見つかりません
                </p>
              ) : (
                searchResults.map(post => (
                  <Link href={`/search/posts/${post.id}`} key={post.id} className="no-underline text-black">
                    <Card post={post} />
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
