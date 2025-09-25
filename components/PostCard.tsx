import React, { useState } from "react";

type User = {
  name: string;
  avatar: string;
  time: string;
};

type PostCardProps = {
  user: User;
  image: string;
  caption: string;
};

export default function PostCard({ user, image, caption }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [animate, setAnimate] = useState(false);

  const shortCaption = caption.slice(0, 100);

  const handleLike = () => {
    if (!liked) {
      setLikeCount(likeCount + 1);
      setLiked(true);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);
    } else {
      setLikeCount(likeCount > 0 ? likeCount - 1 : 0);
      setLiked(false);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "10px",
        marginBottom: "12px",
        color: "#222",
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}
      >
        <img
          src={user.avatar}
          alt={user.name}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            marginRight: "6px",
          }}
        />
        <div>
          <div style={{ fontWeight: "bold" }}>{user.name}</div>
          <div style={{ fontSize: "12px", color: "#888" }}>{user.time}</div>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          aspectRatio: "4/3", // 画像枠を小さく（例：4:3）
          background: "#eee",
          borderRadius: "8px",
          overflow: "hidden",
          marginBottom: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={image}
          alt="投稿画像"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}
      >
        <button
          style={{
            fontSize: "22px",
            cursor: "pointer",
            background: "none",
            border: "none",
            color: liked ? "red" : "#fff",
            transition: "color 0.2s, transform 0.2s",
            marginRight: "6px",
            outline: "none",
            transform: animate ? "scale(1.3)" : "scale(1)",
          }}
          onClick={handleLike}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={liked ? "red" : "none"}
            stroke={liked ? "red" : "#888"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ display: "inline-block", verticalAlign: "middle" }}
          >
            <path d="M12 21s-6.5-5.6-8.5-8.1C1.7 10.1 2 7.2 4.1 5.5 6.2 3.8 9.1 4.3 12 7.1c2.9-2.8 5.8-3.3 7.9-1.6 2.1 1.7 2.4 4.6 0.6 7.4C18.5 15.4 12 21 12 21z" />
          </svg>
        </button>
        {likeCount > 0 && (
          <span style={{ fontWeight: "bold", color: "#888", fontSize: "15px" }}>
            {likeCount}
          </span>
        )}
      </div>
      <div>
        <p>
          <span style={{ fontWeight: "bold" }}>{user.name}</span>{" "}
          {expanded
            ? caption
            : shortCaption + (caption.length > 100 ? "..." : "")}
        </p>
        {caption.length > 100 && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              border: "none",
              background: "none",
              color: "#0095f6",
              cursor: "pointer",
              padding: "5px 0",
              fontSize: "13px",
            }}
          >
            {expanded ? "折りたたむ" : "もっと見る"}
          </button>
        )}
      </div>
    </div>
  );
}
