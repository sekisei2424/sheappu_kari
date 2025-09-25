"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Post = {
  id: number;
  title: string;
  content: string;
  image: string;
  region: string;
  municipality: string;
  industry: string;
  conditions: string[];
  reading?: string;
};

{/*自治体のプロフィール仮データ */}
const municipalities: { [key: string]: { description: string; image: string; followers: number } } = {
  "青森市": { description: "りんごと自然が豊かな青森県の県庁所在地", image: "/images/apple_prof.png", followers: 1280 },
  "那覇市": { description: "沖縄県の県庁所在地、ビーチと文化が魅力", image: "/images/okinawa_prof.png", followers: 2045 },
  "京都市": { description: "歴史と観光名所が豊富な京都府の中心都市", image: "/images/kyoto_prof.png", followers: 3400 },
  "白馬村": { description: "長野県のスキー・登山で有名な自然豊かな村", image: "/images/nagano_prof.png", followers: 980 },
  "高松市": { description: "香川県の県庁所在地、うどんと瀬戸内海が魅力", image: "/images/udon_prof.png", followers: 1230 },
  "札幌市": { description: "北海道の県庁所在地、雪と食が魅力", image: "/images/sakura_prof.png", followers: 4120 },
  "長崎市": { description: "歴史ある港町、異文化交流の街", image: "/images/fishing_prof.png", followers: 875 },
  "ニセコ町": { description: "北海道のウインタースポーツの聖地", image: "/images/ski_prof.png", followers: 1530 },
  "小豆島町": { description: "瀬戸内海の美しい離島、オリーブの島", image: "/images/island_prof.png", followers: 640 },
  "大阪市": { description: "関西の中心都市、食とエンタメが盛ん", image: "/images/bike_prof.png", followers: 5200 },
};

{/*案件仮データ(トップぺーじと同じもの) */}
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

export default function PostDetailPage() {
  const params = useParams();
  const postId = Number(params.id);
  const [applied, setApplied] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [followers, setFollowers] = useState<number | null>(null);

  const post = posts.find((p) => p.id === postId);
  const municipalityInfo = post ? municipalities[post.municipality] : null;

  const handleApply = () => {
    setApplied(true);
    alert("応募完了🎉");
  };

  const handleFollow = () => {
    if (!followed && municipalityInfo) {
      setFollowers(prev => (prev !== null ? prev + 1 : municipalityInfo.followers + 1));
      setFollowed(true);
    }
  };

  if (!post) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">投稿が見つかりません</p>
        <Link href="/search" className="text-orange-500 underline">
          ← 戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6">
      <Link href="/search" className="text-orange-500 underline">
        ← 戻る
      </Link>

      {/* 投稿画像 */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <Image
          src={post.image}
          alt={post.title}
          width={600}
          height={400}
          className="w-full h-80 object-cover"
        />
      </div>

      {/* 投稿内容 */}
      <div className="space-y-2 px-2">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <p className="text-gray-700">{post.content}</p>
        <p className="text-gray-500 text-sm">{post.region}・{post.industry}</p>

        {/* 条件タグ（疑似要素で・区切り） */}
      <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-800">
        {post.conditions.map((cond, i) => (
          <span
            key={i}
            className={`
            bg-gray-100 px-2 py-1 rounded-full
            ${i > 0 ? "before:content-['・'] before:mr-1" : ""}
          `}
        >
      {cond}
    </span>
  ))}
</div>

      </div>

      {/* 自治体プロフィール */}
      {municipalityInfo && (
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition">
          <div className="flex items-center space-x-4">
            <Image
              src={municipalityInfo.image}
              alt={post.municipality}
              width={60}
              height={60}
              className="rounded-full object-cover"
            />
            <div>
              <h2 className="font-bold">{post.municipality}</h2>
              <p className="text-gray-600 text-sm">{municipalityInfo.description}</p>
              <p className="text-gray-400 text-xs mt-1">
                フォロワー: {followers ?? municipalityInfo.followers}
              </p>
            </div>
          </div>
          <button
            onClick={handleFollow}
            disabled={followed}
            className={`px-4 py-2 rounded-full font-bold text-white transition ${
              followed ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 active:scale-95 shadow-md"
            }`}
          >
            {followed ? "フォロー中" : "フォロー"}
          </button>
        </div>
      )}

      {/* 応募ボタン */}
      <button
        onClick={handleApply}
        disabled={applied}
        className={`w-full p-3 rounded-full text-white font-bold mt-2 transition ${
          applied ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 active:scale-95 shadow-md"
        }`}
      >
        {applied ? "応募済み" : "この案件に応募する!"}
      </button>
    </div>
  );
}
