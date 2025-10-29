"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/crud/posts";
import { getImagesForPost } from "@/lib/crud/experience_images";
import ListingDetail from "@/components/features/listings/ListingDetail";
import { Search as SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type Post = {
  id: string;
  post_type: string;
  title: string;
  description: string;
  date?: string;
  location: string;
  municipality?: string;
  industry: string;
  conditions: string[];
  likes?: number;
  image?: string;
};

// 地域マッピング
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

// 条件リスト
const conditionsList = [
  "日程調整可能","日程調整不可","学生歓迎","年齢不問","初しぇあっぷ歓迎",
  "未経験OK","複数名採用","友達参加歓迎","1日4時間以内","経験者限定",
  "まかないあり","客室に泊まれる","一人部屋に泊まれる","服装、髪色自由","海が見える",
  "紅葉が見れる","桜が見れる","離島で暮らせる","ウインタースポーツができる","マリンスポーツができる",
  "交流会、懇親会あり","地域の方と触れ合う機会多め","温泉入浴可能","国際交流可能",
  "語学を活かせる","自転車無料貸し出しあり"
];

// 業種
const postTypes = ["第一次産業","第二次産業","第三次産業"];

// カナを正規化
function normalizeKana(str: string) {
  return str.replace(/[\u30a1-\u30f6]/g, (match) =>
    String.fromCharCode(match.charCodeAt(0) - 0x60)
  );
}

function Card({
  post,
  likes,
  toggleLike,
  onClick
}: {
  post: Post;
  likes: string[];
  toggleLike: (id: string) => void;
  onClick?: () => void;
}) {
  const isLiked = likes.includes(post.id);

  return (
    <div
      onClick={onClick}
      className="
        relative w-full pt-[100%] rounded-xl overflow-hidden cursor-pointer
        transform transition-transform duration-200 hover:scale-105 hover:shadow-lg
      "
    >
      {post.image ? (
        <Image
          src={post.image}
          alt={post.title || "体験画像"}
          fill
          style={{ objectFit: "cover" }}
          unoptimized
        />
      ) : (
        <div className="w-full h-full bg-gray-200" />
      )}

      <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white p-2 text-sm">
        <div className="font-bold">{post.title}</div>
        <div className="text-xs">
          {post.location}{post.municipality ? ` ${post.municipality}` : ""} | {post.industry} | {post.date}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleLike(post.id);
        }}
        className="absolute top-2 left-2 bg-transparent border-none cursor-pointer"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={isLiked ? "#FACC15" : "none"}
          stroke="#fff"
          strokeWidth={2}
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      </button>
    </div>
  );
}



// メインページ
export default function Page() {
  const router = useRouter();

  // 投稿データ
  const [posts, setPosts] = useState<Post[]>([]);
  const [likes, setLikes] = useState<string[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // フィルター・検索関連
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<Post[] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"popular" | "new">("new");

  // 投稿取得
  useEffect(() => {
    async function fetchPosts() {
      const { data: postsData } = await getAllPosts() as { data: Post[] | null; error: any };
      if (!postsData) return setPosts([]);

      // 画像をセット
      const postsWithImages = await Promise.all(
        postsData.map(async (post) => {
          const { data: images } = await getImagesForPost(post.id);
          return { ...post, image: images && images.length > 0 ? images[0].url : undefined };
        })
      );

      setPosts(postsWithImages);
    }

    fetchPosts();
  }, []);

  // いいね切り替え
  const toggleLike = (id: string) => {
    setLikes(prev => prev.includes(id) ? prev.filter(likeId => likeId !== id) : [...prev, id]);
  };

  // フィルター選択トグル
  const toggleSelection = (list: string[], setter: (v: string[]) => void, value: string) => {
    if (list.includes(value)) setter(list.filter((v) => v !== value));
    else setter([...list, value]);
  };

  // 選択中の都道府県リスト
  const prefecturesToShow = selectedAreas.flatMap(area => areaToPrefecture[area] || []);

  // 検索実行
  const handleSearch = () => {
  const normalizedKeyword = normalizeKana(keyword.toLowerCase());
  const results = posts.filter(post => {
    const postConditions: string[] = Array.isArray(post.conditions)
  ? post.conditions.map(c => c.trim()).filter(c => c.length > 0)
  : typeof post.conditions === "string"
    ? post.conditions
        .split(',')
        .map(c => c.replace(/["]/g, '').trim()) // ← ダブルクオート削除
    : [];


    console.log("post.id:", post.id, "post.conditions:", post.conditions, "postConditions:", postConditions);

    const matchArea =
      selectedAreas.length === 0 ||
      selectedAreas.some(area => areaToPrefecture[area]?.includes(post.location));
    const matchPrefecture =
      selectedPrefectures.length === 0 || selectedPrefectures.includes(post.location);
    const matchIndustry =
      selectedIndustries.length === 0 || selectedIndustries.includes(post.industry);

    const matchConditions =
  selectedConditions.length === 0 ||
  selectedConditions.some(selectedCond =>
    postConditions.includes(normalizeKana(selectedCond.trim().toLowerCase()))
  );

    const matchKeyword =
      normalizedKeyword === "" ||
      normalizeKana(post.title.toLowerCase()).includes(normalizedKeyword) ||
      normalizeKana(post.description.toLowerCase()).includes(normalizedKeyword) ||
      normalizeKana(post.location.toLowerCase()).includes(normalizedKeyword) ||
      postConditions.some(c => normalizeKana(c.toLowerCase()).includes(normalizedKeyword));

    return matchArea && matchPrefecture && matchIndustry && matchConditions && matchKeyword;
  });

  setSearchResults(results);
};



  // ボタンレンダリング
  const renderButton = (value: string, selectedList: string[], setter: (v: string[]) => void) => {
    const selected = selectedList.includes(value);
    return (
      <button
        key={value}
        onClick={() => toggleSelection(selectedList, setter, value)}
        style={{
          padding: "6px 12px",
          borderRadius: "20px",
          border: "1px solid #ccc",
          cursor: "pointer",
          backgroundColor: selected ? "#FF7F50" : "#f0f0f0",
          color: selected ? "white" : "black",
          boxShadow: selected ? "0 4px 6px rgba(0,0,0,0.2)" : "none",
          transition: "all 0.2s",
          margin: "4px 4px 0 0",
          whiteSpace: "nowrap"
        }}
      >
        {value}
      </button>
    );
  };

  // 並び替え
  const sortedPosts = (searchResults ?? posts)
    .slice()
    .sort((a, b) => {
      const likesA = a.likes ?? 0;
      const likesB = b.likes ?? 0;
      if (sortBy === "popular") return likesB - likesA;
      if (sortBy === "new") return new Date(b.date ?? "1970-01-01").getTime() - new Date(a.date ?? "1970-01-01").getTime();
      return 0;
    });

  return (
    <div style={{ padding: "20px" }}>
      {/* 検索バー */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }} className="relative">
        <SearchIcon
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
          style={{ cursor: "pointer" }}
          onClick={handleSearch}
        />
        <input
          type="text"
          placeholder="お仕事体験をさがす"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{ color: "#000" }}
          className="w-full p-3 border rounded-lg pl-10 focus:ring-2 focus:ring-orange-400 placeholder-gray-500"
        />
        <button
          className="condition-button"
          onClick={() => setShowFilters(f => !f)}
          style={{ height: "50px", padding: "0 16px", borderRadius: "8px", border: "1px solid #ccc", cursor: "pointer", backgroundColor: "white", fontSize: "13px", color: "black" }}
        >
          条件
        </button>
      </div>

      {/* フィルター */}
      {showFilters && (
        <div style={{ marginBottom: "20px" }}>
          <div style={{ marginBottom: "8px", fontWeight: "bold" }}>地方</div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>{Object.keys(areaToPrefecture).map(area => renderButton(area, selectedAreas, setSelectedAreas))}</div>

          {prefecturesToShow.length > 0 && (
            <>
              <div style={{ margin: "8px 0 4px 0", fontWeight: "bold" }}>都道府県</div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>{prefecturesToShow.map(pref => renderButton(pref, selectedPrefectures, setSelectedPrefectures))}</div>
            </>
          )}

          <div style={{ margin: "8px 0 4px 0", fontWeight: "bold" }}>業種</div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>{postTypes.map(pt => renderButton(pt, selectedIndustries, setSelectedIndustries))}</div>

          <div style={{ margin: "8px 0 4px 0", fontWeight: "bold" }}>条件</div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>{conditionsList.map(cond => renderButton(cond, selectedConditions, setSelectedConditions))}</div>

          <button
            onClick={handleSearch}
            style={{ width: "100%", padding: "12px", backgroundColor: "#FF7F50", color: "white", borderRadius: "8px", cursor: "pointer", marginTop: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.2)", transition: "background 0.2s" }}
          >
            検索
          </button>
        </div>
      )}

      {/* 並び替え */}
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
  <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#000" }}>
    {searchResults ? "検索結果" : "あなたへのおすすめ"}
  </h2>
  <div style={{ display: "flex", borderRadius: "30px", overflow: "hidden", userSelect: "none" }}>
    {["popular", "new"].map((type) => (
      <div
        key={type}
        onClick={() => setSortBy(type as "popular" | "new")}
        style={{
          padding: "8px 24px",
          backgroundColor: sortBy === type ? "#FF7F50" : "#f0f0f0",  // 選択中はオレンジ
          color: sortBy === type ? "white" : "#333",
          fontWeight: sortBy === type ? "bold" : "normal",
          cursor: "pointer",
          transition: "all 0.2s",
          borderRadius: "999px", 
          boxShadow: sortBy === type ? "0 4px 12px rgba(0,0,0,0.2)" : "0 2px 4px rgba(0,0,0,0.1)",
          marginRight: "8px",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        {type === "popular" ? "人気順" : "新着順"}
      </div>
    ))}
  </div>
</div>



     {/* 投稿カード */}
<div className="grid gap-4 
  grid-cols-2
  sm:grid-cols-2
  md:grid-cols-3
  lg:grid-cols-4
">
  {sortedPosts.map(post => (
    <Card
      key={post.id}
      post={post}
      likes={likes}
      toggleLike={toggleLike}
      onClick={() => router.push(`/search/listings/${post.id}`)}
    />
  ))}
</div>

    </div>
  );
}

// ---------- モーダル内容 ----------
function ModalContent({ postId }: { postId: string }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600 animate-pulse text-lg">読み込み中...</p>
      </div>
    );
  }
  return <ListingDetail id={postId} />;
}
