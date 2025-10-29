"use client";

import { useState, useEffect } from "react";
import PostCard from "../../components/PostCard";
import { supabase } from "../../lib/supabase/client";
import { getImagesForPost } from "../../lib/crud/experience_images";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"tab1" | "tab2">("tab1");
  const [personalProfiles, setPersonalProfiles] = useState<any[]>([]);
  const [companyProfiles, setCompanyProfiles] = useState<any[]>([]);
  const demoListingId = "036e078c-bc56-4d7e-bee8-9340d39346fa";

  useEffect(() => {
    const fetchProfilesAndPosts = async () => {
      
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) {
        console.error("Profiles Error:", profilesError.message);
        return;
      }

      
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("id, description, created_at, likes");

      if (postsError) {
        console.error("Posts Error:", postsError.message);
        return;
      }

      if (!profilesData || !postsData) return;

      
      const shuffledPosts = [...postsData].sort(() => Math.random() - 0.5);

      // 個人・企業に分割
      const personal = profilesData.filter((p) => !p.is_organizer);
      const company = profilesData.filter((p) => p.is_organizer);

      // 個人投稿に紐付け
      const personalWithPosts = await Promise.all(
        personal.map(async (profile) => {
          const matchedPost = shuffledPosts.find(
            (p) => p.id === profile.id && p.description
          );
          if (!matchedPost) return null;

          const { data: imagesData, error: imagesError } = await getImagesForPost(
            matchedPost.id
          );
          if (imagesError) console.error("Image Error:", imagesError.message);

          return {
            ...profile,
            caption: matchedPost.description,
            time: matchedPost.created_at,
            image_url:
              imagesData && imagesData.length > 0
                ? imagesData[0].url || imagesData[0]
                : "https://via.placeholder.com/600",
          };
        })
      );

      // 企業投稿に紐付け
      const companyWithPosts = await Promise.all(
        company.map(async (profile) => {
          const matchedPost = shuffledPosts.find(
            (p) => p.id === profile.id && p.description
          );
          if (!matchedPost) return null;

          const { data: imagesData, error: imagesError } = await getImagesForPost(
            matchedPost.id
          );
          if (imagesError) console.error("Image Error:", imagesError.message);

          return {
            ...profile,
            caption: matchedPost.description,
            time: matchedPost.created_at,
            image_url:
              imagesData && imagesData.length > 0
                ? imagesData[0].url || imagesData[0]
                : "https://via.placeholder.com/600",
          };
        })
      );

      // nullを除外してセット
      setPersonalProfiles(personalWithPosts.filter(Boolean));
      setCompanyProfiles(companyWithPosts.filter(Boolean));
    };

    fetchProfilesAndPosts();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        height: "100vh",
      }}
    >
      {/* タブ切替 */}
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
          }}
          onClick={() => setActiveTab("tab2")}
        >
          企業
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {/* デモリンク */}
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
            <div style={{ fontSize: 12, color: "#fb923c", fontWeight: 600 }}>
              デモ（DB）
            </div>
            <div style={{ fontWeight: 700, marginTop: 4 }}>
              ラベンダー農園スタッフ
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#6b7280",
                marginTop: 4,
              }}
            >
              実データの案件詳細をモーダルで開きます
            </div>
          </a>
        </div>

        {/* 個人投稿 */}
        {activeTab === "tab1" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {personalProfiles.map((userProfile) => (
              <PostCard
                key={userProfile.id}
                user={{
                  name: userProfile.name,
                  avatar:
                    userProfile.avatar_url || "https://via.placeholder.com/40",
                  time: userProfile.time
                    ? new Date(userProfile.time).toLocaleString("ja-JP")
                    : "取得日未設定",
                }}
                image={userProfile.image_url}
                caption={userProfile.caption}
              />
            ))}
          </div>
        )}

        {/* 企業投稿 */}
        {activeTab === "tab2" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {companyProfiles.map((userProfile) => (
              <PostCard
                key={userProfile.id}
                user={{
                  name: userProfile.name,
                  avatar:
                    userProfile.avatar_url || "https://via.placeholder.com/40",
                  time: userProfile.time
                    ? new Date(userProfile.time).toLocaleString("ja-JP")
                    : "取得日未設定",
                }}
                image={userProfile.image_url}
                caption={userProfile.caption}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
