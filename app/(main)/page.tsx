"use client";

import { useState } from "react";
import PostCard from "../../components/PostCard";

const dummyPersonalPosts = [
  {
    id: 1,
    user: {
      name: "yudai",
      avatar: "https://via.placeholder.com/40",
      time: "2時間前",
    },
    image: "https://i.ytimg.com/vi/BCMKhsXcdJI/hq720.jpg", // 横画像
    caption:
      "誇る世全部僕が僕であるための要素を好きだよ全部君という簿黒い部分も恵まれなかった才能も丈夫じゃない性格もだけど大それた夢をちゃんと描くしたたかさを焦るよいつも 足音の群衆が僕の努力を引き裂いて何度君という闇の世話になったろうオンリーワンでもいいと無理やり付けたアイマスクの奥で一睡もしやしない自分も見飽きたよ #React #SNS風",
  },
  {
    id: 2,
    user: {
      name: "taro",
      avatar: "https://via.placeholder.com/40",
      time: "1分前",
    },
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308", // 縦画像
    caption: "縦長画像のテスト投稿です。新しい冒険が始まる！ #縦画像 #テスト",
  },
  {
    id: 3,
    user: {
      name: "buchi",
      avatar: "https://via.placeholder.com/40",
      time: "5分前",
    },
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    caption: "今日はとても楽しかった！ #日常 #写真",
  },
];

const dummyCompanyPosts = [
  {
    id: 2,
    user: {
      name: "企業A",
      avatar: "https://via.placeholder.com/40",
      time: "1時間前",
    },
    image: "https://i.ytimg.com/vi/BCMKhsXcdJI/hq720.jpg",
    caption: "企業の投稿内容です。",
  },
  {
    id: 4,
    user: {
      name: "企業B",
      avatar: "https://via.placeholder.com/40",
      time: "10分前",
    },
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
    caption: "新商品のお知らせです！ #新商品",
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"tab1" | "tab2">("tab1");
  const demoListingId = "036e078c-bc56-4d7e-bee8-9340d39346fa";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        height: "100vh", // 追加
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#222",
          borderBottom: "1px solid #444",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <button
          style={{
            padding: "12px 0",
            textAlign: "center",
            fontWeight: "bold",
            background: activeTab === "tab1" ? "#222" : "transparent",
            color: activeTab === "tab1" ? "#fff" : "#aaa",
            borderBottom: activeTab === "tab1" ? "2px solid #2196f3" : "none",
            transition: "color 0.2s",
          }}
          onClick={() => setActiveTab("tab1")}
        >
          個人
        </button>
        <button
          style={{
            padding: "12px 0",
            textAlign: "center",
            fontWeight: "bold",
            background: activeTab === "tab2" ? "#222" : "transparent",
            color: activeTab === "tab2" ? "#fff" : "#aaa",
            borderBottom: activeTab === "tab2" ? "2px solid #2196f3" : "none",
            transition: "color 0.2s",
          }}
          onClick={() => setActiveTab("tab2")}
        >
          企業
        </button>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto", // 投稿部分だけスクロール
          padding: "16px",
        }}
      >
        {/* モーダル動作デモへの最小導線（現在のレイアウトに付け足し） */}
        <div style={{ marginBottom: "12px" }}>
          <a
            href={`/search/listings/${demoListingId}`}
            style={{
              display: "block",
              textDecoration: "none",
              color: "#222",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 12,
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontSize: 12, color: "#fb923c", fontWeight: 600 }}>デモ（DB）</div>
            <div style={{ fontWeight: 700, marginTop: 4 }}>ラベンダー農園スタッフ</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
              実データの案件詳細をモーダルで開きます
            </div>
          </a>
        </div>

        {activeTab === "tab1" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {dummyPersonalPosts.map((post) => (
              <div key={post.id} style={{ width: "100%" }}>
                <PostCard
                  user={post.user}
                  image={post.image}
                  caption={post.caption}
                />
              </div>
            ))}
          </div>
        )}
        {activeTab === "tab2" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {dummyCompanyPosts.map((post) => (
              <div key={post.id} style={{ width: "100%" }}>
                <PostCard
                  user={post.user}
                  image={post.image}
                  caption={post.caption}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
